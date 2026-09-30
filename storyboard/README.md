# VAO Shotbook

A photo and video reference and storyboard app for **architecture and real estate films**.
It starts from what the viewer should feel, turns that into camera grammar (size, angle, lens,
movement, light, speed, transition, sound), shows every choice on a live 3D previs villa, and
turns the storyboard into a sun-aware shoot plan for the day.

Static site, no build step, works offline once loaded. Boards stay on the device.

## The idea: Feel → Frame → Film

1. **Feel.** In films a close-up makes us feel close to a character and a very wide shot makes us
   feel their loneliness. Buildings work the same way: the space is the character. Pick one of
   15 feelings (Grandeur, Intimacy, Calm, Luxury, Discovery, Openness, Flow, Craft, Belonging,
   Retreat, Energy, Soul & heritage, Design intent, Clarity, Welcome).
2. **Frame.** Each feeling gives a recipe drawn from the library: shot sizes, angles, lenses,
   moves, composition, light, speed, transitions, sound, grade, pace and music tempo, plus what
   to avoid. Every technique is rendered on the same procedural villa, so you see the effect.
3. **Film.** Story arcs assemble shots into a narrative (the VAO signature "Visit": promise,
   arrival, compression at the door, release at the view, details, life, glowing farewell).
   The board then becomes a shoot plan ordered by light, with real golden and blue hour times
   and the hours when your facade is in the sun.

## What is inside

| View | What it does |
| --- | --- |
| **Feel** | 15 feelings with the film logic, the architecture translation, why it works, a full recipe and a 3-shot starter sequence you can add to the board. |
| **Library** | 169 techniques in 15 categories: shot size, angle & height, composition, camera movement, drone, transitions, lenses, focus, light & time, speed & frame rate, format, color, sound, people, pro rules. Each has effect on the viewer, a film reference, architecture/real estate use, how to shoot, what to avoid, feelings, best spaces and pairings. Movements and drone moves play as animated previs; transitions loop as A→B demos; grades have a before/after slider. |
| **Arcs** | 11 story templates: The Visit, Reel hook-first, A day in the life, The architect's eye, Guest journey (Airbnb/hotel), City apartment, Riad reveal, Before/after, Off-plan to reality, Land & plot, Agent-led tour. |
| **Board** | Storyboard with previs frames (or your own photos), storyboard notation arrows, drag to reorder, per-shot editor that explains each choice, runtime vs target, timeline with the music beat grid, **shoot plan** grouped by light and space with sun times and checkboxes, and an **animatic** that plays every camera move for its duration with the board's transitions. Copy the shot list or an owner prep list; export/import boards as JSON; print to PDF. |
| **Tools** | Lens lab (field of view, compression demo, crop factors), Sun planner (sunrise/sunset, golden and blue hours, facade exposure, hero window, live previs of the lit facade), Frame check (composition guides and format crops on your own photos), Speed & shutter (slow motion %, 180° rule, flicker-safe shutters for 50/60 Hz, ND calculator), Timelapse & hyperlapse calculator, Beat grid. |

## Run it

Any static server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/storyboard/
```

On a phone, open the hosted page and use "Add to Home Screen": the service worker caches the app
so the board and shot list open on location without signal.

## Host it

It lives next to the flipbook in the same repository. Once this branch is merged into the branch
your Cloudflare Pages project deploys, it is served at `https://flip.vaoprod.com/storyboard/`
(Pages also builds a preview URL for other branches if branch previews are on).

For its own subdomain, create a second Pages project from this repository with framework **None**,
no build command, and **root directory** `storyboard`, then add a custom domain such as
`shotbook.vaoprod.com`.

## Files

```
storyboard/
  index.html            app shell
  css/app.css           VAO theme (light: cream paper, dark: black), layout, print sheets
  js/previs.js          3D previs engine: procedural villa, time-of-day lighting, camera moves
  js/shots.js           camera presets for the library + shot → previs generator for the board
  js/data-library.js    the 169 techniques (the research)
  js/data-feel.js       the 15 feelings and their recipes
  js/data-arcs.js       the 11 story arcs
  js/data-options.js    editor option lists
  js/sun.js             solar position, golden/blue hour, facade exposure
  js/diagrams.js        SVG diagrams, composition guides, storyboard notation
  js/store.js           IndexedDB storage
  js/app.js             views and interactions
  vendor/three.min.js   three.js r128 (MIT), vendored so the app works offline
  sw.js                 offline cache
```

### Adding content

- **A technique:** add an object to `L` in `js/data-library.js` (`id`, `cat`, `name`, `level`,
  `line`, `effect`, `film`, `archi`, `how`, `avoid`, `feel`, `spaces`, `pairs`) and give it a
  visual: `pv` (a camera preset in `js/shots.js`), `pair`, `tx` (transition demo), `grade` or `dg`
  (a diagram in `js/diagrams.js`).
- **A camera preset:** add a key to `PV` in `js/shots.js`: `pos`, `target`, `focal` (full-frame
  mm), optional `keys` for moves, `orbit`, `tod` (`morning`, `noon`, `afternoon`, `overcast`,
  `golden`, `blue`, `night`), `person`, `door`, `reflect`. The villa plan and coordinates are
  described at the top of `js/previs.js`.
- **An arc:** add to `VAO.ARCS` in `js/data-arcs.js`; each beat has a `why` and shots built with
  `S(title, space, size, angle, lens, move, light, duration, transition, purpose, extra)`.

## Notes on the numbers

- Golden hour is sun elevation +6° to −4°, blue hour −4° to −6° (PhotoPills convention). Sun
  times were checked against the `astral` library to within 1–2 minutes (Marrakech, Paris,
  Los Angeles, including daylight saving).
- Reel safe zones follow commonly cited Meta guidance (about 14% top, 35% bottom, 6% sides);
  sources differ, so the overlay is conservative.
- Instagram Reels can run up to 3 minutes since January 2025; short cuts still perform best.
- Flicker: under 50 Hz mains (Morocco, Europe) use 1/50 or 1/100; under 60 Hz use 1/60 or 1/120.

## Sources

- PhotoPills, [golden hour](https://www.photopills.com/articles/golden-hour-photography-guide) and [blue hour](https://www.photopills.com/articles/blue-hour-photography-guide) guides
- [Instagram safe zones](https://zeely.ai/blog/master-instagram-safe-zones/) and [Reels up to 3 minutes](https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-3-minutes/737766/)
- [Avoiding flicker: PAL 50 Hz and NTSC 60 Hz](https://www.urbanvideo.ca/avoid-video-flicker)
- [Focal lengths for real estate video](https://vidpros.com/best-focal-length-for-real-estate-video/) and [gimbal technique](https://homejab.com/how-to-shoot-real-estate-video-pro-camera-gimbal-tips/)
- [Essential real estate drone shots](https://homejab.com/essential-shots-for-real-estate-drone-videos/)
- [Handheld hyperlapse technique](https://timelapsemagazine.com/how-to-create-a-handheld-hyperlapse/)
- [Kogonada's Columbus and architectural framing](https://www.austinfilm.org/2017/08/from-video-essay-to-screen-why-kogonadas-columbus-is-a-radical-movie/)
- [Real estate video hooks](https://www.luxurypresence.com/blogs/real-estate-video-hooks/)

Film references in the library are cited by title and year; no film stills are used. All visuals
are live renders of one procedural villa.
