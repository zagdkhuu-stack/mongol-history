# Topic-detail exhibition system

## Scope

Nine supported topics use an opt-in museum system: 35 original sections, 78
explicit selectable/comparison content units. All 39 original sections remain
available when the four unchanged Topic 05 sections are included.

The homepage scene, original column, camera, animations, images, palette and
navigation module are unchanged. Existing topic hero image URLs and all original
content data in `src/topics.js` are unchanged. The original Topic 05 renderers
are retained as `src/legacy-content.js` and `src/legacy-learning.js`; its detail
page is excluded from the new styles and data adapter.

The supplied reference is `C:/Users/Dell/OneDrive/Pictures/Screenshots/Screenshot 2026-10-19 105422.png`. Its visual language is applied to supported detail exhibitions: a generous introduction, wrapped numbered selector with a gold underline, a fine divider, and an image beside a gold serif title and explanatory text. Verified craft enumerations use explicit bullet lists; compound labels are preserved. Image inspection is an arrow control at the image corner. The image/text split remains approximately 53/47 with natural image ratios and a conservative 1.35x maximum enlargement for source craft images. Mobile stacks the content and keeps its 280px image-height limit.

## Architecture and layouts

- `src/exhibits.js`: non-mutating detail-only adapter. Complete units contain
  `id`, `label`, `title`, `description`, `image`, `imageAlt`, `sourcePage`, plus
  independent image provenance and natural dimensions.
- `src/exhibit-image-sources.json`: explicit verified source-image records.
- `src/content.js`: shared asymmetric section shell, continuous editorial
  image/text layouts, two-sided comparisons, source citations, document viewer,
  next/previous topic controls and a restrained final epilogue.
- `src/learning.js`: complete-unit category, chronology, manuscript and process
  views. One active item synchronously updates labels, image, heading and text.
- `styles/museum.css`: scoped to `#detail[data-exhibition]`. The `#0D0C0B`,
  `#E8E1D5`, `#B79A61`, `#C4BDB1` palette does not modify root/homepage tokens.

Topics 01/02 combine editorial context and categories; Topic 03 uses source-based
hunting methods, agriculture, food selectors and the original optional table;
Topic 04 retains all seven craft categories. Topic 06 combines an existing
process schematic with the source's actual network image. Topic 07 provides
object inspection and contextual categories. Topic 08 provides synchronized
script images and a zoomable document viewer. Topic 09 separates knowledge
directions, beliefs and editorial context. Topic 10 combines comparison, legacy
categories, a source-supported chronology and the concluding exhibition.

No historical illustration is assigned to an unrelated category. Units without
a confidently matched source image remain text-only. A contextual section image
is distinct from a selected item illustration. No new geographic routes or
historical claims are invented.

## PDF audit and page discrepancy

The actual source PDF in Downloads currently has **32 pages**. The older
`research/pdf-extracted.json` and `docs/source-records.json` describe a **33-page**
version with an extra page before crafts. Raw filenames therefore cannot be
treated as current source-page numbers.

Embedded source images were matched to archived raw assets by SHA-256 bytes;
see `research/museum-image-sources.json`. Current PDF text is audited in
`research/museum-pdf-audit.json`. The resolved complete section/item mapping is
in `research/museum-content-map.json`.

Examples: the seven crafts are on current page 8, previously page 9. Mongolian
script is on current page 24, previously page 25. The Phags-pa illustration on
archived page 27 remains in **Topic 08**, sourced from current page 26. Current
page 27 begins the science/exchange topic, so it is not mislabeled as a manuscript.
The relay-network image is extracted from current page 17 and identified as the
source's explanatory schematic, not a verified geographic reconstruction.

Source captions and the compact section-page citation are retained for visitors.
Extraction notes, unresolved-image records and research implementation details
are kept in the audit files rather than shown in the exhibition.

## Interaction and cleanup

Panels occupy one shared grid cell, reserving the required content height and
avoiding section jumps. Image/panel opacity transitions last 450 ms, text opacity
350 ms, and the measured gold underline 300 ms. Interrupted CSS transitions
reverse naturally; there are no queued content timers or independent image/text
updates. Inactive units are hidden from assistive technology and pointer input.
Arrow/Home/End keyboard navigation uses roving tab stops. Reduced motion disables
transitions. The native modal viewer contains focus and consumes Escape without
closing the topic; zoom resets between documents.

Each mounted topic owns an AbortController. Learning components disconnect their
ResizeObservers, cancel their initial animation frame and transitions, and the
viewer/entrance fade are disposed before replacement. Legacy Topic 05 also keeps
its original IntersectionObserver cleanup. Detail-only navigation swaps the old
article atomically, resets its scroll, and uses history depth so returning to all
topics still reaches the originating gallery entry. Homepage input/camera
behavior is unchanged.

## Verification

`layout.spec.js` covers every original section and all categories at 1920×1080,
1440×900, 1366×768, 1024×768, 768×1024, 390×844 and 375×667. It checks header
separation, image/text identity, image aspect ratios, touch targets and overflow.
Existing homepage screenshots are compared without changing their baselines.

`museum.spec.js` additionally checks protected homepage hashes, unchanged Topic
05 renderers, all complete data units, rapid switching with a stationary heading,
keyboard input, manuscript zoom/Escape, rapid article replacement, scroll reset
and browser history. `tests.spec.js` retains the original navigation/learning
regressions. Preview captures are in `research/museum-preview/`.

Final checks: all 22 regression tests passed; the mobile layout matrix was
rechecked after capping small-screen exhibit image height at 280px. Production
build and production smoke passed with loaded images and no runtime errors.
The six existing homepage visual baselines passed without replacement.

Source-image completion: added the original PDF livestock composite (p. 3), hunting scene (p. 5), both food illustrations (p. 7), craft-city map (p. 9), gerege illustration (p. 18), and the source-page photograph accompanying knowledge exchange (p. 27). Food cutout transparency uses the PDF soft mask. Section-wide composites remain separate from item-specific images. Supporting source images use a responsive gallery and the existing inspection dialog.
