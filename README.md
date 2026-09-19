# Random Lunch Menu Generator

A small web app for Homework 1. You click a button, and the app picks a random
lunch dish for you. It is based on the teacher's starter code, fixed after we
found a real problem with the dish pictures.

## Where did this app come from?

This is a fix of the teacher's starter app, not a new app.

- Original file: `https://raw.githubusercontent.com/dryjins/RecSys-LLMs/main/week1/index.html`
- Original prompt: `https://raw.githubusercontent.com/dryjins/RecSys-LLMs/main/week1/prompt.md`
- Git commits (from the GitHub API):
  - index.html: `1042ffe7f73d1968329a8a21c5b32f8cccfec953` (2025-09-02)
  - prompt.md: `7b4e5a35e15dda8d87e73636e0a6fb178d203534` (2025-09-02)

The original, unchanged copies live in `starter/`, together with source notes.

## What was wrong and how we fixed it

The starter loaded Font Awesome **6.4.0 free** and used three icon names that do
**not exist** in the free version:

- `fa-bowl-hot` (Ramen)
- `fa-pasta` (Pasta)
- `fa-bowl` (Soup)

Because the names are missing from the CSS, nothing was drawn for these three
dishes. We checked this two ways: by searching the exact CSS file the app loads,
and in a real browser (the `::before` content is `none` and the element width
is `0` for these three, while the other nine icons render).

**The fix** (kept small, inside the original app):

- Added 12 local SVG images in `assets/food-icons/`, one clear picture per dish.
- Changed only the dish array (`img` + `alt` per dish) and the line that draws
  the chosen dish (`<img>` instead of a Font Awesome `<i>`).
- Added a tiny CSS rule so each image has the same size (96 x 96 px).
- The design, the button, the spinner, the fade-in animation, all 12 dishes in
  the original order, and the formula
  `Math.floor(Math.random() * lunchMenu.length)` are untouched.

Images use relative paths, so the app works offline and on GitHub Pages.
Font Awesome is still loaded and used for the heading, the button and the
"thinking" spinner.

## Project structure

```
├── index.html         # the fixed app (CSS and JS are inline, as in the starter)
├── assets/food-icons/ # 12 local SVG images, one per dish
├── prompt.md          # revised prompt (original is kept in starter/prompt.md)
├── README.md          # this file
├── starter/           # teacher's original files, unchanged, with source notes
├── backup/            # backup of our earlier prototype (not submitted)
├── tools/             # the test scripts used for verification
├── verification.md    # exact commands and outputs of all checks
└── index.html.diff    # readable diff from the original source
```

There is no licence file. No licence is declared for this homework.

## How to run it

Easiest way (no tools needed): open `index.html` in your browser (double-click).

With a local server (Python):
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

On GitHub Pages:
1. Push this folder to a GitHub repository.
2. Open Settings → Pages.
3. Choose branch `main`, folder `/ (root)`, and click Save.

## The random pick, in plain words

`Math.random()` gives a number from 0 (included) to 1 (excluded).
`lunchMenu.length` is 12. `Math.random() * 12` gives a number in [0, 12).
`Math.floor(...)` rounds it down to a whole number 0..11. That number picks the
dish (`lunchMenu[0]` is Pizza, ..., `lunchMenu[11]` is BBQ).

Example: if `Math.random()` returns `0.25`, then `0.25 * 12 = 3`, and
`Math.floor(3) = 3`, so the app shows dish 3 = Salad.

## What checks were done

See `verification.md` for the exact commands and output. In short, all checks
below are automated browser checks (headless Chromium) and file checks:

- the original app really does not draw the three icons (confirmed);
- the fixed app draws all 12 dishes with correct names, paths and alt text;
- each of the 12 images actually loads;
- the button works with the real `Math.random()`;
- the page loads with no console errors and no failed requests.

You should still open the app yourself and look at the pictures and layout on
your own screen; see `verification.md` for the short personal checklist.