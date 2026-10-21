# Reference museum detail pages

Implemented only in `C:\Users\Dell\OneDrive\Desktop\mongol-history - Copy`.
The current 32-page PDF was inspected directly, including its visible images.
Pre-edit detail files are under `research/reference-redesign/before/`.

## Resulting sections

| Topic | Three exhibitions | Source pages |
|---|---|---|
| 01 | Historical context; compact 1206 / XIII–XIV-century selector; historical significance categories | 2 |
| 02 | Nomadic life; five livestock categories; complete seasonal image/editorial | 3–4, with existing economic-use facts cited to 7, 20, 23 |
| 03 | Mounted/group hunting and tools; agriculture; five food categories | 5–7, with existing detailed food information from 22 |
| 04 | Craft introduction; seven verified artifact categories; urban production centers | 8–10, with existing metal/elite-use details from 22 |
| 06 | Relay system/network; four-step relay and gerege selector; historical impact | 16–19 |
| 07 | Ger/daily life; clothing, household objects and smithwork selector; transport/customs | 20–23 |
| 08 | Mongolian writing; square script and Secret History documents; education/knowledge exchange | 24–27 |
| 09 | Scientific contacts; religious relationships selector; cultural exchange | 28–29 |
| 10 | Global influence; artistic legacies and qualified plague risk; source-based conclusion | 30–31 |

Topic 05 remains on its existing renderer, unchanged. All other topics have
three exhibitions: 27 sections and 11 source-backed selectors in total.
No unsupported dates were added to Topic 01's timeline.

## Source and image decisions

PDF page 27 belongs exclusively to Topic 08. Its technology directions,
Maragha observatory, Nasir ad-Din at-Tusi and the distinction between invention
and accelerating exchange are retained there. Topic 09's science section uses
the scientist/physician contacts described on page 29.

The religious policy selector includes the source's tax exemption and the 1254
debate. The page-28 portrait is labelled as the source page's contextual
illustration; its independent identity is not asserted. Writing information
retains Tatatunga, official records/seals, the 1240 and 1269 dates, Phags-pa's
author/basis/language coverage, Secret History's three values, Hanlin/Ganlin
academy, census and tax records.

Images follow reviewed semantic associations. Mounted hunting has its hunting
image; food categories use the corresponding preserved-meat/dairy illustrations;
crafts use the seven individually reviewed images. The full seasonal composite
uses an existing source asset. The Secret History and other concepts with no
matching illustration are text-only. Pasture/rider photographs are not assigned
to scientific technologies, porcelain, textiles or plague. Duplicate display of
the same manuscript was avoided by placing Mongolian script in the writing
introduction and square script/Secret History in the document selector.

`research/reference-redesign/content-map.json` is the complete presentation
manifest. `image-text-map.json` in that directory lists every item, source page,
image and association status. `pdf-review.json` and `pdf-pages.jpg` record the
source review.

## Layout and behavior

Desktop uses a 1360px maximum content width, 64px minimum side padding, 36/64
heading/content tracks and a 64px gap. The existing logo and hamburger occupy an
80px header. Initial content and scroll-to-heading positions clear the viewport
top by 120px. Section headings are gold; supplied typography/color values are
scoped to the museum article. Sections use 80px spacing and natural height.

Numbered selectors wrap at 13px, with a moving 2px underline. The selected
image/text tracks are 52/48 with a 32px gap, contain-scaled images and 400px image
height cap. A single active item controls title, description and image together.
Whole units crossfade for 400ms without vertical transforms. Hidden panels do
not reserve the height of their larger media. Old red timeline borders and
fixed six-column timeline rules were removed from the scoped foundation CSS.

Tablets reduce gaps/padding; narrow content areas stack image/text. Mobile uses
20px padding and heading → introduction → selector → image → description order.
Interactive controls have at least 44px touch targets. Existing zoom, logo,
hamburger, next-topic, browser history and clean navigation teardown are tested.

## Validation

All final browser checks use `http://127.0.0.1:5173/mongol-history/`.
`npx playwright test --config museum-transfer.config.js`: **11 passed**.
The suite covers all sections and selector states at 1920×1080, 1440×900,
1366×768, 1024×768, 768×1024, 390×844 and 375×667, including image proportions,
header clearance, overflow, mobile zoom, rapid changes, event/observer cleanup,
hamburger navigation, all ten gallery entries and Topic 05's existing next button.

`node research/verify-reference-redesign.mjs`: protected file hashes and the
homepage DOM/styles/card image URLs remain unchanged; Topic 05 DOM/styles/hero
also match the pre-transfer records. Essential source-fact checks pass.

63 selector screenshots, seven Topic 03 hero screenshots and seven viewport
overview sheets are under `research/reference-redesign/previews/`. Visual review
identified and fixed native-width image capping, old red borders and excessive
space from inactive panels. `npm run build` passes without warnings.

The homepage HTML/styles/scene/camera/lighting/navigation/animations, original
topic data, all existing hero/card image files, package manifests, Vite config,
Git branch and remote are unchanged. `dist/` was generated by Vite, not edited
directly. No commits or pushes were made.
