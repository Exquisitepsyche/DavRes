/* VAO Shotbook · Option lists used by the storyboard editor.
 * Each row: [value, label, short code, library id]
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});

  VAO.OPT = {
    size: [
      ['ews', 'Extreme wide', 'EWS', 'ews'], ['ws', 'Wide', 'WS', 'ws'], ['mws', 'Medium wide', 'MWS', 'mws'],
      ['ms', 'Medium', 'MS', 'ms'], ['cu', 'Close-up', 'CU', 'cu'], ['ecu', 'Extreme close-up', 'ECU', 'ecu'],
      ['insert', 'Insert', 'INS', 'insert'], ['pov', 'Point of view', 'POV', 'pov'], ['ots', 'Over the shoulder', 'OTS', 'ots'],
    ],
    angle: [
      ['eye', 'Eye level', 'EYE', 'eye'], ['chest', 'Chest height', 'CHEST', 'chest'], ['low', 'Low angle', 'LOW', 'low'],
      ['worm', 'Worm’s-eye', 'WORM', 'worm'], ['high', 'High angle', 'HIGH', 'high'], ['bird', 'Drone oblique', 'DRONE', 'bird'],
      ['top', 'Top-down', 'TOP', 'top'], ['dutch', 'Dutch tilt', 'DUTCH', 'dutch'],
    ],
    move: [
      ['static', 'Static / lock-off', 'STATIC', 'static'], ['pushin', 'Push-in', 'PUSH IN', 'pushin'], ['pullout', 'Pull-out', 'PULL OUT', 'pullout'],
      ['truck', 'Truck / slide', 'SLIDE', 'truck'], ['pan', 'Pan', 'PAN', 'pan'], ['tilt', 'Tilt', 'TILT', 'tilt'],
      ['pedestal', 'Pedestal', 'PED', 'pedestal'], ['crane', 'Crane / jib', 'CRANE', 'crane'], ['arc', 'Arc', 'ARC', 'arc'],
      ['track', 'Tracking', 'TRACK', 'track'], ['walkthrough', 'Gimbal walkthrough', 'WALK', 'walkthrough'], ['reveal', 'Foreground reveal', 'REVEAL', 'reveal'],
      ['pushthrough', 'Push-through', 'THROUGH', 'pushthrough'], ['zoom', 'Slow zoom', 'ZOOM', 'zoom'], ['dollyzoom', 'Dolly zoom', 'VERTIGO', 'dollyzoom'],
      ['whip', 'Whip pan', 'WHIP', 'whip'], ['handheld', 'Handheld', 'HAND', 'handheld'], ['speedramp', 'Speed ramp', 'RAMP', 'speedramp'],
      ['rise', 'Drone rise / pull-back', 'RISE', 'd-reveal'], ['orbit', 'Drone orbit', 'ORBIT', 'd-orbit'], ['topdown', 'Drone top-down', 'TOP', 'd-topdown'],
      ['flyover', 'Drone fly-over', 'FLY', 'd-flyover'], ['timelapse', 'Timelapse', 'TL', 'timelapse'], ['hyperlapse', 'Hyperlapse', 'HL', 'hyperlapse'],
    ],
    light: [
      ['dawn', 'Sunrise & morning', 'AM', 'morning'], ['day', 'Midday', 'DAY', 'noon'], ['overcast', 'Overcast', 'SOFT', 'overcast'],
      ['golden', 'Golden hour', 'GOLD', 'golden'], ['blue', 'Blue hour', 'BLUE', 'blue'], ['night', 'Night', 'NIGHT', 'night'],
      ['any', 'Interior · any time', 'INT', 'practicals'],
    ],
    speed: [
      ['rt', 'Real time 24/25p', '25P', 'fps-cine'], ['slow', 'Slow 50/60p', '50P', 'fps-slow'], ['high', 'High speed 100/120p', '100P', 'fps-high'],
      ['tl', 'Timelapse', 'TL', 'timelapse'], ['hl', 'Hyperlapse', 'HL', 'hyperlapse'], ['ramp', 'Speed ramp', 'RAMP', 'speedramp'],
    ],
    trans: [
      ['cut', 'Cut', 'CUT', 'cut'], ['matchcut', 'Match cut', 'MATCH', 'matchcut'], ['matchaction', 'Match on action', 'ACTION', 'matchaction'],
      ['jcut', 'J-cut / L-cut', 'J-CUT', 'jlcut'], ['dissolve', 'Dissolve', 'DISSOLVE', 'dissolve'], ['dip', 'Dip to black', 'DIP', 'dip'],
      ['whip', 'Whip pan', 'WHIP', 'whip-t'], ['wipe', 'Foreground wipe', 'WIPE', 'wipe'], ['push', 'Push-through', 'PUSH', 'push-t'],
      ['mask', 'Door / wall mask', 'MASK', 'mask'], ['ramp', 'Speed-ramp cut', 'RAMP', 'ramp-t'], ['daynight', 'Day to night', 'D→N', 'daynight'],
      ['beforeafter', 'Before / after', 'B/A', 'beforeafter'], ['plan', 'Plan to reality', 'PLAN', 'plan2real'], ['seamless', 'Invisible cut', 'SEAMLESS', 'seamless'],
      ['beat', 'Cut on the beat', 'BEAT', 'beatcut'], ['smash', 'Smash cut', 'SMASH', 'smash'], ['spin', 'Spin', 'SPIN', 'spin'],
      ['flash', 'Light leak', 'FLASH', 'lightleak'], ['split', 'Split screen', 'SPLIT', 'split'], ['end', 'End card', 'END', null],
    ],
    format: [['16:9', 16 / 9], ['9:16', 9 / 16], ['4:5', 4 / 5], ['1:1', 1], ['2.39:1', 2.39]],
    lens: [12, 14, 16, 18, 20, 24, 28, 35, 50, 70, 85, 100, 135, 200],
    types: ['Villa', 'House', 'Apartment', 'Penthouse', 'Riad', 'Hotel / Airbnb', 'Architecture', 'New build', 'Land', 'Commercial'],
  };

  VAO.opt = function (kind, value) {
    var list = VAO.OPT[kind] || [];
    for (var i = 0; i < list.length; i++) if (list[i][0] === value) return list[i];
    return null;
  };
  VAO.aspectOf = function (fmt) {
    var f = VAO.OPT.format.filter(function (r) { return r[0] === fmt; })[0];
    return f ? f[1] : 16 / 9;
  };
})();
