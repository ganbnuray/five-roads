// content for the site: the works, places, periods and quiz
// the 43 events themselves live in data/events.json

// the five works, in the order they appear on the page
const WORKS = [
  {
    id: "thinker",
    title: "The Thinker",
    shortTitle: "Thinker",
    artist: "Auguste Rodin",
    color: "#1f4e79",
    cast: "Cast in Rodin's lifetime, ca. 1904",
    summary: "Bought through Rodin's agent at a world's fair.",
    tombstone: "Auguste Rodin, The Thinker (modeled ca. 1880, enlarged 1902–1904, cast ca. 1904). Bronze, 72 x 38 x 54 in. (182.9 x 96.5 x 137.2 cm). Legion of Honor, Fine Arts Museums of San Francisco, San Francisco. Acc. 1924.18.1.",
    museumPage: "https://www.famsf.org/artworks/the-thinker"
  },
  {
    id: "prodigal",
    title: "The Prodigal Son",
    shortTitle: "Prodigal Son",
    artist: "Auguste Rodin",
    color: "#3d7a5a",
    cast: "Cast in Rodin's lifetime, 1913",
    summary: "Same 1915 road, then 16 years on loan.",
    tombstone: "Auguste Rodin, The Prodigal Son (modeled ca. 1887, cast 1913). Bronze, 54 x 25 x 37 3/8 in. (137.2 x 63.5 x 94.9 cm). Legion of Honor, Fine Arts Museums of San Francisco, San Francisco. Acc. 1940.137.",
    museumPage: "https://www.famsf.org/artworks/the-prodigal-son-89897"
  },
  {
    id: "faun",
    title: "Faun and Nymph",
    shortTitle: "Faun and Nymph",
    artist: "Auguste Rodin",
    color: "#6f6418",
    cast: "Cast after Rodin's death, 1926 to 1927",
    summary: "Resold at a Paris auction during the Depression.",
    tombstone: "Auguste Rodin, Faun and Nymph (modeled ca. 1886, cast ca. 1926–1927). Bronze, 12 7/8 x 8 1/2 x 11 11/16 in. (32.7 x 21.6 x 29.7 cm). Legion of Honor, Fine Arts Museums of San Francisco, San Francisco. Acc. 1942.42.",
    museumPage: "https://www.famsf.org/artworks/faun-and-nymph"
  },
  {
    id: "poly",
    title: "Polyphemus and Acis",
    shortTitle: "Polyphemus and Acis",
    artist: "Auguste Rodin",
    color: "#7d3c6b",
    cast: "Cast after Rodin's death, 1929",
    summary: "Fourteen years unsold in New York.",
    tombstone: "Auguste Rodin, Polyphemus and Acis (modeled 1888, cast 1929). Bronze, 11 1/8 x 5 7/8 x 8 7/8 in. (28.3 x 14.9 x 22.5 cm). Legion of Honor, Fine Arts Museums of San Francisco, San Francisco. Acc. 1950.58.",
    museumPage: "https://www.famsf.org/artworks/polyphemus-and-acis"
  },
  {
    id: "tiger",
    title: "Tiger Love",
    shortTitle: "Tiger Love",
    artist: "Arthur Putnam",
    color: "#d9692e",
    cast: "Cast ca. 1921 to 1924 from Putnam's plaster, paid for by Alma",
    summary: "A California artist's plaster, sent to Rodin's foundry.",
    tombstone: "Arthur Putnam, Tiger Love (ca. 1917–1924). Bronze, 6 1/2 x 7 x 12 1/2 in. (16.5 x 17.8 x 31.8 cm). Legion of Honor, Fine Arts Museums of San Francisco, San Francisco. Acc. 1924.118.",
    museumPage: "https://www.famsf.org/artworks/tiger-love"
  }
];

// city names drawn on the map; dx, dy and anchor place the name next to the dot
const CITIES = [
  { name: "Paris", lat: 48.86, lon: 2.35, dx: 6, dy: -6, anchor: "start" },
  { name: "San Francisco", lat: 37.77, lon: -122.42, dx: -8, dy: -8, anchor: "end" },
  { name: "New York", lat: 40.71, lon: -74.0, dx: 8, dy: 14, anchor: "start" },
  { name: "Buffalo", lat: 42.89, lon: -78.88, dx: -6, dy: -6, anchor: "end" },
  { name: "San Diego", lat: 32.72, lon: -117.16, dx: 8, dy: 12, anchor: "start" },
  { name: "Williamstown", lat: 42.71, lon: -73.2, dx: 4, dy: -12, anchor: "start" },
  { name: "Atlanta", lat: 33.75, lon: -84.39, dx: 6, dy: -6, anchor: "start" }
];

// the foundry where all five works were cast
const FOUNDRY = {
  name: "Rudier foundry, Paris",
  note: "all five works cast here",
  years: "1904, 1913, ca. 1921 to 1924, 1927, 1929",
  lat: 48.8636,
  lon: 2.3637
};

// who held a work after each step
const STATUS_LABELS = {
  studio: "With the artist or foundry",
  agent: "With an agent (Loïe Fuller)",
  market: "On the market (dealer, auction, unsold stock)",
  alma: "Owned by Alma Spreckels",
  loan: "Lent to the Legion (Alma still owns it)",
  museum: "Owned by the museum"
};
