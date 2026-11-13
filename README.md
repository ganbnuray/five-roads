# Five Roads to the Legion of Honor

An interactive map of how five bronze sculptures reached the Legion of Honor in San Francisco: four by Auguste Rodin and one by the California sculptor Arthur Putnam. All five were cast at the same foundry in Paris, two in Rodin's lifetime, two after his death, and one from Putnam's plaster because Alma de Bretteville Spreckels paid for it. The site follows each work from the foundry to the museum and asks what the art market, two world wars and the Depression did to these copies on the way.

## What you can do

- **Overview**: all five routes at once, with the foundry they share.
- **By period**: seven periods from 1904 to today, each with what happened to the works and what happened in the world.
- **Follow one work**: step through one work's road, with the place, the people, the source and how certain each step is.
- **Quiz**: eight questions, each linked back to the step on the map where the answer is.

## Run it locally

The page loads its data with `fetch`, so it needs a small local server instead of opening the file directly:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

```
index.html          page structure
css/style.css       styles
js/data.js          the works, places, periods and quiz
js/map.js           the map: setup, zoom, routes, markers and labels
js/app.js           state, side panel, controls and loading
data/events.json    the 43 events, one per step of each work
img/                photos of the five works
```

Each event in `data/events.json` has a date, a place, the people involved, a source, and a note on how certain it is. Steps marked `"uncertain": true` are drawn as dashed lines.

## Sources and credits

- Provenance and exhibition history: Fine Arts Museums of San Francisco online collection records for The Thinker (1924.18.1), The Prodigal Son (1940.137), Faun and Nymph (1942.42), Polyphemus and Acis (1950.58) and Tiger Love (1924.118).
- Photos of the works: Fine Arts Museums of San Francisco.
- Background on Rodin's casting rights, the Rudier foundry, the 1941 melting of French bronzes and the 1956 limit on casts comes from the Musée Rodin, AGORHA (INHA), Kirrily Freeman's *Bronzes to Bullets* (2009) and the Cantor Foundation.
- Map shapes: [world-atlas](https://github.com/topojson/world-atlas), from Natural Earth.
- Built with [d3](https://d3js.org) and [topojson](https://github.com/topojson/topojson-client).

The routes are drawn as arcs between places. They show that a work moved, not the road it took.
