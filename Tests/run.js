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

console.log((failed ? failed + ' failed, ' : '') + passed + ' passed');
process.exit(failed ? 1 : 0);
