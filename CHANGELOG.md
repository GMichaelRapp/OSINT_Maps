# Changelog

Changes to the OSINT Map Builder, newest first.

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
