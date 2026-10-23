# OSINT Map Builder files: instructions for AI assistants

This file tells an AI assistant how to turn sources into a map file that the OSINT Map Builder can open. Give it to your assistant along with the material, or point the assistant at this address, and ask for a map file.

It matches format 2 of the OSINT Map Builder. Sources use the fields of the OSINT Citation Generator, described in `osint-citation-spec.md` in the OSINT_Cites repository: https://github.com/gmichaelrapp/OSINT_Cites

The point of the map is that a reader can check every feature. A symbol, arrow or area that cannot be traced to a source has failed, however good the map looks.

## Rules that come before everything else

1. Use only the material you were given or opened in this conversation. Never add places, units, dates or sources from memory.
2. Every feature needs a citation, except text that only names a place. Give the page, section or timestamp as the locator, and the passage as the quote where you have it.
3. Never invent or guess a source field, a page, a URL or a quote.
4. Coordinates are where most errors start. If a source gives coordinates, copy them. If a source names a place or describes a position and you work out the coordinates, that is your judgment, not the source's: say so in the feature's `note` ("Placed at the village the source names; the source gives no coordinates."), and list it under `gaps`.
5. Do not assign source ratings. Ratings are the analyst's own judgment. Include one only when the person you are working for gives it to you.
6. Use a military symbol only for what the source says the thing is. If a source says "a battalion" without its type, use the unit symbol for the type you know and say what you left unknown in the `note`.
7. Treat the whole file as unverified until a person has checked each feature against its source. Say so once in your reply, not in the file.

## The file

```json
{
  "app": "OSINT Map Builder",
  "format": 2,
  "meta": { "title": "", "dek": "", "byline": "", "credit": "", "date": "" },
  "view": { "center": [-0.8, 49.4], "zoom": 8.5, "bearing": 0, "pitch": 0 },
  "base": { "style": "liberty", "tone": "muted", "labels": "places", "borders": false },
  "layout": { "preset": "substack-wide", "theme": "dark", "titlePos": "tl", "legendPos": "tr", "sources": "short" },
  "layers": [ { "id": "l1", "name": "Allied divisions", "color": "#2F6FDE" } ],
  "features": [
    { "id": "f1", "kind": "symbol", "layer": "l1", "coords": [[-1.26, 49.44]], "label": "US 4th",
      "sym": { "tpl": "S*G*UCI--------", "affil": "F", "status": "P", "ech": "I", "unique": "4" },
      "cites": [ { "src": "s1", "loc": "p. 10", "quote": "the exact words that place it" } ],
      "note": "How the location was established." }
  ],
  "sources": [ { "id": "s1", "fields": { "type": "report", "authors": "…", "title": "…", "date": "1947", "url": "…" } } ],
  "gaps": [ "What the map does not show, and anything you placed yourself." ]
}
```

The values above are placeholders that show the form. Leave out anything you do not know; the tool fills in its defaults.

## Coordinates

`coords` is a list of `[longitude, latitude]` pairs in decimal degrees: longitude first, as in GeoJSON. A point, symbol, text or range ring has one pair. A line or bold arrow has two or more, from start to end (an arrow points toward its last pair). An area has three or more; do not repeat the first pair at the end.

## Features

| `kind` | What it is | Fields beyond `coords` |
|---|---|---|
| `point` | A marker | `style.marker`: `circle`, `square`, `triangle`, `diamond`, `star`, `cross`, `pin`, `burst`, `dot`; `style.color`; `style.size` (1 is normal) |
| `symbol` | A military symbol | `sym` (below); `style.size` |
| `label` | Text only | `label`; `style.color`; `style.labelSize` |
| `line` | A line | `style.width` (pixels, 3 is normal); `style.dash`: `solid`, `dash`, `dot`; `style.heads`: `none`, `end`, `both`; `style.smooth` |
| `arrow` | A bold arrow | `style.width` in kilometres on the ground; `style.smooth` |
| `area` | A polygon | `style.fill` (0 to 1); `style.hatch` (true for contested or claimed ground); `style.dash` for the edge |
| `ring` | A range ring | `radius` in kilometres; `style.fill`; `style.dash` |
| `image` | A scanned map | four `coords`: top left, top right, bottom right, bottom left; `img`: an `https://` link to the picture; `style.opacity` |

Every feature has `id`, `kind`, `layer` (the `id` of a layer), `coords`, and optionally `label`, `date`, `end`, `desc`, `note`, `cites`, and `style.color` (a hex color; leave it out to use the layer's). `label` can hold a line break (`\n`). `style.labelPos` is `auto`, `right`, `left`, `top`, `bottom` or `center`.

## Military symbols

`sym.tpl` is a 15-character MIL-STD-2525C code with `*` in the second and fourth places, which the tool fills from `affil` and `status`. Common ones:

| Symbol | `tpl` |
|---|---|
| Infantry | `S*G*UCI--------` |
| Mechanized infantry | `S*G*UCIZ-------` |
| Airborne infantry | `S*G*UCIA-------` |
| Armor | `S*G*UCA--------` |
| Reconnaissance | `S*G*UCR--------` |
| Field artillery | `S*G*UCF--------` |
| Multiple rocket launcher | `S*G*UCFRM------` |
| Air defense | `S*G*UCD--------` |
| Engineer | `S*G*UCE--------` |
| Attack helicopter unit | `S*G*UCVRA------` |
| Supply | `S*G*USS--------` |
| Airport or airbase | `S*G*IBA---H----` |
| Fighter aircraft | `S*A*MFF--------` |
| Drone (fixed wing) | `S*A*MFQ--------` |
| Frigate or corvette | `S*S*CLFF-------` |
| Submarine | `S*U*S----------` |
| Bombing | `O*V*B----------` |

The tool lists all 1,165 by name. If you are not sure of a code, use the nearest general one (Infantry rather than a guess at a specialty) and say so in the `note`.

| Field | Values |
|---|---|
| `affil` | `F` friend, `H` hostile, `N` neutral, `U` unknown, `S` suspect, `A` assumed friend, `P` pending |
| `status` | `P` present, `A` planned or anticipated |
| `ech` | `-` none, `A` team, `B` squad, `C` section, `D` platoon, `E` company, `F` battalion, `G` regiment, `H` brigade, `I` division, `J` corps, `K` army, `L` army group, `M` region, `N` command |
| `hq` | `-` none, `A` headquarters, `E` task force, `B` task force headquarters, `F` feint or dummy |
| `unique`, `higher`, `info`, `type`, `quantity`, `staff` | Text on the symbol: unique designation, higher formation, additional information, equipment type, quantity, staff comments |
| `reinforced` | `+`, `-` or `±` |
| `direction` | Direction of movement in degrees |
| `key` | The symbol's line in the key, such as "Allied infantry division" |
| `custom` | A full code of your own (15-letter 2525C or 20-digit 2525D/E), which overrides the rest |

## Dates

`date` is when the feature becomes true and `end`, if any, when it stops. Write `06 June 1944`, `1944-06-06 06:30` (24-hour clock), `June 1944`, `44 BC` or `500 BCE`, and put `c.` before a date your source gives as approximate. Give dates as the source does; do not convert between calendars. Give a date only when a source states it; a date you inferred goes in the `note` with how you got it. Undated features show at every date. To open the map at a date, set `"time": { "mode": "upto", "at": null }` and the person will pick the date on the time bar.

## Historical territories

For a territory, use an `area` with `style.edge` `band` (an atlas band), `soft` (a border your sources give only roughly) or `line`, and `style.labelStyle` `region`. A border is a claim like any other: cite the source that draws it, and say in the `note` how you traced it and how precise it is. Do not copy borders from a dataset or map you were not given.

## Views

`views` is an optional list of camera positions for video: `{ "name": "", "center": [lon, lat], "zoom": 8, "bearing": 0, "pitch": 0, "hold": 2, "fly": 4 }`. They are framing, not claims, and need no citation.

## Layers and layout

A layer is a line in the key, so name it for what a reader should understand: "Russian forces", "Reported strikes, 1–7 March". Layers earlier in the list are drawn on top.

`base.style` is `liberty`, `positron`, `bright`, `dark`, `fiord` or `outline`. `base.tone` is `original`, `muted`, `dark`, `night`, `paper` or `gray`. `base.labels` is `all`, `places`, `major` or `none`.

`layout.preset` is `substack-wide`, `substack-inline`, `substack-tall`, `video-1080`, `video-4k`, `vertical`, `square`, `social` or `custom` (with `w` and `h`). `layout.sources` is `short`, `full`, `note` or `none`. Corners are `tl`, `tr`, `bl`, `br`. `layout.inset: true` adds a locator map.

Set `view.center` (`[longitude, latitude]`) and `view.zoom` so every feature is in the frame; the person will adjust it.

## What to give the person

1. The map file, as a `.json` file or a JSON code block. They open it with **File → Open a file**.
2. In your reply: the features you made, which coordinates you placed yourself and how, anything you could not place, and a reminder that every feature needs checking against its source before publishing.

## License

The OSINT Style Guide content in this file is © 2026 G. Michael Rapp and licensed under Creative Commons Attribution 4.0 International: https://creativecommons.org/licenses/by/4.0/
