// the map: setup, zoom, and drawing routes, markers and labels

const WIDTH = 1000;
const HEIGHT = 620;

const svg = d3.select("#map");
const baseLayer = svg.append("g"); // land and borders, moved by the zoom
const overlay = svg.append("g"); // routes and labels, redrawn after every zoom

let projection;
let currentTransform = d3.zoomIdentity;

const zoom = d3.zoom()
  .scaleExtent([0.85, 220])
  .on("zoom", (event) => {
    currentTransform = event.transform;
    baseLayer.attr("transform", currentTransform);
    drawMap(false);
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
  svg.transition().duration(500).call(zoom.transform, overviewTransform());
};

// find the zoom that shows all the given events
function fitToEvents(events, minSize) {
  const points = events.filter((e) => e && e.hasPlace);
  if (points.length === 0) return d3.zoomIdentity;

  let west = d3.min(points, (e) => e.lon);
  let east = d3.max(points, (e) => e.lon);
  let south = d3.min(points, (e) => e.lat);
  let north = d3.max(points, (e) => e.lat);

  // give a single place some room around it
  if (east - west < minSize) {
    const middle = (west + east) / 2;
    west = middle - minSize / 2;
    east = middle + minSize / 2;
  }
  if (north - south < minSize * 0.6) {
    const middle = (north + south) / 2;
    south = middle - minSize * 0.3;
    north = middle + minSize * 0.3;
  }

  const topLeft = projection([west, north]);
  const bottomRight = projection([east, south]);
  const boxWidth = Math.max(1, bottomRight[0] - topLeft[0]);
  const boxHeight = Math.max(1, bottomRight[1] - topLeft[1]);
  const scale = Math.max(0.85, Math.min(220, 0.62 * Math.min(WIDTH / boxWidth, HEIGHT / boxHeight)));
  const centerX = (topLeft[0] + bottomRight[0]) / 2;
  const centerY = (topLeft[1] + bottomRight[1]) / 2;

  return d3.zoomIdentity
    .translate(WIDTH / 2 - scale * centerX, HEIGHT / 2 - scale * centerY)
    .scale(scale);
}

function overviewTransform() {
  return fitToEvents(allEvents, 1);
}

// turn a longitude and latitude into a point on screen, after zoom
function project(lon, lat) {
  const [x, y] = projection([lon, lat]);
  return [currentTransform.applyX(x), currentTransform.applyY(y)];
}

// a gently bent line from point a to point b
function curvePath(a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const bend = Math.hypot(dx, dy) > 200 ? 0.22 : 0.15;
  const midX = (a[0] + b[0]) / 2 - dy * bend;
  const midY = (a[1] + b[1]) / 2 + dx * bend;
  return `M${a[0]},${a[1]} Q${midX},${midY} ${b[0]},${b[1]}`;
}

function drawMap(animate) {
  overlay.selectAll("*").remove();
  if (allEvents.length === 0) return; // data is still loading
  const view = buildView(animate);
  view.routes.forEach(drawRoute);
}

// decide which routes, markers and labels to show for the current mode
function buildView(animate) {
  const view = { routes: [], markers: [], labels: [] };

  // overview: every route, and a marker where each work ends up
  WORKS.forEach((work) => {
    segmentsByWork[work.id].forEach((segment) => {
      view.routes.push({ work: work.id, segment, style: "solid" });
    });
  });
  return view;
}

const ROUTE_WIDTH = { ghost: 1, future: 1.5, past: 2, solid: 3, now: 4 };
const ROUTE_OPACITY = { ghost: 0.18, future: 0.35, past: 0.4, solid: 0.9, now: 1 };

function drawRoute(route) {
  const color = WORKS_BY_ID[route.work].color;
  const a = project(route.segment.from.lon, route.segment.from.lat);
  const b = project(route.segment.to.lon, route.segment.to.lat);
  const path = overlay.append("path")
    .attr("d", curvePath(a, b))
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-linecap", "round")
    .attr("stroke-width", ROUTE_WIDTH[route.style])
    .attr("opacity", ROUTE_OPACITY[route.style]);
  drawArrow(path, color, true);
}

// a small arrowhead at the end of a route
function drawArrow(path, color, small) {
  const node = path.node();
  const length = node.getTotalLength();
  if (length < 6) return;
  const tip = node.getPointAtLength(length);
  const before = node.getPointAtLength(Math.max(0, length - 8));
  const angle = (Math.atan2(tip.y - before.y, tip.x - before.x) * 180) / Math.PI;
  const size = small ? 6 : 9;
  overlay.append("path")
    .attr("d", `M0,0 L${-size * 1.6},${-size * 0.75} L${-size * 1.6},${size * 0.75} Z`)
    .attr("fill", color)
    .attr("transform", `translate(${tip.x},${tip.y}) rotate(${angle})`);
}
