/* VAO Shotbook · Previs engine
 * A procedural modernist villa rendered with three.js (r128) so that every
 * technique in the library can be seen on the same property.
 * World units are metres. Y is up, +Z points south (garden side), +X east.
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});
  var THREE = window.THREE;
  var Previs = (VAO.Previs = { ok: false });
  if (!THREE) return;

  var D2R = Math.PI / 180;

  /* ------------------------------------------------------------------ */
  /* Procedural textures                                                  */
  /* ------------------------------------------------------------------ */
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h || w;
    return c;
  }
  // tile = how many metres the canvas represents (geometry UVs are in metres)
  function toTex(c, tile) {
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    t.repeat.set(1 / tile, 1 / tile);
    return t;
  }
  function hsl(h, s, l, a) {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + (a == null ? 1 : a) + ')';
  }
  function speckle(g, w, h, r, count, colors, size) {
    for (var i = 0; i < count; i++) {
      g.fillStyle = colors[(r() * colors.length) | 0];
      var s = (size || 1) * (0.5 + r());
      g.fillRect(r() * w, r() * h, s, s);
    }
  }

  var TEX = {};
  function buildTextures() {
    var c, g, r, i, x, y;

    // Oak floor planks, 2.4 m tile
    c = makeCanvas(512); g = c.getContext('2d'); r = rng(7);
    var rows = 12, rh = 512 / rows;
    for (i = 0; i < rows; i++) {
      x = -r() * 400;
      while (x < 512) {
        var len = 170 + r() * 280;
        g.fillStyle = hsl(31 + r() * 5, 30 + r() * 10, 62 + r() * 8);
        g.fillRect(x, i * rh, len, rh);
        g.globalAlpha = 0.13;
        for (var k = 0; k < 7; k++) {
          g.strokeStyle = r() < 0.55 ? '#6b4a2b' : '#fff5e6';
          g.lineWidth = 0.5 + r();
          y = i * rh + r() * rh;
          g.beginPath();
          g.moveTo(x, y);
          g.bezierCurveTo(x + len * 0.3, y + (r() - 0.5) * 5, x + len * 0.6, y + (r() - 0.5) * 5, x + len, y + (r() - 0.5) * 4);
          g.stroke();
        }
        g.globalAlpha = 1;
        g.fillStyle = 'rgba(70,45,25,.35)';
        g.fillRect(x, i * rh, 1.2, rh);
        x += len;
      }
      g.fillStyle = 'rgba(70,45,25,.30)';
      g.fillRect(0, i * rh, 512, 1.1);
    }
    TEX.oak = toTex(c, 2.4);

    // Teak decking, 2.4 m tile
    c = makeCanvas(512); g = c.getContext('2d'); r = rng(21);
    rows = 17; rh = 512 / rows;
    for (i = 0; i < rows; i++) {
      g.fillStyle = hsl(24 + r() * 5, 34 + r() * 8, 38 + r() * 7);
      g.fillRect(0, i * rh, 512, rh);
      g.globalAlpha = 0.12;
      for (k = 0; k < 5; k++) {
        g.fillStyle = r() < 0.5 ? '#2c1a0f' : '#e7c9a4';
        g.fillRect(0, i * rh + r() * rh, 512, 0.8);
      }
      g.globalAlpha = 1;
      g.fillStyle = 'rgba(25,15,8,.55)';
      g.fillRect(0, i * rh, 512, 2.2);
    }
    TEX.deck = toTex(c, 2.4);

    // Marble, 1.6 m tile
    c = makeCanvas(512); g = c.getContext('2d'); r = rng(11);
    g.fillStyle = '#efece7'; g.fillRect(0, 0, 512, 512);
    for (i = 0; i < 30; i++) {
      var rg = g.createRadialGradient(r() * 512, r() * 512, 0, r() * 512, r() * 512, 60 + r() * 120);
      rg.addColorStop(0, 'rgba(205,200,192,.18)');
      rg.addColorStop(1, 'rgba(205,200,192,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 512, 512);
    }
    for (var v = 0; v < 12; v++) {
      x = r() * 512; y = r() * 512;
      var a = r() * Math.PI * 2;
      g.strokeStyle = 'rgba(110,104,98,' + (0.12 + r() * 0.4) + ')';
      g.lineWidth = 0.4 + r() * (v < 3 ? 3 : 1.4);
      g.beginPath(); g.moveTo(x, y);
      for (var s = 0; s < 70; s++) {
        a += (r() - 0.5) * 0.55;
        x += Math.cos(a) * 8; y += Math.sin(a) * 8;
        g.lineTo(x, y);
      }
      g.stroke();
    }
    TEX.marble = toTex(c, 1.6);

    // Dark timber battens, 1.2 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(5);
    g.fillStyle = '#231710'; g.fillRect(0, 0, 256, 256);
    var bw = 256 / 20;
    for (i = 0; i < 20; i++) {
      g.fillStyle = hsl(22 + r() * 6, 30 + r() * 8, 21 + r() * 7);
      g.fillRect(i * bw + 1.2, 0, bw - 2.4, 256);
      g.globalAlpha = 0.18;
      for (k = 0; k < 4; k++) {
        g.fillStyle = r() < 0.5 ? '#0d0806' : '#8a6246';
        g.fillRect(i * bw + 1.2 + r() * (bw - 3), 0, 0.7, 256);
      }
      g.globalAlpha = 1;
    }
    TEX.timber = toTex(c, 1.2);

    // Lime render / plaster, 3 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(3);
    g.fillStyle = '#ece6db'; g.fillRect(0, 0, 256, 256);
    for (i = 0; i < 26; i++) {
      rg = g.createRadialGradient(r() * 256, r() * 256, 0, r() * 256, r() * 256, 30 + r() * 70);
      rg.addColorStop(0, r() < 0.5 ? 'rgba(214,204,188,.06)' : 'rgba(255,252,246,.08)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
    }
    speckle(g, 256, 256, r, 1400, ['rgba(120,105,90,.07)', 'rgba(255,255,255,.12)'], 1);
    TEX.render = toTex(c, 3);

    // Zellige tiles, 1 m tile (10 x 10 cm tiles)
    c = makeCanvas(512); g = c.getContext('2d'); r = rng(13);
    g.fillStyle = '#e8e0cd'; g.fillRect(0, 0, 512, 512);
    var tw = 512 / 10;
    for (i = 0; i < 10; i++) for (var j = 0; j < 10; j++) {
      var L = 26 + r() * 12;
      g.fillStyle = hsl(158 + r() * 12, 42 + r() * 14, L);
      g.fillRect(i * tw + 1.6, j * tw + 1.6, tw - 3.2, tw - 3.2);
      rg = g.createRadialGradient(i * tw + tw * (0.3 + r() * 0.4), j * tw + tw * 0.3, 1, i * tw + tw / 2, j * tw + tw / 2, tw * 0.7);
      rg.addColorStop(0, 'rgba(255,255,255,.22)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rg; g.fillRect(i * tw + 1.6, j * tw + 1.6, tw - 3.2, tw - 3.2);
    }
    TEX.zellige = toTex(c, 1);

    // Pool tiles (small turquoise mosaic), 1 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(17);
    g.fillStyle = '#d7efee'; g.fillRect(0, 0, 256, 256);
    tw = 256 / 16;
    for (i = 0; i < 16; i++) for (j = 0; j < 16; j++) {
      g.fillStyle = hsl(186 + r() * 8, 55 + r() * 15, 52 + r() * 12);
      g.fillRect(i * tw + 1, j * tw + 1, tw - 2, tw - 2);
    }
    TEX.pool = toTex(c, 1);

    // Travertine, 1.2 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(19);
    g.fillStyle = '#e6dccb'; g.fillRect(0, 0, 256, 256);
    for (i = 0; i < 40; i++) {
      g.fillStyle = r() < 0.5 ? 'rgba(200,184,160,.25)' : 'rgba(250,244,232,.35)';
      g.fillRect(0, r() * 256, 256, 1 + r() * 4);
    }
    for (i = 0; i < 160; i++) {
      g.fillStyle = 'rgba(150,130,105,.22)';
      g.beginPath();
      g.ellipse(r() * 256, r() * 256, 1 + r() * 3, 0.5 + r(), 0, 0, 7);
      g.fill();
    }
    g.strokeStyle = 'rgba(140,120,95,.35)'; g.lineWidth = 1.2;
    g.strokeRect(0.5, 0.5, 255, 127); g.strokeRect(0.5, 128.5, 255, 127);
    TEX.travertine = toTex(c, 1.2);

    // Lawn, 6 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(23);
    g.fillStyle = '#788d4e'; g.fillRect(0, 0, 256, 256);
    for (i = 0; i < 40; i++) {
      rg = g.createRadialGradient(r() * 256, r() * 256, 0, r() * 256, r() * 256, 20 + r() * 60);
      rg.addColorStop(0, r() < 0.5 ? 'rgba(96,120,58,.16)' : 'rgba(150,160,90,.12)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
    }
    speckle(g, 256, 256, r, 3000, ['rgba(60,80,35,.25)', 'rgba(170,185,110,.25)'], 1);
    TEX.grass = toTex(c, 9);

    // Dry meadow outside the plot, 14 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(29);
    g.fillStyle = '#bfae84'; g.fillRect(0, 0, 256, 256);
    for (i = 0; i < 50; i++) {
      rg = g.createRadialGradient(r() * 256, r() * 256, 0, r() * 256, r() * 256, 20 + r() * 70);
      rg.addColorStop(0, r() < 0.5 ? 'rgba(150,140,90,.12)' : 'rgba(215,196,150,.12)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
    }
    speckle(g, 256, 256, r, 2500, ['rgba(110,100,60,.25)', 'rgba(230,215,175,.25)'], 1);
    TEX.meadow = toTex(c, 36);

    // Gravel, 2 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(31);
    g.fillStyle = '#d6c8ae'; g.fillRect(0, 0, 256, 256);
    speckle(g, 256, 256, r, 6000, ['rgba(120,105,85,.35)', 'rgba(250,244,230,.5)', 'rgba(170,150,120,.4)'], 1.5);
    TEX.gravel = toTex(c, 2);

    // Asphalt, 4 m tile
    c = makeCanvas(128); g = c.getContext('2d'); r = rng(37);
    g.fillStyle = '#4b4946'; g.fillRect(0, 0, 128, 128);
    speckle(g, 128, 128, r, 1500, ['rgba(20,20,20,.3)', 'rgba(140,140,140,.25)'], 1);
    TEX.asphalt = toTex(c, 4);

    // Wool rug, 2 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(41);
    g.fillStyle = '#cdbfa6'; g.fillRect(0, 0, 256, 256);
    for (i = 0; i < 256; i += 4) {
      g.fillStyle = 'rgba(150,130,100,' + (0.05 + r() * 0.08) + ')';
      g.fillRect(0, i, 256, 2);
    }
    speckle(g, 256, 256, r, 2500, ['rgba(110,95,75,.18)', 'rgba(255,250,240,.2)'], 1);
    TEX.rug = toTex(c, 2);

    // Stone for the hearth, 1.5 m tile
    c = makeCanvas(256); g = c.getContext('2d'); r = rng(43);
    g.fillStyle = '#b9ad9b'; g.fillRect(0, 0, 256, 256);
    for (y = 0; y < 256; y += 32) {
      x = -r() * 60;
      while (x < 256) {
        var sw = 40 + r() * 70;
        g.fillStyle = hsl(34, 10 + r() * 8, 60 + r() * 12);
        g.fillRect(x + 1.5, y + 1.5, sw - 3, 29);
        x += sw;
      }
    }
    TEX.stone = toTex(c, 1.5);

    // Art canvases (plain 0..1 UVs)
    TEX.art = [];
    var palettes = [
      ['#efe7da', '#c0392b', '#1a1a1a', '#d6a15a'],
      ['#e9e4dc', '#2f5d62', '#c7a27c', '#1b1b1b'],
    ];
    for (var p = 0; p < palettes.length; p++) {
      c = makeCanvas(256, 320); g = c.getContext('2d'); r = rng(50 + p);
      var P = palettes[p];
      g.fillStyle = P[0]; g.fillRect(0, 0, 256, 320);
      g.fillStyle = P[1]; g.beginPath(); g.arc(90 + r() * 80, 110 + r() * 60, 60 + r() * 30, 0, 7); g.fill();
      g.fillStyle = P[3]; g.fillRect(30 + r() * 60, 190, 150 + r() * 40, 70);
      g.strokeStyle = P[2]; g.lineWidth = 7;
      g.beginPath(); g.arc(160, 150, 95, Math.PI * 0.9, Math.PI * 1.9); g.stroke();
      var at = new THREE.CanvasTexture(c);
      at.encoding = THREE.sRGBEncoding;
      TEX.art.push(at);
    }

    // Soft radial glow for sprites
    c = makeCanvas(128); g = c.getContext('2d');
    rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.18, 'rgba(255,255,255,.85)');
    rg.addColorStop(0.45, 'rgba(255,255,255,.18)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
    TEX.glow = new THREE.CanvasTexture(c);
  }

  /* ------------------------------------------------------------------ */
  /* Geometry helpers                                                     */
  /* ------------------------------------------------------------------ */
  // Replace UVs with world-space metres, projected on the dominant normal axis.
  function uvWorld(geom) {
    var pos = geom.attributes.position, nor = geom.attributes.normal;
    var uv = new Float32Array(pos.count * 2);
    for (var i = 0; i < pos.count; i++) {
      var nx = Math.abs(nor.getX(i)), ny = Math.abs(nor.getY(i)), nz = Math.abs(nor.getZ(i));
      var px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
      if (ny >= nx && ny >= nz) { uv[i * 2] = px; uv[i * 2 + 1] = pz; }
      else if (nx >= nz) { uv[i * 2] = pz; uv[i * 2 + 1] = py; }
      else { uv[i * 2] = px; uv[i * 2 + 1] = py; }
    }
    geom.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    return geom;
  }

  function mergeGeoms(list) {
    var parts = list.map(function (g) { return g.index ? g.toNonIndexed() : g; });
    var n = 0;
    parts.forEach(function (g) { n += g.attributes.position.count; });
    var pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
    var o = 0;
    parts.forEach(function (g) {
      var c = g.attributes.position.count;
      pos.set(g.attributes.position.array, o * 3);
      nor.set(g.attributes.normal.array, o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
      o += c;
    });
    var out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    out.computeBoundingSphere();
    return out;
  }

  function Builder() { this.map = {}; }
  Builder.prototype.add = function (key, g) {
    (this.map[key] = this.map[key] || []).push(g);
    return g;
  };
  // Axis-aligned box between two corners.
  Builder.prototype.box = function (key, x0, y0, z0, x1, y1, z1) {
    var g = new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0));
    g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    return this.add(key, uvWorld(g));
  };
  // Any geometry, rotated around Y then placed.
  Builder.prototype.put = function (key, g, x, y, z, ry, rx, rz) {
    if (rx) g.rotateX(rx);
    if (rz) g.rotateZ(rz);
    if (ry) g.rotateY(ry);
    g.translate(x || 0, y || 0, z || 0);
    return this.add(key, uvWorld(g));
  };
  Builder.prototype.build = function (mats, opts) {
    opts = opts || {};
    var group = new THREE.Group();
    Object.keys(this.map).forEach(function (key) {
      var geom = mergeGeoms(this.map[key]);
      var mat = mats[key];
      var mesh = new THREE.Mesh(geom, mat);
      mesh.name = key;
      mesh.castShadow = !(opts.noCast && opts.noCast.indexOf(key) >= 0);
      mesh.receiveShadow = true;
      group.add(mesh);
      if (opts.edges && opts.edges.indexOf(key) >= 0) {
        var lines = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 28), mats._edge);
        lines.name = key + ':edges';
        group.add(lines);
      }
    }, this);
    return group;
  };

  /* ------------------------------------------------------------------ */
  /* Materials                                                           */
  /* ------------------------------------------------------------------ */
  var MAT = {};
  function std(o) { return new THREE.MeshStandardMaterial(o); }
  function buildMaterials() {
    MAT.render = std({ map: TEX.render, roughness: 0.92 });
    MAT.renderIn = std({ map: TEX.render, color: '#f4efe6', roughness: 0.95 });
    MAT.slab = std({ map: TEX.render, color: '#f7f3ec', roughness: 0.9 });
    MAT.timber = std({ map: TEX.timber, roughness: 0.75 });
    MAT.oak = std({ map: TEX.oak, roughness: 0.62 });
    MAT.oakDark = std({ map: TEX.oak, color: '#8a6a50', roughness: 0.6 });
    MAT.marble = std({ map: TEX.marble, roughness: 0.22, metalness: 0.02 });
    MAT.zellige = std({ map: TEX.zellige, roughness: 0.18, metalness: 0.05 });
    MAT.deck = std({ map: TEX.deck, roughness: 0.82 });
    MAT.travertine = std({ map: TEX.travertine, roughness: 0.85 });
    MAT.stone = std({ map: TEX.stone, roughness: 0.95 });
    MAT.grass = std({ map: TEX.grass, roughness: 1 });
    MAT.meadow = std({ map: TEX.meadow, roughness: 1 });
    MAT.gravel = std({ map: TEX.gravel, roughness: 1 });
    MAT.asphalt = std({ map: TEX.asphalt, roughness: 0.95 });
    MAT.poolTile = std({ map: TEX.pool, roughness: 0.4 });
    MAT.rug = std({ map: TEX.rug, roughness: 1 });
    MAT.frame = std({ color: '#2a2927', roughness: 0.45, metalness: 0.4 });
    MAT.glass = new THREE.MeshStandardMaterial({
      color: '#b9d0d6', transparent: true, opacity: 0.2, roughness: 0.04, metalness: 0.35, depthWrite: false,
      emissive: new THREE.Color('#ffb46e'), emissiveIntensity: 0,
    });
    MAT.fabric = std({ color: '#e8e0d2', roughness: 1 });
    MAT.fabricWarm = std({ color: '#b89c7d', roughness: 1 });
    MAT.fabricDark = std({ color: '#5b5148', roughness: 1 });
    MAT.linen = std({ color: '#f6f2ea', roughness: 1 });
    MAT.cushion = std({ color: '#f1ece2', roughness: 1 });
    MAT.black = std({ color: '#1f1e1c', roughness: 0.6 });
    MAT.brass = std({ color: '#b48c4e', roughness: 0.32, metalness: 0.75 });
    MAT.ceramic = std({ color: '#f4f2ee', roughness: 0.2 });
    MAT.trunk = std({ color: '#7d6651', roughness: 1 });
    MAT.olive = std({ color: '#5d6a45', roughness: 1 });
    MAT.oliveFar = std({ color: '#5f6b47', roughness: 1, flatShading: true });
    MAT.palm = std({ color: '#4f6d3e', roughness: 0.9, side: THREE.DoubleSide });
    MAT.cypress = std({ color: '#314a37', roughness: 1, flatShading: true });
    MAT.hedge = std({ color: '#4f6841', roughness: 1 });
    MAT.shrub = std({ color: '#667a4c', roughness: 1, flatShading: true });
    MAT.mountain = std({ color: '#978d82', roughness: 1, flatShading: true, side: THREE.DoubleSide });
    MAT.mountainFar = std({ color: '#a4a9b0', roughness: 1, flatShading: true, side: THREE.DoubleSide });
    MAT.neighbour = std({ color: '#e9e1d4', roughness: 1 });
    MAT.person = std({ color: '#3a3531', roughness: 0.9 });
    MAT.skin = std({ color: '#a98670', roughness: 0.9 });
    MAT.water = new THREE.MeshStandardMaterial({
      color: '#4aa9bd', transparent: true, opacity: 0.62, roughness: 0.06, metalness: 0.15,
      emissive: new THREE.Color('#1bb3d6'), emissiveIntensity: 0, depthWrite: false,
    });
    MAT.shade = std({ color: '#f1e3c8', roughness: 0.9, emissive: new THREE.Color('#ffc27a'), emissiveIntensity: 0 });
    MAT.bulb = std({ color: '#f5efe2', roughness: 0.5, emissive: new THREE.Color('#ffd49a'), emissiveIntensity: 0 });
    MAT.fire = std({ color: '#20150f', roughness: 1, emissive: new THREE.Color('#ff7b2e'), emissiveIntensity: 0 });
    MAT.art0 = std({ map: TEX.art[0], roughness: 0.9 });
    MAT.art1 = std({ map: TEX.art[1], roughness: 0.9 });
    MAT._edge = new THREE.LineBasicMaterial({ color: '#2a2521', transparent: true, opacity: 0.22 });
  }

  /* ------------------------------------------------------------------ */
  /* The villa                                                            */
  /* ------------------------------------------------------------------ */
  var WATER_Y = -0.07;
  var WORLD = {}; // references to animated parts

  function buildHouse(B) {
    // Plinth + interior floor (top at 0.1)
    B.box('oak', -11, 0, -5, 9, 0.1, 5);
    B.box('render', -11.25, 0, -5.25, 9.25, 0.1, -5);

    // --- V1 base volume (kitchen / dining), x -11..1, h 3.3
    // north wall with slot window and pivot door
    B.box('render', -11.25, 0, -5.25, -9.5, 3.3, -5);
    B.box('render', -9.5, 0, -5.25, -5.5, 2.4, -5);
    B.box('render', -9.5, 2.9, -5.25, -5.5, 3.3, -5);
    B.box('render', -5.5, 0, -5.25, -2.7, 3.3, -5);
    B.box('render', -2.7, 3.0, -5.25, -1.3, 3.3, -5);
    B.box('render', -1.3, 0, -5.25, 1, 3.3, -5);
    B.box('glass', -9.5, 2.4, -5.15, -5.5, 2.9, -5.1);
    // west wall
    B.box('render', -11.25, 0, -5, -11, 3.3, 5);
    // roof slab with a deep south canopy
    B.box('slab', -11.4, 3.3, -5.4, 1, 3.6, 7.2);
    // south glazing, 5 bays of 2.4 m; bay 4 (x -3.8..-1.4) slid open
    var bays = [-11, -8.6, -6.2, -3.8, -1.4, 1];
    for (var i = 0; i < bays.length; i++) {
      B.box('frame', bays[i] - 0.04, 0.1, 4.94, bays[i] + 0.04, 3.3, 5.04);
      if (i < bays.length - 1 && i !== 3) B.box('glass', bays[i], 0.1, 4.97, bays[i + 1], 3.3, 5.0);
    }
    B.box('glass', -6.2, 0.1, 4.9, -3.8, 3.3, 4.93); // the opened slider parked behind
    B.box('frame', -11, 3.24, 4.94, 1, 3.3, 5.04);
    B.box('frame', -11, 0.1, 4.94, 1, 0.13, 5.04);

    // --- V2 glass pavilion (double-height living), x 1..9, h 6.6
    B.box('render', 1, 0, -5.25, 9.25, 6.6, -5);
    // east glazing
    var ez = [-5, -2.5, 0, 2.5, 5];
    for (i = 0; i < ez.length; i++) B.box('frame', 8.96, 0.1, ez[i] - 0.04, 9.06, 6.6, ez[i] + 0.04);
    B.box('glass', 9.0, 0.1, -5, 9.03, 6.6, 5);
    B.box('frame', 8.96, 3.28, -5, 9.06, 3.36, 5);
    // south glazing, 2 m bays; bay x 5..7 open at ground level
    var sx = [1, 3, 5, 7, 9];
    for (i = 0; i < sx.length; i++) B.box('frame', sx[i] - 0.04, 0.1, 4.94, sx[i] + 0.04, 6.6, 5.04);
    B.box('frame', 1, 3.28, 4.94, 9, 3.36, 5.04);
    B.box('glass', 1, 0.1, 4.97, 5, 3.28, 5.0);
    B.box('glass', 7, 0.1, 4.97, 9, 3.28, 5.0);
    B.box('glass', 5.02, 0.1, 4.9, 6.98, 3.28, 4.93);
    B.box('glass', 1, 3.36, 4.97, 9, 6.6, 5.0);
    // roof slab: deep canopy south and east
    B.box('slab', 0.6, 6.6, -5.4, 10.4, 6.95, 7.0);

    // --- V3 floating timber box (bedrooms), x -12..1, y 3.6..6.6
    B.box('timber', -12, 3.6, -4.5, 1, 6.6, -4.3); // north
    B.box('timber', -12, 3.6, -4.3, -11.8, 6.6, 6.2); // west
    // east wall with the door from the stair landing (z -4.3..-3.3)
    B.box('timber', 0.8, 3.6, -3.3, 1, 6.6, 6.2);
    B.box('timber', 0.8, 5.8, -4.3, 1, 6.6, -3.3);
    B.box('render', 0.8, 3.3, -5.25, 1, 6.6, -4.5);
    // south face with ribbon window x -11..-1, y 4.2..6.0
    B.box('timber', -12, 3.6, 6.0, 1, 4.2, 6.2);
    B.box('timber', -12, 6.0, 6.0, 1, 6.6, 6.2);
    B.box('timber', -12, 4.2, 6.0, -11, 6.0, 6.2);
    B.box('timber', -1, 4.2, 6.0, 1, 6.0, 6.2);
    B.box('glass', -11, 4.2, 6.05, -1, 6.0, 6.08);
    for (var rx = -11; rx <= -1; rx += 2) B.box('frame', rx - 0.03, 4.2, 6.02, rx + 0.03, 6.0, 6.12);
    // floor and roof
    B.box('oak', -11.8, 3.6, -4.3, 0.8, 3.7, 6.0);
    B.box('slab', -12.2, 6.6, -4.7, 1.0, 6.9, 6.4);
    // headboard partition
    B.box('renderIn', -11.8, 3.7, 0.8, 0.8, 6.6, 1.0);

    // --- Pivot entrance door (animated)
    var door = new THREE.Group();
    var dg = new THREE.BoxGeometry(1.4, 2.9, 0.09);
    dg.translate(0.7, 1.45, 0);
    uvWorld(dg);
    var dmesh = new THREE.Mesh(dg, MAT.oakDark);
    dmesh.castShadow = dmesh.receiveShadow = true;
    door.add(dmesh);
    var handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, 0.06), MAT.brass);
    handle.position.set(1.2, 1.3, -0.08);
    door.add(handle);
    door.position.set(-2.7, 0.1, -5.12);
    WORLD.door = door;
  }

  function buildInterior(B) {
    // Floating oak stair along the pavilion north wall, rising west to the landing
    var n = 20, rise = 3.5 / n, tread = 0.28;
    for (var i = 1; i < n; i++) {
      var top = 0.1 + i * rise;
      var x1 = 8.4 - (i - 1) * tread, x0 = x1 - tread;
      B.box('oak', x0, top - 0.06, -5, x1, top, -3.9);
    }
    B.box('oak', 1, 3.35, -5, 3.08, 3.6, -3.9); // landing
    B.box('glass', 1, 3.6, -3.92, 3.08, 4.6, -3.88);

    // Living
    B.box('rug', 3.4, 0.1, -0.8, 7.6, 0.12, 3.2);
    // sofa facing east
    B.box('fabric', 3.0, 0.1, -0.6, 4.0, 0.42, 2.8);
    B.box('fabric', 3.0, 0.42, -0.6, 3.28, 0.82, 2.8);
    B.box('fabric', 3.28, 0.42, -0.6, 4.0, 0.62, -0.38);
    B.box('fabric', 3.28, 0.42, 2.58, 4.0, 0.62, 2.8);
    B.box('cushion', 3.3, 0.42, -0.36, 3.98, 0.52, 1.1);
    B.box('cushion', 3.3, 0.42, 1.14, 3.98, 0.52, 2.56);
    // armchairs facing west
    [[-0.2, 0.7], [1.4, 2.3]].forEach(function (z) {
      B.box('fabricWarm', 6.8, 0.1, z[0], 7.7, 0.4, z[1]);
      B.box('fabricWarm', 7.45, 0.4, z[0], 7.7, 0.8, z[1]);
    });
    // coffee table (travertine drum)
    B.put('travertine', new THREE.CylinderGeometry(0.62, 0.62, 0.36, 32), 5.3, 0.28, 1.1);
    B.put('ceramic', new THREE.CylinderGeometry(0.09, 0.12, 0.22, 16), 5.1, 0.57, 1.0);
    // floor lamp by the sofa
    B.put('black', new THREE.CylinderGeometry(0.015, 0.015, 1.5, 6), 3.35, 0.85, 3.1);
    B.put('shade', new THREE.CylinderGeometry(0.16, 0.24, 0.3, 24, 1, true), 3.35, 1.6, 3.1);
    // low hearth with a linear fire, facing south
    B.box('stone', 4.4, 0.1, -3.2, 7.6, 0.35, -2.5);
    B.box('stone', 4.4, 0.7, -3.2, 7.6, 0.95, -2.5);
    B.box('stone', 4.4, 0.35, -3.2, 5.0, 0.7, -2.5);
    B.box('stone', 7.0, 0.35, -3.2, 7.6, 0.7, -2.5);
    B.box('stone', 5.0, 0.35, -3.2, 7.0, 0.7, -3.0);
    B.box('fire', 5.0, 0.35, -3.0, 7.0, 0.42, -2.62);
    // indoor olive tree in a planter
    B.box('stone', 8.0, 0.1, -3.6, 8.8, 0.7, -2.8);
    B.put('trunk', new THREE.CylinderGeometry(0.05, 0.08, 1.6, 7), 8.4, 1.4, -3.2);
    B.put('olive', new THREE.IcosahedronGeometry(0.75, 2), 8.4, 2.45, -3.2);
    B.put('olive', new THREE.IcosahedronGeometry(0.55, 2), 8.1, 2.15, -3.0);
    // pendant globes over the coffee table
    [[5.1, 4.1, 0.9], [5.5, 3.7, 1.3], [5.3, 4.4, 1.25]].forEach(function (p) {
      B.put('bulb', new THREE.SphereGeometry(0.2, 20, 14), p[0], p[1], p[2]);
      B.put('black', new THREE.CylinderGeometry(0.006, 0.006, 6.6 - p[1], 4), p[0], (6.6 + p[1]) / 2, p[2]);
    });

    // Kitchen (V1 west)
    B.box('oak', -10.9, 0.1, -5, -9.3, 2.6, -4.35); // tall units
    B.box('oakDark', -9.3, 0.1, -5, -4.4, 0.86, -4.4); // base run
    B.box('marble', -9.3, 0.86, -5, -4.4, 0.9, -4.38);
    B.box('zellige', -9.3, 0.9, -5, -4.4, 1.7, -4.98);
    B.box('oak', -8.6, 2.0, -5, -5.2, 2.05, -4.72); // open shelf
    B.box('oakDark', -9.0, 0.1, -2.0, -5.6, 0.86, -1.0); // island
    B.box('marble', -9.08, 0.86, -2.08, -5.52, 0.92, -0.92);
    [-8.3, -7.3, -6.3].forEach(function (x) {
      B.put('black', new THREE.CylinderGeometry(0.2, 0.2, 0.05, 20), x, 0.66, -0.55);
      B.put('black', new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), x, 0.36, -0.55);
      B.put('brass', new THREE.ConeGeometry(0.2, 0.26, 24, 1, true), x, 2.05, -1.5);
      B.put('bulb', new THREE.SphereGeometry(0.06, 10, 8), x, 1.95, -1.5);
      B.put('black', new THREE.CylinderGeometry(0.005, 0.005, 1.1, 4), x, 2.75, -1.5);
    });
    B.put('ceramic', new THREE.CylinderGeometry(0.16, 0.1, 0.12, 20), -7.4, 0.98, -1.55); // bowl

    // Dining
    B.box('oak', -3.3, 0.8, 0.5, -0.3, 0.85, 1.5);
    [[-3.15, 0.62], [-3.15, 1.38], [-0.45, 0.62], [-0.45, 1.38]].forEach(function (p) {
      B.box('oak', p[0] - 0.04, 0.1, p[1] - 0.04, p[0] + 0.04, 0.8, p[1] + 0.04);
    });
    [-2.8, -1.8, -0.8].forEach(function (x) {
      [0.15, 1.85].forEach(function (z, k) {
        B.box('fabricDark', x - 0.23, 0.1, z - 0.22, x + 0.23, 0.46, z + 0.22);
        var bz = k ? z + 0.18 : z - 0.22;
        B.box('fabricDark', x - 0.23, 0.46, bz, x + 0.23, 0.86, bz + 0.05);
      });
    });
    B.box('bulb', -3.0, 2.1, 0.96, -0.6, 2.16, 1.04);
    B.put('black', new THREE.CylinderGeometry(0.005, 0.005, 1.15, 4), -2.6, 2.72, 1.0);
    B.put('black', new THREE.CylinderGeometry(0.005, 0.005, 1.15, 4), -1.0, 2.72, 1.0);

    // Entry screen: the threshold that hides the view until you step past it
    B.box('oak', -3.6, 0.1, -3.0, -0.4, 2.6, -2.8);
    B.box('oakDark', -3.2, 0.1, -3.35, -0.8, 0.8, -3.0); // console
    B.put('ceramic', new THREE.CylinderGeometry(0.1, 0.14, 0.45, 18), -1.3, 1.02, -3.18);

    // Upper bedroom (V3), bed facing the ribbon window
    B.box('oak', -7.1, 3.7, 1.0, -4.9, 4.0, 3.2);
    B.box('linen', -7.0, 4.0, 1.1, -5.0, 4.24, 3.15);
    B.box('fabricWarm', -7.05, 4.0, 2.4, -4.95, 4.28, 3.2);
    B.box('cushion', -6.8, 4.24, 1.15, -6.05, 4.4, 1.5);
    B.box('cushion', -5.95, 4.24, 1.15, -5.2, 4.4, 1.5);
    B.box('fabricWarm', -7.3, 3.7, 1.0, -4.7, 5.0, 1.12);
    [-7.55, -4.45].forEach(function (x) {
      B.box('oakDark', x - 0.25, 3.7, 1.12, x + 0.25, 4.2, 1.6);
      B.put('shade', new THREE.CylinderGeometry(0.12, 0.16, 0.24, 20, 1, true), x, 4.5, 1.35);
      B.put('brass', new THREE.CylinderGeometry(0.015, 0.02, 0.2, 6), x, 4.3, 1.35);
    });
    B.box('rug', -8.2, 3.7, 2.4, -3.8, 3.71, 5.0);
    // freestanding bath by the window
    B.box('ceramic', -11.1, 3.7, 4.55, -9.3, 4.25, 5.45);
    B.box('black', -10.95, 4.2, 4.68, -9.45, 4.255, 5.32);

    // Art: tall canvas above the stair and a large piece on the kitchen west wall
    var a0 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.3), MAT.art0);
    a0.position.set(5.9, 5.1, -4.99);
    var a1 = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.1), MAT.art1);
    a1.position.set(-10.99, 1.75, 0.6);
    a1.rotation.y = Math.PI / 2;
    return [a0, a1];
  }

  function buildGarden(B) {
    // Deck and pool
    B.box('deck', -12, 0, 5, 10.6, 0.1, 9.2);
    B.box('travertine', -8.45, 0, 9.2, 6.45, 0.1, 9.62); // coping N
    B.box('travertine', -8.45, 0, 14.38, 6.45, 0.1, 14.8); // coping S
    B.box('travertine', -8.45, 0, 9.62, -8.0, 0.1, 14.38);
    B.box('travertine', 6.0, 0, 9.62, 6.45, 0.1, 14.38);
    // pool shell (seen from above)
    B.box('poolTile', -8, -1.5, 9.62, 6, -1.45, 14.38);
    // loungers
    [-10.6, -9.0].forEach(function (x) {
      B.box('oakDark', x - 0.35, 0.1, 6.4, x + 0.35, 0.34, 8.4);
      B.box('cushion', x - 0.33, 0.34, 6.9, x + 0.33, 0.42, 8.38);
      var back = new THREE.BoxGeometry(0.66, 0.08, 0.7);
      B.put('cushion', back, x, 0.62, 6.72, 0, -0.95);
    });
    B.box('ceramic', -9.95, 0.1, 7.2, -9.65, 0.45, 7.5); // side table
    // planters along the deck edge
    [[-11.5, 9.6], [8.8, 9.6], [9.8, 7.6]].forEach(function (p) {
      B.box('stone', p[0] - 0.45, 0, p[1] - 0.45, p[0] + 0.45, 0.6, p[1] + 0.45);
      B.put('shrub', new THREE.IcosahedronGeometry(0.55, 1), p[0], 1.0, p[1]);
    });

    // Pergola + outdoor dining, west of the house
    B.box('gravel', -22.5, 0, -1.5, -14.5, 0.03, 7.5);
    [[-22, -1], [-22, 7], [-15, -1], [-15, 7], [-22, 3], [-15, 3]].forEach(function (p) {
      B.box('render', p[0] - 0.15, 0, p[1] - 0.15, p[0] + 0.15, 2.8, p[1] + 0.15);
    });
    B.box('render', -22.2, 2.8, -1.2, -21.8, 3.1, 7.2);
    B.box('render', -15.2, 2.8, -1.2, -14.8, 3.1, 7.2);
    for (var z = -1.1; z <= 7.1; z += 0.42) B.box('oak', -22.3, 3.1, z - 0.04, -14.7, 3.28, z + 0.04);
    B.box('oak', -19.9, 0.72, 1.4, -17.1, 0.77, 4.6);
    B.box('oak', -19.8, 0.03, 1.5, -17.2, 0.72, 1.6);
    B.box('oak', -19.8, 0.03, 4.4, -17.2, 0.72, 4.5);
    [1.9, 3.0, 4.1].forEach(function (z) {
      [-20.3, -16.7].forEach(function (x) {
        B.box('fabricDark', x - 0.22, 0.03, z - 0.22, x + 0.22, 0.46, z + 0.22);
      });
    });

    // Driveway, gate and boundary
    B.box('gravel', -4.5, 0, -26, 0.5, 0.03, -5.25);
    B.box('render', -32, 0, -26.3, -4.5, 2.2, -26);
    B.box('render', 0.5, 0, -26.3, 32, 2.2, -26);
    B.box('render', -32.3, 0, -26.3, -32, 2.2, 34);
    B.box('render', 32, 0, -26.3, 32.3, 2.2, 34);
    B.box('render', -32.3, 0, 34, 32.3, 0.7, 34.3); // low south wall
    // hedge that hides the house from low garden viewpoints
    B.box('hedge', -19, 0, 25, -3, 1.35, 26.1);
    // path from the deck to the lawn
    for (var s = 0; s < 6; s++) B.box('travertine', 7.6, 0, 15.6 + s * 1.3, 8.8, 0.04, 16.4 + s * 1.3);
    // road outside
    B.box('asphalt', -200, 0, -35, 200, 0.02, -28);
  }

  function palmGeometry(h, seed) {
    var r = rng(seed);
    var geoms = [];
    var trunk = new THREE.CylinderGeometry(0.17, 0.26, h, 9, 6);
    // gentle lean
    var p = trunk.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var t = (p.getY(i) + h / 2) / h;
      p.setX(i, p.getX(i) + t * t * 0.7);
    }
    trunk.computeVertexNormals();
    trunk.translate(0, h / 2, 0);
    geoms.push({ key: 'trunk', g: trunk });
    var fronds = [];
    var n = 11;
    for (var f = 0; f < n; f++) {
      var ang = (f / n) * Math.PI * 2 + r() * 0.3;
      var len = 2.6 + r() * 0.9;
      var droop = 0.55 + r() * 0.5;
      var segs = 7, verts = [], idx = [];
      for (var s = 0; s <= segs; s++) {
        var u = s / segs;
        var w = Math.sin(u * Math.PI) * 0.42 + 0.03;
        var along = u * len;
        var y = Math.sin(u * 1.4) * 0.8 - u * u * droop * 2.2;
        var cx = Math.cos(ang) * along, cz = Math.sin(ang) * along;
        var px = -Math.sin(ang) * w, pz = Math.cos(ang) * w;
        verts.push(cx + px, y + 0.12 * u, cz + pz, cx - px, y + 0.12 * u, cz - pz);
        if (s < segs) {
          var b = s * 2;
          idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
        }
      }
      var fg = new THREE.BufferGeometry();
      fg.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      fg.setIndex(idx);
      fg.computeVertexNormals();
      fg.translate(0.7, h, 0);
      fronds.push(fg);
    }
    geoms.push({ key: 'palm', list: fronds });
    return geoms;
  }

  function buildVegetation(B) {
    var palms = [[11.5, 12.5, 8.6, 1], [13.8, 8.6, 7.2, 2], [-14.2, 13.2, 9.2, 3], [16.5, -2.5, 7.6, 4], [-27, 21, 8.2, 5], [28.5, 12, 9.4, 6], [-24.5, -6, 7.8, 7]];
    palms.forEach(function (p) {
      palmGeometry(p[2], p[3]).forEach(function (part) {
        if (part.g) B.put(part.key, part.g, p[0], 0, p[1]);
        else part.list.forEach(function (g) { B.put(part.key, g, p[0], 0, p[1], p[3]); });
      });
    });
    var olives = [[-11, 21, 1.1], [21, 12, 1.0], [-24.5, 12, 0.9], [26, -2, 1.1], [-12, -17, 1.0], [24, -16, 1.2], [-2, 31, 0.9]];
    olives.forEach(function (o, k) {
      var r = rng(90 + k), s = o[2];
      B.put('trunk', new THREE.CylinderGeometry(0.12 * s, 0.22 * s, 1.8 * s, 7), o[0], 0.9 * s, o[1]);
      for (var i = 0; i < 6; i++) {
        B.put('olive', new THREE.IcosahedronGeometry((0.8 + r() * 0.5) * s, 2),
          o[0] + (r() - 0.5) * 2.4 * s, (2.2 + r() * 1.1) * s, o[1] + (r() - 0.5) * 2.4 * s);
      }
    });
    // cypress alley along the drive
    for (var z = -24; z <= -8; z += 4) {
      [-6.2, 2.2].forEach(function (x) {
        B.put('cypress', new THREE.ConeGeometry(0.75, 8.5, 8), x, 4.25, z);
      });
    }
  }

  function buildContext(scene) {
    // Ground: lawn inside the plot, meadow outside, with a hole for the pool.
    var lawn = new THREE.Shape();
    lawn.moveTo(-32, -26); lawn.lineTo(32, -26); lawn.lineTo(32, 34); lawn.lineTo(-32, 34); lawn.lineTo(-32, -26);
    var hole = new THREE.Path();
    hole.moveTo(-8, 9.62); hole.lineTo(-8, 14.38); hole.lineTo(6, 14.38); hole.lineTo(6, 9.62); hole.lineTo(-8, 9.62);
    lawn.holes.push(hole);
    var lg = new THREE.ShapeGeometry(lawn);
    lg.rotateX(Math.PI / 2); // shape y -> world z
    uvWorld(lg);
    var lawnMesh = new THREE.Mesh(lg, MAT.grass);
    lawnMesh.material.side = THREE.DoubleSide;
    lawnMesh.receiveShadow = true;
    lawnMesh.position.y = 0.005;
    scene.add(lawnMesh);

    var ms = new THREE.Shape();
    ms.moveTo(-1500, -1500); ms.lineTo(1500, -1500); ms.lineTo(1500, 1500); ms.lineTo(-1500, 1500); ms.lineTo(-1500, -1500);
    var mh = new THREE.Path();
    mh.moveTo(-32, -26); mh.lineTo(-32, 34); mh.lineTo(32, 34); mh.lineTo(32, -26); mh.lineTo(-32, -26);
    ms.holes.push(mh);
    var mg = new THREE.ShapeGeometry(ms);
    mg.rotateX(Math.PI / 2);
    uvWorld(mg);
    var meadow = new THREE.Mesh(mg, MAT.meadow);
    meadow.material.side = THREE.DoubleSide;
    meadow.receiveShadow = true;
    scene.add(meadow);

    // Water surface
    var wg = new THREE.PlaneGeometry(14, 4.76);
    wg.rotateX(-Math.PI / 2);
    var water = new THREE.Mesh(wg, MAT.water);
    water.position.set(-1, WATER_Y, 12);
    water.renderOrder = 2;
    water.receiveShadow = true;
    scene.add(water);
    WORLD.water = water;

    // Two mountain ridges (sloped rings), higher to the north, hazier far away
    [[360, 170, 14, 95, 77, MAT.mountain], [640, 260, 40, 210, 78, MAT.mountainFar]].forEach(function (cfg) {
      var R = cfg[0], depth = cfg[1], base = cfg[2], amp = cfg[3], rr0 = rng(cfg[4]);
      var ph = [rr0() * 6.28, rr0() * 6.28, rr0() * 6.28, rr0() * 6.28, rr0() * 6.28];
      var n = 220, pos = [], idx = [];
      for (var i = 0; i <= n; i++) {
        var a = (i / n) * Math.PI * 2;
        var north = Math.max(0, -Math.cos(a));
        var wav = Math.sin(a * 3 + ph[0]) * 0.45 + Math.sin(a * 7 + ph[1]) * 0.28 + Math.sin(a * 13 + ph[2]) * 0.16 +
          Math.sin(a * 31 + ph[3]) * 0.07 + Math.sin(a * 67 + ph[4]) * 0.035;
        var h = base + amp * (0.3 + 0.7 * north) * (0.55 + 0.45 * wav) + (rr0() - 0.5) * amp * 0.05;
        var sa = Math.sin(a), ca = -Math.cos(a);
        pos.push(sa * R, -2, ca * R);
        pos.push(sa * (R + depth * 0.55), h, ca * (R + depth * 0.55));
        pos.push(sa * (R + depth), h * 0.6, ca * (R + depth));
        if (i < n) {
          var b = i * 3;
          idx.push(b, b + 3, b + 1, b + 1, b + 3, b + 4, b + 1, b + 4, b + 2, b + 2, b + 4, b + 5);
        }
      }
      var rg = new THREE.BufferGeometry();
      rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      rg.setIndex(idx);
      rg.computeVertexNormals();
      var ridge = new THREE.Mesh(rg, cfg[5]);
      scene.add(ridge);
    });

    // Scattered olive trees outside the plot and two neighbour houses
    var tg = [];
    var rr = rng(99);
    for (var i = 0; i < 70; i++) {
      var x = (rr() - 0.5) * 420, z = (rr() - 0.5) * 420;
      if (Math.abs(x) < 45 && z > -40 && z < 48) continue;
      var t = new THREE.IcosahedronGeometry(1.4 + rr() * 1.1, 1);
      t.translate(x, 2.4, z);
      tg.push(t);
    }
    var trees = new THREE.Mesh(mergeGeoms(tg), MAT.oliveFar);
    trees.castShadow = false;
    scene.add(trees);
    var nb = new Builder();
    nb.box('neighbour', 70, 0, -60, 86, 6.5, -48);
    nb.box('neighbour', 62, 0, -54, 70, 3.4, -46);
    nb.box('neighbour', -104, 0, 20, -88, 6.2, 33);
    nb.box('neighbour', -120, 0, -70, -108, 3.5, -58);
    scene.add(nb.build(MAT, { noCast: ['neighbour'] }));
  }

  /* People: architectural-model figures (walk cycle on the legs) */
  function makePerson() {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.68, 12), MAT.person);
    body.position.y = 1.2;
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 10), MAT.skin);
    head.position.y = 1.66;
    var legs = [];
    [-0.09, 0.09].forEach(function (x) {
      var leg = new THREE.Group();
      var lg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.86, 8), MAT.person);
      lg.position.y = -0.43;
      leg.add(lg);
      leg.position.set(x, 0.88, 0);
      g.add(leg);
      legs.push(leg);
    });
    var arms = [];
    [-0.22, 0.22].forEach(function (x) {
      var arm = new THREE.Group();
      var am = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.62, 8), MAT.person);
      am.position.y = -0.31;
      arm.add(am);
      arm.position.set(x, 1.5, 0);
      g.add(arm);
      arms.push(arm);
    });
    g.add(body, head);
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.userData = { legs: legs, arms: arms };
    return g;
  }

  /* ------------------------------------------------------------------ */
  /* Sky, sun and time of day                                             */
  /* ------------------------------------------------------------------ */
  var TODS = {
    morning: { el: 17, az: 112, sun: '#ffe1b8', sunI: 1.9, hemiT: '#d6e2ec', hemiB: '#a38e75', hemiI: 0.82, top: '#6c98c9', hor: '#f0dcc4', glow: '#ffd7a3', glowI: 0.55, fog: '#e5dccf', exp: 1.0, inside: 0.12, pool: 0 },
    interior: { el: 44, az: 205, sun: '#fff1dc', sunI: 1.9, hemiT: '#d6e2ea', hemiB: '#b3a084', hemiI: 0.78, top: '#5a8fca', hor: '#dbe6ee', glow: '#ffffff', glowI: 0.2, fog: '#dce4e8', exp: 0.98, inside: 0.55, pool: 0 },
    afternoon: { el: 36, az: 236, sun: '#ffe2bd', sunI: 2.1, hemiT: '#d3e0ea', hemiB: '#b09a7d', hemiI: 0.72, top: '#5288c8', hor: '#dfe6ea', glow: '#ffe7c4', glowI: 0.35, fog: '#dde2e2', exp: 0.95, inside: 0, pool: 0 },
    noon: { el: 62, az: 196, sun: '#fff3e0', sunI: 2.0, hemiT: '#cfe1f1', hemiB: '#bda988', hemiI: 0.76, top: '#4b8bcf', hor: '#d4e5f1', glow: '#ffffff', glowI: 0.2, fog: '#d8e4ec', exp: 0.9, inside: 0, pool: 0 },
    overcast: { el: 45, az: 196, sun: '#ffffff', sunI: 0.28, hemiT: '#e7e9eb', hemiB: '#9d998f', hemiI: 1.3, top: '#b8bdc3', hor: '#e3e4e4', glow: '#ffffff', glowI: 0, fog: '#dcdedf', exp: 1.05, inside: 0.35, pool: 0 },
    golden: { el: 5.5, az: 258, sun: '#ff9d4f', sunI: 2.2, hemiT: '#d9b99e', hemiB: '#57443a', hemiI: 0.5, top: '#3f67a0', hor: '#ffb77a', glow: '#ff9446', glowI: 1.0, fog: '#e9b88f', exp: 1.05, inside: 0.6, pool: 0.12 },
    blue: { el: -5, az: 272, sun: '#6f7fb0', sunI: 0, hemiT: '#3d5590', hemiB: '#15161d', hemiI: 0.5, top: '#0b1b44', hor: '#4d6fb0', glow: '#e79b72', glowI: 0.42, fog: '#2f4677', exp: 1.3, inside: 1, pool: 1 },
    night: { el: -24, az: 300, sun: '#8090c0', sunI: 0, hemiT: '#1b2440', hemiB: '#0a0b10', hemiI: 0.34, top: '#04060c', hor: '#141e35', glow: '#000000', glowI: 0, fog: '#0f1727', exp: 1.4, inside: 1, pool: 1 },
  };
  Previs.TODS = TODS;

  function mixTod(a, b, t) {
    var out = {};
    Object.keys(a).forEach(function (k) {
      if (typeof a[k] === 'number') out[k] = a[k] + (b[k] - a[k]) * t;
      else out[k] = '#' + new THREE.Color(a[k]).lerp(new THREE.Color(b[k]), t).getHexString();
    });
    return out;
  }
  // Blend presets from a sun elevation (used by the sun planner and timelapses).
  function todFromSun(el, az) {
    var stops = [[-24, TODS.night], [-5, TODS.blue], [5.5, TODS.golden], [17, TODS.morning], [62, TODS.noon]];
    var t;
    if (el <= stops[0][0]) t = Object.assign({}, stops[0][1]);
    else if (el >= stops[4][0]) t = Object.assign({}, stops[4][1]);
    else {
      for (var i = 0; i < stops.length - 1; i++) {
        if (el <= stops[i + 1][0]) {
          t = mixTod(stops[i][1], stops[i + 1][1], (el - stops[i][0]) / (stops[i + 1][0] - stops[i][0]));
          break;
        }
      }
    }
    t.el = el;
    t.az = az;
    if (el < -0.5) t.sunI = 0;
    return t;
  }
  Previs.todFromSun = todFromSun;

  var skyGeo, skyMesh, sunSprite, hemi, sun, insideLights = [], poolLight;
  function buildSky(scene) {
    skyGeo = new THREE.SphereGeometry(2000, 48, 24);
    var cols = new Float32Array(skyGeo.attributes.position.count * 3);
    skyGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    skyMesh = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
    skyMesh.renderOrder = -10;
    scene.add(skyMesh);
    sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: '#fff2d6', fog: false, depthWrite: false, transparent: true }));
    sunSprite.scale.set(160, 160, 1);
    scene.add(sunSprite);

    hemi = new THREE.HemisphereLight('#cfe1f1', '#bda988', 0.8);
    scene.add(hemi);
    sun = new THREE.DirectionalLight('#fff3e0', 2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    var sc = sun.shadow.camera;
    sc.left = -46; sc.right = 46; sc.top = 46; sc.bottom = -46; sc.near = 1; sc.far = 400;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    scene.add(sun, sun.target);
    sun.target.position.set(-2, 0, 4);

    [[5.3, 3.9, 1.1, 1.3, 11], [-1.8, 2.0, 1.0, 1.0, 8], [-7.3, 1.9, -1.5, 1.0, 8], [-6.0, 4.9, 2.2, 1.0, 8], [3.4, 1.5, 3.0, 0.6, 6], [6.0, 0.8, -2.2, 0.8, 5]].forEach(function (p, i) {
      var l = new THREE.PointLight(i === 5 ? '#ff8a3c' : '#ffbd78', 0, p[4], 2);
      l.position.set(p[0], p[1], p[2]);
      l.userData.base = p[3] * 3.2;
      scene.add(l);
      insideLights.push(l);
    });
    poolLight = new THREE.PointLight('#38c6e6', 0, 16, 2);
    poolLight.position.set(-1, -0.2, 12);
    scene.add(poolLight);
  }

  function applyTod(renderer, scene, tod) {
    if (typeof tod === 'string') tod = TODS[tod] || TODS.golden;
    var el = tod.el * D2R, az = tod.az * D2R;
    var dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).normalize();
    // sun light from direction (clamped just above horizon for shadow casting)
    var le = Math.max(tod.el, 2) * D2R;
    var ldir = new THREE.Vector3(Math.sin(az) * Math.cos(le), Math.sin(le), -Math.cos(az) * Math.cos(le));
    sun.position.copy(sun.target.position).addScaledVector(ldir, 150);
    sun.color.set(tod.sun);
    sun.intensity = tod.sunI;
    sun.castShadow = tod.sunI > 0.05;
    hemi.color.set(tod.hemiT);
    hemi.groundColor.set(tod.hemiB);
    hemi.intensity = tod.hemiI;
    scene.fog.color.set(tod.fog);
    renderer.toneMappingExposure = tod.exp;

    // sky dome colours
    var top = new THREE.Color(tod.top), hor = new THREE.Color(tod.hor), glow = new THREE.Color(tod.glow);
    var below = hor.clone().multiplyScalar(0.82);
    var pos = skyGeo.attributes.position, col = skyGeo.attributes.color;
    var c = new THREE.Color(), v = new THREE.Vector3();
    for (var i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      if (v.y >= 0) c.copy(hor).lerp(top, Math.pow(v.y, 0.5));
      else c.copy(hor).lerp(below, Math.min(1, -v.y * 5));
      var d = Math.max(0, v.dot(dir));
      var gl = (Math.pow(d, 10) * 0.9 + Math.pow(d, 3) * 0.25) * tod.glowI;
      c.r += glow.r * gl; c.g += glow.g * gl; c.b += glow.b * gl;
      col.setXYZ(i, c.r, c.g, c.b);
    }
    col.needsUpdate = true;
    sunSprite.position.copy(dir).multiplyScalar(1500);
    sunSprite.material.color.set(tod.sun);
    sunSprite.material.opacity = tod.el > -1.5 ? Math.min(1, (tod.el + 1.5) / 3) * (tod.sunI > 0.5 ? 1 : 0.35) : 0;
    sunSprite.scale.setScalar(tod.el < 12 ? 190 : 120);

    // practical lights
    insideLights.forEach(function (l) { l.intensity = l.userData.base * tod.inside; });
    MAT.shade.emissiveIntensity = 1.4 * tod.inside;
    MAT.bulb.emissiveIntensity = 1.8 * tod.inside;
    MAT.fire.emissiveIntensity = 2.2 * Math.max(tod.inside, 0.15);
    MAT.water.emissiveIntensity = 0.75 * tod.pool;
    poolLight.intensity = 2.2 * tod.pool;
    MAT.glass.opacity = 0.2 - 0.06 * tod.inside;
    MAT.glass.emissiveIntensity = 0.55 * Math.max(0, tod.inside - 0.3);
  }

  /* ------------------------------------------------------------------ */
  /* Scene assembly                                                       */
  /* ------------------------------------------------------------------ */
  var scene, person, person2, mirror;
  function buildScene() {
    buildTextures();
    buildMaterials();
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#d8e4ec', 130, 720);
    buildSky(scene);
    buildContext(scene);

    var house = new Builder();
    buildHouse(house);
    var art = buildInterior(house);
    var houseGroup = house.build(MAT, {
      edges: ['render', 'slab', 'timber', 'oak', 'oakDark', 'fabric', 'fabricWarm', 'fabricDark', 'stone', 'travertine', 'marble', 'cushion', 'linen', 'renderIn', 'ceramic'],
      noCast: ['glass', 'bulb'],
    });
    art.forEach(function (a) { houseGroup.add(a); });
    houseGroup.add(WORLD.door);
    scene.add(houseGroup);

    var garden = new Builder();
    buildGarden(garden);
    buildVegetation(garden);
    var gardenGroup = garden.build(MAT, {
      edges: ['render', 'deck', 'travertine', 'stone', 'oak', 'oakDark', 'cushion'],
      noCast: ['gravel', 'asphalt', 'deck', 'poolTile'],
    });
    scene.add(gardenGroup);

    // Mirror world under the pool for reflections (visible only through the pool opening)
    mirror = new THREE.Group();
    [houseGroup, gardenGroup].forEach(function (g) {
      var c = g.clone();
      var drop = [];
      c.traverse(function (o) { o.castShadow = false; if (/^poolTile/.test(o.name)) drop.push(o); });
      drop.forEach(function (o) { o.parent.remove(o); });
      mirror.add(c);
    });
    mirror.scale.y = -1;
    mirror.position.y = 2 * WATER_Y;
    scene.add(mirror);

    person = makePerson();
    person.visible = false;
    scene.add(person);
    person2 = makePerson();
    person2.visible = false;
    scene.add(person2);
  }

  /* ------------------------------------------------------------------ */
  /* Cameras and motion                                                   */
  /* ------------------------------------------------------------------ */
  function vec(a) { return new THREE.Vector3(a[0], a[1], a[2]); }
  function ease(k, t) {
    if (k === 'linear') return t;
    if (k === 'in') return t * t * t;
    if (k === 'out') return 1 - Math.pow(1 - t, 3);
    if (k === 'ramp') { // slow, fast, slow (speed ramp feel)
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // inOut quad
  }

  // Normalise a shot spec: keys => sorted, orbit helper expanded.
  var prepared = new WeakMap();
  function prep(spec) {
    if (spec._prepared) return spec;
    var hit = prepared.get(spec);
    if (hit) return hit;
    var s = Object.assign({}, spec);
    if (s.orbit) {
      var o = s.orbit, keys = [];
      for (var i = 0; i <= 24; i++) {
        var t = i / 24, a = (o.from + (o.to - o.from) * t) * D2R;
        var h = o.height + (o.rise || 0) * t;
        var rad = o.radius + (o.dr || 0) * t;
        keys.push({ t: t, pos: [o.center[0] + Math.sin(a) * rad, h, o.center[2] + Math.cos(a) * rad], target: o.target || o.center, focal: o.focal || 24 });
      }
      s.keys = keys;
      s.curve = 'spline';
    }
    if (!s.keys) s.keys = [{ t: 0, pos: s.pos, target: s.target, focal: s.focal, roll: s.roll, shift: s.shift }];
    s.keys = s.keys.map(function (k, i, arr) {
      var kk = Object.assign({}, k);
      if (kk.t == null) kk.t = arr.length === 1 ? 0 : i / (arr.length - 1);
      if (kk.focal == null) kk.focal = (arr[i - 1] && arr[i - 1].focal) || s.focal || 24;
      return kk;
    });
    if (s.curve === 'spline' && s.keys.length > 2) {
      s._pc = new THREE.CatmullRomCurve3(s.keys.map(function (k) { return vec(k.pos); }), false, 'centripetal');
      s._tc = new THREE.CatmullRomCurve3(s.keys.map(function (k) { return vec(k.target); }), false, 'centripetal');
    }
    s._prepared = true;
    prepared.set(spec, s);
    return s;
  }

  function lerpNum(a, b, t) { return (a == null ? 0 : a) + ((b == null ? 0 : b) - (a == null ? 0 : a)) * t; }

  // Camera pose for normalised time t (0..1)
  function poseAt(spec, t) {
    var s = prep(spec);
    var u = ease(s.ease || 'inOut', Math.min(1, Math.max(0, t)));
    var ks = s.keys;
    var pose;
    if (ks.length === 1) {
      pose = { pos: vec(ks[0].pos), target: vec(ks[0].target), focal: ks[0].focal, roll: ks[0].roll || 0, shift: ks[0].shift || 0 };
    } else {
      var i = 0;
      while (i < ks.length - 2 && u > ks[i + 1].t) i++;
      var a = ks[i], b = ks[i + 1];
      var lt = b.t === a.t ? 0 : (u - a.t) / (b.t - a.t);
      lt = Math.min(1, Math.max(0, lt));
      pose = {
        pos: s._pc ? s._pc.getPoint(u) : vec(a.pos).lerp(vec(b.pos), lt),
        target: s._tc ? s._tc.getPoint(u) : vec(a.target).lerp(vec(b.target), lt),
        focal: lerpNum(a.focal, b.focal, lt),
        roll: lerpNum(a.roll, b.roll, lt),
        shift: lerpNum(a.shift, b.shift, lt),
      };
    }
    if (s.dollyZoom) { // keep the subject the same width while distance changes
      var d0 = vec(ks[0].pos).distanceTo(vec(s.dollyZoom.subject));
      var d = pose.pos.distanceTo(vec(s.dollyZoom.subject));
      pose.focal = ks[0].focal * (d / d0);
    }
    if (s.handheld) {
      var k = s.handheld, tt = t * (s.dur || 6);
      pose.target.x += (Math.sin(tt * 2.1) + Math.sin(tt * 5.3) * 0.4) * 0.03 * k;
      pose.target.y += (Math.sin(tt * 1.7 + 1) + Math.sin(tt * 6.1) * 0.35) * 0.025 * k;
      pose.pos.y += Math.sin(tt * 3.9) * 0.012 * k;
      pose.roll += Math.sin(tt * 1.3) * 0.6 * k;
    }
    if (s.hyper) { // stepped hyperlapse feel: quantise time
      var steps = 26;
      var qu = Math.floor(u * steps) / steps;
      if (qu !== u) return poseAt(Object.assign({}, s, { hyper: false, ease: 'linear' }), qu);
    }
    return pose;
  }
  Previs.poseAt = poseAt;

  function applyCamera(cam, pose, aspect) {
    var f = Math.max(4, pose.focal || 24);
    var tanLong = 18 / f; // full-frame 36 mm long side
    var tanV = aspect >= 1 ? tanLong / aspect : tanLong;
    cam.aspect = aspect;
    var shift = pose.shift || 0;
    if (Math.abs(shift) > 0.001) {
      var H = 1 + 2 * Math.abs(shift);
      cam.fov = (2 * Math.atan(tanV * H)) / D2R;
      var fw = 1000 * aspect, fh = 1000 * H;
      cam.setViewOffset(fw, fh, 0, shift > 0 ? 0 : fh - 1000, fw, 1000);
    } else {
      cam.clearViewOffset();
      cam.fov = (2 * Math.atan(tanV)) / D2R;
    }
    cam.position.copy(pose.pos);
    var dir = pose.target.clone().sub(pose.pos).normalize();
    if (Math.abs(dir.y) > 0.985) cam.up.set(0, 0, -1);
    else cam.up.set(0, 1, 0);
    cam.lookAt(pose.target);
    if (pose.roll) cam.rotateZ(pose.roll * D2R);
    cam.near = pose.pos.y > 25 ? 0.5 : 0.04;
    cam.far = 4000;
    cam.updateProjectionMatrix();
  }

  function placePerson(p, cfg, t, dur) {
    if (!cfg) { p.visible = false; return; }
    p.visible = true;
    var x, z, face = cfg.face || 0, walking = false;
    if (cfg.path) {
      var t0 = cfg.t0 || 0, t1 = cfg.t1 == null ? 1 : cfg.t1;
      var u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
      var pts = cfg.path, segs = pts.length - 1;
      var fu = u * segs, i = Math.min(segs - 1, Math.floor(fu)), lt = fu - i;
      x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * lt;
      z = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * lt;
      face = Math.atan2(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) / D2R;
      walking = u > 0 && u < 1;
    } else { x = cfg.at[0]; z = cfg.at[1]; }
    p.position.set(x, cfg.y || 0.1, z);
    p.rotation.y = face * D2R;
    var sw = walking ? Math.sin(t * (dur || 6) * 7.5) * 0.45 : 0;
    p.userData.legs[0].rotation.x = sw;
    p.userData.legs[1].rotation.x = -sw;
    p.userData.arms[0].rotation.x = -sw * 0.7;
    p.userData.arms[1].rotation.x = sw * 0.7;
    if (cfg.pose === 'sit') {
      p.userData.legs.forEach(function (l) { l.rotation.x = -1.45; });
      p.position.y = (cfg.y || 0.1) - 0.42;
    }
  }

  function setWorld(spec, t) {
    var s = prep(spec);
    // time of day (possibly animated)
    var tod = s.tod || 'golden';
    if (s.todTo) {
      var a = typeof tod === 'string' ? TODS[tod] : tod, b = typeof s.todTo === 'string' ? TODS[s.todTo] : s.todTo;
      tod = mixTod(a, b, Math.min(1, Math.max(0, t)));
    }
    applyTod(Previs._renderer, scene, tod);
    // door
    var d = 0;
    if (s.door === 'open') d = 1;
    else if (Array.isArray(s.door)) d = Math.min(1, Math.max(0, (t - s.door[0]) / (s.door[1] - s.door[0])));
    WORLD.door.rotation.y = -d * 1.35;
    placePerson(person, s.person, t, s.dur);
    placePerson(person2, s.person2, t, s.dur);
    // reflection strength
    MAT.water.opacity = s.reflect != null ? 1 - s.reflect : 0.62;
    mirror.visible = s.mirror !== false;
  }

  /* ------------------------------------------------------------------ */
  /* Renderers                                                            */
  /* ------------------------------------------------------------------ */
  var thumbR, liveR, camT, camL;
  function makeRenderer(canvas, preserve) {
    var r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: !!preserve, powerPreference: 'high-performance' });
    r.outputEncoding = THREE.sRGBEncoding;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    return r;
  }

  function init() {
    if (Previs.ok || Previs.failed) return Previs.ok;
    try {
      var test = document.createElement('canvas');
      var gl = test.getContext('webgl') || test.getContext('experimental-webgl');
      if (!gl) throw new Error('no webgl');
      buildScene();
      thumbR = makeRenderer(document.createElement('canvas'), true);
      thumbR.setPixelRatio(1);
      Previs._renderer = thumbR;
      camT = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 4000);
      camL = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 4000);
      Previs.ok = true;
    } catch (e) {
      Previs.failed = true;
      Previs.error = String(e && e.message || e);
      if (window.console) console.warn('[previs] disabled:', Previs.error);
    }
    return Previs.ok;
  }
  Previs.init = init;

  function renderInto(renderer, cam, spec, t, w, h) {
    Previs._renderer = renderer;
    setWorld(spec, t);
    var pose = poseAt(spec, t);
    applyCamera(cam, pose, w / h);
    renderer.render(scene, cam);
    return pose;
  }

  /* Thumbnails: queued, cached data URLs */
  var cache = new Map(), queue = [], busy = false;
  function key(spec, o) {
    var clean = {};
    Object.keys(spec).forEach(function (k) { if (k.charAt(0) !== '_') clean[k] = spec[k]; });
    return JSON.stringify([clean, o.w, o.h, o.t]);
  }
  Previs.thumb = function (spec, opts) {
    opts = Object.assign({ w: 480, h: 270, t: 0 }, opts || {});
    if (!init()) return Promise.reject(new Error('previs unavailable'));
    var k = key(spec, opts);
    if (cache.has(k)) return Promise.resolve(cache.get(k));
    return new Promise(function (resolve, reject) {
      queue.push({ spec: spec, opts: opts, key: k, resolve: resolve, reject: reject });
      pump();
    });
  };
  function pump() {
    if (busy || !queue.length) return;
    busy = true;
    var run = function () {
      var job = queue.shift();
      try {
        if (cache.has(job.key)) job.resolve(cache.get(job.key));
        else {
          var w = job.opts.w, h = job.opts.h;
          if (thumbR.domElement.width !== w || thumbR.domElement.height !== h) thumbR.setSize(w, h, false);
          renderInto(thumbR, camT, job.spec, job.opts.t, w, h);
          var url = thumbR.domElement.toDataURL('image/jpeg', 0.86);
          cache.set(job.key, url);
          job.resolve(url);
        }
      } catch (e) { job.reject(e); }
      busy = false;
      if (queue.length) requestAnimationFrame(pump);
    };
    requestAnimationFrame(run);
  }
  Previs.clearQueue = function () {
    queue.splice(0).forEach(function (j) { j.reject(new Error('cancelled')); });
  };

  /* Live player: one shared WebGL canvas moved between containers */
  var player = null;
  Previs.player = function (container, spec, opts) {
    if (!init()) return null;
    opts = opts || {};
    if (!liveR) {
      liveR = makeRenderer(document.createElement('canvas'), false);
      liveR.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      liveR.domElement.className = 'pv-canvas';
    }
    if (player) player.destroy();
    var st = {
      spec: spec, t: opts.t || 0, playing: opts.autoplay !== false, aspect: opts.aspect || 16 / 9,
      raf: 0, last: 0, hold: 0, onTick: opts.onTick || null, loop: opts.loop !== false, speed: 1,
    };
    container.appendChild(liveR.domElement);
    function size() {
      var w = container.clientWidth || 320;
      var h = Math.round(w / st.aspect);
      liveR.setSize(w, h, false);
      liveR.domElement.style.width = '100%';
      liveR.domElement.style.height = 'auto';
      liveR.domElement.style.aspectRatio = String(st.aspect);
      return [w, h];
    }
    var dims = size();
    var ro = window.ResizeObserver ? new ResizeObserver(function () { dims = size(); draw(); }) : null;
    if (ro) ro.observe(container);
    function draw() {
      var s = prep(st.spec);
      var pose = renderInto(liveR, camL, s, st.t, dims[0], dims[1]);
      // whip-pan blur
      var blur = 0;
      if (s.whip) {
        var mid = (s.whip[0] + s.whip[1]) / 2, half = (s.whip[1] - s.whip[0]) / 2;
        var dd = Math.abs(ease(s.ease || 'inOut', st.t) - mid);
        if (dd < half) blur = (1 - dd / half) * 9;
      }
      liveR.domElement.style.filter = blur ? 'blur(' + blur.toFixed(1) + 'px)' : '';
      if (st.onTick) st.onTick(st.t, pose);
    }
    function frame(now) {
      st.raf = 0;
      if (!st.playing) return;
      var dt = st.last ? (now - st.last) / 1000 : 0;
      st.last = now;
      var s = prep(st.spec);
      var dur = s.dur || 6;
      if (st.hold > 0) {
        st.hold -= dt;
        if (st.hold <= 0) st.t = 0;
      } else {
        st.t += (dt * st.speed) / dur;
        if (st.t >= 1) {
          st.t = 1;
          if (st.loop) st.hold = 1.1;
          else st.playing = false;
        }
      }
      draw();
      if (st.playing) st.raf = requestAnimationFrame(frame);
    }
    var api = {
      play: function () {
        if (st.t >= 1 && !st.hold) st.t = 0;
        st.playing = true; st.last = 0;
        if (!st.raf) st.raf = requestAnimationFrame(frame);
      },
      pause: function () { st.playing = false; if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; },
      toggle: function () { if (st.playing) api.pause(); else api.play(); return st.playing; },
      seek: function (t) { st.t = Math.min(1, Math.max(0, t)); st.hold = 0; draw(); },
      setSpec: function (s, keepTime) { st.spec = s; if (!keepTime) { st.t = 0; st.hold = 0; } draw(); },
      setAspect: function (a) { st.aspect = a; dims = size(); draw(); },
      setSpeed: function (v) { st.speed = v; },
      get playing() { return st.playing; },
      get t() { return st.t; },
      redraw: draw,
      canvas: liveR.domElement,
      snapshot: function (type) { draw(); return liveR.domElement.toDataURL(type || 'image/jpeg', 0.88); },
      destroy: function () {
        api.pause();
        if (ro) ro.disconnect();
        if (liveR.domElement.parentNode) liveR.domElement.parentNode.removeChild(liveR.domElement);
        liveR.domElement.style.filter = '';
        if (player === api) player = null;
      },
    };
    player = api;
    draw();
    if (st.playing) api.play();
    return api;
  };
  Previs.stopPlayer = function () { if (player) player.destroy(); };

  /* Screen projection of a world point for overlays (uses the last live pose) */
  Previs.project = function (spec, t, aspect, point) {
    var pose = poseAt(spec, t);
    var cam = new THREE.PerspectiveCamera(40, aspect, 0.05, 4000);
    applyCamera(cam, pose, aspect);
    var p = vec(point).project(cam);
    return [(p.x + 1) / 2, (1 - p.y) / 2, p.z];
  };
})();
