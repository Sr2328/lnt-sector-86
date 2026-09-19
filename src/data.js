// ── Local asset imports ──────────────────────────────────────────────
// Vite will bundle these and give you the correct hashed URL automatically.
// Adjust paths/extensions to match whatever is actually in src/assets/.
import heroImg from "./assets/Hero-main.png";
import towerImg from "./assets/Tower.jpg";
import skylineImg from "./assets/SkylineImg.png";
import livingImg from "./assets/Tower.jpg";
import living2Img from "./assets/Hero-main.png";
import bedroomImg from "./assets/Hero-main.png";
import kitchenImg from "./assets/Hero-main.png";
import balconyImg from "./assets/Hero-main.png";
import poolImg from "./assets/Tower.jpg";
import exteriorImg from "./assets/Tower.jpg";
import exterior2Img from "./assets/Tower.jpg";
import roadImg from "./assets/Hero-main.png";
import campusImg from "./assets/Hero-main.png";
import buildImg from "./assets/Hero-main.png";
import heroMobile from "./assets/Mobile-hero.png"

export const NAV = [
  ["Overview", "overview"],
  ["Highlights", "highlights"],
  ["Residences", "residences"],
  ["Amenities", "amenities"],
  ["Location", "location"],
  ["Gallery", "gallery"],
  ["Enquire", "inquire"],
];

// Local images, referencing the imports above.
export const IMG = {
  hero: heroImg,
  heroMobile: heroMobile,
  tower: towerImg,
  skyline: skylineImg,
  living: livingImg,
  living2: living2Img,
  bedroom: bedroomImg,
  kitchen: kitchenImg,
  balcony: balconyImg,
  pool: poolImg,
  exterior: exteriorImg,
  exterior2: exterior2Img,
  road: roadImg,
  campus: campusImg,
  build: buildImg,
};

export const MARQUEE = [
  "New Gurugram",
  "20-acre development",
  "3 & 4 BHK residences",
  "Dwarka Expressway",
  "NH-48",
  "Southern Peripheral Road",
  "3.6 mn sq ft potential",
  "By L&T Realty",
];

export const OVERVIEW_TEXT =
  "L&T Realty's first residential address in NCR. A 20-acre development in Sector 86, New Gurugram, built on the engineering and construction pedigree of Larsen & Toubro.";

export const STATS = [
  { to: 20, suffix: " acres", label: "Land parcel in Sector 86, New Gurugram" },
  { to: 3.6, decimals: 1, suffix: " mn sq ft", label: "Estimated development potential" },
  { text: "3 & 4 BHK", label: "Configurations currently being marketed" },
  { to: 1938, label: "Year Larsen & Toubro was founded" },
];

export const HIGHLIGHTS = [
  {
    tag: "First in NCR",
    title: "L&T Realty's first address in the region",
    body: "The April 2026 acquisition of a 20-acre Gurugram parcel marks the company's entry into the NCR micro-market.",
    img: IMG.tower,
  },
  {
    tag: "Scale",
    title: "20 acres. 3.6 mn sq ft potential.",
    body: "Estimated development potential across the parcel, as announced by L&T.",
    tone: "gold",
  },
  {
    tag: "Homes",
    title: "3 & 4 BHK residences",
    body: "The configurations being marketed today. Sizes and layouts arrive with the official release.",
    img: IMG.living,
  },
  {
    tag: "Access",
    title: "Three arterial routes",
    body: "Dwarka Expressway, NH-48 and the Southern Peripheral Road are cited as access routes to the site.",
    tone: "navy",
  },
  {
    tag: "Legacy",
    title: "Backed by Larsen & Toubro",
    body: "Founded in 1938, L&T builds airports, metros and power infrastructure across India.",
    img: IMG.build,
  },
  {
    tag: "Neighbourhood",
    title: "Schools within reach",
    body: "St. Andrews School is listed about 1.8 km away, and K.R. Mangalam University about 8 km.",
    img: IMG.campus,
  },
];

export const HOMES = [
  {
    id: "3bhk",
    label: "3 BHK",
    title: "A family-sized home in a 20-acre community",
    desc: "Three bedrooms, planned for everyday family life. Layouts are indicative until L&T publishes the official floor plans.",
    img: IMG.living2,
    specs: [
      ["Bedrooms", "3"],
      ["Carpet area", "On official release"],
      ["Floor plan", "On official release"],
      ["Price", "On request"],
    ],
  },
  {
    id: "4bhk",
    label: "4 BHK",
    title: "Extra room for larger households",
    desc: "Four bedrooms for larger or multi-generational families. Sizes and specifications will be confirmed at launch.",
    img: IMG.bedroom,
    specs: [
      ["Bedrooms", "4"],
      ["Carpet area", "On official release"],
      ["Floor plan", "On official release"],
      ["Price", "On request"],
    ],
  },
];

export const HOME_FEATURES = [
  "Spacious layouts",
  "Large balconies",
  "High ceilings",
  "Wide windows",
];

export const AMENITIES = [
  { icon: "Trees", title: "Landscaped gardens", body: "Green open space across the 20-acre site." },
  { icon: "Waves", title: "Swimming pool", body: "A pool for laps and lazy weekends." },
  { icon: "Landmark", title: "Clubhouse", body: "A social hub for residents and guests." },
  { icon: "Trophy", title: "Sports facilities", body: "Courts and grounds for every age." },
  { icon: "Dumbbell", title: "Fitness studio", body: "Train without leaving the community." },
  { icon: "ShieldCheck", title: "24/7 security", body: "Round-the-clock gated protection." },
  { icon: "Baby", title: "Kids' play areas", body: "Safe, shaded space to play." },
  { icon: "Droplets", title: "Sustainable design", body: "Water and energy-conscious systems." },
];

export const GALLERY = [
  { src: IMG.exterior, caption: "Residential architecture", span: "md:col-span-7 md:row-span-2", ratio: "aspect-[4/5] md:aspect-auto" },
  { src: IMG.living, caption: "Living spaces", span: "md:col-span-5", ratio: "aspect-[4/3]" },
  { src: IMG.pool, caption: "Leisure amenities", span: "md:col-span-5", ratio: "aspect-[4/3]" },
  { src: IMG.balcony, caption: "Balconies and views", span: "md:col-span-4", ratio: "aspect-[4/5]" },
  { src: IMG.kitchen, caption: "Kitchens", span: "md:col-span-4", ratio: "aspect-[4/5]" },
  { src: IMG.skyline, caption: "New Gurugram skyline", span: "md:col-span-4", ratio: "aspect-[4/5]" },
];

export const ENQUIRY_ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT || "";