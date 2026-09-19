# Revised prompt — Random Lunch Menu Generator (Homework 1)

This is the **revised** prompt for Homework 1. The teacher's original prompt is
kept unchanged in `starter/prompt.md`. This version fixes two problems found in
the original work and one wrong assumption in the original prompt itself.

## 1. Task

Fix and improve the teacher's starter app. Do **not** create a new app from
scratch. The starter is a single file, `starter/index.html`. Work on a copy of
it in the project root so the original stays unchanged.

## 2. The starter app (facts)

- Single-file HTML app: all CSS and JavaScript are inline, **inside** `index.html`.
  There is **no** separate `style.css` or `script.js` file.
- It loads Font Awesome 6.4.0 free from cdnjs.
- It has 12 dishes, in this exact order:
  1. Pizza
  2. Sushi
  3. Burger
  4. Salad
  5. Tacos
  6. Ramen
  7. Sandwich
  8. Pasta
  9. Curry
  10. Steak
  11. Soup
  12. BBQ
- The selection logic is `Math.floor(Math.random() * lunchMenu.length)`.
- There is a `Generate Lunch!` button, a "thinking" spinner for 500 ms, and the
  app also generates one random dish automatically when the page loads.

Keep all of the above. Do not reorder the dishes, do not change the formula,
and do not redesign the page.

## 3. Confirmed problem (do not repeat it)

Three dish icons do **not** exist in Font Awesome 6.4.0 **free**:

- `fa-bowl-hot` (used for Ramen)
- `fa-pasta` (used for Pasta)
- `fa-bowl` (used for Soup)

Verified two ways:

1. `grep` the exact CSS the starter loads
   (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`):
   these three class names are absent, while the other nine are present.
2. In a real browser: for these three, the computed `::before` content is
   `none` and the element width is `0`, so nothing is drawn. The other nine
   render correctly. The same holds for other classes like
   `fa-bowl-rice`, `fa-bowl-food`, `fa-wheat-awn`, which DO exist in 6.4.0 free.

Also note: some icons that *do* render are not a clear picture of the dish
(e.g. Sushi uses a fish icon, Tacos uses a spoon, Steak uses a drumstick).
Always check that the visible picture clearly matches the dish name.

## 4. Required fix

Choose one of these two options:

- **Option A (recommended):** add one local SVG image per dish under
  `assets/food-icons/`, using relative paths (e.g. `assets/food-icons/pizza.svg`)
  and a useful `alt` attribute on each `<img>`. This works offline and on
  GitHub Pages and gives a clear picture for every dish.
- **Option B:** keep Font Awesome icons, but use ONLY icon names that exist in
  FA 6.4.0 free (verify each name against the CSS first).

Tooling notes:

- Every local image must be reachable from `index.html` with a relative path so
  the app works when opened as a plain file and when served from GitHub Pages.
- Give every image a clear, human-readable `alt` text.
- Keep the rest of the app untouched (design, button, formula, spinner,
  animation, auto-generate on load).

## 5. Corrected file structure

```
<project root>/
├── index.html         # the fixed app (all CSS and JS are inline in this file)
├── assets/
│   └── food-icons/    # local SVG images, one per dish
├── README.md          # short description and run instructions
├── prompt.md          # this revised prompt
├── starter/           # the teacher's original files, unchanged (with source notes)
└── backup/            # backup of any earlier prototype work
```

This matches the real starter. The original prompt wrongly listed
`style.css` and `script.js` as separate files — they do not exist in this
homework, so do not create them.

## 6. Licence

Do NOT invent a licence or a licence file. The original prompt's README
template claims "MIT License - see the LICENSE.md file". There is no
`LICENSE.md`, and we have no right to add one. Remove or replace that claim
with a simple note that no licence is declared.

## 7. Final checklist before submission

- [ ] The app is the teacher's starter, fixed — not a new app.
- [ ] All 12 dishes still present, in the original order.
- [ ] Recipe: `Math.floor(Math.random() * lunchMenu.length)` unchanged.
- [ ] `Generate Lunch!` button works; auto-generate on load works.
- [ ] Every dish shows a clear, correct picture (no empty / wrong images).
- [ ] Pictures are local files with relative paths (`assets/food-icons/...`).
- [ ] Every `<img>` has a useful `alt` attribute.
- [ ] No console errors; no reference to non-existent FA icons.
- [ ] README, revised prompt and verification notes are included.
- [ ] No invented licence or licence file.