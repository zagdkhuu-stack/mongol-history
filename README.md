# Монгол гүрэн — Аж ахуй, соёл

A local, Mongolian-language museum experience. Three.js renders the central architectural pavilion; CSS3DRenderer places the ten image screens in genuine 3D space. Both renderers share one perspective camera. No remote JavaScript CDN is required.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Opening index.html directly with file:// does not support the module-based application.

```sh
npm run build
npm run preview
npm test
```

The build is in `dist/`. Tests use Microsoft Edge on Windows, or Playwright Chromium on other systems (`npx playwright install chromium`).

## Explore

- Wheel or trackpad: advance one topic per gesture, with damping and a cooldown.
- Arrow keys / Page Up / Page Down: move through topics. Enter opens the focused topic.
- Touch: swipe vertically or horizontally.
- The topic index and numbered progress controls jump to any of the ten topics.
- Click the focused screen or СЭДВИЙГ НЭЭХ to enter.
- ← БҮХ СЭДЭВ, Escape, or browser Back returns to the same topic.
- Topic URLs support direct links, for example `#topic/topic-8`.

## Structure

- `src/topics.js`: ordered topic data, Mongolian reading sections, source links and research status.
- `src/scene.js`: pavilion, spatial screens, perspective camera and transitions.
- `src/navigation.js`: bounded wheel gestures, keyboard and touch input, cleanup.
- `src/main.js`: interface, history, detail pages and state restoration.
- `style.css`: shared theme tokens, gallery and reading layouts, mobile and reduced-motion styles.
- `public/assets/optimized`: resized JPEG copies, about 3 MB total.
- `assets/images`: untouched original image assets.
- `assets/original-*`: original HTML, CSS and topic summaries retained for reference.

## Editorial and visual notes

The Canva deck was not supplied. The bronze, charcoal and parchment palette is provisional. CSS theme tokens are at the top of style.css; 3D material colors are in src/theme.js.

Existing images are contemporary illustrative reconstructions, not archival evidence. Their origin and licensing were not supplied. The reading pages label them accordingly. The central pavilion is an original architectural interpretation, not an archaeological reconstruction.

Reading pages link to the university and museum references used for their introductory summaries. Specific gaps in farming, hunting, relay distances, household artifacts and Karakorum archaeology remain explicitly marked rather than being filled with invented data. The original Karakorum topic has been retained within topic 10, which follows the requested cultural-legacy title.

The experience works without WebGL via its perspective CSS3D screen layer, with the architectural mesh omitted. Reduced motion removes transition delays. The camera pauses while a reading page is open. Rendering caps pixel density at 1.6; distant screens are culled and images are lazy-loaded. Google Fonts is optional; local serif and sans-serif fallbacks remain available.

## Validation

Playwright covers wheel limits, spatial screen entry, all ten articles, independent article scrolling, return-state restoration, browser Back, mobile touch input, deep links and reduced motion. A visual preview is saved in gallery-preview.png; screenshots are development artifacts and are not part of the production build.
