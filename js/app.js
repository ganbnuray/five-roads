// the app: loads the data, keeps track of what is on screen, and fills the side panel

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const WORKS_BY_ID = Object.fromEntries(WORKS.map((work) => [work.id, work]));

// what the page is showing right now
const state = {
  mode: "overview",
};

let allEvents = [];
const eventsByWork = {};
const segmentsByWork = {};

// "1935-12-05" becomes about 1935.92, so dates can be compared and placed on a scale
function yearOf(sortDate) {
  const [year, month, day] = sortDate.split("-").map(Number);
  return year + ((month || 1) - 1) / 12 + ((day || 1) - 1) / 365;
}

function prepareEvents(events) {
  allEvents = events;
  allEvents.forEach((e) => {
    e.year = yearOf(e.sortDate);
    e.hasPlace = e.lat != null && e.lon != null;
  });
  WORKS.forEach((work) => {
    eventsByWork[work.id] = allEvents
      .filter((e) => e.work === work.id)
      .sort((a, b) => a.step - b.step);
    segmentsByWork[work.id] = buildSegments(eventsByWork[work.id]);
  });
}

// a segment joins two steps in different places; a step at sea rides along with the next one
function buildSegments(events) {
  const segments = [];
  let last = null;
  let sea = null;
  events.forEach((e) => {
    if (!e.hasPlace) {
      sea = e;
      return;
    }
    const moved = last && (Math.abs(last.lat - e.lat) > 1e-4 || Math.abs(last.lon - e.lon) > 1e-4);
    if (moved) segments.push({ from: last, to: e, sea });
    sea = null;
    last = e;
  });
  return segments;
}

function escapeHtml(text) {
  const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
  return String(text ?? "").replace(/[&<>"]/g, (c) => replacements[c]);
}

function renderMapKey() {
  document.querySelector(".key-works").innerHTML = WORKS.map((work) =>
    `<span><i style="background:${work.color}"></i>${escapeHtml(work.shortTitle)}</span>`
  ).join("");
}

function renderWorkList() {
  const list = document.getElementById("work-list");
  list.innerHTML = WORKS.map((work) => `
    <button class="work-link" data-work="${work.id}" aria-pressed="${state.mode === "work" && state.work === work.id}">
      <span class="arrow" aria-hidden="true">&rarr;</span>
      <span class="name">${escapeHtml(work.title)}</span>
    </button>`).join("");
}

// load the map shapes and the events, then draw the page
Promise.all([d3.json(WORLD_URL), d3.json("data/events.json")]).then(([world, events]) => {
  setupMap(world);
  prepareEvents(events);
  renderMapKey();
  svg.call(zoom.transform, overviewTransform());
  renderWorkList();
});
