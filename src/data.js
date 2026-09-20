// ── Local asset imports ──────────────────────────────────────────────
import heroImg from "./assets/Hero-main.png";
import towerImg from "./assets/Tower.jpg";
import skylineImg from "./assets/SkylineImg.png";
import livingImg from "./assets/Tower.jpg";
import living2Img from "./assets/Hero-main.png";
import bedroomImg from "./assets/Hero-main.png";
// import kitchenImg from "./assets/Hero-main.png";
import balconyImg from "./assets/Hero-main.png";
import poolImg from "./assets/Tower.jpg";
import exteriorImg from "./assets/Tower.jpg";
import exterior2Img from "./assets/Tower.jpg";
import roadImg from "./assets/Hero-main.png";
import campusImg from "./assets/Hero-main.png";
import buildImg from "./assets/Hero-main.png";
import heroMobile from "./assets/Mobile-hero.png";
import Aerial from "./assets/AerialRoutes.png";
import SpaciousImg from "./assets/Spacious.png";
import LegacyImg from "./assets/Lagacy.png";
import NeighbourhoodImg from "./assets/Neighbourhood.png";
// import OverviewImg from "./assets/OverviewImg.png";
import Residence1Img from "./assets/3BHK.png";
import Residence2Img from "./assets/4BHK.png";
import PoolImg from "./assets/Pool.png"
import kitchenImg from "./assets/Kitchen.png"
import OverviewImg from "./assets/OverviewImg.png"

// Feature panel images. Placeholders point at existing assets.
// Drop real files into src/assets/ and swap these imports, e.g.:
// import FeatureLayoutsImg from "./assets/feature-layouts.jpg";
import FeatureLayoutsImg from "./assets/SpaciousLayout.png";
import FeatureBalconiesImg from "./assets/Balcony.png";
import FeatureCeilingsImg from "./assets/HighCeleing.png";
import FeatureWindowsImg from "./assets/WideWindows.png";

export const NAV = [
  ["OVERVIEW", "overview"],
  ["HIGHLIGHTS", "highlights"],
  ["RESIDENCES", "residences"],
  ["AMENITIES", "amenities"],
  ["LOCATION", "location"],
  ["GALLERY", "gallery"],
  ["ENQUIRE", "inquire"],
];

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
  pool: PoolImg,
  exterior: exteriorImg,
  exterior2: exterior2Img,
  road: roadImg,
  campus: NeighbourhoodImg,
  build: buildImg,
  Access: Aerial,
  Spacious: SpaciousImg,
  Legacy: LegacyImg,
  OverView: OverviewImg,
  Residence: Residence1Img,
  Residence2: Residence2Img,
  featureLayouts: FeatureLayoutsImg,
  featureBalconies: FeatureBalconiesImg,
  featureCeilings: FeatureCeilingsImg,
  featureWindows: FeatureWindowsImg,
  Overview: OverviewImg
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
    hoverImg: IMG.skyline,
  },
  {
    tag: "Homes",
    title: "3 & 4 BHK residences",
    body: "The configurations being marketed today. Sizes and layouts arrive with the official release.",
    img: IMG.Spacious,
  },
  {
    tag: "Access",
    title: "Three arterial routes",
    body: "Dwarka Expressway, NH-48 and the Southern Peripheral Road are cited as access routes to the site.",
    tone: "navy",
    hoverImg: IMG.Access,
  },
  {
    tag: "Legacy",
    title: "Backed by Larsen & Toubro",
    body: "Founded in 1938, L&T builds airports, metros and power infrastructure across India.",
    img: IMG.Legacy,
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
    img: IMG.Residence,
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
    img: IMG.Residence2,
    specs: [
      ["Bedrooms", "4"],
      ["Carpet area", "On official release"],
      ["Floor plan", "On official release"],
      ["Price", "On request"],
    ],
  },
];

export const HOME_FEATURES = [
  {
    title: "Spacious layouts",
    img: IMG.featureLayouts,
    desc: "Open, well-planned interiors with flowing living and dining spaces that make every square foot count.",
  },
  {
    title: "Large balconies",
    img: IMG.featureBalconies,
    desc: "Generous balconies that extend your living space outdoors, with open views across Sector 86.",
  },
  {
    title: "High ceilings",
    img: IMG.featureCeilings,
    desc: "Added ceiling height for an airy, premium feel with better natural light and ventilation.",
  },
  {
    title: "Wide windows",
    img: IMG.featureWindows,
    desc: "Expansive glazing that floods rooms with daylight and frames the skyline and greenery outside.",
  },
];

export const AMENITIES = [
  {
    icon: "Trees", title: "Landscaped gardens", body: "Green open space across the 20-acre site.",
    img: "https://images.pexels.com/photos/34360409/pexels-photo-34360409/free-photo-of-modern-apartment-complex-with-landscaped-garden.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    icon: "Waves", title: "Swimming pool", body: "A pool for laps and lazy weekends.",
    img: "https://images.pexels.com/photos/2930101/pexels-photo-2930101.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  { icon: "Landmark", title: "Clubhouse", body: "A social hub for residents and guests.", img: "/amenities/clubhouse.jpg" },
  { icon: "Trophy", title: "Sports facilities", body: "Courts and grounds for every age.", img: "/amenities/sports.jpg" },
  { icon: "Dumbbell", title: "Fitness studio", body: "Train without leaving the community.", img: "/amenities/fitness.jpg" },
  { icon: "ShieldCheck", title: "24/7 security", body: "Round-the-clock gated protection.", img: "/amenities/security.jpg" },
  {
    icon: "Baby", title: "Kids' play areas", body: "Safe, shaded space to play.",
    img: "https://images.pexels.com/photos/34360412/pexels-photo-34360412/free-photo-of-modern-apartment-complex-with-playground.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  { icon: "Droplets", title: "Sustainable design", body: "Water and energy-conscious systems.", img: "/amenities/sustainable.jpg" },
  {
    icon: "Bike", title: "Cycling & jogging track", body: "A landscaped loop running through the community.",
    img: "https://images.pexels.com/photos/8000412/pexels-photo-8000412.png?auto=compress&cs=tinysrgb&w=900"
  },
  { icon: "BookOpen", title: "Library & co-working lounge", body: "Quiet reading corners and work-from-home pods.", img: "/amenities/library-lounge.jpg" },
];

export const GALLERY = [
  { src: IMG.skyline, caption: "Residential architecture", span: "col-span-2 row-span-2 md:col-span-7" },
  { src: IMG.featureWindows, caption: "Living spaces", span: "md:col-span-5" },
  { src: IMG.pool, caption: "Leisure amenities", span: "md:col-span-5" },
  { src: IMG.featureBalconies, caption: "Balconies and views", span: "md:col-span-4" },
  { src: IMG.kitchen, caption: "Kitchens", span: "md:col-span-4" },
  { src: IMG.Overview, caption: "New Gurugram skyline", span: "col-span-2 md:col-span-4" },
];

export const CONTACT = {
  phone: "+91 9873336632 ", // shown on the page
  phoneHref: "+919873336632", // used in tel:
  whatsapp: "919873336632", // country code + number, no "+" or spaces
  whatsappText: "Hi, I'd like to know more about L&T Realty Sector-86, New Gurugram.",
  email: "lntRealtySec86.com",
  hours: "", // optional, e.g. "Mon–Sun, 10am – 7pm". Leave empty to hide
  socials: [
    { label: "Instagram", href: "https://instagram.com/yourhandle", icon: "Instagram" },
    { label: "Facebook", href: "https://facebook.com/yourpage", icon: "Facebook" },
    { label: "LinkedIn", href: "https://linkedin.com/company/yourpage", icon: "Linkedin" },
    { label: "YouTube", href: "https://youtube.com/@yourchannel", icon: "Youtube" },
  ], // an entry with an empty href is hidden automatically
};



export const ENQUIRY_ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT || "";