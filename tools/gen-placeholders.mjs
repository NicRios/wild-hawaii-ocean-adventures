/* Generates lightweight ocean-gradient SVG placeholders into ../images.
   Each one is labelled with the photo that belongs in that slot, so the
   layout looks finished and you know exactly what to drop in later.
   Run:  node tools/gen-placeholders.mjs
   Swap: replace images/<name>.svg with a real <name>.jpg and update the
         src in the HTML (or keep the .svg name and overwrite the file). */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "images");
mkdirSync(OUT, { recursive: true });

// ocean palettes: [topColor, bottomColor]
const PALETTES = {
  deep:    ["#1b6c8f", "#0a2a3c"],
  teal:    ["#2a93a8", "#0d4258"],
  reef:    ["#27a3a0", "#0f4a55"],
  azure:   ["#3aa0c4", "#103d59"],
  night:   ["#13405c", "#06141f"],
  emerald: ["#2f9e86", "#0c3f45"],
  storm:   ["#16586f", "#081c2a"],
};

function svg(label, paletteKey, w = 1200, h = 900) {
  const [c1, c2] = PALETTES[paletteKey] || PALETTES.deep;
  // a few diagonal "light caustics"
  let rays = "";
  for (let i = 0; i < 6; i++) {
    const x = (i / 6) * w + 40;
    rays += `<rect x="${x}" y="-200" width="34" height="${h + 400}" fill="#ffffff" opacity="0.05" transform="rotate(14 ${x} ${h / 2})"/>`;
  }
  const wave = `M0 ${h - 70} C ${w * 0.25} ${h - 130}, ${w * 0.45} ${h - 20}, ${w * 0.6} ${h - 70} S ${w * 0.9} ${h - 120}, ${w} ${h - 70} V ${h} H 0 Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.0" r="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${rays}
  <path d="${wave}" fill="#ffffff" opacity="0.06"/>
  <g opacity="0.9" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="3">
    <circle cx="${w / 2}" cy="${h / 2 - 36}" r="30"/>
    <path d="M${w / 2 - 13} ${h / 2 - 36} a13 13 0 0 1 26 0" stroke-opacity="0.9"/>
  </g>
  <text x="50%" y="${h / 2 + 28}" text-anchor="middle" fill="#ffffff" fill-opacity="0.92"
    font-family="Georgia, 'Times New Roman', serif" font-size="42" font-style="italic">${label}</text>
  <text x="50%" y="${h / 2 + 78}" text-anchor="middle" fill="#ffffff" fill-opacity="0.55"
    font-family="Arial, sans-serif" font-size="20" letter-spacing="3">PHOTO PLACEHOLDER</text>
</svg>`;
}

// Note: the hero, logo, six tour-card images, and the story image are now
// real photography (.jpg/.png). Only the gallery tiles remain placeholders.
const IMAGES = [
  ["gallery-1",             "Humpback Whale",         "storm"],
  ["gallery-2",             "Green Sea Turtle",       "emerald"],
  ["gallery-3",             "Reef Shark",             "deep"],
  ["gallery-4",             "Free Diver",             "azure"],
  ["gallery-5",             "Manta Ray",              "night"],
  ["gallery-6",             "Spinner Dolphins",       "teal"],
  ["gallery-7",             "Coral Reef",             "reef"],
  ["gallery-8",             "Snorkelers",             "azure"],
  ["gallery-9",             "Whale Shark",            "storm"],
];

for (const [name, label, pal] of IMAGES) {
  writeFileSync(join(OUT, name + ".svg"), svg(label, pal));
}

// tiny white check used by CSS bullet points
writeFileSync(
  join(OUT, "check.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.6 16.2 5.4 12l-1.4 1.4 5.6 5.6 12-12L20.2 5.6z" fill="#ffffff"/></svg>`
);

console.log("Wrote " + (IMAGES.length + 1) + " placeholder assets to images/");
