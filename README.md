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
- The МОНГОЛ ГҮРЭН logo or Escape returns to `#gallery`; browser Back restores the preceding route.
- Section links and previous/next section buttons provide explicit navigation. Topic pages also scroll normally.
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

The supplied 32-page PDF «Монгол гүрний аж ахуй, соёл. 4-р баг.» is the content reference. All ten topics use the museum renderer, preserving the original 39-section structure. See [the completion report](docs/museum-completion.md) for source decisions and validation.

Existing images are contemporary illustrative reconstructions, not archival evidence. Their origin and licensing were not supplied. The reading pages label them accordingly. The central pavilion is an original architectural interpretation, not an archaeological reconstruction.

Source page references accompany museum illustrations and each topic footer. `src/museum-source-topics.js` retains the original content; `src/museum-exhibition-data.js` adapts its presentation. Source illustrations with no matching artifact photograph remain clearly contextual; unsupported images are not added. Responsive renditions live under `public/assets/exhibit/responsive`.

The experience works without WebGL via its perspective CSS3D screen layer, with the architectural mesh omitted. Reduced motion removes transition delays. The camera pauses while a reading page is open. Rendering caps pixel density at 1.6; distant screens are culled and images are lazy-loaded. Google Fonts is optional; local serif and sans-serif fallbacks remain available.

## Validation

With the development server running, `npm test` checks all 39 sections and selector states at seven desktop, tablet and mobile sizes, plus all ten gallery entries, keyboard controls, touch selection, browser history, image inspection and observer cleanup. Review screenshots are under `research/final-review`; these are not shipped in the production build. Legacy renderer checks remain in `tests.spec.js` for reference; the current suite is `museum-transfer.spec.js`.

## GitHub Pages deployment

The project is published at https://zagdkhuu-stack.github.io/mongol-history/.
Vite uses `/mongol-history/` as its base; dynamically rendered images use `src/asset-url.js`.
The `.github/workflows/deploy.yml` workflow runs `npm ci` and `npm run build`, uploads `dist`, and deploys it to GitHub Pages on each push to `main`. It can also be run manually from Actions. Pages must use **GitHub Actions** as its deployment source.

To check the actual production build locally, run `npm run build` followed by `node scripts/verify-pages.mjs`. To check the published website, run `node scripts/verify-pages.mjs https://zagdkhuu-stack.github.io/mongol-history/`.
