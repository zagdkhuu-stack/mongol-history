# Museum transfer into the authoritative Copy project

Target: `C:\Users\Dell\OneDrive\Desktop\mongol-history - Copy`.
Source: sibling `mongol-history` project. No commits or pushes were made.

Backup made before editing:
`C:\Users\Dell\OneDrive\Desktop\mongol-history-backups\copy-before-museum-transfer-20261019`.
It contains the original `src/main.js`, protected source/configuration/assets,
hash manifest, and before screenshots/DOM/style records.

## Files

Added museum modules: `src/content.js`, `src/learning.js`, `src/exhibits.js`,
`src/exhibit-image-sources.json`, `src/museum-source-topics.js`,
`src/museum-topics.js`, and `src/museum-visuals.js`.
Added `styles/museum.css` and `styles/museum-foundation.css`.
Transferred 35 exhibit WebP images under `public/assets/exhibit/`.
Adapted only the existing `src/main.js` to select the museum renderer for topics
01–04 and 06–10 and clean it up on navigation. Topic 05 retains its original
Copy renderer. `museum-topics.js` takes hero images from the unchanged Copy
`src/topics.js`; exhibit URLs use the existing asset URL helper and project base.
Foundation CSS and spacing tokens are scoped to the museum article.

The exhaustive transferred-file list is `docs/museum-transfer-files.json`.
Added validation files: `museum-transfer.config.js`, `museum-transfer.spec.js`,
and `research/museum-transfer/expected.json`. Preview captures and verification
records are under `research/museum-transfer/`.

## Preserved

The backup hash check covers 56 existing files, including all original public
assets, homepage HTML/styles/scene/topic data, package manifests, Vite config,
PDF renderers/content, and `.git/config`. All match their original hashes.
Homepage DOM, computed styles and all ten topic image URLs match the pre-transfer
records. Topic 05 DOM, hero image and computed styles also match exactly.
The branch remains `main`; origin remains
`https://github.com/zagdkhuu-stack/mongol-history.git`.

## Validation

All browser validation used the running Copy server at
`http://127.0.0.1:5173/mongol-history/`; port 5181 was not used.

`npx playwright test --config museum-transfer.config.js`: 10 passed.
The suite checks all 35 museum sections and selector/image/text synchronization
at 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 390×844 and 375×667.
It also covers stationary rapid selections, scrolling under a fixed navigation
row, all ten homepage topic entries, Topic 02, Topic 05's existing next button,
detail navigation/scroll reset, browser Back, gallery return, mobile keyboard
selection and image-viewer zoom/Escape.

`npm run build`: passed without warnings. Package dependencies did not change.

To start the site normally, run `npm run dev` from the target folder and use the
Local URL printed by Vite (the configured base is `/mongol-history/`).
