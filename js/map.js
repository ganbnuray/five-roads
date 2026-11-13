// the map: setup, zoom, and drawing routes, markers and labels

const WIDTH = 1000;
const HEIGHT = 620;

const svg = d3.select("#map");
const baseLayer = svg.append("g"); // land and borders, moved by the zoom

let projection;
let currentTransform = d3.zoomIdentity;

const zoom = d3.zoom()
  .scaleExtent([0.85, 220])
  .on("zoom", (event) => {
    currentTransform = event.transform;
    baseLayer.attr("transform", currentTransform);
  });

function setupMap(world) {
  const land = topojson.feature(world, world.objects.countries);
  const borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

  // fit the map to the area between california and paris
  const frame = { type: "MultiPoint", coordinates: [[-125, 27], [8, 54], [-125, 54], [8, 27]] };
  projection = d3.geoMercator().fitExtent([[24, 24], [WIDTH - 24, HEIGHT - 24]], frame);
  const path = d3.geoPath(projection);

  baseLayer.append("rect")
    .attr("x", -5000)
    .attr("y", -5000)
    .attr("width", 11000)
    .attr("height", 11000)
    .attr("fill", "var(--sea)");

  baseLayer.append("path")
    .datum(land)
    .attr("d", path)
    .attr("fill", "var(--land)")
    .attr("stroke", "var(--border)")
    .attr("stroke-width", 0.6)
    .attr("vector-effect", "non-scaling-stroke");

  baseLayer.append("path")
    .datum(borders)
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "var(--border)")
    .attr("stroke-width", 0.5)
    .attr("vector-effect", "non-scaling-stroke");

  svg.call(zoom).on("dblclick.zoom", null);
}

document.getElementById("zoom-in").onclick = () => {
  svg.transition().duration(300).call(zoom.scaleBy, 1.6);
};

document.getElementById("zoom-out").onclick = () => {
  svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.6);
};

document.getElementById("zoom-reset").onclick = () => {
  svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
};
