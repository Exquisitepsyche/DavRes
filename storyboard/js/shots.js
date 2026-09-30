/* VAO Shotbook · Camera presets on the previs villa + a generator that turns
 * any storyboard shot (space, size, angle, lens, movement, light) into a
 * previs spec. Coordinates are metres; see previs.js for the site plan.
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});

  // Repeated views
  var HERO = { pos: [0, 1.6, 24], target: [-1, 3.0, 3], focal: 24 };
  var CORNER = { pos: [22, 1.6, 22], target: [0, 2.5, 3], focal: 24 };
  var LIVING = { pos: [8.5, 1.3, 4.5], target: [2, 1.2, -3], focal: 18 };
  function v(o, extra) { return Object.assign({}, o, extra || {}); }

  var PV = {
    /* Shot sizes */
    'size-ews': { pos: [95, 55, 140], target: [0, 0, 0], focal: 24, tod: 'golden' },
    'size-ws': v(HERO, { tod: 'golden' }),
    'size-mws': { pos: [6.5, 1.5, 16.5], target: [5, 2.4, 4], focal: 24, tod: 'golden', person: { at: [6.2, 7.4], face: 180 } },
    'size-ms': { pos: [-0.3, 1.35, 3.9], target: [-1.9, 0.9, 1.0], focal: 35, tod: 'golden' },
    'size-cu': { pos: [-5.35, 4.55, 2.3], target: [-4.45, 4.42, 1.35], focal: 50, tod: 'blue' },
    'size-ecu': { pos: [-7.05, 1.02, -0.8], target: [-7.6, 0.9, -1.25], focal: 100, tod: 'noon' },
    'size-insert': { pos: [-6.3, 1.32, -3.7], target: [-7.1, 1.12, -5.0], focal: 50, tod: 'noon' },
    'size-pov': { pos: [5.9, 1.6, 3.4], target: [5.4, 1.0, 14], focal: 20, tod: 'golden' },
    'size-ots': { pos: [1.7, 1.78, 4.9], target: [4.6, 1.1, 22], focal: 35, tod: 'golden', person: { at: [3.2, 7.7], face: 0 } },

    /* Angles and heights */
    'ang-eye': v(CORNER, { tod: 'golden' }),
    'ang-chest': v(LIVING, { tod: 'noon' }),
    'ang-low': { pos: [5, 0.3, 11], target: [5, 5, 4], focal: 16, tod: 'golden' },
    'ang-worm': { pos: [7.4, 0.12, 8.2], target: [6.5, 9, 2.5], focal: 14, tod: 'golden' },
    'ang-high': { pos: [20, 14, 26], target: [0, 0, 5], focal: 24, tod: 'golden' },
    'ang-top': { pos: [-1, 62, 4], target: [-1, 0, 4.01], focal: 24, tod: 'noon' },
    'ang-dutch': { pos: [18, 1.6, 20], target: [0, 3, 3], focal: 24, roll: 14, tod: 'golden' },
    'ang-bird': { pos: [45, 32, 55], target: [0, 1, 3], focal: 24, tod: 'golden' },

    /* Composition */
    'comp-thirds': { pos: [-15, 1.6, 20.5], target: [-3.5, 3.4, 3], focal: 24, tod: 'golden' },
    'comp-symmetry': { pos: [8.6, 1.5, 0.6], target: [-11, 1.5, 0.6], focal: 20, tod: 'noon' },
    'comp-two-point': { pos: [24, 1.6, 22], target: [1, 3, 1], focal: 24, tod: 'golden' },
    'comp-leading': { pos: [-8.2, 0.35, 16.2], target: [3, 1.8, 8], focal: 18, tod: 'golden', reflect: 0.6 },
    'comp-frame': { pos: [-21, 1.5, 6.3], target: [0, 2.5, 5], focal: 20, tod: 'golden' },
    'comp-layers': { pos: [-17.2, 1.4, 17.5], target: [0, 2.5, 5], focal: 24, tod: 'golden' },
    'comp-negative': { pos: [30, 0.9, 62], target: [2, 14, 0], focal: 24, tod: 'blue' },
    'comp-diagonal': { pos: [8.7, 0.9, -1.4], target: [4, 2.3, -4.8], focal: 20, tod: 'noon' },
    'comp-golden': { pos: [-4.5, 1.25, 12.8], target: [-9.8, 0.7, 7.4], focal: 28, tod: 'golden', person: { at: [-9.0, 7.9], pose: 'sit', face: 180 } },
    'comp-pattern': { pos: [-18.5, 0.9, 3.2], target: [-18.4, 3.3, 3.9], focal: 16, tod: 'golden' },
    'comp-scale': { pos: [8.5, 1.2, 23], target: [5, 3.6, 5], focal: 35, tod: 'golden', person: { at: [6.2, 7.2], face: 180 } },
    'comp-reflection': { pos: [-1, 0.26, 15.25], target: [-1, 2.4, 5], focal: 16, tod: 'golden', reflect: 0.82 },
    'comp-lightshadow': { pos: [-16.2, 2.3, 6.7], target: [-18.6, 0.4, 2.8], focal: 24, tod: 'afternoon' },
    'comp-horizon': { pos: [0, 1.4, 26], target: [-1, 7.5, 3], focal: 24, tod: 'golden' },
    'comp-leadroom': { pos: [-10.5, 1.5, 15.3], target: [-3, 1.3, 7.3], focal: 35, tod: 'golden', person: { at: [-8.2, 7.4], face: 90 } },
    'comp-inout': { pos: [3.6, 1.4, -1.8], target: [7, 1.1, 12], focal: 20, tod: 'golden' },
    'comp-balance': { pos: [-20, 1.6, 20], target: [-4, 3.2, 4], focal: 24, tod: 'golden' },
    'comp-depth': { pos: [-10.6, 1.5, 0.6], target: [9, 1.5, 0.6], focal: 20, tod: 'noon' },
    'comp-center': { pos: [-2, 1.6, -12.5], target: [-2, 2.0, -5], focal: 28, tod: 'morning' },
    'rule-tilted': { pos: [5, 1.5, 14], target: [5, 6.2, 5], focal: 18, tod: 'golden' },
    'rule-level': { pos: [5, 1.5, 14], target: [5, 1.5, 5], focal: 18, shift: 0.36, tod: 'golden' },

    /* Camera movement */
    'mv-static': v(HERO, { tod: 'golden', dur: 8, ease: 'linear', person: { path: [[-10, 7.6], [8.5, 7.6]] } }),
    'mv-pan': { pos: [22, 1.6, 20], keys: [{ pos: [22, 1.6, 20], target: [-18, 2, 3] }, { pos: [22, 1.6, 20], target: [6, 2.5, 3] }], focal: 24, tod: 'golden', dur: 7 },
    'mv-tilt': { keys: [{ pos: [5, 1.5, 12.5], target: [5, 0.9, 5] }, { pos: [5, 1.5, 12.5], target: [5, 7.6, 5] }], focal: 20, tod: 'golden', dur: 6 },
    'mv-pushin': { keys: [{ pos: [5, 1.6, 22], target: [5, 2.2, 0] }, { pos: [5, 1.6, 11.5], target: [5, 2.2, 0] }], focal: 24, tod: 'golden', dur: 7 },
    'mv-pullout': { keys: [{ pos: [6.9, 1.45, 3.4], target: [8.6, 1.3, 6.4] }, { pos: [2.6, 1.7, -3.2], target: [8.6, 1.3, 6.4] }], focal: 20, tod: 'golden', dur: 7 },
    'mv-zoom': { keys: [{ pos: [5, 1.6, 22], target: [5, 2.4, 0], focal: 24 }, { pos: [5, 1.6, 22], target: [5, 2.4, 0], focal: 52 }], tod: 'golden', dur: 6 },
    'mv-dollyzoom': { keys: [{ pos: [5, 1.6, 30], target: [5, 3, 5], focal: 70 }, { pos: [5, 1.6, 12], target: [5, 3, 5], focal: 70 }], dollyZoom: { subject: [5, 3, 5] }, tod: 'golden', dur: 6 },
    'mv-truck': { keys: [{ pos: [3, 1.4, 19.5], target: [1, 2.5, 5] }, { pos: [18, 1.4, 19.5], target: [16, 2.5, 5] }], focal: 24, tod: 'golden', dur: 8, ease: 'linear' },
    'mv-pedestal': { keys: [{ pos: [6, 0.45, 13], target: [6, 0.95, 5] }, { pos: [6, 5.6, 13], target: [6, 6.1, 5] }], focal: 20, tod: 'golden', dur: 6 },
    'mv-crane': { keys: [{ pos: [-11, 0.75, 28.5], target: [-8, 1.0, 12] }, { pos: [-11.5, 5.2, 31.5], target: [-4, 2.6, 5] }], focal: 24, tod: 'golden', dur: 7 },
    'mv-arc': { orbit: { center: [-1, 1.2, 10], target: [-1, 1.6, 7], radius: 13, height: 1.6, from: -38, to: 22, focal: 24 }, tod: 'golden', dur: 8 },
    'mv-track': { keys: [{ pos: [-11.5, 1.5, 15.3], target: [-10, 1.2, 7.3] }, { pos: [5.5, 1.5, 15.3], target: [7, 1.2, 7.3] }], focal: 28, tod: 'golden', dur: 8, ease: 'linear', person: { path: [[-10, 7.3], [7, 7.3]] } },
    'mv-walkthrough': {
      curve: 'spline', dur: 14, ease: 'linear', tod: 'golden', door: [0.06, 0.2], focal: 20,
      keys: [
        { t: 0, pos: [-2, 1.6, -12.5], target: [-2, 1.7, -5] },
        { t: 0.16, pos: [-2, 1.6, -7.4], target: [-2, 1.6, -3] },
        { t: 0.3, pos: [-2, 1.55, -4.3], target: [-1.4, 1.5, -2.9] },
        { t: 0.42, pos: [0.25, 1.5, -3.7], target: [1.3, 1.4, -1] },
        { t: 0.56, pos: [0.7, 1.5, -1.5], target: [4, 1.3, 3.5] },
        { t: 0.72, pos: [2.2, 1.5, 2.1], target: [7, 1.2, 8] },
        { t: 0.86, pos: [5.7, 1.5, 4.4], target: [6, 1.2, 12] },
        { t: 1, pos: [6, 1.55, 8.3], target: [4, 1.0, 22] },
      ],
    },
    'mv-reveal': { keys: [{ pos: [-12.9, 0.95, 10.4], target: [-2, 1.4, 8.8] }, { pos: [-12.9, 0.95, 13.9], target: [-2, 2.2, 6.5] }], focal: 24, tod: 'golden', dur: 6 },
    'mv-pushthrough': { keys: [{ pos: [6, 1.5, 12.5], target: [6, 1.4, -5] }, { pos: [6, 1.5, 0.8], target: [6, 1.2, -5] }], focal: 20, tod: 'golden', dur: 7 },
    'mv-handheld': { pos: [-1.2, 1.6, 3.8], target: [-1.9, 0.95, 1.0], focal: 28, tod: 'golden', handheld: 1.6, dur: 6, ease: 'linear' },
    'mv-whip': { keys: [{ t: 0, pos: [-0.5, 1.5, 3.2], target: [6, 1.2, 0] }, { t: 0.42, pos: [-0.5, 1.5, 3.2], target: [6, 1.2, 0] }, { t: 0.58, pos: [-0.5, 1.5, 3.2], target: [-8, 1.1, -1.8] }, { t: 1, pos: [-0.5, 1.5, 3.2], target: [-8, 1.1, -1.8] }], focal: 24, tod: 'noon', whip: [0.42, 0.58], ease: 'linear', dur: 5 },
    'mv-speedramp': { keys: [{ pos: [0, 1.6, 27], target: [-1, 2.6, 3] }, { pos: [0, 1.6, 12], target: [-1, 2.6, 3] }], focal: 24, tod: 'golden', ease: 'ramp', dur: 5 },
    'mv-tiltreveal': { keys: [{ pos: [2, 1.6, 24], target: [-1, 24, 3] }, { pos: [2, 1.6, 24], target: [-1, 3, 3] }], focal: 24, tod: 'golden', dur: 6 },

    /* Drone */
    'dr-establish': { keys: [{ pos: [120, 60, 180], target: [0, 0, 3] }, { pos: [48, 28, 70], target: [0, 1, 3] }], focal: 24, tod: 'golden', dur: 9 },
    'dr-reveal': { keys: [{ pos: [-1, 2, 44], target: [-1, 0, 37] }, { pos: [-1, 24, 58], target: [-1, 1, 4] }], focal: 24, tod: 'golden', dur: 8 },
    'dr-orbit': { orbit: { center: [-1, 0, 4], target: [-1, 2, 3], radius: 42, height: 22, from: -40, to: 40, focal: 24 }, tod: 'golden', dur: 10, ease: 'linear' },
    'dr-topdown': { keys: [{ pos: [-1, 95, 5], target: [-1, 0, 5.02], roll: 0 }, { pos: [-1, 34, 5], target: [-1, 0, 5.02], roll: 55 }], focal: 24, tod: 'noon', dur: 9 },
    'dr-pullback': { keys: [{ pos: [4, 3.4, 11.5], target: [3, 3, 2] }, { pos: [70, 45, 110], target: [0, 1, 3] }], focal: 24, tod: 'golden', dur: 9, ease: 'in' },
    'dr-flyover': { keys: [{ pos: [-1, 24, 55], target: [-1, 0, 14] }, { pos: [-1, 24, -45], target: [-1, 0, -26] }], focal: 24, tod: 'golden', dur: 9, ease: 'linear' },
    'dr-track': { keys: [{ pos: [-14, 9, -31], target: [-2, 1, -24] }, { pos: [-14, 9, -14], target: [-2, 1, -8] }], focal: 28, tod: 'morning', dur: 9, ease: 'linear', person: { path: [[-2, -24], [-2, -8]] } },
    'dr-fpv': {
      curve: 'spline', dur: 12, ease: 'linear', tod: 'golden', door: 'open', focal: 16,
      keys: [
        { t: 0, pos: [6, 3.5, 34], target: [6, 2, 20] },
        { t: 0.2, pos: [6, 1.6, 12], target: [6, 1.5, 0] },
        { t: 0.32, pos: [6, 1.6, 4], target: [6, 2.5, -4] },
        { t: 0.48, pos: [5.4, 4.8, -1], target: [2, 4, -4], roll: -12 },
        { t: 0.62, pos: [2, 2, -1.5], target: [-2, 1.5, -4], roll: 10 },
        { t: 0.76, pos: [-0.2, 1.6, -3.8], target: [-2, 1.6, -6], roll: -14 },
        { t: 0.86, pos: [-2, 1.7, -6.6], target: [-2, 3, -14], roll: 0 },
        { t: 1, pos: [-2, 16, -30], target: [-2, 2, -6], roll: 0 },
      ],
    },
    'dr-lowglide': { keys: [{ pos: [-1, 0.9, 31], target: [-1, 1.5, 5] }, { pos: [-1, 0.7, 15.6], target: [-1, 1.6, 5] }], focal: 20, tod: 'golden', dur: 7, reflect: 0.6 },
    'dr-boundary': { keys: [{ pos: [-30, 78, 40], target: [-30, 0, 40.02] }, { pos: [30, 78, -30], target: [30, 0, -29.98] }], focal: 24, tod: 'noon', dur: 9, ease: 'linear' },
    'dr-hyperlapse': { orbit: { center: [-1, 0, 4], target: [-1, 2, 3], radius: 40, height: 20, from: -70, to: 40, focal: 24 }, tod: 'golden', todTo: 'blue', hyper: true, dur: 8, ease: 'linear' },
    'dr-twilight': { orbit: { center: [-1, 0, 4], target: [-1, 2, 3], radius: 36, height: 16, from: -30, to: 30, focal: 24 }, tod: 'blue', dur: 10, ease: 'linear' },

    /* Speed & time */
    'sp-timelapse': { pos: [4, 1.6, 24], target: [-1, 3, 3], focal: 24, tod: 'golden', todTo: 'night', dur: 8, ease: 'linear' },
    'sp-hyperlapse': { keys: [{ pos: [-2, 1.6, -27], target: [-2, 1.9, -5] }, { pos: [-2, 1.6, -9.5], target: [-2, 2.1, -5] }], focal: 24, tod: 'morning', hyper: true, dur: 6, ease: 'linear' },

    /* Light & time of day (same corner view) */
    'li-morning': v(CORNER, { tod: 'morning' }),
    'li-noon': v(CORNER, { tod: 'noon' }),
    'li-overcast': v(CORNER, { tod: 'overcast' }),
    'li-golden': v(CORNER, { tod: 'golden' }),
    'li-blue': v(CORNER, { tod: 'blue' }),
    'li-night': v(CORNER, { tod: 'night' }),
    'li-practicals': v(LIVING, { tod: 'blue' }),
    'li-window': { pos: [3.4, 1.4, -2.2], target: [6.2, 1.3, 5], focal: 20, tod: 'noon' },
    'li-motivated': { pos: [-3.2, 4.8, 5.3], target: [-6.2, 4.2, 1.6], focal: 24, tod: 'night' },

    /* Human element */
    'hu-silhouette': { pos: [4.6, 1.5, -1.7], target: [6.3, 1.4, 6], focal: 24, tod: 'golden', person: { at: [6.1, 4.3], face: 0 } },
    'hu-back': { pos: [2.6, 1.6, 2.6], target: [4, 1.2, 14], focal: 24, tod: 'golden', dur: 6, ease: 'linear', person: { path: [[3, 4.1], [3.6, 8.8]] } },
    'hu-hands': { pos: [-1.8, 1.55, -6.3], target: [-1.6, 1.3, -5.1], focal: 24, tod: 'morning', door: [0.3, 0.9], dur: 5 },
    'hu-lifestyle': { pos: [-6.4, 1.2, 11.6], target: [-9.6, 0.75, 7.3], focal: 35, tod: 'golden', person: { at: [-9.0, 7.9], pose: 'sit', face: 180 } },
    'hu-lead': { keys: [{ pos: [6.3, 1.6, 10.6], target: [5.9, 1.3, 2] }, { pos: [5.9, 1.6, 4.4], target: [5.2, 1.2, -3] }], focal: 24, tod: 'golden', dur: 7, ease: 'linear', person: { path: [[6, 8.2], [5.6, 1.6]] } },

    /* Lenses: same position, different focal length */
    'lens-14': v(CORNER, { focal: 14, tod: 'golden' }),
    'lens-24': v(CORNER, { focal: 24, tod: 'golden' }),
    'lens-35': v(CORNER, { focal: 35, tod: 'golden' }),
    'lens-50': v(CORNER, { focal: 50, tod: 'golden' }),
    'lens-85': v(CORNER, { focal: 85, tod: 'golden' }),
    'lens-135': v(CORNER, { focal: 135, tod: 'golden' }),
    'lens-comp-24': { pos: [5, 1.6, 13.3], target: [5, 1.5, 7.5], focal: 24, tod: 'golden', person: { at: [5, 7.5], face: 180 } },
    'lens-comp-85': { pos: [5, 1.6, 28.1], target: [5, 1.5, 7.5], focal: 85, tod: 'golden', person: { at: [5, 7.5], face: 180 } },
    'lens-ts': { pos: [5, 1.5, 14], target: [5, 1.5, 5], focal: 17, shift: 0.38, tod: 'golden' },

    /* Stills for transition demos */
    'tr-a': v(HERO, { tod: 'golden' }),
    'tr-b': v(LIVING, { tod: 'golden' }),
    'tr-match-a': { pos: [-7.3, 3.2, -1.5], target: [-7.3, 0, -1.49], focal: 50, tod: 'noon' },
    'tr-match-b': { pos: [5.3, 3.1, 1.1], target: [5.3, 0, 1.11], focal: 50, tod: 'noon' },
    'tr-door-in': { pos: [-2, 1.6, -3.15], target: [-2, 1.5, -5.1], focal: 20, tod: 'morning', door: [0, 0.7], dur: 4 },
    'tr-blue': v(HERO, { tod: 'blue' }),
    'tr-overcast': v(HERO, { tod: 'overcast' }),
    'tr-top': v({ pos: [-1, 62, 4], target: [-1, 0, 4.01], focal: 24 }, { tod: 'noon' }),
    'tr-drone': { pos: [45, 32, 55], target: [0, 1, 3], focal: 24, tod: 'blue' },

    /* Format */
    'fmt-vertical': { pos: [6.5, 1.5, 17], target: [5, 3.6, 4], focal: 24, tod: 'golden' },
    'sun-facade': { pos: [0, 1.6, 26], target: [-1, 3.2, 3], focal: 24, tod: 'golden' },
  };
  VAO.PV = PV;

  /* ------------------------------------------------------------------ */
  /* Options used by the storyboard                                        */
  /* ------------------------------------------------------------------ */
  // Where the camera looks for each kind of space. dir points from the subject
  // toward the camera; box = [xmin, xmax, zmin, zmax] limits interior positions.
  var SPACES = {
    context: { name: 'Location & context', sub: [-1, 1, 3], w: 90, dir: [0.55, 0.0, 1], ext: true },
    street: { name: 'Street & approach', sub: [-2, 1.6, -27], w: 14, dir: [0.35, 0, -1], ext: true },
    arrival: { name: 'Gate & driveway', sub: [-2, 1.7, -14], w: 12, dir: [0, 0, -1], ext: true, maxD: 12 },
    facade: { name: 'Facade', sub: [-1.5, 3.2, 5], w: 24, dir: [0.15, 0, 1], ext: true, maxD: 24 },
    entrance: { name: 'Entrance & threshold', sub: [-2, 1.7, -5.1], w: 6, dir: [0, 0, -1], ext: true, maxD: 7.4 },
    living: { name: 'Living room', sub: [5, 1.1, 0], w: 8, dir: [0.55, 0, 0.8], box: [1.3, 8.8, -3.7, 4.8], h: [0.3, 6.2], floor: 0.1 },
    kitchen: { name: 'Kitchen', sub: [-7.3, 1.0, -2.3], w: 6, dir: [0.55, 0, 0.85], box: [-10.8, 0.9, -4.3, 4.8], h: [0.3, 3.1], floor: 0.1 },
    dining: { name: 'Dining', sub: [-1.8, 0.9, 1.0], w: 4.6, dir: [-0.25, 0, 1], box: [-10.8, 0.9, -2.6, 4.8], h: [0.3, 3.1], floor: 0.1 },
    bedroom: { name: 'Bedroom', sub: [-6, 4.25, 2.0], w: 5, dir: [0.35, 0, 1], box: [-11.6, 0.6, 1.2, 5.8], h: [3.9, 6.4], floor: 3.7 },
    bathroom: { name: 'Bathroom', sub: [-10.2, 4.05, 5.0], w: 2.8, dir: [1, 0, -0.25], box: [-11.6, 0.6, 1.2, 5.8], h: [3.9, 6.4], floor: 3.7 },
    stairs: { name: 'Stairs & circulation', sub: [5.4, 1.9, -4.4], w: 6.5, dir: [0.35, 0, 1], box: [1.3, 8.8, -3.7, 4.8], h: [0.3, 6.2], floor: 0.1 },
    terrace: { name: 'Terrace & deck', sub: [-1, 0.6, 7.1], w: 12, dir: [0.3, 0, 1], ext: true },
    pool: { name: 'Pool', sub: [-1, 0.3, 12], w: 16, dir: [0.45, 0, 1], ext: true },
    garden: { name: 'Garden & pergola', sub: [-18.5, 1.4, 3], w: 10, dir: [0.8, 0, 0.6], ext: true },
    view: { name: 'The view', sub: [4, 1.2, 40], w: 60, dir: [-0.05, 0, -1], ext: true, fixed: [4, 1.6, 7.6] },
    detail: { name: 'Materials & details', sub: [-7.3, 0.9, -1.5], w: 1.2, dir: [0.25, 0.7, 1], box: [-10.8, 0.9, -4.3, 4.8], h: [0.2, 3.1], floor: 0.1 },
    courtyard: { name: 'Courtyard / patio', sub: [-18.5, 1.4, 3], w: 10, dir: [0.8, 0, 0.6], ext: true },
    rooftop: { name: 'Rooftop', sub: [4, 1.2, 40], w: 60, dir: [-0.05, 0, -1], ext: true, fixed: [2, 8.6, 5.5] },
    amenity: { name: 'Amenities (spa, gym, lobby)', sub: [-1, 0.3, 12], w: 16, dir: [0.45, 0, 1], ext: true },
  };
  VAO.SPACES = SPACES;

  var SIZE_MULT = { ews: 3.2, ws: 1.25, mws: 0.8, ms: 0.5, cu: 0.2, ecu: 0.08, insert: 0.12, pov: 1.0, ots: 1.0 };
  var LIGHT_TOD = { dawn: 'morning', day: 'noon', golden: 'golden', blue: 'blue', night: 'night', overcast: 'overcast', any: 'interior' };
  VAO.LIGHT_TOD = LIGHT_TOD;

  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

  // Clamp an interior camera position into its room box, moving toward the subject.
  function clampRoom(sp, pos) {
    if (!sp.box) return { pos: pos, limited: false };
    var b = sp.box, limited = false;
    var p = pos.slice();
    var s = sp.sub;
    for (var i = 0; i < 40; i++) {
      if (p[0] >= b[0] && p[0] <= b[1] && p[2] >= b[2] && p[2] <= b[3]) break;
      p = [p[0] + (s[0] - p[0]) * 0.08, p[1], p[2] + (s[2] - p[2]) * 0.08];
      limited = true;
    }
    if (sp.h) p[1] = Math.min(sp.h[1], Math.max(sp.h[0], p[1]));
    return { pos: p, limited: limited };
  }

  /* Build a previs spec from a storyboard shot. Returns {spec, note}. */
  VAO.shotSpec = function (shot, aspect) {
    aspect = aspect || 16 / 9;
    var sp = SPACES[shot.space] || SPACES.facade;
    var f = Number(shot.lens) || 24;
    var sizeKey = shot.size || 'ws';
    var mult = SIZE_MULT[sizeKey] || 1;
    var frameW = sp.w * mult;
    var d = (frameW * f) / 36;
    if (sp.maxD && d > sp.maxD && sizeKey !== 'ews') d = sp.maxD;
    var dir = norm(sp.dir);
    var angle = shot.angle || 'eye';
    var floor = sp.floor || 0;
    var sub = sp.sub.slice();
    var pos, target = sub.slice(), roll = 0, shift = 0;

    var eyeH = sp.ext ? 1.6 : 1.35;
    if (angle === 'chest') eyeH = 1.15;
    var flat = norm([dir[0], 0, dir[2]]);
    pos = add(sub, mul(flat, d));
    pos[1] = floor + eyeH;
    if (sp.fixed) { pos = sp.fixed.slice(); d = 30; }

    if (angle === 'low') { pos[1] = floor + 0.35; target[1] = sub[1] + frameW * 0.12; }
    if (angle === 'worm') { pos[1] = floor + 0.1; target[1] = sub[1] + frameW * 0.45; }
    if (angle === 'high') { pos = add(sub, mul(norm([flat[0], 0.6, flat[2]]), d)); }
    if (angle === 'bird') { pos = add(sub, mul(norm([flat[0], 0.85, flat[2]]), Math.max(d, 40))); }
    if (angle === 'top') { pos = [sub[0], sub[1] + Math.max(d, sp.ext ? 25 : 2.6), sub[2]]; target = [sub[0], sub[1], sub[2] + 0.02]; }
    if (angle === 'dutch') roll = 12;
    if (angle === 'eye' || angle === 'chest') {
      // keep verticals straight: level camera, frame with a little rise instead of tilting
      target[1] = pos[1];
      var need = (sub[1] - pos[1]) / Math.max(d, 0.5);
      // rise needed (in frame heights) to centre the subject without tilting
      var tanV = aspect >= 1 ? 18 / f / aspect : 18 / f;
      shift = Math.max(-0.45, Math.min(0.45, need / (2 * tanV)));
    }
    if (sizeKey === 'pov') { pos = add(sub, mul(flat, Math.min(d, 3.5))); pos[1] = floor + 1.6; target = [sub[0], floor + 1.3, sub[2]]; shift = 0; }

    var note = '';
    if (!sp.ext && angle !== 'top') {
      var c = clampRoom(sp, pos);
      if (c.limited) {
        var avail = Math.hypot(c.pos[0] - sub[0], c.pos[2] - sub[2]);
        var fNeed = Math.max(10, Math.floor((36 * avail) / frameW));
        note = 'Room too small for this framing at ' + f + 'mm: you can back up ' + avail.toFixed(1) + ' m. Go to ~' + fNeed + 'mm or choose a tighter size.';
      }
      pos = c.pos;
    }
    if (angle === 'top' && !sp.ext) {
      if (sp.h) pos[1] = sp.h[1];
    }

    var base = { pos: pos, target: target, focal: f, roll: roll, shift: shift };
    var spec = { tod: LIGHT_TOD[shot.light] || 'golden', dur: Math.max(2, Number(shot.duration) || 5) };
    if (shot.space === 'entrance' || shot.space === 'arrival') spec.door = 'open';
    var mv = shot.move || 'static';
    var right = [-flat[2], 0, flat[0]];
    var keys = null;
    var span = Math.max(0.6, frameW * 0.28);
    switch (mv) {
      case 'pushin':
      case 'walkthrough':
        keys = [v(base, { pos: add(pos, mul(flat, d * 0.35)) }), v(base, { pos: add(pos, mul(flat, -d * 0.18)) })];
        break;
      case 'pullout':
        keys = [v(base, { pos: add(pos, mul(flat, -d * 0.2)) }), v(base, { pos: add(pos, mul(flat, d * 0.35)) })];
        break;
      case 'pushthrough':
        keys = [v(base, { pos: add(pos, mul(flat, d * 0.3)) }), v(base, { pos: add(pos, mul(flat, -d * 0.85)) })];
        break;
      case 'truck':
      case 'track':
        keys = [v(base, { pos: add(pos, mul(right, -span)), target: add(target, mul(right, -span)) }), v(base, { pos: add(pos, mul(right, span)), target: add(target, mul(right, span)) })];
        if (mv === 'track') spec.person = { path: [[sub[0] - right[0] * span, sub[2] - right[2] * span], [sub[0] + right[0] * span, sub[2] + right[2] * span]] };
        break;
      case 'pan':
        keys = [v(base, { target: add(target, mul(right, -d * 0.35)) }), v(base, { target: add(target, mul(right, d * 0.35)) })];
        break;
      case 'tilt':
        keys = [v(base, { target: add(target, [0, -d * 0.15, 0]), shift: 0 }), v(base, { target: add(target, [0, d * 0.3, 0]), shift: 0 })];
        break;
      case 'pedestal':
        keys = [v(base, { pos: add(pos, [0, -Math.min(1, pos[1] - floor - 0.3), 0]), target: add(target, [0, -Math.min(1, pos[1] - floor - 0.3), 0]) }), v(base, { pos: add(pos, [0, 1.4, 0]), target: add(target, [0, 1.4, 0]) })];
        break;
      case 'crane':
      case 'rise':
        keys = [v(base, { pos: add(pos, [0, -Math.min(1.2, pos[1] - floor - 0.3), 0]), shift: 0 }), v(base, { pos: add(add(pos, [0, sp.ext ? 6 : 1.5, 0]), mul(flat, d * 0.2)), target: sub, shift: 0 })];
        break;
      case 'arc':
      case 'orbit':
        var r0 = Math.hypot(pos[0] - sub[0], pos[2] - sub[2]);
        var a0 = Math.atan2(pos[0] - sub[0], pos[2] - sub[2]) * 180 / Math.PI;
        spec.orbit = { center: sub, target: target, radius: r0, height: pos[1], from: a0 - 22, to: a0 + 22, focal: f };
        break;
      case 'zoom':
        keys = [v(base, { focal: f }), v(base, { focal: f * 1.7 })];
        break;
      case 'dollyzoom':
        keys = [v(base, { pos: add(pos, mul(flat, d * 0.8)), focal: f * 1.8 }), v(base, { pos: pos, focal: f * 1.8 })];
        spec.dollyZoom = { subject: sub };
        break;
      case 'reveal':
        keys = [v(base, { pos: add(pos, mul(right, -span * 1.3)), target: add(target, mul(right, -span * 0.4)) }), v(base, {})];
        break;
      case 'whip':
        keys = [v(base, { t: 0 }), v(base, { t: 0.42 }), v(base, { t: 0.58, target: add(target, mul(right, d * 1.4)) }), v(base, { t: 1, target: add(target, mul(right, d * 1.4)) })];
        spec.whip = [0.42, 0.58];
        spec.ease = 'linear';
        break;
      case 'handheld':
        spec.handheld = 1.4;
        break;
      case 'topdown':
        keys = [v(base, { pos: [sub[0], sub[1] + Math.max(60, d * 2), sub[2]], target: [sub[0], sub[1], sub[2] + 0.02], roll: 0 }), v(base, { pos: [sub[0], sub[1] + Math.max(30, d), sub[2]], target: [sub[0], sub[1], sub[2] + 0.02], roll: 45 })];
        break;
      case 'flyover':
        keys = [v(base, { pos: add(add(sub, [0, 22, 0]), mul(flat, 55)), target: add(sub, mul(flat, 20)) }), v(base, { pos: add(add(sub, [0, 22, 0]), mul(flat, -55)), target: add(sub, mul(flat, -90)) })];
        spec.ease = 'linear';
        break;
      case 'timelapse':
        spec.todTo = { morning: 'noon', noon: 'golden', golden: 'night', blue: 'night', night: 'night', overcast: 'golden' }[spec.tod];
        spec.ease = 'linear';
        break;
      case 'hyperlapse':
        keys = [v(base, { pos: add(pos, mul(flat, d * 0.6)) }), v(base, { pos: add(pos, mul(flat, -d * 0.2)) })];
        spec.hyper = true;
        spec.ease = 'linear';
        break;
      case 'speedramp':
        keys = [v(base, { pos: add(pos, mul(flat, d * 0.45)) }), v(base, { pos: add(pos, mul(flat, -d * 0.2)) })];
        spec.ease = 'ramp';
        break;
      default:
        break;
    }
    if (keys) spec.keys = keys;
    else if (!spec.orbit) Object.assign(spec, base);
    if (shot.talent && !spec.person) {
      var tp = add(sub, mul(right, frameW * 0.18));
      spec.person = { at: [tp[0], tp[2]], face: 180, y: floor };
    }
    return { spec: spec, note: note };
  };
})();
