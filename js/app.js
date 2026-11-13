// the app: loads the data, keeps track of what is on screen, and fills the side panel

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const WORKS_BY_ID = Object.fromEntries(WORKS.map((work) => [work.id, work]));

// what the page is showing right now
const state = {
  mode: "overview",
  work: "thinker",
  step: 1,
  roadOpen: false,
  playing: null,
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
  list.querySelectorAll("[data-work]").forEach((button) => {
    button.onclick = () => go("work", { work: button.dataset.work, step: 1 });
  });
}

const panel = document.getElementById("panel");

// the title inside a tombstone is set in italics
function tombstoneHtml(work) {
  const title = escapeHtml(work.title);
  return escapeHtml(work.tombstone).replace(title, `<i>${title}</i>`);
}

function renderOverview() {
  const items = WORKS.map((work) => `
    <li>
      <button class="work-title" data-follow="${work.id}">${escapeHtml(work.title)}</button>
      <p class="cast">${escapeHtml(work.cast)}</p>
      <p class="small">${escapeHtml(work.summary)}</p>
      <div class="tomb">${tombstoneHtml(work)}</div>
      <div class="links">
        <button data-follow="${work.id}"><span aria-hidden="true">&rarr;</span> Follow this work</button>
        <a href="${work.museumPage}"><span aria-hidden="true">&rarr;</span> Museum record</a>
      </div>
    </li>`).join("");
  panel.innerHTML = `<h2>Five works, one museum</h2><ul class="works">${items}</ul>`;
  panel.querySelectorAll("[data-follow]").forEach((button) => {
    button.onclick = () => go("work", { work: button.dataset.follow, step: 1 });
  });
}

function placeText(e) {
  let text = e.place + (e.city ? ", " + e.city : "");
  if (e.placeAccuracy && e.placeAccuracy !== "Exact address") text += ` (${e.placeAccuracy.toLowerCase()})`;
  return text;
}

function renderWork() {
  const work = WORKS_BY_ID[state.work];
  const events = eventsByWork[state.work];
  const e = events.find((x) => x.step === state.step);
  panel.innerHTML = `
    <figure class="photo">
      <img src="${work.photo}" alt="${escapeHtml(work.title)}, bronze, Legion of Honor">
      <figcaption>Photo: Fine Arts Museums of San Francisco</figcaption>
    </figure>
    <div>
      <h2><i>${escapeHtml(work.title)}</i></h2>
      <p class="cast">${escapeHtml(work.cast)}</p>
      <div class="tomb">${tombstoneHtml(work)}</div>
    </div>
    <div class="step">
      <div class="date"><span class="type">${escapeHtml(e.type)}</span><span>${escapeHtml(e.date)}</span></div>
      <p class="what">${escapeHtml(e.what)}.</p>
      <dl class="details">
        <dt>Where</dt><dd>${escapeHtml(placeText(e))}</dd>
        <dt>Who</dt><dd>${escapeHtml(e.who)}</dd>
        <dt>Context (our reading)</dt><dd>${escapeHtml(e.context)}</dd>
        <dt>Source</dt><dd>${escapeHtml(e.source)}</dd>
        <dt>Certainty</dt><dd>${escapeHtml(e.certainty)}</dd>
        <dt>After this</dt><dd>${escapeHtml(STATUS_LABELS[e.status])}</dd>
      </dl>
    </div>
    <details class="road" ${state.roadOpen ? "open" : ""}>
      <summary>The whole road <span class="muted">(${events.length} steps)</span></summary>
      <ul class="event-list">${events.map((x) => `
        <li class="${x.uncertain ? "uncertain" : ""}">
          <button data-step="${x.step}" ${x.step === state.step ? 'aria-current="step"' : ""}>
            <span class="when">${escapeHtml(x.date)}</span>
            <span class="text">${escapeHtml(x.what)}</span>
          </button>
        </li>`).join("")}
      </ul>
    </details>
    <p class="small"><a href="${work.museumPage}">See the museum record</a></p>`;

  panel.querySelectorAll("[data-step]").forEach((button) => {
    button.onclick = () => go("work", { work: state.work, step: Number(button.dataset.step) });
  });
  // remember if the list was open, so it stays open on the next step
  const road = panel.querySelector(".road");
  road.ontoggle = () => {
    state.roadOpen = road.open;
  };
}

function updateTabs() {
  ["overview", "period", "work", "quiz"].forEach((mode) => {
    document.getElementById("tab-" + mode).setAttribute("aria-pressed", String(state.mode === mode));
  });
}

// the previous place, the current place, and the next place if this step is at sea
function workStepPoints() {
  const events = eventsByWork[state.work];
  const current = events.find((e) => e.step === state.step);
  const previous = events.filter((e) => e.step < state.step && e.hasPlace).pop();
  const next = current.hasPlace ? null : events.find((e) => e.step > state.step && e.hasPlace);
  return [previous, current, next];
}

// switch to a mode, then move the map and redraw
function go(mode, options = {}) {
  state.mode = mode;
  if (options.work) state.work = options.work;
  if (options.step != null) state.step = options.step;
  updateTabs();
  renderWorkList();
  updateControls();

  if (mode === "overview" || mode === "quiz") {
    renderOverview();
    moveMapTo(overviewTransform(), () => drawMap(false));
    return;
  }

  let target;
  if (mode === "work") {
    renderWork();
    target = fitToEvents(workStepPoints(), 0.12);
  }
  // hide the new route while the map moves, then draw it in
  hideNewRoutes = true;
  moveMapTo(target, () => {
    hideNewRoutes = false;
    drawMap(true);
  });
}

function updateControls() {
  let status = "";
  let canGoBack = false;
  let canGoNext = false;
  if (state.mode === "work") {
    const total = eventsByWork[state.work].length;
    status = `Step ${state.step} of ${total}`;
    canGoBack = state.step > 1;
    canGoNext = state.step < total;
  }
  document.getElementById("status").textContent = status;
  document.getElementById("prev").disabled = !canGoBack;
  document.getElementById("next").disabled = !canGoNext;

  const play = document.getElementById("play");
  play.disabled = state.mode !== "work";
  play.textContent = state.playing ? "Pause" : "Play";
  updateEraTag();
  updateYearBar();
}

function step(direction) {
  if (state.mode === "work") {
    const next = state.step + direction;
    if (next >= 1 && next <= eventsByWork[state.work].length) go("work", { work: state.work, step: next });
    else stopPlaying();
  }
}

function stopPlaying() {
  if (!state.playing) return;
  clearInterval(state.playing);
  state.playing = null;
  updateControls();
}

function togglePlay() {
  if (state.playing) {
    stopPlaying();
    return;
  }
  state.playing = setInterval(() => step(1), 4200);
  updateControls();
}

function updateEraTag() {
  const tag = document.getElementById("era");
  let text = "";
  if (state.mode === "work") {
    const year = eventsByWork[state.work].find((e) => e.step === state.step).year;
    if (state.work === "tiger") {
      text = year < PUTNAM_DEATH ? "Putnam alive" : "After Putnam's death";
    } else if (year < RODIN_DEATH) {
      text = "Rodin alive";
    } else {
      const years = Math.floor(year - RODIN_DEATH);
      text = years < 1 ? "Rodin has just died" : `${years} years after Rodin's death`;
    }
  }
  tag.textContent = text;
  tag.style.display = text ? "" : "none";
  tag.className = "era " + (text.includes("alive") ? "alive" : "after");
}

// position on the year bar in percent; 1900 to 1952 fills most of the bar, later years share the end
function yearBarPosition(year) {
  const start = 1900;
  const end = 1952;
  const share = 0.88;
  if (year <= end) return ((year - start) / (end - start)) * share * 100;
  return share * 100 + Math.min(1, (year - end) / 75) * (1 - share) * 100;
}

function setUpYearBar() {
  const bar = document.querySelector(".year-bar");
  bar.querySelector(".year-tick").style.left = yearBarPosition(RODIN_DEATH) + "%";
  bar.querySelector(".label-death").style.left = yearBarPosition(RODIN_DEATH) + "%";
  bar.querySelector(".label-1950").style.left = yearBarPosition(1950) + "%";
}

function updateYearBar() {
  const bar = document.querySelector(".year-bar");
  const dot = bar.querySelector(".year-dot");
  const span = bar.querySelector(".year-span");
  const label = bar.querySelector(".year-now");
  bar.style.display = state.mode === "work" || state.mode === "period" ? "" : "none";

  if (state.mode === "work") {
    const e = eventsByWork[state.work].find((x) => x.step === state.step);
    dot.style.display = "";
    span.style.display = "none";
    dot.style.left = yearBarPosition(e.year) + "%";
    label.textContent = e.date;
  }
}

// menu
document.getElementById("tab-overview").onclick = () => {
  stopPlaying();
  go("overview");
};
document.getElementById("tab-work").onclick = () => {
  stopPlaying();
  go("work", { work: state.work, step: state.step });
};

// back and next buttons, and the arrow keys
document.getElementById("prev").onclick = () => {
  stopPlaying();
  step(-1);
};
document.getElementById("next").onclick = () => {
  stopPlaying();
  step(1);
};
document.getElementById("play").onclick = togglePlay;
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    stopPlaying();
    step(1);
  }
  if (event.key === "ArrowLeft") {
    stopPlaying();
    step(-1);
  }
});

// load the map shapes and the events, then draw the page
Promise.all([d3.json(WORLD_URL), d3.json("data/events.json")]).then(([world, events]) => {
  setupMap(world);
  prepareEvents(events);
  renderMapKey();
  setUpYearBar();
  go("overview");
});
