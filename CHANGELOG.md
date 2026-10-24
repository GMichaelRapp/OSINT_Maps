# Changelog

Changes to the OSINT Map Builder, newest first.

## 2.2 — 23 October 2026

- **Editing:** press and drag markers, symbols, text and labels without selecting them first; bigger handles and hit areas; points snap to points already on the map while drawing (Alt to stop); click the last point to finish a line, the first to close an area; Ctrl+Z takes back the last point while drawing.
- **Labels:** placed automatically to keep clear of symbols, arrows, lines, the title and key, the frame's edge and each other, and re-placed as the camera moves, in video too. Labels can be dragged anywhere, with a leader line when far from their feature, and put back with one click. Diagonal positions added.
- **Arrows:** swept arrowheads with an outline and a soft shadow; lines stop short of their arrowheads instead of poking through.
- **Symbols and key:** text fields around symbols get a halo; the key names the echelon ("Hostile armor, division") and shows the symbol without echelon marks, so two sizes of the same unit no longer look alike; basemap labels hide under symbols instead of running through them.
- The map engine is now shared with the OSINT Dashboard Builder, which shows Map Builder maps as panels.

## 2.1 — 23 October 2026

- **Scanned maps:** add an old map from a file or a link and stretch it onto the ground by dragging its corners (Shift-drag to turn and scale it), with opacity, locking, dates and a draft archival source to fill in. Scans are saved inside map files and kept in the browser, and appear in image and video exports.
- **Historical borders:** add any of 54 snapshots from Historical Basemaps (123,000 BCE to 2010) as editable areas, limited to the frame and simplified to the zoom, colored by ruling power, styled by border precision, dated to change with the time bar, and cited to the exact file and commit. Downloaded on request; not bundled.
- **Physical only:** a basemap setting that hides modern roads, cities, borders and land use.
- **Territory styles:** atlas-band and soft edges for areas, a spaced-capitals region label style, hidden labels, and footnote numbers that can be turned off per feature.
- **Dates:** years before the common era (44 BC, 500 BCE, -0499), AD and CE, and approximate dates (c. 1450). The time bar steps by years or months over long spans and shows dates no more precisely than it steps. Choice of BCE or BC.
- **Check tab:** flags a scanned map with no picture and one with no source.

## 2.0 — 23 October 2026

- **Time:** features take a date (with an optional time of day) and an optional end date. A time bar under the map shows everything up to a date, or only what falls on it, and plays through the range. The date is printed on the image.
- **Views:** save camera positions (center, zoom, rotation, tilt, and a date) with hold and fly times, and preview the flight.
- **Video export:** MP4 (H.264) or WebM, rendered frame by frame so the motion is smooth on any connection, flying between views along MapLibre's smooth zoom-and-pan path, with the layout drawn on every frame. 24, 30 or 60 frames a second, at the layout's size, double or half.
- **Locator map:** a small map of where the main map sits, drawn from the built-in outlines.
- **CSV:** `end` or `until` columns for end dates.
- **Check tab:** flags dates the time bar cannot read.
- Map file format 2. Version 1 files still open.

## 1.0 — 23 October 2026

First release.

- **Features:** markers, military symbols, text, lines with arrowheads, bold arrows sized in kilometres, areas (filled, dashed or hatched), and range rings drawn true to the ground. Drag to move; drag, add and remove points to reshape.
- **Military symbols:** MIL-STD-2525C, 1,165 symbols searchable by name, with affiliation, status, echelon, headquarters and task force marks, and text amplifiers. 2525D and 2525E codes can be typed in.
- **Entry:** clicking, typed coordinates (decimal, degrees-minutes-seconds, MGRS), CSV with column matching and row-by-row citations, and GeoJSON.
- **Sources:** the OSINT Citation Generator's fields and formatter, cited from each feature with a locator and quote, with footnote numbers beside labels and a note on how each location was established.
- **Basemaps:** OpenFreeMap Liberty, Positron, Bright, Dark and Fiord; a built-in plain outline that works offline; or any MapLibre style. Tones, label density and strong borders; shaded relief, hillshade, and Sentinel-2 cloudless imagery.
- **Layout:** sizes for Substack posts, 1080p and 4K video, vertical shorts, squares and custom; a title block, key, sources, scale bar, north arrow and credit, drawn on screen exactly as exported.
- **Exports:** the finished map, the map alone, or the data alone on a transparent background, as PNG or JPEG; footnotes for the post; a Citation Generator source list; GeoJSON; and the map file.
- **Check tab:** lists unsourced features and every check the Citation Generator would raise on a source.
- Map file format 1.
- `map-spec.md`: instructions for AI assistants that write map files.
- Example: *D-Day: The Normandy Landings*, from the Imperial War Museums, the US Army's *Utah Beach to Cherbourg*, and the Canadian official history.
