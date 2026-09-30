/* VAO Shotbook · SVG diagrams, composition guides and storyboard notation.
 * Everything draws with currentColor (ink) and the .a class (accent) so it
 * follows the light and dark themes.
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});
  var W = 320, H = 180;
  var uid = 0;

  function svg(body, vb) {
    return '<svg class="dg" viewBox="' + (vb || '0 0 ' + W + ' ' + H) + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + body + '</svg>';
  }
  function r(x, y, w, h, cls, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="' + (cls || 'l') + '"' + (extra || '') + '/>'; }
  function l(x1, y1, x2, y2, cls, extra) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || 'l') + '"' + (extra || '') + '/>'; }
  function c(x, y, rr, cls, extra) { return '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" class="' + (cls || 'l') + '"' + (extra || '') + '/>'; }
  function p(d, cls, extra) { return '<path d="' + d + '" class="' + (cls || 'l') + '"' + (extra || '') + '/>'; }
  function t(x, y, s, cls, anchor) { return '<text x="' + x + '" y="' + y + '" class="' + (cls || 'tx') + '" text-anchor="' + (anchor || 'start') + '">' + s + '</text>'; }
  function arrowDefs(id) {
    return '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="af"/></marker></defs>';
  }
  function wave(x0, x1, yMid, amp, seed, step, fn) {
    var s = seed || 1, d = 'M' + x0 + ' ' + yMid;
    for (var x = x0; x <= x1; x += step || 2) {
      s = (s * 9301 + 49297) % 233280;
      var rnd = s / 233280;
      var a = fn ? fn(x) : 1;
      d += ' L' + x + ' ' + (yMid - (rnd - 0.5) * 2 * amp * a).toFixed(1);
    }
    return d;
  }

  // A small scene (foreground plant, subject, background window) for focus diagrams.
  function focusScene(blurFg, blurSubj, blurBg, id) {
    var f = function (v) { return v ? ' filter="url(#' + id + 'b' + v + ')"' : ''; };
    return '<defs>' +
      '<filter id="' + id + 'b1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
      '<filter id="' + id + 'b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>' +
      '</defs>' +
      '<g' + f(blurBg) + '>' + r(40, 20, 240, 110, 'fs') + l(160, 20, 160, 130) + l(40, 75, 280, 75, 'l m') +
      p('M40 110 Q100 70 160 100 T280 90 L280 130 L40 130 Z', 'f2') + '</g>' +
      '<g' + f(blurSubj) + '>' + p('M140 150 L145 105 Q160 92 175 105 L180 150 Z', 'fa') + r(120, 150, 80, 8, 'fi') + '</g>' +
      '<g' + f(blurFg) + '>' + p('M0 180 Q20 120 10 70 Q40 110 45 180 Z M20 180 Q45 110 70 95 Q55 140 60 180 Z', 'fi') + '</g>';
  }

  var D = {};
  D.jl = function () {
    var id = 'm' + (++uid);
    var s = arrowDefs(id);
    [['J-cut', 18, 118], ['L-cut', 100, 200]].forEach(function (row, i) {
      var y = 14 + i * 84;
      s += t(8, y + 8, row[0], 'tx b');
      s += t(8, y + 30, 'V', 'tx m') + r(28, y + 18, 130, 18, 'fs') + r(158, y + 18, 130, 18, 'f2');
      s += t(8, y + 58, 'A', 'tx m');
      if (i === 0) { s += r(28, y + 46, 92, 16, 'fs') + r(120, y + 46, 168, 16, 'fa'); }
      else { s += r(28, y + 46, 172, 16, 'fs') + r(200, y + 46, 88, 16, 'f2'); }
      s += l(158, y + 12, 158, y + 70, 'l a', ' stroke-dasharray="3 3"');
      s += t(62, y + 31, 'shot A', 'tx s') + t(198, y + 31, 'shot B', 'tx s');
      s += t(i === 0 ? 150 : 100, y + 58, i === 0 ? 'sound B leads' : 'sound A lingers', 'tx s' + (i === 0 ? ' w' : ''));
    });
    return svg(s);
  };
  D.beats = function () {
    var s = '', x0 = 20, x1 = 300, n = 16, step = (x1 - x0) / n;
    for (var i = 0; i <= n; i++) {
      var bar = i % 4 === 0;
      s += l(x0 + i * step, bar ? 50 : 58, x0 + i * step, 70, bar ? 'l' : 'l m');
      if (bar && i < n) s += t(x0 + i * step + 3, 46, 'bar ' + (i / 4 + 1), 'tx s m');
    }
    s += l(x0, 70, x1, 70);
    var blocks = [[0, 8, 'Wide · 2 bars'], [8, 12, 'Detail'], [12, 16, 'Move']];
    blocks.forEach(function (b, k) { s += r(x0 + b[0] * step + 2, 84, (b[1] - b[0]) * step - 4, 30, k === 0 ? 'fa' : 'fs') + t(x0 + b[0] * step + 8, 103, b[2], k === 0 ? 'tx s w' : 'tx s'); });
    s += t(20, 150, '120 BPM · 1 beat = 0.5 s · 1 bar = 2 s', 'tx');
    s += t(20, 168, 'Cut on downbeats; change pace every 8 bars', 'tx s m');
    return svg(s);
  };
  D.anamorphic = function () {
    var s = r(0, 0, W, 22, 'fi') + r(0, H - 22, W, 22, 'fi') + r(0, 22, W, H - 44, 'fs');
    [[60, 70, 9], [110, 95, 12], [230, 60, 8], [265, 110, 10], [80, 125, 7]].forEach(function (b) { s += '<ellipse cx="' + b[0] + '" cy="' + b[1] + '" rx="' + b[2] * 0.6 + '" ry="' + b[2] + '" class="l"/>'; });
    s += l(20, 92, 300, 92, 'l a', ' stroke-width="2.5" opacity=".75"') + c(160, 92, 5, 'fa');
    s += t(10, 16, '2.39 : 1', 'tx s w') + t(310, H - 7, 'oval bokeh · horizontal flare', 'tx s w', 'end');
    return svg(s);
  };
  D.fisheye = function () {
    var s = c(160, 90, 80, 'l');
    for (var i = -3; i <= 3; i++) {
      var k = i * 22;
      s += p('M' + (160 + k) + ' 12 Q' + (160 + k * 1.6) + ' 90 ' + (160 + k) + ' 168', 'l m');
      s += p('M82 ' + (90 + k) + ' Q160 ' + (90 + k * 1.6) + ' 238 ' + (90 + k), 'l m');
    }
    s += t(250, 30, 'straight lines curve', 'tx s');
    return svg(s);
  };
  D.sensors = function () {
    var s = '', k = 4.6, cx = 115, cy = 90;
    [['Full frame 36×24', 36, 24, '1.0×'], ['APS-C 23.5×15.6', 23.5, 15.6, '1.5×'], ['MFT 17.3×13', 17.3, 13, '2.0×'], ['1-inch 13.2×8.8', 13.2, 8.8, '2.7×'], ['Phone ≈ 9.8×7.3', 9.8, 7.3, '≈ 3.7×']].forEach(function (sz, i) {
      var w = sz[1] * k, h = sz[2] * k;
      s += r(cx - w / 2, cy - h / 2, w, h, i === 0 ? 'l a' : 'l');
      s += t(222, 36 + i * 26, sz[0], i === 0 ? 'tx s a' : 'tx s') + t(222, 48 + i * 26, 'crop ' + sz[3], 'tx s m');
    });
    return svg(s);
  };

  D['dof-deep'] = function () { return svg(focusScene(0, 0, 0, 'd' + (++uid)) + t(10, 172, 'f/8 · everything sharp', 'tx s w')); };
  D['dof-shallow'] = function () { return svg(focusScene(2, 0, 2, 'd' + (++uid)) + t(10, 172, 'f/1.8 · one plane sharp', 'tx s w')); };
  D['dof-rack'] = function () {
    var id = 'd' + (++uid);
    return svg('<g class="rackA">' + focusScene(0, 2, 2, id + 'a') + '</g><g class="rackB">' + focusScene(2, 1, 0, id + 'b') + '</g>' + t(10, 172, 'focus pulls from front to back', 'tx s w'));
  };
  D['dof-hyper'] = function () {
    var s = p('M20 90 l18 -12 v24 z', 'fi') + r(38, 80, 16, 20, 'fi');
    s += l(54, 90, 305, 90, 'l m');
    s += r(110, 76, 195, 28, 'fa', ' opacity=".35"');
    s += l(170, 70, 170, 110, 'l a') + t(170, 64, 'focus at H', 'tx s a', 'middle');
    s += t(110, 124, 'H/2', 'tx s', 'middle') + t(300, 124, '∞', 'tx', 'end');
    s += t(20, 160, 'H ≈ f² / (N × c) · 24 mm, f/8 ≈ 2.4 m', 'tx s');
    return svg(s);
  };
  D['dof-sweet'] = function () {
    var stops = ['1.4', '2', '2.8', '4', '5.6', '8', '11', '16', '22'];
    var vals = [0.45, 0.58, 0.72, 0.86, 0.97, 1, 0.9, 0.74, 0.58];
    var s = l(30, 140, 300, 140) + l(30, 20, 30, 140), d = '';
    vals.forEach(function (v, i) {
      var x = 40 + i * 31, y = 140 - v * 105;
      d += (i ? ' L' : 'M') + x + ' ' + y;
      s += t(x, 156, 'f/' + stops[i], 'tx s' + (i === 4 || i === 5 ? ' a' : ' m'), 'middle');
    });
    s += p(d, 'l a', ' stroke-width="2.5" fill="none"') + r(157, 28, 62, 112, 'fa', ' opacity=".12"');
    s += t(188, 22, 'sweet spot', 'tx s a', 'middle') + t(34, 16, 'sharpness', 'tx s m') + t(300, 176, 'diffraction →', 'tx s m', 'end');
    return svg(s);
  };
  D.kelvin = function () {
    var id = 'k' + (++uid);
    var s = '<defs><linearGradient id="' + id + '"><stop offset="0" stop-color="#ff8a2a"/><stop offset=".35" stop-color="#ffd6a0"/><stop offset=".55" stop-color="#fff6ea"/><stop offset=".8" stop-color="#d7e6ff"/><stop offset="1" stop-color="#8fb3ff"/></linearGradient></defs>';
    s += '<rect x="20" y="60" width="280" height="30" rx="2" fill="url(#' + id + ')"/>';
    [[1900, 'candle'], [2700, 'warm bulb'], [3200, 'tungsten'], [5600, 'daylight'], [6500, 'overcast'], [9000, 'blue sky']].forEach(function (k, i) {
      var x = 20 + ((k[0] - 1800) / (9500 - 1800)) * 280;
      s += l(x, 54, x, 96, 'l') + t(x, i % 2 ? 114 : 48, k[0] + 'K', 'tx s', 'middle') + t(x, i % 2 ? 126 : 36, k[1], 'tx s m', 'middle');
    });
    s += t(20, 160, 'Lock white balance per space; match bulbs (2700–3000 K)', 'tx s');
    return svg(s);
  };
  D.haze = function () {
    var s = r(0, 0, W, H, 'fi') + r(200, 20, 90, 70, 'fs');
    s += p('M200 20 L290 20 L150 180 L20 180 Z', 'fa', ' opacity=".18"') + p('M230 20 L260 20 L120 180 L70 180 Z', 'fs', ' opacity=".25"');
    s += t(12, 20, 'haze makes light visible', 'tx s w');
    return svg(s);
  };
  function strip(y, n, span, label, accentEvery) {
    var s = r(20, y, span, 22, 'fs'), step = span / n;
    for (var i = 0; i < n; i++) s += r(20 + i * step + 1, y + 4, Math.max(1, step - 2), 14, accentEvery && i % accentEvery === 0 ? 'fa' : 'f2');
    return s + t(20, y - 5, label, 'tx s');
  }
  D.fps = function () { return svg(strip(40, 25, 280, '25 frames in 1 second (25p)') + strip(110, 24, 268.8, '24 frames (24p) · shutter 1/48–1/50') + t(20, 170, 'The film look: 24/25 fps with natural motion blur', 'tx s m')); };
  D['fps-slow'] = function () { return svg(strip(34, 50, 280, 'Captured: 50 frames in 1 s (50p)', 2) + strip(104, 25, 280, 'Played at 25p: those 50 frames last 2 s', 1) + t(20, 168, '50p → 25p = 50% · 60p → 24p = 40%', 'tx s')); };
  D['fps-high'] = function () { return svg(strip(34, 60, 280, 'Captured: 120 frames in 1 s', 5) + strip(104, 24, 280, 'Played at 24p: 5 seconds of motion', 1) + t(20, 168, '120p → 24p = 20% · 100p → 25p = 25%', 'tx s')); };
  D.shutter = function () {
    var s = c(70, 90, 50, 'l') + p('M70 90 L70 40 A50 50 0 0 1 70 140 Z', 'fa', ' opacity=".85"');
    s += t(70, 162, '180° open', 'tx s', 'middle');
    s += t(150, 42, '1/50 at 25p', 'tx s a') + r(150, 50, 110, 14, 'fa', ' opacity=".35"') + c(260, 57, 7, 'fa');
    s += t(150, 96, '1/1000 at 25p', 'tx s m');
    for (var i = 0; i < 5; i++) s += c(160 + i * 25, 111, 6, 'fi');
    s += t(150, 140, 'natural blur vs stutter', 'tx s');
    return svg(s);
  };
  D.flicker = function () {
    var s = '', d = 'M20 60';
    for (var x = 20; x <= 300; x += 2) d += ' L' + x + ' ' + (60 - Math.abs(Math.sin((x - 20) / 280 * Math.PI * 8)) * 34).toFixed(1);
    s += p(d, 'l', ' fill="none"') + t(20, 14, '50 Hz mains: light pulses 100× per second', 'tx s');
    for (var i = 0; i < 4; i++) s += r(20 + i * 70, 72, 35, 12, 'fa');
    s += t(20, 102, '1/100 · each frame sees one full pulse: steady', 'tx s a');
    for (i = 0; i < 4; i++) s += r(20 + i * 70 + i * 9, 116, 29, 12, 'f2');
    s += t(20, 146, '1/120 · frames catch different parts: flicker', 'tx s m');
    s += t(20, 172, '50 Hz → 1/50, 1/100 · 60 Hz → 1/60, 1/120', 'tx s');
    return svg(s);
  };
  D.nd = function () {
    var s = '';
    [['ND2', 1], ['ND4', 2], ['ND8', 3], ['ND16', 4], ['ND32', 5], ['ND64', 6], ['ND1000', 10]].forEach(function (n, i) {
      var op = Math.min(0.95, n[1] * 0.1 + 0.05);
      s += r(18 + i * 42, 50, 36, 50, 'fi', ' opacity="' + op.toFixed(2) + '"') + t(36 + i * 42, 118, n[0], 'tx s', 'middle') + t(36 + i * 42, 132, n[1] + ' st', 'tx s m', 'middle');
    });
    s += t(18, 30, 'Stops = log₂(metered shutter ÷ target shutter)', 'tx s');
    s += t(18, 162, 'Sun at 1/800 → want 1/50 → 4 stops → ND16', 'tx s a');
    return svg(s);
  };
  D.reverse = function () {
    var id = 'm' + (++uid);
    var s = arrowDefs(id);
    s += r(30, 40, 110, 62, 'fs') + r(58, 56, 54, 30, 'l') + l(40, 50, 58, 56, 'l', ' marker-end="url(#' + id + ')"') + l(130, 50, 112, 56, 'l', ' marker-end="url(#' + id + ')"');
    s += t(85, 118, 'shot: push-in', 'tx s', 'middle');
    s += r(180, 40, 110, 62, 'fs') + r(208, 56, 54, 30, 'l') + l(208, 56, 190, 50, 'l a', ' marker-end="url(#' + id + ')"') + l(262, 56, 280, 50, 'l a', ' marker-end="url(#' + id + ')"');
    s += t(235, 118, 'played backward: pull-out', 'tx s a', 'middle');
    s += t(30, 160, 'No people walking, water or smoke in frame', 'tx s m');
    return svg(s);
  };
  function aspectBox(ar, cls) {
    var mh = 150, mw = 290, w, h;
    if (ar >= mw / mh) { w = mw; h = mw / ar; } else { h = mh; w = mh * ar; }
    return { x: (W - w) / 2, y: (H - h) / 2, w: w, h: h, svg: r((W - w) / 2, (H - h) / 2, w, h, cls || 'l') };
  }
  function arDiagram(ar, label, others) {
    var s = '';
    (others || []).forEach(function (o) { s += aspectBox(o, 'l m').svg.replace('/>', ' stroke-dasharray="3 3"/>'); });
    var b = aspectBox(ar, 'l a');
    s += b.svg.replace('class="l a"', 'class="l a" stroke-width="2"') + t(b.x + 6, b.y + 16, label, 'tx s a');
    return svg(s);
  }
  D['ar-169'] = function () { return arDiagram(16 / 9, '16:9 · 3840×2160', [9 / 16, 1]); };
  D['ar-45'] = function () { return arDiagram(4 / 5, '4:5 · 1080×1350', [16 / 9, 1]); };
  D['ar-11'] = function () { return arDiagram(1, '1:1', [16 / 9, 4 / 5]); };
  D['ar-239'] = function () { return arDiagram(2.39, '2.39:1 · 3840×1608', [16 / 9]); };
  D.safe = function () {
    var b = aspectBox(9 / 16, 'l a');
    var s = b.svg;
    s += r(b.x, b.y, b.w, b.h * 0.14, 'fa', ' opacity=".25"') + r(b.x, b.y + b.h * 0.65, b.w, b.h * 0.35, 'fa', ' opacity=".25"');
    s += r(b.x, b.y, b.w * 0.06, b.h, 'fa', ' opacity=".18"') + r(b.x + b.w * 0.94, b.y, b.w * 0.06, b.h, 'fa', ' opacity=".18"');
    s += t(b.x + b.w + 10, b.y + 12, 'top ≈ 14%: name, audio', 'tx s') + t(b.x + b.w + 10, b.y + b.h * 0.8, 'bottom ≈ 35%: caption, CTA', 'tx s') + t(b.x + b.w + 10, b.y + b.h * 0.4, 'keep subjects and text here', 'tx s a');
    return svg(s);
  };
  D.dual = function () {
    var b = aspectBox(16 / 9, 'l');
    var vw = b.h * 9 / 16;
    var s = b.svg + r(b.x + (b.w - vw) / 2, b.y, vw, b.h, 'fa', ' opacity=".22"') + r(b.x + (b.w - vw) / 2, b.y, vw, b.h, 'l a');
    s += t(b.x + 8, b.y + 16, '16:9 master', 'tx s') + t(160, b.y + b.h - 10, '9:16 safe center', 'tx s a', 'middle');
    return svg(s);
  };
  D.length = function () {
    var s = l(20, 150, 300, 150) , max = 240, k = 280 / max;
    [0, 30, 60, 120, 180, 240].forEach(function (v) { s += l(20 + v * k, 146, 20 + v * k, 154) + t(20 + v * k, 168, v + 's', 'tx s m', 'middle'); });
    [['Reel', 15, 45, 30], ['Listing film', 60, 120, 70], ['Brand film', 120, 240, 110]].forEach(function (row, i) {
      s += r(20 + row[1] * k, row[3], (row[2] - row[1]) * k, 22, i === 0 ? 'fa' : 'fs') + t(20 + row[1] * k + 4, row[3] - 5, row[0] + ' ' + row[1] + '–' + row[2] + ' s', 'tx s');
    });
    return svg(s);
  };
  D['wave-amb'] = function () {
    return svg(p(wave(20, 300, 90, 12, 3, 2), 'l', ' fill="none"') + t(20, 30, 'room tone · birds · fountain · sea', 'tx s') + t(20, 160, 'Continuous, low, everywhere: it gives the room its size', 'tx s m'));
  };
  D['wave-foley'] = function () {
    var s = l(20, 90, 300, 90, 'l m');
    [[60, 40, 'drawer'], [140, 55, 'latch'], [215, 35, 'tap'], [270, 45, 'step']].forEach(function (k) {
      s += p(wave(k[0], k[0] + 22, 90, k[1], k[0], 1.5, function (x) { return Math.exp(-(x - k[0]) / 8); }), 'l a', ' fill="none"') + t(k[0], 150, k[2], 'tx s', 'start');
    });
    return svg(s + t(20, 30, 'Material sounds synced to detail shots', 'tx s'));
  };
  D.silence = function () {
    var s = p(wave(20, 150, 90, 26, 7, 2), 'l', ' fill="none"') + l(150, 90, 196, 90, 'l a', ' stroke-width="2"');
    s += p(wave(196, 300, 90, 44, 11, 2), 'l', ' fill="none"');
    s += t(173, 60, 'breath', 'tx s a', 'middle') + t(248, 30, 'reveal', 'tx s a', 'middle') + l(196, 36, 196, 140, 'l a', ' stroke-dasharray="3 3"');
    return svg(s + t(20, 170, 'Music drops out for 1–2 s before the key image', 'tx s m'));
  };
  D.vo = function () {
    var s = t(20, 26, 'voice', 'tx s a') + t(20, 116, 'music (ducked under voice)', 'tx s m');
    [[20, 80], [100, 170], [190, 290]].forEach(function (seg, i) { s += p(wave(seg[0], seg[1], 55, 18, 5 + i, 2), 'l a', ' fill="none"'); });
    s += p(wave(20, 300, 140, 12, 9, 2, function (x) { return (x > 20 && x < 80) || (x > 100 && x < 170) || (x > 190 && x < 290) ? 0.45 : 1; }), 'l', ' fill="none"');
    return svg(s);
  };
  D.sfx = function () {
    var s = r(20, 40, 138, 40, 'fs') + r(162, 40, 138, 40, 'f2') + l(160, 30, 160, 150, 'l a', ' stroke-dasharray="3 3"');
    s += p('M110 130 Q150 70 160 70 Q170 70 200 130', 'l a', ' fill="none" stroke-width="2.5"');
    s += t(160, 170, 'whoosh peaks on the cut', 'tx s', 'middle');
    return svg(s);
  };
  function figure(x, y, s, cls) {
    s = s || 1;
    return c(x, y - 30 * s, 6 * s, cls || 'fi') + p('M' + (x - 7 * s) + ' ' + (y - 22 * s) + ' h' + 14 * s + ' l' + 2 * s + ' ' + 22 * s + ' h' + -18 * s + ' z', cls || 'fi');
  }
  D.blur = function () {
    var s = r(20, 40, 280, 110, 'fs');
    for (var i = 0; i < 5; i++) s += r(40 + i * 50, 80, 40, 60, 'fi', ' opacity="' + (0.12 + i * 0.05) + '"');
    s += figure(230, 140, 1.2) + t(20, 30, 'People as flow; the building stays the hero', 'tx s');
    return svg(s);
  };
  D.presenter = function () {
    var id = 'm' + (++uid);
    var s = arrowDefs(id) + figure(120, 130, 1.4) + p('M200 100 l24 -10 v20 z', 'fi') + r(224, 92, 26, 16, 'fi');
    s += l(190, 140, 110, 140, 'l a', ' marker-end="url(#' + id + ')" stroke-width="2"') + t(150, 160, 'walk together, camera backward', 'tx s', 'middle');
    s += p('M140 60 h70 v24 h-50 l-10 8 v-8 h-10 z', 'l') + t(146, 76, 'walk & talk', 'tx s');
    return svg(s);
  };
  D.mirror = function () {
    var s = '';
    [['Family', 70, [[-14, 1.3], [8, 1.1], [24, 0.8]]], ['Couple', 160, [[-8, 1.3], [10, 1.25]]], ['Remote worker', 250, [[0, 1.3]]]].forEach(function (g) {
      g[2].forEach(function (f) { s += figure(g[1] + f[0], 120, f[1]); });
      s += t(g[1], 148, g[0], 'tx s', 'middle');
    });
    return svg(s + t(20, 30, 'Cast who you want to attract', 'tx s a'));
  };
  D['mirror-check'] = function () {
    var s = r(40, 30, 90, 110, 'fs') + p('M70 90 l14 -9 v18 z', 'fi') + r(84, 83, 12, 14, 'fi') + l(35, 25, 135, 145, 'l a', ' stroke-width="2.5"');
    s += t(85, 162, 'frontal: crew visible', 'tx s', 'middle');
    s += p('M190 30 L270 45 L270 125 L190 140 Z', 'fs') + t(230, 162, 'angled: clean', 'tx s a', 'middle');
    return svg(s);
  };
  D.order = function () {
    var s = p('M20 150 Q160 -20 300 150', 'l m', ' fill="none"');
    [[30, 'dawn', 'drone, east'], [95, 'morning', 'lifestyle'], [160, 'midday', 'interiors'], [225, 'afternoon', 'west side'], [270, 'golden', 'heroes'], [300, 'blue', 'twilight']].forEach(function (k, i) {
      s += l(k[0], 150, k[0], 160, 'l') + t(k[0], 172, k[1], 'tx s' + (i >= 4 ? ' a' : ''), 'middle');
      s += t(k[0], i % 2 ? 128 : 116, k[2], 'tx s m', 'middle');
    });
    s += c(160, 44, 9, 'fa');
    return svg(s + l(20, 150, 300, 150));
  };
  D.coverage = function () {
    var s = '';
    [['Wide', 'l'], ['Medium', 'l'], ['Detail', 'l'], ['Move', 'l a']].forEach(function (f, i) {
      var x = 16 + i * 76;
      s += r(x, 60, 66, 38, f[1] === 'l a' ? 'fa' : 'fs', f[1] === 'l a' ? ' opacity=".25"' : '') + r(x, 60, 66, 38, f[1]) + t(x + 33, 116, f[0], 'tx s', 'middle');
    });
    s += r(24, 70, 50, 22, 'l m') + r(106, 66, 32, 26, 'l m') + c(203, 79, 9, 'l m');
    return svg(s + t(16, 40, 'Per hero space', 'tx s a') + t(16, 150, 'wide + medium + 2–3 details + 1 move', 'tx s m'));
  };
  D.handles = function () {
    var s = r(20, 70, 280, 34, 'fs') + r(20, 70, 50, 34, 'fa', ' opacity=".45"') + r(250, 70, 50, 34, 'fa', ' opacity=".45"');
    s += t(45, 64, 'hold 3–5 s', 'tx s a', 'middle') + t(275, 64, 'hold 3–5 s', 'tx s a', 'middle') + t(160, 92, 'the move', 'tx s', 'middle');
    return svg(s + t(20, 140, 'Clean in/out points for cuts, dissolves and ramps', 'tx s m'));
  };

  /* Composition guides over a frame of a given aspect (w x h viewBox) */
  function guides(kind, aspect) {
    var w = 1000, h = Math.round(1000 / aspect), s = '';
    var ln = function (x1, y1, x2, y2, cls) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || 'g') + '"/>'; };
    if (kind === 'thirds') {
      s += ln(w / 3, 0, w / 3, h) + ln(2 * w / 3, 0, 2 * w / 3, h) + ln(0, h / 3, w, h / 3) + ln(0, 2 * h / 3, w, 2 * h / 3);
    } else if (kind === 'phi') {
      var a = 0.382, b = 0.618;
      s += ln(w * a, 0, w * a, h) + ln(w * b, 0, w * b, h) + ln(0, h * a, w, h * a) + ln(0, h * b, w, h * b);
      // Golden spiral drawn in a golden rectangle, stretched to the frame
      // (the way editing apps overlay it). Quarter arcs cut squares
      // left, top, right, bottom, turning clockwise.
      var gw = 1618, gh = 1000, x = 0, y = 0, ww = gw, hh = gh, d = 'M0 ' + gh;
      for (var i = 0; i < 10; i++) {
        var sq, q = i % 4;
        if (q === 0) { sq = hh; d += ' A' + sq + ' ' + sq + ' 0 0 1 ' + (x + sq) + ' ' + y; x += sq; ww -= sq; }
        else if (q === 1) { sq = ww; d += ' A' + sq + ' ' + sq + ' 0 0 1 ' + (x + sq) + ' ' + (y + sq); y += sq; hh -= sq; }
        else if (q === 2) { sq = hh; d += ' A' + sq + ' ' + sq + ' 0 0 1 ' + (x + ww - sq) + ' ' + (y + sq); ww -= sq; }
        else { sq = ww; d += ' A' + sq + ' ' + sq + ' 0 0 1 ' + x + ' ' + (y + hh - sq); hh -= sq; }
        if (ww < 4 || hh < 4) break;
      }
      s += '<svg x="0" y="0" width="' + w + '" height="' + h + '" viewBox="0 0 ' + gw + ' ' + gh + '" preserveAspectRatio="none"><path d="' + d + '" class="g" fill="none"/></svg>';
    } else if (kind === 'center') {
      s += ln(w / 2, 0, w / 2, h) + ln(0, h / 2, w, h / 2) + '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="' + h * 0.06 + '" class="g" fill="none"/>';
    } else if (kind === 'diagonals') {
      s += ln(0, 0, w, h) + ln(0, h, w, 0);
      var k = (h * h) / (w * w + h * h);
      s += ln(w, 0, w * k, h * k) + ln(0, h, w * (1 - k), h * (1 - k));
    } else if (kind === 'safe') {
      s += '<rect x="0" y="0" width="' + w + '" height="' + h * 0.14 + '" class="gz"/><rect x="0" y="' + h * 0.65 + '" width="' + w + '" height="' + h * 0.35 + '" class="gz"/>';
      s += '<rect x="0" y="0" width="' + w * 0.06 + '" height="' + h + '" class="gz"/><rect x="' + w * 0.94 + '" y="0" width="' + w * 0.06 + '" height="' + h + '" class="gz"/>';
    } else if (kind === 'v916' && aspect > 1) {
      var vw = h * 9 / 16;
      s += '<rect x="0" y="0" width="' + (w - vw) / 2 + '" height="' + h + '" class="gz"/><rect x="' + (w + vw) / 2 + '" y="0" width="' + (w - vw) / 2 + '" height="' + h + '" class="gz"/>';
      s += ln((w - vw) / 2, 0, (w - vw) / 2, h) + ln((w + vw) / 2, 0, (w + vw) / 2, h);
    } else if (kind === 'level') {
      s += ln(0, h / 2, w, h / 2, 'g a') + ln(w / 2, h * 0.3, w / 2, h * 0.7, 'g a');
    }
    return '<svg class="guides" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' + s + '</svg>';
  }

  /* Storyboard notation arrows for a camera move */
  function notation(move, aspect) {
    var w = 1000, h = Math.round(1000 / (aspect || 16 / 9)), id = 'n' + (++uid);
    var defs = '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="nf"/></marker></defs>';
    var A = ' marker-end="url(#' + id + ')"';
    var ln = function (x1, y1, x2, y2, extra) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="n"' + (extra || '') + '/>'; };
    var pa = function (d, extra) { return '<path d="' + d + '" class="n" fill="none"' + (extra || '') + '/>'; };
    var s = '', m = Math.min(w, h), cx = w / 2, cy = h / 2;
    var inner = function (k, dash) { return '<rect x="' + (cx - w * k / 2) + '" y="' + (cy - h * k / 2) + '" width="' + w * k + '" height="' + h * k + '" class="n"' + (dash ? ' stroke-dasharray="14 10"' : '') + ' fill="none"/>'; };
    switch (move) {
      case 'pushin': case 'walkthrough': case 'speedramp': case 'hyperlapse':
        s += inner(0.44, move !== 'pushin');
        [[0.12, 0.14, 0.26, 0.26], [0.88, 0.14, 0.74, 0.26], [0.12, 0.86, 0.26, 0.74], [0.88, 0.86, 0.74, 0.74]].forEach(function (q) { s += ln(w * q[0], h * q[1], w * q[2], h * q[3], A); });
        break;
      case 'pullout':
        s += inner(0.44);
        [[0.26, 0.26, 0.12, 0.14], [0.74, 0.26, 0.88, 0.14], [0.26, 0.74, 0.12, 0.86], [0.74, 0.74, 0.88, 0.86]].forEach(function (q) { s += ln(w * q[0], h * q[1], w * q[2], h * q[3], A); });
        break;
      case 'zoom': case 'dollyzoom':
        s += inner(0.55, true) + inner(0.3, true);
        break;
      case 'truck': case 'track': case 'reveal':
        s += ln(w * 0.12, h * 0.86, w * 0.88, h * 0.86, A);
        if (move === 'reveal') s += '<rect x="0" y="0" width="' + w * 0.18 + '" height="' + h + '" class="nz"/>';
        break;
      case 'pan':
        s += pa('M' + w * 0.12 + ' ' + h * 0.16 + ' Q' + cx + ' ' + h * 0.06 + ' ' + w * 0.88 + ' ' + h * 0.16, A);
        break;
      case 'whip':
        s += ln(w * 0.1, h * 0.5, w * 0.9, h * 0.5, A) + ln(w * 0.2, h * 0.42, w * 0.6, h * 0.42) + ln(w * 0.3, h * 0.58, w * 0.7, h * 0.58);
        break;
      case 'tilt':
        s += pa('M' + w * 0.9 + ' ' + h * 0.85 + ' Q' + w * 0.96 + ' ' + cy + ' ' + w * 0.9 + ' ' + h * 0.15, A);
        break;
      case 'pedestal': case 'crane': case 'rise':
        s += ln(w * 0.1, h * 0.85, w * 0.1, h * 0.15, A);
        if (move !== 'pedestal') s += ln(w * 0.16, h * 0.7, w * 0.16, h * 0.3, A);
        break;
      case 'arc': case 'orbit':
        s += pa('M' + w * 0.15 + ' ' + h * 0.78 + ' Q' + cx + ' ' + h * 1.02 + ' ' + w * 0.85 + ' ' + h * 0.78, A);
        break;
      case 'topdown':
        s += pa('M' + (cx + m * 0.2) + ' ' + cy + ' A' + m * 0.2 + ' ' + m * 0.2 + ' 0 1 1 ' + cx + ' ' + (cy - m * 0.2), A);
        break;
      case 'flyover':
        s += ln(cx, h * 0.9, cx, h * 0.1, A);
        break;
      case 'handheld':
        s += pa('M' + w * 0.12 + ' ' + h * 0.86 + ' q30 -26 60 0 t60 0 t60 0 t60 0 t60 0 t60 0');
        break;
      case 'timelapse':
        s += '<circle cx="' + w * 0.9 + '" cy="' + h * 0.18 + '" r="' + m * 0.08 + '" class="n" fill="none"/>' + ln(w * 0.9, h * 0.18, w * 0.9, h * 0.18 - m * 0.055) + ln(w * 0.9, h * 0.18, w * 0.9 + m * 0.04, h * 0.18);
        break;
      default:
        return '';
    }
    return '<svg class="notation" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' + defs + s + '</svg>';
  }

  VAO.Diag = {
    has: function (k) { return !!D[k]; },
    render: function (k) { return D[k] ? D[k]() : ''; },
    guides: guides,
    notation: notation,
  };
})();
