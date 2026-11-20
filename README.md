# ARCHIVE ZERO — GitHub Pages build

A mobile-first, static four-node puzzle experience for an NFC birthday treasure hunt. It uses plain HTML, CSS and JavaScript; there is no build step, framework, account system or server-side code.

## Files

- `index.html` — development hub with direct links to test all four nodes.
- `001.html` — Initial Contact (Caesar cipher → medieval festival photo → clue to the moon in *The Starry Night*).
- `002.html` — Lost Coordinates (shake the phone / manual fallback → giraffe photo → clue to the wax seal).
- `003.html` — Encrypted Correspondence (connect four matching circuits → Teotihuacán photo → clue to the first relationship photo).
- `004.html` — Final Memory (repeat a five-symbol sequence, then enter `SI` → ring photo → ending).
- `styles.css` — responsive classified-terminal interface.
- `app.js` — puzzle logic and node content.
- `audio.js` — original procedural music and sound effects created with Web Audio API. No licensed music files are bundled.
- `assets/evidence-00X.svg` — temporary photo placeholders.

## 1. Preview locally

You can open `index.html` in a browser to inspect the development hub. For the motion sensor, sound, and realistic mobile behavior, test after publishing over HTTPS (GitHub Pages provides HTTPS) or with a local development server. Some browsers restrict motion sensors on insecure origins.

## 2. Add the real photographs (no code editing needed)

The four evidence screens are already configured to look for these exact JPEG filenames inside `assets/`:

| Upload this filename | Photo |
|---|---|
| `foto-001.jpg` | Medieval festival |
| `foto-002.jpg` | Photo with the giraffe |
| `foto-003.jpg` | Teotihuacán / pyramids of the Sun and Moon |
| `foto-004.jpg` | The ring |

From a phone: open your GitHub repository in a browser, open the `assets` folder, choose **Add file → Upload files**, select the four photos from your gallery, and commit the changes. You do not need to edit `app.js`. If GitHub's mobile interface hides the upload option, use the browser menu and enable **Desktop site**.

Use JPEG files (`.jpg`). If your phone saves photos as HEIC, export or convert them to JPEG first. Keep the filenames exactly as shown, including the hyphens and numbers. The project retains SVG placeholders and will display one automatically until its matching JPEG is uploaded.

**Privacy note:** GitHub Pages serves static files publicly. Anyone who knows or discovers the image URL may be able to open or download the photos, even though the game only displays them after the puzzle is solved. Upload only photos you are comfortable hosting publicly.

## 3. Publish with GitHub Pages

1. Create a new GitHub repository, for example `archive-zero`.
2. Upload the contents of this folder to the repository root. Make sure `index.html`, `001.html`, `002.html`, `003.html`, `004.html`, `styles.css`, `app.js`, `audio.js`, and `assets/` are at the top level as shown here.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder, then save.
6. Wait for GitHub Pages to publish the site. The repository Pages panel will show the public URL.

If the repository is named `archive-zero`, the page addresses normally follow this pattern:

- `https://YOUR-USERNAME.github.io/archive-zero/001.html`
- `https://YOUR-USERNAME.github.io/archive-zero/002.html`
- `https://YOUR-USERNAME.github.io/archive-zero/003.html`
- `https://YOUR-USERNAME.github.io/archive-zero/004.html`

Use the exact published URLs shown by GitHub Pages, not the example URLs above.

## 4. Program the NFC tags

Write one URL to each tag:

- NFC on the visible birthday letter → `.../001.html`
- NFC hidden in the moon of the painting → `.../002.html`
- NFC hidden in the wax seal → `.../003.html`
- NFC behind the first relationship photo → `.../004.html`

The `/index.html` hub is for your own testing; do not write it to the tags.

## 5. Test the full experience on a phone

- Open each node directly from its intended URL.
- Tap **INITIALIZE SYSTEM**. This user gesture starts the soundtrack because mobile browsers block autoplay before interaction.
- Node 001: answer `ESTANDARTE` (the Caesar text was shifted one letter forward; decode one letter backward).
- Node 002: tap **ACTIVATE MOTION SENSOR**, grant permission if prompted, then make three short, distinct shakes while holding the phone securely. The counter and three signal bars respond to each detected movement. After the third shake, the recovered photo appears blurred beneath a scanning overlay and then resolves into focus. If motion access is unavailable or denied, tap **USE MANUAL MODE** three times, leaving a short pause between taps.
- Node 003: tap a colored port on the left and then the matching color on the right. Complete all four connections.
- Node 004: watch the five-symbol sequence and repeat it; then enter `SI` (accent optional).
- Once a node has been recovered, its result is saved in that browser's `localStorage`. Reopening that node on the same browser shows the recovered evidence instead of asking for the puzzle again.
- The development hub has **RESET LOCAL TEST PROGRESS**. Use it on the same browser to test the puzzles again from the beginning.

## 6. Personalize the clues

The four clue texts, hints, file titles, and soundtrack themes are in the `CONFIG` object near the top of `app.js`. Edit the text there to make the riddles more personal and less direct. Keep the node order intact unless you also change which NFC URL is written to each tag.

## Technical notes

- The motion challenge uses the browser `DeviceMotionEvent` API. Some browsers (notably iOS Safari) require explicit permission from a button press, and the page must be served over HTTPS. GitHub Pages provides HTTPS. After three detected movements, Node 002 animates the image from a blurred/scan state into focus. A manual calibration fallback is included for browsers or devices that do not expose sensor data.
- The soundtrack and effects are synthesized in the browser using Web Audio API. The initial track is an original suspense motif; after a successful challenge, it transitions to an original theme inspired by the corresponding memory (medieval, playful, majestic, romantic). It is not a recording of an existing song.
- The NFC tags only open URLs. Progress is stored locally in the browser and is not synchronized between devices. If she scans with a different phone/browser, that browser will have its own progress.
- This is an entertainment puzzle, not a secure authentication system. Answers and assets are client-side and can be inspected by someone with technical knowledge.
- The CSS imports Google Fonts as a visual enhancement. System font fallbacks are provided if the fonts cannot load.
