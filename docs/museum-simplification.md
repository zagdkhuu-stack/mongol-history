# Detail-page simplification

Only the authoritative Copy project was edited. Homepage source, animations,
card/hero image files, Topic 05 and Git configuration remain unchanged.
Pre-edit files and protected hashes: `research/before-simplification-20261019/`.

The 35 museum sections became 28. Five numbered selectors remain: livestock,
seasons, food sources, craft categories and writing systems. Short comparisons
are now readable definitions. Each section has one heading and at most one
visible main image. Source data in `src/museum-source-topics.js` and
`src/pdf-chapters.json` was not edited.

| Topic | Consolidation and retained information |
|---|---|
| 01 | Removed the section explaining how to navigate the ten topics. Historical foundation and connections remain. |
| 02 | Moved the repeated economic summary into livestock. Both livestock and seasonal categories remain. |
| 03 | Replaced the hunting selector with its original explanation. Consolidated processing, storage, distribution and economic significance into food sources. Removed the duplicate table and systems recap. Added the specific dairy products, meat preparation and foreign food influences formerly repeated in Topic 07. |
| 04 | Kept seven crafts and both urban centers. Merged the palace-image commentary into the urban section; the silver tree is still mentioned. Arrowheads and elite precious-metal use from Topic 07 remain in the appropriate craft category. |
| 06 | Relay process is one explanation, including changing horses to avoid exhaustion and the right to supplies. Kept the approximate distance, gerege explanation and network's governmental/trade roles. Removed their duplicate selector descriptions. |
| 07 | Kept ger structure/spatial customs, clothing/status, household objects, transport and family customs. Food details moved to Topic 03, craft details to Topic 04, and gerege information stays in Topic 06. Yuan-era clothing/cultural influence is merged into the clothing explanation. |
| 08 | Merged the Mongolian-script origins and official-use section into the existing two-script comparison. Tatatunga, dates, Phags-pa's author/origins/purpose, Secret History's three values, education and administrative records remain. |
| 09 | Exchange directions are plain text. Kept Maragha/at-Tusi, religious coexistence and the 1254 debate. The last section retains Tibetan Buddhism and transmitted goods/compass; mechanisms already explained under writing, science and relay are not restated. |
| 10 | Kept Pax Mongolica, qualified plague risk and four artistic influences. Removed the recap timeline: all its dates remain under 01, 08, 09 and 10's risk explanation. Removed the duplicate closing title panel. |

Removed decorative diagrams, moving selector underline, relay controls, repeated
image galleries and image arrow overlays. Kept the existing image-inspection
viewer, logo navigation and topic links. Section spacing is 48px on desktop and
32px on mobile; there are no viewport-height exhibition sections.

`research/simplification-content-map.json` records the resulting content,
original section IDs and source pages, including cross-topic consolidations.
Verification runs against port 5173 using `museum-transfer.config.js` and
`research/verify-simplification.mjs`.
