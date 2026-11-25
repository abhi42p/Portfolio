# Beyond the Screen — V2

**Abhishek Prajapati — Flutter developer & guitar enthusiast.**

A continuous, scroll-driven, fixed-viewport 3D portfolio. The camera travels through six locations within a single world, with optional audio and an interactive arcade. All source modules, revised portfolio content and original résumé are local. No paid assets, npm dependencies, CDN or API key is needed.

## Run locally

Requires Node.js 18+ (tested syntax with Node 22).

```sh
cd beyond-the-screen
npm run dev
```

Open **http://localhost:5173** in Chrome or another modern WebGL2-capable browser. `npm install` is not required. The server binds to localhost. For a different port use `PORT=8080 npm run dev` (macOS/Linux). On Windows PowerShell: `$env:PORT=8080; npm run dev`.

The modular project uses ES modules; do not open its index.html via file://. An optional dependency-free standalone preview is distributed separately. To regenerate it use `npm run preview:build` (output in the parent directory).

## Explore

- Scroll forward or backward to move through the continuous 3D world. The numbered rail and footer use the same camera timeline.
- Chapter 1: studio, monitor/app shortcut, desk light and guitar shortcut.
- Chapter 2: five interactive phone showcases; hover lifts a device, click opens its original description, stack and store links.
- Chapter 3: experience archive and original résumé.
- Chapter 4: interactive exploded architecture/toolkit stack.
- Chapter 5: play individual guitar notes E2 A2 D3 G3 B3 E4, use keys 1–6, strum the instrument, or play Release Runner. The music corner includes an amplifier and arcade cabinet. Click or hover near the projected strings to interact. Hover audio requires sound enabled.
- Chapter 6: contact and dawn lighting. Contact information and email copying are available without audio.
- Sound toggle enables original ambient synthesis, tap feedback and stereo-panned sounds. Selecting a guitar note/strum is also an explicit audio activation. Nothing autoplays on load. The guitar sounds are synthesized rather than recorded.
- Game: press Start, Space/Arrow Up or tap Jump to avoid bugs and collect tokens. Best score is stored locally. Close the modal to stop the game.
- Quick view offers a direct, recruiter-friendly portfolio, independent of the 3D world. Reduced-motion preference disables UI entrance animations and smooth camera interpolation. WebGL-unavailable devices use a lower-detail CPU projection renderer; if Canvas also fails, the text interface remains usable.

## Project structure

```
beyond-the-screen/
├── index.html                       HTML shell, dialogs, canvas
├── portfolio.html                   Text-only recruiter portfolio
├── .nojekyll                        GitHub Pages static publishing
├── package.json                     Node scripts (no dependencies)
├── README.md
├── assets/
│   └── Abhishek_Prajapati_Resume.pdf Original embedded PDF extracted unchanged
├── src/
│   ├── content.js                   All portfolio data from old portfolio.html
│   ├── main.js                      UI, scroll camera, interactions and chapter navigation
│   ├── renderer.js                  WebGL2 shaders, mesh math and CPU fallback
│   ├── world.js                     Procedural 3D models, materials and scene animation
│   ├── audio.js                     Web Audio synth, guitar and click sound
│   ├── game.js                      Canvas runner, physics and local high score
│   └── style.css                    Typography, responsive layout, accessibility
└── scripts/
    ├── serve.mjs                    Local static server
    ├── check.mjs                    Syntax checks
    └── standalone.mjs               Optional offline HTML bundler
```

## Customize

Edit `src/content.js` for content. All five project case studies are rewritten from the supplied HTML; roles, features, store URLs, skills, career details and contact links are retained. If you edit content.js, update portfolio.html as well. No performance metrics have been invented. Store availability has not been independently rechecked. The app display graphics are illustrative mockups, not actual screenshots. Replace the textures in `world.js` with approved screenshots if available. `SPACING`, camera offsets and chapter metadata control the journey. `audio.js` controls sound level and timbre. `style.css` controls colours, layouts and typography.

## Deploy

This is a static website. Publish `index.html`, `portfolio.html`, `src/`, `assets/` and `.nojekyll` together in the same structure. The Node server is only for local development. No backend or build pipeline is needed.

### GitHub Pages (existing portfolio)

1. Clone your existing portfolio repository using its actual GitHub URL. Check Settings → Pages to see the existing publishing branch and directory (`/` or `/docs`).
2. Create a backup branch before replacing anything, e.g. `git branch backup-old-portfolio` and `git push origin backup-old-portfolio`. Run these from the current publishing branch.
3. Copy the **contents** of this folder (including hidden `.nojekyll`) into the existing publishing directory, not the enclosing folder. Preserve existing `CNAME`, repository settings, workflows and unrelated files. Review changes with `git status`.
4. Test with `npm run check` and `npm run dev` from the copied project directory. Check the 3D rendering, audio, app links, game and PDF on your actual phone and desktop.
5. Commit and push to the configured publishing branch. GitHub Pages will publish the update if it already uses that branch. If it uses GitHub Actions instead, inspect the current workflow and its output directory before changing it.
6. Check the Pages deployment status and live website. For branch publishing, Settings → Pages → Deploy from a branch → your existing branch and folder. Do not switch the existing setting unnecessarily.

All site assets use relative paths, so the project works for both user and repository Pages sites. Keep the resume and contact data public only if you intend them to be public. Your original site was not modified by this package.

## V2 validation and limitations

- V2 source syntax checks passed. The 3D engine, game and audio modules are unchanged from V1. The original resume PDF is unchanged.
- The revised content and static page use the existing source facts; store links and availability are not independently verified.

- `npm run check` passed for all source modules.
- Headless Chromium smoke tests passed on the self-contained preview: scroll navigation, opening a project with four original links, skill selection, guitar-triggered audio activation, runner start/jump/close, quick view and a 390px viewport with no horizontal overflow. No uncaught JS errors in that run.
- The test browser disallowed WebGL2 and direct local navigation. The actual screenshots were captured using the CPU 3D fallback, after injecting the bundled HTML into the browser. WebGL shader execution and performance on physical devices remain unverified. The Node server is provided for the user's local environment; HTTP navigation was not testable here.
- Geometry/materials are procedural, stylized low-poly models, not photorealistic Blender assets. Lighting is shader-based with approximate shading and contact shadows rather than physical ray tracing. No external packages or model assets could be downloaded in the build environment. True spatial HRTF, recorded guitar audio, glTF models, PBR lighting, physical object dragging and cinematic 3D asset films are not included. Test on your target browser and GPU before publishing.

## V2.1 — Continuous background soundtrack

A quiet original fingerpicked guitar-inspired sequence (72 BPM, eight alternating measures) plays with a warm pad and stereo room ambience. Music stays active across all six chapters and during the arcade. It tries to start automatically; browsers that restrict sound require a first tap, click or keypress. The music control mutes music and effects together, and stores the preference locally. No external audio files or packages are used. Adjust `HARMONY`, `BEAT`, and `this.music.gain.value` in `src/audio.js` to customize the soundtrack. Synthesized notes are not recordings of a real guitar.
