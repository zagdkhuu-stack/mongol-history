# Museum completion — 2026-10-21

Latest refinement: Topic 10's disease/risk comparison section and its plague
timeline entry were removed at the user's request. The topic now has three
sections (38 across the website). Pax Mongolica, relay, positive trade effects
and cultural exchange remain. Other topics, gallery, navigation and styles are
unchanged. The original completion checks below describe the earlier 39-section
baseline.

Implemented exclusively in `C:\Users\Dell\OneDrive\Desktop\mongol-history - Copy`.
This report supersedes the previous simplification/reference-redesign reports.

## Result

All ten topics now use the existing museum architecture. The original section
counts are restored: **3 / 3 / 4 / 4 / 4 / 4 / 5 / 4 / 4 / 4 = 39**.
The gallery's ten topic names/order, images, spiral, pavilion, camera, lighting,
typography and navigation source files were preserved. No dependencies were added.

| Topic | Completed presentation and interactions |
|---|---|
| 01 | Foundation, expansion and historical role; prominent 1206 statement and source image |
| 02 | Five animal selectors with separate source crops; four seasonal image/copy states; economic context |
| 03 | Actual hunting illustration replaces the unrelated earlier ger image; wide agriculture image; five food selectors; complementary economic systems |
| 04 | Seven artifact categories with image inspection; both urban centers; silver tree; exchange illustration |
| 05 | Shared museum renderer replaces the separate legacy page; source caravan image, selectable regional diagram, goods descriptions, protection, finance and payments |
| 06 | Source relay map, selectable four-step relay diagram, separately cropped gerege illustration and inspection, administrative importance |
| 07 | Ger photograph and selectable interior plan; clothing image; all six food/household descriptions; transport/customs; changes under the empire |
| 08 | Large writing illustrations; two writing systems; Secret History's three values; education, administration and science/technology exchange |
| 09 | Three cultural channels; scholarly contacts; religion/policy selector including tax exemption and 1254 debate; source exchange image |
| 10 | Pax Mongolica, qualified plague risk, four artistic legacies; landscape closing; original timeline retained in an expandable reading |

Every topic has the logo and hamburger in the same 80px header. The logo returns
to the exact `#gallery` route. There is no secondary toolbar. An integrated section
list in the introduction navigates explicitly;
normal article scrolling remains available. Navigation fades run for 360–400ms,
and category crossfades for 400ms; reduced motion disables these. No scroll
observers, scroll-triggered reveals, parallax or topic-page 3D scenes are used.

## PDF and media

Read the actual supplied PDF at
`C:\Users\Dell\Downloads\Монгол гүрний аж ахуй, соёл. 4-р баг..pdf`.
All 32 pages were rendered into the overview and their extracted text reviewed.
`research/final-review/source-review.json` records each page's text, image xrefs,
dimensions and positions; `pdf-overview.jpg` records their visible composition.
Page 11 is blank, and page 32 contains a closing landscape and thank-you text.
Only the landscape is reused from page 32. Slide frames/headings are not used as
website images. Existing individually extracted craft/writing/source images remain.

Nine additional content assets: five animal crops from page 3, the caravan from
12, the contextual trade illustration from 13, gerege crop from 18, and landscape
from 32. `scripts/review-source.py` reproducibly extracts these and generates
smaller 480/960px WebP renditions. Museum figures use lazy loading, async decoding,
`srcset` and `sizes`; image inspection opens the full source asset. Aspect ratios
are preserved by contain sizing and ratio-aware width limits.

The gerege source is a modern explanatory composite, not a documentary artifact
photograph; its caption/alt identify it accordingly. Its artifact portion is
isolated so the composite's tiny unrelated text is not shown. Source illustrations
and the source relay map are contextual and are not independently authenticated
medieval records. The trade diagram is explicitly a schematic, not an exact
historical route or boundary map. The shared trade illustration is contextual;
regional goods are distinguished by their text and selected map point. The source
does not supply separate regional artifact photographs or a wild-plant photograph;
those are not fabricated. Artistic-legacy concepts without matching source images
remain readable text selectors. No new historical facts were inferred from images.

## Files changed in this task

- `src/main.js`: unify all ten renderers, logo/history behavior, cleanup.
- `src/content.js`: original section structure, integrated navigation, closing,
  image viewer and navigation animation teardown.
- `src/exhibits.js`, `src/museum-exhibition-data.js`: original 39 sections,
  source association, layout selection and responsive media records.
- `src/learning.js`, `src/museum-visuals.js`: restored selectors, interactive
  diagrams, keyboard/touch controls, inactive-panel inertness and cleanup.
- `src/exhibit-image-sources.json`, `public/assets/exhibit/`: media and provenance.
- `styles/museum-foundation.css`, `styles/museum.css`: scoped layouts,
  responsive proportions/header, removal of unused foundation/reveal rules.
- `museum-transfer.spec.js`, `playwright.config.js`: current renderer validation;
  exclude archived test copies from discovery.
- `scripts/review-source.py`, `research/final-review/`: source review, captures.
- `README.md`, this report: current behavior and verification instructions.

Pre-existing untracked project files and historical research snapshots were
retained. `index.html`, `style.css`, `src/scene.js`, `src/navigation.js`,
`src/topics.js`, `src/theme.js`, original card images, package manifests and Vite
configuration were not edited. `git diff --exit-code` confirms the tracked
protected files remain unchanged. No commit, push or deployment was performed.

## Verification

- `npm test`: **11 passed**. All 39 sections and selector states at 1920×1080,
  1440×900, 1366×768, 1024×768, 768×1024, 390×844 and 375×812; image proportions,
  asset responses, no horizontal article overflow, header clearance, 44px controls.
- Navigation checks: all ten gallery entries; visible WebGL canvas; hamburger;
  direct URLs; previous/next topics; browser Back; exact logo return.
- Interaction checks: keyboard/Home/End, map keyboard/point activation, actual
  touch tapping, gerege image inspection, zoom/reset/Escape, rapid category and
  topic changes. ResizeObserver count matches current widgets and returns to
  zero after leaving. No page errors in the exercised flows.
- After the final gerege crop, ger-diagram sizing and gallery keyboard additions,
  the four affected desktop/navigation/keyboard/cleanup tests also passed.
- All 39 sections captured at desktop and mobile sizes (78 section images).
  Review sheets and all ten topic-introduction screenshots were visually inspected.
- `npm run build`: passed; Vite builds the production bundle without warnings.
- Production preview at `/mongol-history/`: all 10 topics / 39 sections loaded;
  all source-bearing detail images decoded; zero runtime or local asset errors.

No functional failures remain in these checks. Validation uses Microsoft Edge
on Windows; Safari/Firefox and prolonged heap profiling were not run. Source
image availability/authenticity limits are documented above.

## Caption and navigation refinement

Removed previous/next section buttons at the user?s request. Image captions now
describe the pictured subject instead of displaying PDF page numbers. Hero captions
name the topic. All other layouts, selectors and navigation remain unchanged.
