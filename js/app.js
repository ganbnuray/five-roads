// the app: loads the data, keeps track of what is on screen, and fills the side panel

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// load the map shapes and the events, then draw the page
d3.json(WORLD_URL).then((world) => {
  setupMap(world);
});
