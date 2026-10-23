#!/usr/bin/env node
/*
 * Tests for the OSINT Map Builder.
 *
 * Run from the repository root with:  node Tests/run.js
 * Needs Node 18 or later and nothing else. It reads index.html, pulls out the
 * citation formatter, the source tables, the symbol catalog, MGRS and the map
 * model (with its dates, time filter and video plans), and checks that known inputs still give the expected results.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function block(id) {
  const m = html.match(new RegExp('<script[^>]*\\bid="' + id + '"[^>]*>([\\s\\S]*?)</script>'));
  if (!m) { console.error('Could not find <script id="' + id + '"> in index.html'); process.exit(1); }
  return m[1];
}
new Function(block('vendor-mgrs'))();
const MG = globalThis.mgrs;
const [O, T, CAT, M] = new Function(block('core') + block('tables') + block('catalog') + block('map-core') + ';return [OSINT, OSINT_TABLES, MIL_CATALOG, MAPC];')();
const lib = {}; T.LIB.forEach((c) => c.g.forEach((g) => g.i.forEach((x) => { lib[x.toLowerCase()] = {}; })));
O.setLibrary(lib);
let failed = 0, passed = 0;
function eq(got, want, label) { const g = JSON.stringify(got), w = JSON.stringify(want); if (g === w) { passed++; return; } failed++; console.log('FAIL  ' + label + '\n  got : ' + g + '\n  want: ' + w); }
function ok(c, label) { eq(!!c, true, label); }
function near(a, b, tol, label) { ok(Math.abs(a - b) <= tol, label + ' (' + a + ' vs ' + b + ')'); }

// ---- 1. Coordinates ----
let c = M.parseCoord('50.4501, 30.5234', MG); near(c.lat, 50.4501, 1e-9, 'decimal latitude'); near(c.lon, 30.5234, 1e-9, 'decimal longitude');
c = M.parseCoord('50°27′00″N 30°31′24″E', MG); near(c.lat, 50.45, 1e-9, 'DMS latitude'); near(c.lon, 30.523333, 1e-6, 'DMS longitude');
c = M.parseCoord('N50 27 00 E30 31 24', MG); near(c.lat, 50.45, 1e-9, 'hemisphere-first DMS');
c = M.parseCoord('50.45 S 30.5 W', MG); ok(c.lat < 0 && c.lon < 0, 'south and west are negative');
c = M.parseCoord('36U UA 21342 89767', MG); near(c.lat, 50.4327, 1e-3, 'MGRS latitude'); near(c.lon, 30.4843, 1e-3, 'MGRS longitude');
ok(M.parseCoord('100, 30', MG).error, 'a latitude over 90 is refused');
ok(M.parseCoord('somewhere', MG).error, 'words are refused');
eq(M.fmtCoord(30.5234, 50.4501, 'dd'), '50.45010, 30.52340', 'decimal output is latitude first');
eq(M.fmtCoord(30.5234, 50.4501, 'dms'), '50°27′00.4″N 30°31′24.2″E', 'DMS output');
ok(/^36U UA \d{5} \d{5}$/.test(M.fmtCoord(30.5234, 50.4501, 'mgrs', MG)), 'MGRS output');

// ---- 2. Geometry ----
const ring = M.circle([0, 0], 100, 64);
eq(ring[0], ring[ring.length - 1], 'a range ring closes');
near(M.dist([0, 0], ring[16]), 100, 0.01, 'range ring radius');
near(M.dist([-0.1278, 51.5074], [2.3522, 48.8566]), 343.5, 1.5, 'London to Paris');
const arrow = M.boldArrow([[30, 50], [31, 50.5], [32, 50.4]], 10, { smooth: true });
ok(arrow && arrow.length > 8 && arrow[0][0] === arrow[arrow.length - 1][0], 'a bold arrow is a closed ring');
near(M.screenBearing([0, 0], [0, 1]), 0, 1e-6, 'due north is 0°'); near(M.screenBearing([0, 0], [1, 0]), 90, 1e-6, 'due east is 90°');

// ---- 3. Military symbols ----
eq(M.sidcOf({ tpl: 'S*G*UCI--------', affil: 'H', status: 'P', ech: 'I', hq: 'A' }), 'SHGPUCI---AI---', 'unit code with echelon and headquarters');
eq(M.sidcOf({ tpl: 'S*G*IBA---H----', affil: 'F', ech: 'F' }), 'SFGPIBA---HF---', 'installation keeps its H');
eq(M.sidcOf({ tpl: 'S*A*MFF--------', affil: 'N', ech: 'I' }), 'SNAPMFF--------', 'air tracks take no echelon');
eq(M.sidcOf({ custom: '10031000141211000000', tpl: 'S*G*UCI--------' }), '10031000141211000000', 'a typed code wins');
ok(CAT.length > 1000, 'the catalog holds the 2525C symbols');
const names = {}; CAT.forEach((r) => { names[M.catalogKey(r[0].replace(/\*/g, 'F'))] = r[1]; });
eq(names[M.catalogKey('SFGPUCI--------')], 'Infantry', 'infantry is in the catalog');
eq(names[M.catalogKey('SHSPCLFF-------')], 'Frigate/Corvette', 'frigates are in the catalog');

// ---- 4. The example ----
const ex = JSON.parse(fs.readFileSync(path.join(root, 'examples', 'd-day.json'), 'utf8'));
let r = M.normalize(ex, T.TEXT_KEYS);
eq(r.fixes, [], 'example opens without repairs');
const p = r.project;
eq(M.audit(p, O, T.TYPES, T.TEXT_KEYS).rows.filter((x) => x.level === 'fix').length, 0, 'example has nothing to fix');
ok(p.features.every((f) => f.kind === 'label' || f.cites.length), 'every example feature cites a source');
ok(p.features.every((f) => f.note), 'every example feature says how its place was set');
const nb = M.numbering(p);
eq(nb.order.length, 3, 'three sources are numbered');
const rd = M.render(p, { markers: true });
ok(rd.fc.features.some((f) => f.properties.g === 'fill') && rd.fc.features.some((f) => f.properties.g === 'point') && rd.fc.features.some((f) => f.properties.g === 'label'), 'the example draws arrows, symbols and labels');
const embedded = JSON.parse(block('example-data').replace(/<\\\//g, '</').trim());
eq(embedded.features.length, ex.features.length, 'the page carries the same example as examples/d-day.json');
const legend = M.legendItems(p, (s) => names[M.catalogKey(s)] || '');
eq(legend.map((x) => x.label), ['Seaborne landings', 'Allied infantry division', 'Allied airborne division', 'German infantry division'], 'the key lists the landings and each symbol once');

// ---- 5. Footnotes come from the Citation Generator's formatter ----
const s2 = p.sources.find((s) => s.id === 's2');
eq(O.toMarkdown(O.build(M.sourceState(T.TYPES, T.TEXT_KEYS, s2.fields, 'p. 10')).seg), 'Historical Division, War Department, *Utah Beach to Cherbourg (6 June–27 June 1944)*, *American Forces in Action Series* [Official History; HyperWar online edition] (1947) https://www.ibiblio.org/hyperwar/USA/USA-A-Utah/index.html: p. 10.', 'report footnote');
eq(M.supText([1, 2, 3, 5, 7, 8]), '1–3,5,7,8', 'footnote numbers collapse runs');

// ---- 6. Reading data in ----
const rows = M.parseCSV('name,lat,lon,side,sidc,source_id,page\nA,49.36,-0.85,Allied,SFGPUCI----I---,s1,p. 3\nB,,,Allied,,s1,\nC,,,x,,,\n');
const map = M.guessMapping(rows[0]);
eq([map.lat, map.lon, map.label, map.layer, map.sidc, map.source, map.loc], [1, 2, 0, 3, 4, 5, 6], 'CSV columns are recognized by name');
r = M.csvToFeatures(rows, map, { layerId: 'l1', mgrs: MG });
eq(r.features.length, 1, 'rows without coordinates are skipped');
eq(r.errors.length, 2, 'and reported');
eq(r.features[0].kind, 'symbol', 'a row with a symbol code becomes a symbol');
eq([r.features[0].sym.affil, r.features[0].sym.ech], ['F', 'I'], 'affiliation and echelon come from the code');
eq(r.features[0].cites[0], { src: 's1', loc: 'p. 3', quote: '', note: '' }, 'the row cites its source and page');
r = M.csvToFeatures(M.parseCSV('grid,label\n36UUA2134289767,Kyiv area\n'), M.guessMapping(['grid', 'label']), { layerId: 'l1', mgrs: MG });
eq(r.features.length, 1, 'MGRS in one column is read');
eq(M.parseWKT('LINESTRING (30 10, 10 30, 40 40)'), { kind: 'line', coords: [[30, 10], [10, 30], [40, 40]] }, 'WKT lines are read');
const gj = M.toGeoJSON(p, (cc) => cc.src);
const back = M.geojsonToFeatures(gj, { layerId: 'l1' }).features;
eq(back.map((f) => f.kind), p.features.map((f) => f.kind), 'GeoJSON export reads back to the same kinds');

// ---- 7. Basemap restyling ----
const style = { version: 8, sources: {}, layers: [
  { id: 'bg', type: 'background', paint: { 'background-color': '#f8f4f0' } },
  { id: 'b', type: 'line', 'source-layer': 'boundary', paint: { 'line-color': '#999', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1, 10, 2] } },
  { id: 'label_city', type: 'symbol', 'source-layer': 'place', layout: {}, paint: { 'text-color': '#333' } },
  { id: 'poi', type: 'symbol', 'source-layer': 'poi', layout: {}, paint: {} }] };
let rs = M.restyle(style, { tone: 'dark', labels: 'places', borders: true });
ok(M.lum(M.parseColor(rs.layers[0].paint['background-color'])) < 0.2, 'dark tone darkens the background');
eq(rs.layers[1].paint['line-width'], ['interpolate', ['linear'], ['zoom'], 3, 2, 10, 4], 'strong borders double the width at every zoom');
eq([rs.layers[2].layout.visibility, rs.layers[3].layout.visibility], [undefined, 'none'], 'places-only keeps place labels and hides the rest');
rs = M.restyle(style, { labels: 'none' }); eq(rs.layers[2].layout.visibility, 'none', 'no labels hides place labels');

// ---- 8. Dates and time ----
eq(M.fmtWhen(M.parseWhen('06 June 1944').t, 'day'), '6 June 1944', 'a day date');
eq(M.parseWhen('1944-06-06 06:30').prec, 'minute', 'a date with a time');
eq(M.parseWhen('6 June 1944 0630').t, M.parseWhen('1944-06-06 06:30').t, 'military time reads the same as 06:30');
eq(M.parseWhen('June 1944').prec, 'month', 'a month');
ok(M.parseWhen('31 June 1944') === null, 'an impossible date is refused');
ok(M.parseWhen('June 1944').t < M.parseWhen('1 July 1944').t, 'dates order correctly');
const tp = { layers: [{ id: 'l1', visible: true }], features: [
  { id: 'a', layer: 'l1', date: '1 March 2022' }, { id: 'b', layer: 'l1', date: '3 March 2022', end: '5 March 2022' }, { id: 'c', layer: 'l1', date: '' }], time: { mode: 'upto', at: M.parseWhen('4 March 2022').t } };
eq(M.atTime(tp).map((f) => f.id), ['a', 'b', 'c'], 'up to a date shows what has started and has not ended, and undated features');
eq(M.atTime(tp, M.parseWhen('6 March 2022').t).map((f) => f.id), ['a', 'c'], 'a feature leaves after its end date');
tp.time.mode = 'during';
eq(M.atTime(tp, M.parseWhen('1 March 2022 15:00').t).map((f) => f.id), ['a', 'c'], 'on the date shows what falls on that day');
eq(M.atTime(tp, M.parseWhen('2 March 2022').t).map((f) => f.id), ['c'], 'and not what has passed');
const tr = M.timeRange(tp);
eq([tr.n, tr.min === M.parseWhen('1 March 2022').t], [2, true], 'the time range spans the dated features');

// ---- 9. Views and video plans ----
eq(p.views.length, 5, 'the example has five views');
const plan = M.videoPlan(p.views, 1000, {});
near(plan.duration, p.views.reduce((s, v, i) => s + v.hold + (i ? v.fly : 0), 0), 1e-9, 'a video holds on each view and flies between them');
const a0 = plan.at(0), a1 = plan.at(plan.duration);
near(a0.center[0], p.views[0].center[0], 1e-9, 'the video starts at the first view'); near(a1.zoom, p.views[4].zoom, 1e-6, 'and ends at the last');
const fly = M.flyPath({ center: [-1, 49], zoom: 9, bearing: 0 }, { center: [30, 50], zoom: 9, bearing: 350 }, 1000);
ok(fly(0.5).zoom < 9, 'a long flight zooms out on the way');
near(fly(1).center[0], 30, 1e-6, 'and lands where it should');
near(fly(0.5).bearing, -5, 1e-6, 'rotation takes the short way round');
const old = M.normalize(Object.assign({}, ex, { format: 1, views: undefined, time: undefined }), T.TEXT_KEYS);
ok(!old.error && old.project.views.length === 0 && old.project.time.mode === 'all', 'a version 1 map file still opens');

// ---- 10. Dates before the common era, and approximate dates ----
const yr = (x) => new Date(M.parseWhen(x).t).getUTCFullYear();
eq(yr('44 BC'), -43, '44 BC is astronomical year -43');
eq(yr('500 BCE'), -499, '500 BCE is astronomical year -499');
eq(yr('-0499'), -499, 'ISO years are astronomical');
eq(yr('1 BC'), 0, '1 BC is year zero');
eq(yr('AD 9'), 9, 'AD before the year'); eq(yr('9 CE'), 9, 'CE after the year');
eq(M.parseWhen('15 March 44 BC').prec, 'day', 'a day before the common era');
eq(M.parseWhen('c. 1450').approx, true, 'c. marks an approximate date');
eq(M.fmtWhen(M.parseWhen('ca. 323 BCE').t, 'year', 'BCE', true), 'c. 323 BCE', 'approximate BCE dates print');
eq(M.fmtWhen(M.parseWhen('500').t, 'year', 'BC'), 'AD 500', 'early CE years print with their era');
ok(M.parseWhen('44') === null, 'a bare two-digit number is not taken as a year');
ok(M.parseWhen('29 February 1900') === null && M.parseWhen('29 February 2000'), 'leap years follow the Gregorian rule');
ok(M.parseWhen('333 BCE').t < M.parseWhen('331 BC').t, 'BCE dates order correctly');
const longR = { min: M.parseWhen('333 BCE').t, max: M.parseWhen('201 BCE').t, prec: 'day' };
eq(M.barPrec(longR), 'month', 'over a long span the time bar shows months, not days');
eq(M.barPrec({ min: M.parseWhen('5000 BCE').t, max: M.parseWhen('1492').t, prec: 'day' }), 'year', 'over millennia it shows years');

// ---- 11. Historical borders ----
eq([M.hbFile(-323), M.hbFile(1492), M.hbYearText(-323)], ['world_bc323.geojson', 'world_1492.geojson', '323 BCE'], 'snapshot file names and years');
ok(M.HB_YEARS.length === 54 && M.HB_YEARS[0] === -123000 && M.HB_YEARS[M.HB_YEARS.length - 1] === 2010, 'all 54 snapshots are listed');
ok(M.hbUrls('world_1492.geojson').every((u) => u.indexOf(M.HB_COMMIT) > 0), 'downloads are pinned to one commit');
const sq = (x, y, d) => [[x, y], [x + d, y], [x + d, y + d], [x, y + d], [x, y]];
const hb = { type: 'FeatureCollection', features: [
  { properties: { NAME: 'Alpha', SUBJECTO: 'Alpha', BORDERPRECISION: 1 }, geometry: { type: 'MultiPolygon', coordinates: [[sq(0, 0, 4)], [sq(10, 0, 1)]] } },
  { properties: { NAME: 'Beta', SUBJECTO: 'Alpha', BORDERPRECISION: 3 }, geometry: { type: 'MultiPolygon', coordinates: [[sq(40, 40, 2)]] } },
  { properties: { NAME: null }, geometry: null }] };
let hr = M.hbToFeatures(hb, { year: -323, next: -300, layerId: 'l1', src: 's1', soft: true, dated: true });
eq(hr.features.length, 3, 'each part of a territory becomes an area');
eq(hr.features.filter((f) => f.style.labelPos !== 'none').map((f) => f.label), ['Alpha', 'Beta'], 'only the largest part of a territory is labeled');
eq([hr.features[0].date, hr.features[0].end], ['323 BCE', '301 BCE'], 'a snapshot is dated until the year before the next one');
eq([hr.features[0].style.edge, hr.features[2].style.edge], ['soft', 'line'], 'approximate borders are soft, legal ones are lines');
eq(hr.features[0].style.color, hr.features[2].style.color, 'territories under the same power share a color');
ok(/precision 1 of 3 \(approximate\)/.test(hr.features[0].note), 'each territory says how precise its border is');
eq(hr.features[2].desc, 'Under Alpha', 'a subject territory names its ruler');
hr = M.hbToFeatures(hb, { year: 1492, bbox: [-1, -1, 20, 20], layerId: 'l1' });
eq(hr.features.length, 2, 'only territories in the frame are added');
const wiggly = []; for (let i = 0; i <= 200; i++) wiggly.push([i * 0.01, Math.sin(i / 3) * 0.00001]);
ok(M.simplifyRing(wiggly, 100).length < 10, 'borders are simplified to the zoom');
const hs = M.hbSource('world_bc323.geojson', '23 October 2026');
eq(O.toMarkdown(O.build(M.sourceState(T.TYPES, T.TEXT_KEYS, hs, '')).seg).indexOf('[GIS Dataset; world_bc323.geojson; commit da7a4b7]') > 0, true, 'the borders are cited to the dataset and file');

// ---- 12. Scanned maps and territory styles ----
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const corners = [[0, 10], [10, 10], [10, 0], [0, 0]];
let ip = M.normalize({ layers: [{ id: 'l1' }], features: [{ id: 'f1', kind: 'image', layer: 'l1', coords: corners, img: png, cites: [{ src: 's1' }] }, { id: 'f2', kind: 'image', layer: 'l1', coords: corners.slice(0, 3), img: png }, { id: 'f3', kind: 'image', layer: 'l1', coords: corners, img: 'javascript:alert(1)' }], sources: [{ id: 's1', fields: { type: 'archival', title: 'Map' } }] }, T.TEXT_KEYS).project;
eq(ip.features.map((f) => f.id), ['f1', 'f3'], 'a scanned map needs four corners');
eq([ip.features[0].img === png, ip.features[1].img], [true, ''], 'only pictures and https links are kept');
const ir = M.render(ip, {});
eq([ir.images.length, ir.images[0].coords], [1, corners], 'the map draws the picture at its corners');
ok(M.audit(ip, O, T.TYPES, T.TEXT_KEYS).rows.some((x) => x.where === 'f3' && /no picture/.test(x.msg)), 'a scanned map without a picture is flagged');
eq(M.legendItems(ip, () => '').length, 0, 'scanned maps stay out of the key');
ok(!('img' in M.toGeoJSON(ip).features[0].properties.osint_map), 'GeoJSON export leaves the picture out');
const ccw = [[0, 0], [2, 0], [2, 2], [0, 2]];
const band = M.render({ layers: [{ id: 'l1', visible: true }], features: [{ id: 'a', kind: 'area', layer: 'l1', coords: ccw, style: { edge: 'band', width: 2 }, cites: [] }], layout: {}, sources: [] }, {}).fc.features.find((f) => f.properties.g === 'band');
eq(band.properties.off, -3, 'an atlas band sits inside the area');
const phys = M.restyle({ version: 8, sources: {}, layers: [{ id: 'water', type: 'fill', 'source-layer': 'water', paint: {} }, { id: 'road', type: 'line', 'source-layer': 'transportation', paint: {} }, { id: 'label_city', type: 'symbol', 'source-layer': 'place', paint: {} }, { id: 'b', type: 'line', 'source-layer': 'boundary', paint: {} }] }, { modern: 'physical' });
eq(phys.layers.map((l) => l.layout.visibility || 'visible'), ['visible', 'none', 'none', 'none'], 'physical only keeps water and hides roads, places and borders');

console.log((failed ? failed + ' failed, ' : '') + passed + ' passed');
process.exit(failed ? 1 : 0);
