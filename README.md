# Wild Hawaii Ocean Adventures

Marketing website for a Kona, Big Island ocean-tour company — built from the
hi-fi design prototypes. Static HTML + CSS + a little vanilla JavaScript, **no
build step**. Open it in a browser and it works; drop it on any static host and
it ships.

## Pages

| File | Page |
|------|------|
| `index.html` | Home — hero, tour grid, story, gallery, reviews, FAQ, CTA |
| `captain-cook-snorkel.html` | Captain Cook Snorkel Tour |
| `coastal-marine-life.html` | Coastal Marine Life & Snorkeling |
| `manta-ray-night-snorkel.html` | Manta Ray Night Snorkel |
| `offshore-blue-water.html` | Offshore Blue Water Adventure |
| `private-charters.html` | Private Charters |
| `whale-watching.html` | Whale Watching Tour (seasonal) |

Each tour page shares the same structure: hero + quick-facts bar, trust badges,
"About this tour" with a sticky booking card, highlights, itinerary, what's
included / what to bring, photo gallery, directions + live map, contact form,
"You may also love", and the closing CTA.

## Structure

```
.
├── index.html + 6 tour pages   # all HTML lives at the repo root (flat = simple relative paths)
├── css/styles.css              # the entire design system (tokens, components, responsive)
├── js/main.js                  # sticky header, mobile nav, FAQ accordion, form handling, scroll reveal
├── images/                     # ocean-gradient SVG placeholders (swap for real photos)
└── tools/gen-placeholders.mjs  # regenerates the placeholder images
```

## Run locally

Just open `index.html` in a browser. Or serve it (nicer for the map iframe and
relative links):

```bash
python3 -m http.server 8000      # then visit http://localhost:8000
```

## Swapping in real photos

Every image is a labelled SVG placeholder in `images/` that says which photo
belongs in that slot (e.g. `tour-manta-ray.svg`, `gallery-1.svg`). Two options:

1. **Keep the filenames** — overwrite e.g. `images/tour-manta-ray.svg` with a
   real `tour-manta-ray.jpg`, then find-and-replace the `.svg` extension with
   `.jpg` in the HTML. (Hero backgrounds are set inline via `style="background-image:..."`.)
2. **New names** — drop your photos in `images/` and update the `src` / `background-image`
   references in the HTML.

Regenerate the placeholders any time with:

```bash
node tools/gen-placeholders.mjs
```

## Wiring up the contact / booking form

The contact form currently validates in the browser and shows a success message
— it does **not** send anywhere yet (`action="#"`, handled in `js/main.js`).
To go live, point each `<form data-contact>` at a form backend and the JS will
let it submit normally:

- **Formspree** — `action="https://formspree.io/f/yourid" method="POST"`
- **Netlify Forms** — add `netlify` to the `<form>` tag (auto-detected on deploy)
- **Basin / Getform / your own endpoint** — set `action` + `method="POST"`

## Deploying

It's a static site, so anything works: Netlify, Vercel, Cloudflare Pages, GitHub
Pages, S3 + CloudFront. No configuration needed — point the host at this folder.

## Notes

- Fonts: Playfair Display (headings) + Mulish (body), loaded from Google Fonts.
- The "How to get here" map is a keyless Google Maps embed pointed at Honokohau
  Small Boat Harbor.
- Contact details in the markup (`808-854-4401`, `info@wild-hawaii.com`, the
  marina address) are from the prototypes — update them to the real ones before
  launch.
- Reviews, ratings ("4.9 / 300+ reviews", "TripAdvisor 2012–2016") and tour
  copy come from the prototypes; verify they're accurate before publishing.
