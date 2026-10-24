# OSINT Map Builder

A tool for making sourced maps that hold up in a Substack post or a video: real basemaps, military symbols, arrows, areas and range rings, with every feature cited in the form set out by the [OSINT Style Guide](https://gmichaelrapp.github.io/OSINT_Cites/). Footnote numbers sit beside the labels, and the matching footnotes go into your post, so a reader can follow any symbol on the map back to the page that put it there.

It is one web page. There is nothing to install, no account, and no server. It is a sibling of the [OSINT Timeline Builder](https://github.com/gmichaelrapp/OSINT_Timelines) and the [OSINT Dashboard Builder](https://github.com/gmichaelrapp/OSINT_Dashboards): all three use the Citation Generator's source fields and footnote formatter. A map saved here opens in the Dashboard Builder as a zoomable panel, with its key and numbered citations.

## What it makes

| Feature | Tool | Use it for |
|---|---|---|
| Marker | M | A place: a strike, a site, a sighting. Nine shapes, including a strike burst and a pin |
| Military symbol | S | Units, equipment, installations, aircraft and ships, drawn to MIL-STD-2525C. 1,165 symbols, searchable by name |
| Text | T | Names of rivers, regions or fronts that the basemap does not label |
| Line | L | Routes, front lines, supply lines. Solid, dashed or dotted, with arrowheads |
| Bold arrow | A | An axis of advance. Its width is set in kilometres, so it scales with the map |
| Area | G | Occupied, claimed or contested ground, or a historical territory. Filled, outlined, hatched, with an atlas band or a soft edge |
| Range ring | R | A weapon's reach or a radius from a point, drawn true to the ground |
| Scanned map | | An old map from a file or a link, stretched onto the ground by its corners |

Military symbols take the full set of choices: affiliation (friend, hostile, neutral, unknown, suspect, assumed friend, pending), present or planned, echelon from team to command, headquarters and task force marks, and the text amplifiers (unique designation, higher formation, equipment type, reinforced or reduced, direction of movement and others). A 2525D or 2525E numeric code can be typed in directly.

The finished image carries a title block, a key, the sources, a scale bar, a north arrow, a locator map, the map's date, a credit line, and the basemap attribution its providers require.

Give features dates and the map becomes a sequence: a time bar under the map shows the situation on any day or hour and plays through them. Save views, and the tool renders a video that holds on each one and flies smoothly to the next, with the title, key and date drawn on every frame.

## Basemaps

| Basemap | What it is |
|---|---|
| Liberty, Positron, Bright, Dark, Fiord | OpenStreetMap vector maps from [OpenFreeMap](https://openfreemap.org/): free, no key, no limits on views |
| Plain outline | Coastlines and borders from Natural Earth, built into the page. Works offline |
| Your own style | Any MapLibre style URL, such as a MapTiler style with your key or your own tiles |

Any basemap can be toned (Muted, Dark ops, Night blue, Paper, Grayscale) so your data stands out, thinned to places only or no labels, and given strong borders. For realism, add:

- **Shaded relief** from Natural Earth, for country and region scale.
- **Hillshade** from [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) elevation data, at any scale.
- **Satellite imagery** from [Sentinel-2 cloudless](https://cloudless.eox.at/) by EOX. The 2016 mosaic is CC BY 4.0 and fine for commercial use. The 2024 mosaic is CC BY-NC-SA 4.0: non-commercial only, and a monetized post or channel is commercial use.

## Using it

Open `index.html` in any current browser, or use the hosted copy linked in this repository's About box. It opens on the D-Day example, which has five saved views for trying the video export.

1. **Frame the map.** Under **Layout**, choose what it is for: a Substack post (16:9, 4:3 or 4:5), a 1080p or 4K video frame, a vertical short, a square, or a custom size. The frame on screen is the image you will get.
2. **Choose the look** under **Basemap**. **Find a place** searches OpenStreetMap's Nominatim; **Go to coordinates** takes decimal degrees, degrees-minutes-seconds or MGRS.
3. **Add features** with the tools beside the map. Click to place. For lines, arrows and areas, click each point; click the last point again (or double-click, or press Enter) to finish, and click the first point to close an area. Ctrl+Z (Cmd+Z) takes back the last point while drawing. New points snap to points already on the map; hold Alt to place freely.
   Press on a marker, symbol or text and drag to move it, without selecting it first. Lines, areas and scans move once selected, so dragging across them still pans the map. Drag a point of a line or area to reshape it, drag the small dot between two points to add one, and double-click a point to remove it. **Add at coordinates** places features from typed coordinates, one per line.
   Labels place themselves: on **Automatic** (the default) each label picks the side of its feature that keeps clear of symbols, arrows, lines, the title and key, the frame's edge and other labels, and moves as you pan and zoom. Drag a label to put it anywhere; a thin leader line joins it to its feature when it is far away. **Put the label back** returns it to Automatic.
4. **Cite everything.** Add sources under **Sources**, with the same fields as the Citation Generator, then cite them from each feature with the page or timestamp and, if you like, the passage. Each feature also has a box for how its location was established: a place you worked out yourself is a judgment, not source data, and the Style Guide asks you to say how you got it.
5. **Check** lists everything unsourced and every check the Citation Generator would raise on a source.
6. **Export image.** Three kinds:

| Export | What you get |
|---|---|
| The finished map | Basemap, features, title, key, sources and credit, at the frame's size (or double or half) |
| The map only | Basemap and features with the attribution, for layouts you build elsewhere |
| Your data only, transparent | Features and labels on a transparent background, to lay over footage or another map in a video editor |

**File → Copy footnotes for your post** gives the numbered footnotes in the same order as the numbers on the image. The numbers stay the same whatever date the time bar shows, so one footnote list serves a whole sequence of maps or a video.

### Time

Give a feature a **Date**, and an end date under **Shown until** if it stops being true (a unit that moved on, an area retaken). Dates can be written `06 June 1944`, `1944-06-06 06:30`, `6 June 1944 0630`, `June 1944`, `1944`, `c. 1450`, `44 BC`, `500 BCE`, `AD 9` or, in ISO form, `-0499` (which, as in ISO 8601, is 500 BCE); the form says how it read yours. `c.`, `ca.` or `circa` marks a date as approximate. Dates are taken as written: the tool does not convert between the Julian and Gregorian calendars, so give dates as your sources do and say which calendar in the feature's note where it matters. Once any feature has a date, a time bar appears under the map:

| Setting | What the map shows |
|---|---|
| All dates | Everything, as if there were no dates |
| Up to | Everything that has started by the chosen date and not ended |
| On the date | Only what falls on the chosen day (or hour, for times) |

The bar steps by minutes, days, months or years to suit the span, and shows the date no more precisely than it steps. **Views & video** sets whether years before the common era print as `500 BCE` or `500 BC`.

Features without a date are always shown. Play runs through the whole range in the time set under **Views & video**. The chosen date is printed on the image, in the corner you choose under **Layout**, so each export is labeled with the moment it shows.

### Views and video

Under **Views & video**, **Save the current view** stores where the map looks: center, zoom, rotation (right-drag) and tilt (Ctrl-drag), and the time bar's date if one is set. Give each view a hold time and the time to fly in from the one before. **Preview the flight** plays it on screen.

**Export video** renders the flight off screen, frame by frame, at the layout's size (or double or half) and 24, 30 or 60 frames a second. Each frame waits for its map tiles, so the motion is smooth however slow the connection; the export takes longer than the video runs. A view with a date moves the time bar with the camera, so a flight can also play the days in between. With no views saved, the video plays the time bar at the current view.

The result is an MP4 (H.264) where the browser can encode one, and WebM otherwise. Current Chrome, Edge and Safari can; keep the tab in front while it renders. Leave the title and key off for footage you will finish in a video editor.

### Locator map

**Layout → Locator map** adds a small map of where the main map is, in the corner you choose, with the frame outlined. It is drawn from the built-in Natural Earth outlines, so it looks the same on every basemap and needs no connection.

### Layers and the key

Each layer is a line in the key, named after the layer. Layers higher in the list are drawn on top. Military symbols are listed in the key symbol by symbol ("Hostile armor", "Friendly infantry airborne"); give a symbol a **Name in the key** to group symbols your way, as the example does with "Allied airborne division".

## Historical maps

**Basemap → Historical maps** (or the File menu) offers two ways to show the past, and **Basemap → Modern features → Physical only** clears today's roads, cities, borders and land use off the basemap so they do not sit under 1680 borders. Rivers, lakes and coastlines are still today's, and some have moved a long way; say so where it matters.

### Scanned maps

**Add a scanned map** takes a PNG, JPEG or WebP file (scans over 4,096 pixels on the long side are reduced), or a link to a picture on a site that lets other pages draw it, as most library IIIF image servers do. The scan appears over the frame. Lower its **Opacity**, then drag its corners until landmarks on the scan sit on the same places on the basemap. Hold **Shift** while dragging a corner to turn and scale the whole picture without changing its shape, and drag inside it to move it. **Square up the corners** and **Fit to the view** start again. Tick **Locked in place** when it fits, so dragging on it moves the map.

Four corners fit a scan the way you would pin a print to a wall map: well enough where the old map was surveyed well, and not everywhere. Fit the part your story is about.

Each scan is cited like any other feature. Adding one creates a draft source (an archival source, kind *Historical Map*, qualified as a scan) for you to fill in with the library or archive, the map's title, maker and date, and the catalog link. Scanned maps are drawn under all other features, can take dates for the time bar, and are left out of the key. A scan chosen from a file is saved inside the map file and kept in the browser; a linked scan is loaded from its site each time.

Use scans you may publish. Most maps published before 1931 are public domain in the US, but some libraries set terms for their scans.

### Historical borders

**Add historical borders** downloads one of 54 snapshots, from 123,000 BCE to 2010, from [Historical Basemaps](https://github.com/aourednik/historical-basemaps) by A. Ourednik, and adds its territories as areas you can restyle, rename, reshape or delete:

- Only what is in the frame is added, unless you choose the whole world. Borders are simplified to suit the zoom.
- Each territory is colored by the power that ruled it, so a colony shares its ruler's color, and named in spaced capitals. Territories with several parts are named once.
- Each says how precise its border is. The dataset rates borders 1 (approximate), 2 (moderately precise) or 3 (determined by international law); approximate borders are drawn soft, and moderately precise ones dashed.
- Each is cited to the dataset, the snapshot's file and the commit it came from, so the footnote points at exactly the data you used.
- Dated, a snapshot shows from its year until the year before the next snapshot. Add two or more and the borders change as you move the time bar or play a video.

Its author describes the dataset as a work in progress, drawn for world and continent scale, and asks users to check borders against other sources. Before about 1648, a border is often a convention for a zone of control, and neighbouring peoples' lands overlap. The data is licensed GPL-3.0. The tool downloads it when you ask and does not include it; the credit "Historical borders: Historical Basemaps by A. Ourednik (GPL-3.0)" is added to every image that shows it. A map file or GeoJSON export holding the borders holds GPL-3.0 data.

### Territory styles

Any area can take an **Edge look**: a line, an atlas band (a wide translucent strip inside the border, as in printed historical atlases), or a soft edge for a border that is only approximate. **Region** label style sets a name in spaced capitals in a darker shade of the area's color. A label can be **Hidden**, which keeps the name for the feature list and search, and a label's footnote numbers can be turned off.

## Bringing data in

**File → Open a file**, or drag a file onto the page:

| File | What happens |
|---|---|
| A map (`.json`) saved from this tool | It replaces the open map, after you confirm |
| A CSV or TSV | Its rows become features, after you match the columns |
| GeoJSON | Its points, lines and polygons are added as a new layer |
| A source list (`.json`) from the OSINT Citation Generator | Its sources are added to the source list |
| A picture (PNG, JPEG, WebP) | It is added as a scanned map |

### Columns a CSV can have

Column names are recognized when they match these; you can match others by hand.

| Header | Read as |
|---|---|
| `lat`, `latitude` and `lon`, `lng`, `longitude` | The position |
| `coordinates`, `location`, `mgrs`, `grid` | The position in one column: decimal, DMS or MGRS |
| `wkt`, `geometry` | A shape: `POINT`, `LINESTRING` or `POLYGON` |
| `label`, `name`, `unit` | The label |
| `layer`, `side`, `category`, `faction` | The layer, created if it does not exist |
| `sidc`, `symbol` | A MIL-STD-2525 code. The row becomes a military symbol |
| `affiliation` | `friend`, `hostile`, `neutral`, `unknown`… overrides the code's |
| `marker`, `shape` and `color` | A marker shape and color |
| `radius_km`, `radius` | The row becomes a range ring of that radius |
| `date`, `end` (or `until`) | When the feature appears, and when it stops |
| `description` | Kept with the feature |
| `source_id`, `locator` (or `page`), `quote` | The row's citation: the ID of a source in the source list, the page or timestamp, and the passage |
| `note`, `method`, `geolocation` | How the place was established |

`examples/d-day-divisions.csv` is a CSV of the example's divisions.

## Files

**File → Save map** writes a `.json` file holding everything. The map is also kept in the browser's local storage on your device, so it is there when you come back; save it to a file to move it or keep it safe.

| Export | What you get |
|---|---|
| Map (`.json`) | The whole map, to open here again |
| Source list (`.json`) | Opens in the OSINT Citation Generator with every field intact |
| Footnotes (`.md`) | The cited sources as numbered footnotes, then how each location was established |
| GeoJSON | Every feature, with its footnotes as text, for QGIS, Google Earth or another tool |

## Publishing on GitHub Pages

1. Make a new public repository and upload this folder's files.
2. In **Settings → Pages**, deploy from the `main` branch, `/ (root)`.

The tool will be at `https://<your-username>.github.io/<repository>/`.

## Using it with an AI assistant

`map-spec.md` tells an AI assistant how to write a map file this tool can open: features, layers, symbols and citations, and the rules against inventing coordinates or sources. Give the assistant that file and your material, then open the result here and check it before you publish.

## Your data

Your map stays in your browser. The page asks other sites only for the basemap you choose (map tiles, fonts and icons from OpenFreeMap, or your own style's provider), for the relief, hillshade or imagery you turn on, and for place searches, which go to Nominatim one search at a time. Adding historical borders downloads the snapshot you choose from jsDelivr (or GitHub if that fails), and a linked scan loads from its site. The Plain outline basemap needs no connection at all.

## Tests

`node Tests/run.js` checks coordinate reading, geometry, symbol codes, the example, footnotes, CSV and GeoJSON reading, basemap restyling, dates (including years before the common era) and the time filter, video flight paths, historical borders, scanned maps and territory styles. It needs Node 18 or later and nothing else, and it runs on GitHub on every push.

## Credits and license

- The citation formatter, the source types and the description library are taken from the [OSINT Citation Generator](https://github.com/gmichaelrapp/OSINT_Cites) v3.2.1.
- Maps: [MapLibre GL JS](https://maplibre.org/) 5.24.0 (BSD-3-Clause). Military symbols: [milsymbol](https://github.com/spatialillusions/milsymbol) 3.0.4 (MIT), with symbol names from [mil-std-2525](https://github.com/spatialillusions/mil-std-2525) (MIT). MGRS: [mgrs](https://github.com/proj4js/mgrs) 2.2.0 (MIT). Video files: [mp4-muxer](https://github.com/Vanilagy/mp4-muxer) 5.2.2 and [webm-muxer](https://github.com/Vanilagy/webm-muxer) 5.1.4 (MIT). Outlines: [Natural Earth](https://www.naturalearthdata.com/) (public domain). See `THIRD-PARTY-NOTICES.md`.
- Historical borders, downloaded on request and not included: [Historical Basemaps](https://github.com/aourednik/historical-basemaps) by A. Ourednik (GPL-3.0).
- Basemap data © OpenStreetMap contributors, tiles by OpenFreeMap and OpenMapTiles. Their attribution is printed on every image.
- Code: MIT License (`LICENSE-MIT`)
- OSINT Style Guide content: the citation rules, description library, and qualifier and access lists, under Creative Commons Attribution 4.0 International (`LICENSE-CC-BY-4.0`)

© 2026 G. Michael Rapp.
