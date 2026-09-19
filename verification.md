# Verification record

All outputs below were produced by the commands shown. The browser checks used
headless Chromium via Playwright 1.49.1 (real browser engine, not an emulation).
No visual review was done by a human; everything here is an automated check.

## 1. Getting the teacher's files (unchanged copies in `starter/`)

Commands:

```bash
curl -s -o starter/index.html https://raw.githubusercontent.com/dryjins/RecSys-LLMs/main/week1/index.html
curl -s -o starter/prompt.md   https://raw.githubusercontent.com/dryjins/RecSys-LLMs/main/week1/prompt.md
curl -s "https://api.github.com/repos/dryjins/RecSys-LLMs/commits?path=week1/index.html&per_page=1"   # -> 1042ffe7... 2025-09-02T14:32:24Z "Create index.html"
curl -s "https://api.github.com/repos/dryjins/RecSys-LLMs/commits?path=week1/prompt.md&per_page=1"     # -> 7b4e5a35... 2025-09-02T14:36:51Z "Create prompt.md"
```

Verification that our copies are byte-identical to those commits:

```text
index.html MATCHES commit 1042ffe7   (SHA-256 45de4f0b3b77768b5c7c095b1e4f0f1de2095935c5f0711e60831b834181fdbb)
prompt.md   MATCHES commit 7b4e5a35   (SHA-256 9b2b2295908d0e5403c2464104214d3d23186f9a92b437dcca612fdc0732e764)
```

## 2. Icon availability in the CSS the starter loads (Font Awesome 6.4.0 free)

Command:

```bash
curl -s -o all.min.css "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
for cls in pizza-slice fish hamburger leaf utensil-spoon bowl-hot bread-slice pasta mortar-pestle drumstick-bite bowl fire question spinner utensils random; do
  echo "fa-$cls: $(grep -c "fa-$cls:before" all.min.css)"
done
```

Output:

```text
fa-pizza-slice: 1   fa-fish: 1   fa-hamburger: 1   fa-leaf: 1    fa-utensil-spoon: 1
fa-bowl-hot: 0      fa-bread-slice: 1   fa-pasta: 0   fa-mortar-pestle: 1
fa-drumstick-bite: 1   fa-bowl: 0   fa-fire: 1   fa-question: 1   fa-spinner: 1   fa-utensils: 1   fa-random: 1
```

Classes that exist near the missing ones and could be used instead
(`grep -o "fa-[a-z-]*bowl[a-z-]*:before" all.min.css`):

```text
fa-bowl-food:before  fa-bowl-rice:before
```

So: `fa-bowl-hot`, `fa-pasta` and `fa-bowl` are absent from the exact CSS file
the app loads. The other nine dish icons are present.

## 3. Original app in a real browser (before the fix)

Command: `node tools/check_original.js` (headless Chromium, page loaded from a
local HTTP server; computes the CSS `::before` content for each icon).

Key output:

```text
fa-pizza-slice  content: "\f7c4"  width: 16     fa-fish  content: "\f578"  width: 18
fa-hamburger    content: "\f805"  width: 16     fa-leaf  content: "\f06c"  width: 16
fa-utensil-spoon content: "\f2e5" width: 16      fa-bread-slice content: "\f7ec" width: 16
fa-mortar-pestle content: "\f5e7" width: 16      fa-drumstick-bite content: "\f6d7" width: 16
fa-fire         content: "\f06d"  width: 14
fa-bowl-hot     content: "none"   width: 0       <- MISSING
fa-pasta        content: "none"   width: 0       <- MISSING
fa-bowl         content: "none"   width: 0       <- MISSING
Font Awesome stylesheet found in page: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
font loaded via document.fonts.check: true
console messages: none   page errors: none   failed requests: none
```

In the auto-generated live view, the app picked "Pasta" and the DOM contained
`<i class="fas fa-pasta"></i>` with nothing visible — the icon is a ghost.

## 4. Fixed app — all 12 dishes, browser test

Test method: in the browser page, `Math.random` is overridden to
`(i + 0.5) / 12` so that the index is always `i` (0..11). Then the button is
clicked and the DOM is read. This is test-only: the submitted `index.html`
keeps the original `Math.floor(Math.random() * lunchMenu.length)` formula.

Command: `node tools/check_fixed.js`. Output:

```text
=== 1. INITIAL PAGE LOAD ===
auto-generated dish name: Ramen
auto-generated img src: http://localhost:8123/assets/food-icons/ramen.svg
image loaded (naturalWidth>0): true
decoration glyphs ::before content: {"utensils":"\f72f","random":"\f074","spinner":"\f110"}

=== 2. ALL 12 ITEMS (Math.random overridden to (i+0.5)/12 per call) ===
i=0  exp=(Pizza,   assets/food-icons/pizza.svg)    -> PASS (imgLoaded=true, alt="Pizza")
i=1  exp=(Sushi,   assets/food-icons/sushi.svg)    -> PASS (imgLoaded=true, alt="Sushi")
i=2  exp=(Burger,  assets/food-icons/burger.svg)   -> PASS (imgLoaded=true, alt="Burger")
i=3  exp=(Salad,   assets/food-icons/salad.svg)    -> PASS (imgLoaded=true, alt="Salad")
i=4  exp=(Tacos,   assets/food-icons/tacos.svg)    -> PASS (imgLoaded=true, alt="Tacos")
i=5  exp=(Ramen,   assets/food-icons/ramen.svg)    -> PASS (imgLoaded=true, alt="Ramen")
i=6  exp=(Sandwich,assets/food-icons/sandwich.svg) -> PASS (imgLoaded=true, alt="Sandwich")
i=7  exp=(Pasta,   assets/food-icons/pasta.svg)    -> PASS (imgLoaded=true, alt="Pasta")
i=8  exp=(Curry,   assets/food-icons/curry.svg)    -> PASS (imgLoaded=true, alt="Curry")
i=9  exp=(Steak,   assets/food-icons/steak.svg)    -> PASS (imgLoaded=true, alt="Steak")
i=10 exp=(Soup,    assets/food-icons/soup.svg)     -> PASS (imgLoaded=true, alt="Soup")
i=11 exp=(BBQ,     assets/food-icons/bbq.svg)      -> PASS (imgLoaded=true, alt="BBQ")

=== 3. BUTTON + REAL Math.random (5 clicks all yield an image) ===
[true, true, true, true, true]

=== 4. CONSOLE / ERRORS / FAILED REQUESTS ===
console messages: none   page errors: none   failed requests: none
```

All 12 SVG files also passed an XML validity check and a file-existence check
against the paths written in `index.html`.

## 5. Diff from the original

Generated with `diff -u starter/index.html index.html > index.html.diff`.
The change is limited to three places: a small CSS rule for the image size,
the dish array (SVG path + alt instead of the three broken icon classes), and
the single line that renders the chosen dish. The design, the order of the 12
dishes, the button, the spinner and the random formula are unchanged.

## 5b. Screenshots (generated, NOT visually verified by the assistant)

Command: `node tools/shots.js` (headless Chromium, forced index via test-only
`Math.random` override). Four PNG files were saved in `tools/`:

- `screenshot-original-pasta.png` — the ORIGINAL app forced to "Pasta"
  (`fa-pasta`): the icon area is empty (this is the bug in a picture).
- `screenshot-fixed-pasta.png` — the FIXED app, "Pasta" (local SVG).
- `screenshot-fixed-ramen.png` — the FIXED app, "Ramen" (local SVG).
- `screenshot-fixed-bbq.png` — the FIXED app, "BBQ" (local SVG).

Honest note: the assistant's model cannot display image files, so these PNGs
were NOT examined by eye. Please open them and confirm they look right.

## 6. What you still need to check personally

These checks need your eyes and could not be automated here:

- open `index.html` and look at every dish picture — it clearly matches the dish;
- check the layout looks good on a phone (small screen) and on a desktop;
- press "Generate Lunch!" several times in a row and confirm you never see an
  empty picture spot or a wrong-placed image;
- check the page on a device with NO internet connection (offline) — images are
  local, Font Awesome decorations will not load without network, and that is
  expected and acceptable.
- open the four screenshots in `tools/` (see section 5b) and confirm the
  pictures match the dishes. You can delete them after the check if you wish.