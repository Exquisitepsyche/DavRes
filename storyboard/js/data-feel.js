/* VAO Shotbook · Feel → Frame
 * Start from what the viewer should feel; get the camera recipe.
 * Recipes reference library ids. seq = a 3-shot starter sequence.
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});

  function S(title, space, size, angle, lens, move, light, dur, trans, purpose, extra) {
    return Object.assign({ title: title, space: space, size: size, angle: angle, lens: lens, move: move, light: light, duration: dur, trans: trans, purpose: purpose }, extra || {});
  }
  VAO.mkShot = S;

  VAO.FEELINGS = [
    {
      id: 'grandeur', name: 'Grandeur', tag: 'Awe · scale · landmark', voice: '“This place is exceptional.”', pv: 'ang-low',
      film: 'Cinema makes a character powerful by looking up at them and giving them space: the low angles of Citizen Kane, the tiny figures under giant architecture in Blade Runner 2049.',
      archi: 'Double heights, cantilevers, stairs, entrance halls, facades against the sky. Let the architecture tower and keep people small.',
      why: 'Looking up triggers respect. Long holds and slow motion signal importance. A human figure turns "big" into "awe" because the brain finally has a ruler.',
      recipe: { size: ['ws', 'ews'], angle: ['low', 'worm'], lens: ['l-ultra', 'l-wide'], move: ['pedestal', 'crane', 'tiltreveal', 'd-reveal'], comp: ['symmetry', 'scale', 'negative'], light: ['golden', 'blue'], speed: ['fps-slow'], trans: ['dissolve', 'cut'], sound: ['s-silence', 's-music'], color: ['c-moody'] },
      pace: '4–7 s per shot', music: '60–80 BPM, orchestral swell or deep pulse',
      spaces: ['facade', 'living', 'stairs', 'entrance'],
      avoid: 'Handheld, fast cuts, cluttered foregrounds, eye-level framing of tall spaces.',
      seq: [
        S('The facade towers', 'facade', 'ws', 'low', 16, 'pedestal', 'golden', 6, 'dissolve', 'Make the house a landmark before we enter.'),
        S('Double height with a figure', 'living', 'ws', 'low', 16, 'pedestal', 'golden', 5, 'cut', 'Scale: a person shows how tall the space really is.', { talent: 'One figure, back to camera' }),
        S('The stair rises', 'stairs', 'mws', 'low', 20, 'tilt', 'golden', 5, 'cut', 'Diagonal energy leading upward.'),
      ],
    },
    {
      id: 'intimacy', name: 'Intimacy', tag: 'Closeness · touch · comfort', voice: '“I can almost feel it.”', pv: 'size-cu',
      film: 'The close-up is cinema’s tool for empathy: when a face fills the frame we feel what the character feels (The Passion of Joan of Arc, Leone’s eyes).',
      archi: 'Treat materials like faces. Linen, oak, a warm lamp, steam from a bath: fill the frame so the viewer feels the texture and the comfort.',
      why: 'Physical closeness on screen reads as emotional closeness. Shallow focus removes distractions, and close sound (foley) makes the image tactile.',
      recipe: { size: ['cu', 'ecu', 'insert'], angle: ['chest'], lens: ['l-50', 'l-85', 'l-macro'], move: ['pushin', 'truck', 'static'], focus: ['shallow', 'rackfocus'], comp: ['layers', 'lightshadow'], light: ['practicals', 'golden', 'motivated'], speed: ['fps-slow', 'fps-high'], trans: ['dissolve', 'jlcut'], sound: ['s-foley', 's-ambience'], color: ['c-warm'] },
      pace: '2–4 s per detail', music: 'Soft piano, 60–80 BPM, kept low under the foley',
      spaces: ['bedroom', 'bathroom', 'detail', 'living'],
      avoid: 'Wide lenses close to objects, cold light, generic props, hard overhead light.',
      seq: [
        S('Bedside lamp glowing', 'bedroom', 'cu', 'chest', 50, 'pushin', 'blue', 3, 'dissolve', 'Warmth: someone is expected tonight.'),
        S('Linen and light', 'bedroom', 'ms', 'chest', 50, 'truck', 'golden', 4, 'cut', 'Softness the viewer can feel.'),
        S('Stone under the fingers', 'detail', 'ecu', 'chest', 100, 'truck', 'any', 3, 'cut', 'Tactile quality of the materials.', { talent: 'Hands only' }),
      ],
    },
    {
      id: 'calm', name: 'Calm', tag: 'Serenity · stillness · balance', voice: '“I can breathe here.”', pv: 'comp-reflection',
      film: 'Ozu and Kogonada’s Columbus hold still, symmetrical frames and let time pass. Nothing pushes the eye.',
      archi: 'Spas, bathrooms, pools at dawn, minimal rooms. Still frames, symmetry, reflections, negative space and long holds.',
      why: 'Low motion and symmetry reduce mental effort. Long shots slow the viewer’s breathing; ambient sound replaces tension.',
      recipe: { size: ['ws', 'ms'], angle: ['eye', 'chest'], lens: ['l-35', 'l-wide'], move: ['static', 'truck', 'pushin'], comp: ['symmetry', 'negative', 'reflection', 'horizon'], light: ['morning', 'overcast', 'blue'], speed: ['fps-slow', 'timelapse'], trans: ['dissolve', 'dip'], sound: ['s-ambience', 's-silence'], color: ['c-airy', 'c-natural'] },
      pace: '6–10 s per shot', music: '50–70 BPM ambient, or no music and only ambience',
      spaces: ['bathroom', 'pool', 'bedroom', 'courtyard'],
      avoid: 'Whip pans, speed ramps, busy music, cluttered props.',
      seq: [
        S('Still pool at dawn', 'pool', 'ws', 'low', 16, 'static', 'dawn', 8, 'dissolve', 'Mirror-still water: time slows down.'),
        S('Bathroom on axis', 'bathroom', 'ws', 'chest', 24, 'static', 'any', 7, 'dissolve', 'Symmetry and order: a room that rests.'),
        S('Morning in the bedroom', 'bedroom', 'ws', 'chest', 24, 'pushin', 'dawn', 8, 'dip', 'Soft light, one slow move.'),
      ],
    },
    {
      id: 'luxury', name: 'Luxury', tag: 'Exclusivity · desire · refinement', voice: '“I want this.”', pv: 'tr-blue',
      film: 'Luxury cinema is slow and controlled: precise dolly moves, deep blacks, reflections, anamorphic width, nothing accidental.',
      archi: 'Twilight exteriors with every light on, slow slides along stone and glass, reflections in the pool, macro details of craft, privacy cues like gates and long drives.',
      why: 'Control reads as cost: steady moves, perfect symmetry and restraint look expensive. Privacy and scarcity cues increase desire.',
      recipe: { size: ['ws', 'cu', 'ecu'], angle: ['low', 'eye'], lens: ['l-wide', 'l-85', 'l-anamorphic'], move: ['truck', 'pushin', 'arc', 'd-twilight'], comp: ['symmetry', 'reflection', 'layers', 'negative'], light: ['blue', 'golden', 'practicals'], speed: ['fps-slow', 'fps-high'], trans: ['dissolve', 'matchcut', 'dip'], sound: ['s-silence', 's-foley', 's-music'], color: ['c-moody'], format: ['f-239'] },
      pace: '4–7 s per shot', music: '70–90 BPM, minimal piano and strings or deep electronic',
      spaces: ['facade', 'pool', 'bathroom', 'living'],
      avoid: 'Fast cuts, stock lifestyle, cheap transitions (light leaks, spins), clutter.',
      seq: [
        S('Twilight hero', 'facade', 'ws', 'eye', 24, 'static', 'blue', 6, 'dissolve', 'The house glows: warm inside, deep blue outside.'),
        S('Slide through the layers', 'living', 'ws', 'chest', 20, 'truck', 'golden', 5, 'cut', 'Parallax: the premium signature move.'),
        S('Marble in raking light', 'detail', 'ecu', 'chest', 100, 'truck', 'any', 3, 'matchcut', 'Craft at a macro scale.'),
      ],
    },
    {
      id: 'discovery', name: 'Discovery', tag: 'Anticipation · curiosity · reveal', voice: '“What’s behind that door?”', pv: 'mv-reveal',
      film: 'Suspense is information withheld: frames within frames, doors, slow reveals, sound before image (Hitchcock, every trailer).',
      archi: 'Gates, entrance sequences, corridors, a riad’s bent entrance, the curtain before the view. Hide, then give.',
      why: 'Curiosity is an itch created by missing information. A short delay before the payoff makes the reveal land harder.',
      recipe: { size: ['pov', 'ms', 'ws'], angle: ['eye', 'chest'], lens: ['l-wide'], move: ['reveal', 'crane', 'pushthrough', 'pullout', 'tiltreveal', 'd-reveal'], comp: ['framing', 'leading', 'depth'], focus: ['rackfocus'], light: ['golden', 'windows'], speed: ['fps-slow'], trans: ['jlcut', 'mask', 'matchaction'], sound: ['s-silence', 's-ambience'] },
      pace: '3–6 s, hold the payoff longer', music: 'Building, with a drop right before the reveal',
      spaces: ['entrance', 'arrival', 'courtyard', 'view'],
      avoid: 'Showing the best shot first in a slow film (in reels do the opposite: hook first).',
      seq: [
        S('Hand on the door', 'entrance', 'insert', 'chest', 35, 'static', 'golden', 3, 'matchaction', 'The threshold: anticipation.', { talent: 'Hands only' }),
        S('Through the threshold', 'entrance', 'pov', 'eye', 20, 'pushthrough', 'golden', 5, 'cut', 'Compression before release.'),
        S('The view revealed', 'view', 'ws', 'eye', 24, 'reveal', 'golden', 6, 'dissolve', 'Release: the payoff of the visit.'),
      ],
    },
    {
      id: 'openness', name: 'Openness', tag: 'Light · air · freedom', voice: '“It feels so open.”', pv: 'comp-inout',
      film: 'Wide frames with low horizons and big skies are cinema’s shorthand for freedom (John Ford’s Monument Valley).',
      archi: 'Glass walls, open sliders, terraces, sea views, rooftops. Show inside and outside together, keep windows exposed, let curtains move.',
      why: 'Visible sky and distance reduce the feeling of crowding; indoor–outdoor frames extend a room honestly.',
      recipe: { size: ['ws', 'ots', 'ews'], angle: ['eye', 'chest'], lens: ['l-wide'], move: ['pan', 'pushthrough', 'pullout', 'd-pullback'], comp: ['inout', 'horizon', 'negative', 'framing'], light: ['morning', 'noon', 'overcast', 'windows'], speed: ['fps-slow', 'fps-high'], trans: ['dissolve', 'push-t'], sound: ['s-ambience'], color: ['c-airy'] },
      pace: '4–6 s per shot', music: '90–110 BPM, airy acoustic or light electronic',
      spaces: ['living', 'terrace', 'view', 'rooftop'],
      avoid: 'Burned windows, closed curtains, heavy dark grades.',
      seq: [
        S('Living opens to the pool', 'living', 'ws', 'chest', 20, 'static', 'golden', 5, 'push', 'Walls disappear: inside and outside are one.'),
        S('Step out', 'terrace', 'pov', 'eye', 20, 'pushthrough', 'golden', 5, 'cut', 'Crossing into the open air.'),
        S('The horizon', 'view', 'ots', 'eye', 35, 'static', 'golden', 6, 'dissolve', 'Low horizon, big sky: freedom.', { talent: 'Back to camera' }),
      ],
    },
    {
      id: 'flow', name: 'Flow', tag: 'Connection · orientation', voice: '“I know my way around.”', pv: 'mv-walkthrough',
      film: 'Long takes and tracking shots let the audience learn a space by moving through it (Russian Ark, Goodfellas).',
      archi: 'Open plans, circulation, the route from door to view. One-take walkthroughs, match cuts on action, consistent screen direction.',
      why: 'Continuous movement builds a mental map. When the viewer can orient, they trust the layout and remember it.',
      recipe: { size: ['ws', 'pov', 'mws'], angle: ['chest', 'eye'], lens: ['l-wide'], move: ['walkthrough', 'track', 'pushthrough', 'd-fpv'], comp: ['leading', 'depth', 'leadroom'], light: ['golden', 'practicals'], speed: ['fps-slow'], trans: ['matchaction', 'seamless', 'whip-t', 'jlcut', 'wipe'], sound: ['s-ambience'], human: ['h-lead'] },
      pace: 'Long takes of 8–15 s, or fluid 2–3 s cuts in one direction', music: 'Steady 90–110 BPM',
      spaces: ['entrance', 'living', 'kitchen', 'terrace'],
      avoid: 'Changing screen direction every cut, jumping between floors at random.',
      seq: [
        S('Door to living, one take', 'entrance', 'ws', 'eye', 20, 'walkthrough', 'golden', 12, 'seamless', 'The visit as one breath.'),
        S('Follow into the kitchen', 'kitchen', 'mws', 'chest', 24, 'track', 'golden', 5, 'matchaction', 'Talent leads, we follow.', { talent: 'Guest walking ahead' }),
        S('Through to the terrace', 'terrace', 'ws', 'eye', 20, 'pushthrough', 'golden', 5, 'cut', 'Inside flows into outside.'),
      ],
    },
    {
      id: 'craft', name: 'Craft', tag: 'Materials · quality · detail', voice: '“This is well made.”', pv: 'size-insert',
      film: 'Food and watch films make objects precious with macro lenses, raking light and slow motion (Chef’s Table).',
      archi: 'Stone, wood, brass, zellige, tadelakt, joinery, stitching. Macro slides in raking light, hands touching, the sound of materials.',
      why: 'Detail is a proxy for quality: if the viewer sees care at 2 cm, they assume care everywhere.',
      recipe: { size: ['ecu', 'cu', 'insert'], angle: ['chest'], lens: ['l-macro', 'l-85', 'l-50'], move: ['truck', 'static'], focus: ['shallow', 'rackfocus', 'sweetspot'], comp: ['lightshadow', 'pattern'], light: ['motivated', 'morning', 'golden'], speed: ['fps-slow', 'fps-high'], trans: ['cut', 'matchcut'], sound: ['s-foley'], human: ['h-hands'] },
      pace: '2–4 s per detail', music: 'Sparse and rhythmic; let the foley lead',
      spaces: ['detail', 'kitchen', 'bathroom'],
      avoid: 'Dust, fingerprints, flat front light, handheld macro.',
      seq: [
        S('Zellige glaze', 'detail', 'insert', 'chest', 50, 'truck', 'any', 3, 'cut', 'Handmade texture catching the light.'),
        S('Marble macro slide', 'detail', 'ecu', 'chest', 100, 'truck', 'any', 3, 'matchcut', 'The veins of the stone as landscape.'),
        S('Brass handle, hand', 'entrance', 'insert', 'chest', 85, 'static', 'dawn', 3, 'cut', 'Weight and touch of the hardware.', { talent: 'Hands only' }),
      ],
    },
    {
      id: 'belonging', name: 'Belonging', tag: 'Lifestyle · home', voice: '“That could be my life.”', pv: 'hu-lifestyle',
      film: 'Audiences bond with characters doing ordinary things; we project ourselves into figures seen from behind (Friedrich’s Rückenfigur).',
      archi: 'People using the house: breakfast, a swim, dinner at dusk, reading by the window. Cast the buyer, show gestures more than faces.',
      why: 'Self-projection turns square meters into a life. Familiar moments lower resistance and build desire.',
      recipe: { size: ['mws', 'ms', 'ots'], angle: ['eye', 'chest'], lens: ['l-35', 'l-50'], move: ['track', 'handheld', 'static'], comp: ['scale', 'leadroom'], light: ['golden', 'morning', 'practicals'], speed: ['fps-slow'], trans: ['cut', 'jlcut', 'lightleak'], sound: ['s-ambience', 's-vo'], color: ['c-warm'], human: ['h-lifestyle', 'h-back', 'h-mirror'] },
      pace: '3–5 s per shot', music: '90–110 BPM, warm acoustic',
      spaces: ['terrace', 'kitchen', 'pool', 'dining'],
      avoid: 'Stock smiles, faces to camera, casting that does not match the buyer.',
      seq: [
        S('Morning coffee', 'terrace', 'mws', 'eye', 35, 'static', 'dawn', 4, 'cut', 'A ritual the buyer wants to own.', { talent: 'Couple, relaxed' }),
        S('Poolside, golden', 'pool', 'mws', 'eye', 35, 'track', 'golden', 5, 'jcut', 'Leisure as the subject.', { talent: 'Guest on a lounger' }),
        S('Dinner at dusk', 'dining', 'ms', 'chest', 35, 'truck', 'blue', 5, 'dissolve', 'The house at its warmest.', { talent: 'Friends at the table' }),
      ],
    },
    {
      id: 'retreat', name: 'Retreat', tag: 'Privacy · escape · own world', voice: '“Finally, away from everything.”', pv: 'size-ews',
      film: 'The extreme wides that make a character lonely (Paris, Texas, Nomadland) make a place feel private and far from everything.',
      archi: 'Countryside villas, desert lodges, cliff houses, gated estates. Show distance: the long drive, the empty horizon, no neighbors, one figure.',
      why: 'Distance and emptiness signal exclusivity and safety. A single figure lets the viewer imagine being alone at last. Loneliness, reframed as privacy.',
      recipe: { size: ['ews', 'ws', 'ots'], angle: ['bird', 'eye'], lens: ['l-tele', 'l-wide'], move: ['d-establish', 'd-pullback', 'static', 'crane'], comp: ['negative', 'horizon', 'scale'], light: ['golden', 'morning', 'blue'], speed: ['fps-slow', 'timelapse'], trans: ['dissolve', 'dip'], sound: ['s-ambience', 's-silence'], color: ['c-moody', 'c-natural'], human: ['h-silhouette', 'h-back'] },
      pace: '5–9 s per shot', music: 'Sparse ambient, 50–70 BPM, nature sounds forward',
      spaces: ['context', 'view', 'terrace', 'pool'],
      avoid: 'Neighbors in frame (unless honest context needs them), city noise, fast cuts.',
      seq: [
        S('Alone in the landscape', 'context', 'ews', 'bird', 24, 'static', 'golden', 7, 'dissolve', 'Distance equals privacy.'),
        S('Silhouette at the window', 'bedroom', 'ms', 'chest', 35, 'static', 'golden', 6, 'dissolve', 'One person, a whole view to themselves.', { talent: 'Silhouette' }),
        S('Pull away at blue hour', 'facade', 'ws', 'bird', 24, 'rise', 'blue', 8, 'dip', 'Leaving the house to its landscape.'),
      ],
    },
    {
      id: 'energy', name: 'Energy', tag: 'Urban pulse · vibrancy', voice: '“Everything happens here.”', pv: 'dr-hyperlapse',
      film: 'Fast cutting, whip pans and speed ramps drive energy in music videos and action (Baby Driver, 300).',
      archi: 'City apartments, neighborhoods, nightlife, rooftops, commercial buildings. Hyperlapses, cuts on the beat, centered framing for fast reading.',
      why: 'Cut frequency and motion raise arousal; rhythm synchronized with music is satisfying.',
      recipe: { size: ['ws', 'cu', 'insert'], angle: ['eye', 'top', 'dutch'], lens: ['l-wide', 'l-ultra'], move: ['whip', 'speedramp', 'hyperlapse', 'd-hyperlapse', 'handheld'], comp: ['center', 'diagonal'], light: ['night', 'noon'], speed: ['speedramp', 'hyperlapse', 'timelapse'], trans: ['beatcut', 'whip-t', 'ramp-t', 'smash', 'spin'], sound: ['s-music', 's-sfx'], format: ['f-916'] },
      pace: '1–2.5 s per shot', music: '115–128 BPM',
      spaces: ['street', 'context', 'view', 'amenity'],
      avoid: 'Using it for calm luxury villas; seasick camera work.',
      seq: [
        S('Street hyperlapse', 'street', 'ws', 'eye', 24, 'hyperlapse', 'day', 2.5, 'beat', 'The neighborhood in fast forward.'),
        S('Whip into the living', 'living', 'ws', 'chest', 20, 'whip', 'day', 2, 'whip', 'Momentum between spaces.'),
        S('City lights from the terrace', 'view', 'ws', 'eye', 24, 'speedramp', 'night', 3, 'smash', 'The payoff: the city is yours.'),
      ],
    },
    {
      id: 'heritage', name: 'Soul & heritage', tag: 'Timelessness · tradition', voice: '“This place has a story.”', pv: 'comp-lightshadow',
      film: 'Period films use static compositions, doorways, natural light and warm grain to slow time down (Barry Lyndon’s candlelight).',
      archi: 'Riads, kasbahs, restored farmhouses, historic apartments. Arches, courtyards, zellige, light beams, fountains, lanterns.',
      why: 'Framing and slowness signal permanence; natural light and texture signal authenticity.',
      recipe: { size: ['ws', 'cu', 'ecu'], angle: ['eye', 'worm', 'top'], lens: ['l-35', 'l-50', 'l-macro'], move: ['static', 'tiltreveal', 'pushthrough'], comp: ['framing', 'symmetry', 'pattern', 'lightshadow'], light: ['golden', 'motivated', 'haze'], speed: ['timelapse', 'fps-slow'], trans: ['dissolve', 'mask'], sound: ['s-ambience', 's-vo'], color: ['c-film', 'c-warm'] },
      pace: '5–8 s per shot', music: 'Traditional instruments or strings, 60–90 BPM',
      spaces: ['courtyard', 'entrance', 'detail', 'rooftop'],
      avoid: 'Speed ramps and glitch transitions, oversaturated grades.',
      seq: [
        S('Through the arch', 'courtyard', 'ws', 'eye', 24, 'static', 'golden', 6, 'dissolve', 'The frame of tradition.'),
        S('Shadow patterns move', 'courtyard', 'ms', 'eye', 35, 'timelapse', 'golden', 5, 'dissolve', 'Time written in light.'),
        S('Zellige by hand', 'detail', 'ecu', 'chest', 100, 'truck', 'any', 3, 'cut', 'Centuries of craft in one tile.'),
      ],
    },
    {
      id: 'design', name: 'Design intent', tag: 'The architect’s eye', voice: '“Every line was decided.”', pv: 'comp-symmetry',
      film: 'Kubrick’s one-point perspective and Kogonada’s Columbus treat buildings as compositions of lines and planes.',
      archi: 'Architect portfolios and awards: level cameras, symmetry, graphic top-downs, slow linear moves that reveal structure, plan-to-reality transitions.',
      why: 'Order and precision communicate intention: the viewer reads the building the way the architect drew it.',
      recipe: { size: ['ws', 'ms', 'ecu'], angle: ['eye', 'top', 'worm'], lens: ['l-ts', 'l-wide', 'l-85'], move: ['static', 'truck', 'pedestal', 'd-topdown'], comp: ['symmetry', 'verticals', 'pattern', 'depth', 'diagonal'], light: ['overcast', 'lightshadow'], speed: ['fps-cine', 'timelapse'], trans: ['matchcut', 'plan2real', 'cut'], sound: ['s-ambience', 's-vo'], color: ['c-natural'] },
      pace: '5–8 s per shot', music: 'Minimal, 70–100 BPM',
      spaces: ['facade', 'stairs', 'courtyard', 'context'],
      avoid: 'Leaning verticals, lifestyle clutter, heavy warm grades that hide materials.',
      seq: [
        S('Enfilade on axis', 'living', 'ws', 'chest', 20, 'static', 'day', 6, 'cut', 'One-point perspective: the plan made visible.'),
        S('Plan view', 'context', 'ws', 'top', 24, 'topdown', 'day', 6, 'plan', 'The drawing and the building.'),
        S('Stair as a diagonal', 'stairs', 'mws', 'chest', 20, 'pedestal', 'day', 5, 'matchcut', 'Structure as composition.'),
      ],
    },
    {
      id: 'clarity', name: 'Clarity', tag: 'Honest scale · trust', voice: '“I understand exactly what I’m buying.”', pv: 'comp-two-point',
      film: 'Documentaries earn trust with steady wides, natural perspective and no tricks.',
      archi: 'Listing films that must inform: corner wides at 18–24 mm, consistent height, floor plans, drone plot views, true color.',
      why: 'When the visit matches the film, trust grows and so does the agent’s reputation. Disappointment at the visit kills deals.',
      recipe: { size: ['ws', 'mws'], angle: ['chest', 'eye', 'bird'], lens: ['l-wide', 'l-35'], move: ['static', 'pan', 'walkthrough'], comp: ['twopoint', 'verticals', 'depth'], light: ['overcast', 'noon', 'windows'], speed: ['fps-cine'], trans: ['cut', 'plan2real'], sound: ['s-vo'], color: ['c-natural', 'c-match'], rule: ['r-honesty'] },
      pace: '3–5 s per shot', music: 'Neutral and unobtrusive',
      spaces: ['living', 'kitchen', 'bedroom', 'context'],
      avoid: 'Ultra-wide lenses, heavy grades, sky replacement, hiding defects.',
      seq: [
        S('Living from the corner', 'living', 'ws', 'chest', 20, 'static', 'day', 4, 'cut', 'The whole room, true proportions.'),
        S('Kitchen layout', 'kitchen', 'ws', 'chest', 20, 'pan', 'day', 4, 'cut', 'How it works and connects.'),
        S('The plot from above', 'context', 'ws', 'top', 24, 'topdown', 'day', 5, 'plan', 'Exactly what is included.'),
      ],
    },
    {
      id: 'welcome', name: 'Welcome', tag: 'Hospitality · warmth', voice: '“They were expecting me.”', pv: 'li-practicals',
      film: 'Warm practical light and a gentle point of view make audiences feel invited in (the warm palette of Her).',
      archi: 'Airbnb and hotels: door opening, warm lamps, bed turn-down, welcome tray, towels, coffee, the host’s gestures. Show the experience, not just the room.',
      why: 'Warmth and hands-on details signal care and service, which drive bookings and reviews.',
      recipe: { size: ['pov', 'ms', 'insert'], angle: ['chest'], lens: ['l-35', 'l-50'], move: ['pushin', 'static'], comp: ['center', 'framing'], light: ['practicals', 'golden'], speed: ['fps-slow'], trans: ['matchaction', 'lightleak', 'cut'], sound: ['s-foley', 's-ambience'], color: ['c-warm'], human: ['h-hands', 'h-presenter'] },
      pace: '2–4 s per shot', music: 'Friendly acoustic, 90–110 BPM',
      spaces: ['entrance', 'bedroom', 'bathroom', 'kitchen'],
      avoid: 'Empty cold rooms, overhead lights only, unmade beds.',
      seq: [
        S('The door opens for you', 'entrance', 'pov', 'eye', 24, 'pushin', 'golden', 4, 'matchaction', 'Arrival from the guest’s eyes.', { talent: 'Hands only' }),
        S('Lamps on, bed ready', 'bedroom', 'ms', 'chest', 35, 'pushin', 'blue', 4, 'cut', 'Warm light, prepared for the night.'),
        S('Coffee is ready', 'kitchen', 'insert', 'chest', 50, 'static', 'dawn', 3, 'cut', 'Small attentions make big reviews.'),
      ],
    },
  ];
  VAO.FEELMAP = {};
  VAO.FEELINGS.forEach(function (f) { VAO.FEELMAP[f.id] = f; });
})();
