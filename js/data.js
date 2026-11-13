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
    photo: "img/thinker.webp",
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
    photo: "img/prodigal.webp",
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
    photo: "img/faun.webp",
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
    photo: "img/poly.webp",
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
    photo: "img/tiger.webp",
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

// key dates as decimal years, used by the era tag and the year bar
const RODIN_DEATH = 1917.88; // november 17, 1917
const PUTNAM_DEATH = 1930.4; // 1930

// the seven periods for "by period" mode
const PERIODS = [
  {
    start: 1900,
    end: 1913,
    years: "1904 to 1913",
    title: "Copies Rodin approved",
    text: "Rodin is alive and sells bronzes of his own models, but he does not pour them. Each one is cast from a plaster mold at the Rudier foundry in Paris, so even these lifetime bronzes are copies he approved. The Thinker is cast around 1904 and The Prodigal Son in 1913. In San Francisco, Arthur Putnam's plaster models are fragile: the 1906 earthquake destroys many of them, and a 1911 surgery ends his career.",
    world: [
      { date: "ca. 1900", text: "Rodin gives the Rudier foundry the sole right to cast his bronzes" },
      { date: "1906", text: "Earthquake and fire destroy much of San Francisco, and many of Putnam's models" },
      { date: "1911", text: "Surgery leaves Putnam partly paralyzed and ends his career" }
    ]
  },
  {
    start: 1914,
    end: 1918,
    years: "1914 to 1918",
    title: "War, the fair and Rodin's gift to France",
    text: "War makes every crossing a risk, yet France still sends art to San Francisco's fair. Loïe Fuller ships two of these casts herself and sells them to Alma there. In 1916, in the middle of the war, Rodin gives France his works and the right to cast them. When he dies in November 1917, his bronzes do not stop: the right to make them now belongs to the state.",
    world: [
      { date: "Dec 1914", text: "A government memo lets Fuller export five Rodin works" },
      { date: "1915", text: "Panama Pacific International Exposition, February 20 to December 4" },
      { date: "Dec 1916", text: "A French law accepts Rodin's gift of his works and casting rights" },
      { date: "Nov 1917", text: "Rodin dies at Meudon" },
      { date: "Nov 1918", text: "Armistice ends the war" }
    ]
  },
  {
    start: 1919,
    end: 1929,
    years: "1919 to 1929",
    title: "After Rodin: the state keeps casting",
    text: "The Musée Rodin opens in 1919 and pays for itself by ordering new casts from Rodin's molds at the same foundry. Faun and Nymph and Polyphemus and Acis are made this way, as new works by a dead artist. In 1921 Alma uses the same method for a living one: she buys Putnam's plasters and pays Rudier to cast them in bronze, with Putnam there to supervise. On Armistice Day 1924 the Legion opens, and The Thinker is her gift.",
    world: [
      { date: "1919", text: "The Musée Rodin opens in Paris and starts to sell new casts" },
      { date: "1921", text: "Putnam moves to France to supervise his castings" },
      { date: "Nov 1924", text: "The Legion of Honor opens on Armistice Day" },
      { date: "Oct 1929", text: "The Wall Street crash" }
    ]
  },
  {
    start: 1930,
    end: 1939,
    years: "1930 to 1939",
    title: "The Depression: more copies than buyers",
    text: "New casts are easy to make but hard to sell. Faun and Nymph goes to auction at the Hôtel Drouot in 1933, when its owner's collection is broken up. Polyphemus and Acis crosses to a New York dealer in 1935 with seven other new casts from Rudier, and even a museum show in Buffalo finds no buyer. In the same years, Walter Benjamin writes that mechanical reproduction strips art of its aura.",
    world: [
      { date: "1930", text: "Arthur Putnam dies in France" },
      { date: "May 1933", text: "The Danthon collection is sold at the Hôtel Drouot" },
      { date: "Dec 1935", text: "Eight new Rodin casts reach Jacques Seligmann & Co., New York" },
      { date: "1935 to 1936", text: "Benjamin writes \"The Work of Art in the Age of Mechanical Reproduction\"" },
      { date: "Sept 1939", text: "World War II begins in Europe" }
    ]
  },
  {
    start: 1940,
    end: 1945,
    years: "1940 to 1945",
    title: "World War II: bronze as metal",
    text: "In occupied France, bronze becomes raw metal again. From October 1941 the Vichy government melts between about 1,500 and 1,750 public bronze statues for the German war industry, while Eugène Rudier takes orders from German officials and sells Musée Rodin bronzes. Across the Atlantic, his unsold casts pass to an agent in New York. In San Francisco, Alma turns long loans into gifts: The Prodigal Son in 1940 and Faun and Nymph in 1942.",
    world: [
      { date: "June 1940", text: "Germany occupies Paris" },
      { date: "Oct 1941", text: "A Vichy law orders public bronze statues taken down and melted" },
      { date: "May 1942", text: "Rudier attends a Musée Rodin reception for Hitler's sculptor Arno Breker, whose bronzes he casts" },
      { date: "1945", text: "The war ends" }
    ]
  },
  {
    start: 1946,
    end: 1950,
    years: "1946 to 1950",
    title: "After the war: the last copy finds a buyer",
    text: "In March 1949 a letter in the dealer's files mentions a chance to sell Rudier's bronzes in California. That October Alma buys them from Rudier, and in 1950 Polyphemus and Acis joins the Legion. All five casts now belong to the museum.",
    world: [
      { date: "Mar 1949", text: "Seligman writes of a possible buyer in California" },
      { date: "Oct 1949", text: "Alma buys a group of casts from Rudier" }
    ]
  },
  {
    start: 1951,
    end: 2025,
    years: "1951 to today",
    title: "Afterlife: a limit on copies",
    text: "The Musée Rodin keeps casting, but in 1956 French law caps each work at twelve casts per size. The five works stay in San Francisco, yet still travel as loans: The Prodigal Son appears in the Jewel City show in 2015, then tours to Williamstown and Atlanta in 2022.",
    world: [
      { date: "1956", text: "French law limits each Rodin model to twelve casts per size" },
      { date: "1968", text: "Alma de Bretteville Spreckels dies" },
      { date: "1972", text: "The Legion and the de Young become the Fine Arts Museums of San Francisco" },
      { date: "2022", text: "Rodin in the United States tours Williamstown and Atlanta" }
    ]
  }
];

// quiz questions; "answer" is the index of the right option
const QUIZ = [
  {
    question: "Where were all five of these bronzes cast?",
    options: ["In Rodin's studio at Meudon", "At the Rudier foundry in Paris", "At a foundry in San Francisco", "At the Musée Rodin"],
    answer: 1,
    explanation: "All five, even Putnam's Tiger Love. Alma sent his plasters to the same Paris foundry Rodin used. Look for the ringed dot in Paris.",
    showOnMap: { work: "tiger", step: 4 }
  },
  {
    question: "Which two works were cast after Rodin died in 1917?",
    options: ["The Thinker and The Prodigal Son", "Faun and Nymph and Polyphemus and Acis", "The Thinker and Tiger Love", "None of them"],
    answer: 1,
    explanation: "Faun and Nymph was cast in 1926 to 1927 and Polyphemus and Acis in 1929, ten years and more after his death. Both still count as works by Rodin.",
    showOnMap: { work: "faun", step: 2 }
  },
  {
    question: "After 1916, who held the right to make new Rodin bronzes?",
    options: ["Loïe Fuller", "The French state, through the Musée Rodin", "Alma Spreckels", "Any foundry in Paris"],
    answer: 1,
    explanation: "In 1916 Rodin gave France his works and his casting rights. The Musée Rodin opened in 1919 and pays for itself by selling new casts.",
    showOnMap: { work: "faun", step: 1 }
  },
  {
    question: "Even The Thinker, cast while Rodin was alive, was not poured by Rodin. Who made it?",
    options: ["Rodin's assistants at Meudon", "The Rudier foundry, from Rodin's plaster", "Loïe Fuller's workshop", "A foundry chosen by Alma"],
    answer: 1,
    explanation: "Rodin modeled the figure; the foundry cast the bronze from a plaster mold. Even a lifetime cast is a copy the artist approved.",
    showOnMap: { work: "thinker", step: 1 }
  },
  {
    question: "Why did Alma send Arthur Putnam's plasters to Paris in 1921?",
    options: ["To sell them at auction", "To have them cast in bronze at Rodin's foundry", "To show them at the Musée Rodin", "To return them to a French owner"],
    answer: 1,
    explanation: "Plaster breaks easily, and the 1906 earthquake had already destroyed many of Putnam's models. Casting made his work last, in two full sets.",
    showOnMap: { work: "tiger", step: 3 }
  },
  {
    question: "The two lifetime casts found a buyer at the 1915 fair. What happened to Polyphemus and Acis, cast in 1929?",
    options: ["It sold at once in Paris", "It sat unsold with New York dealers for about 14 years", "It was melted down in the war", "It stayed at the Musée Rodin"],
    answer: 1,
    explanation: "It reached New York in 1935, during the Depression, and found a buyer only in 1949. More copies did not mean more buyers.",
    showOnMap: { work: "poly", step: 5 }
  },
  {
    question: "During World War II, what happened to many public bronze statues in France?",
    options: ["They were shipped to the United States", "They were melted down for metal", "They were hidden at the Musée Rodin", "They were cast again"],
    answer: 1,
    explanation: "From October 1941 the Vichy government melted about 1,500 to 1,750 public bronzes for the German war industry. The material that lets a sculpture be copied also lets it be destroyed. In San Francisco, Alma gave Faun and Nymph to the Legion in 1942.",
    showOnMap: { work: "faun", step: 8 }
  },
  {
    question: "Since 1956, how many casts of each Rodin model does French law allow, per size?",
    options: ["One", "Eight", "Twelve", "No limit"],
    answer: 2,
    explanation: "Twelve. There was no legal limit yet when Polyphemus and Acis was cast in 1929; the cap came almost forty years after Rodin's death.",
    showOnMap: { work: "poly", step: 2 }
  }
];
