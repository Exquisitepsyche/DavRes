/* VAO Shotbook · Application
 * Views: Feel (feeling → recipe), Library (reference), Arcs (story templates),
 * Board (storyboard, timeline, shoot plan, animatic), Tools (lens, sun, frame
 * check, speed & shutter, timelapse, beat grid).
 */
(function () {
  'use strict';
  const VAO = window.VAO;
  const P = VAO.Previs;
  const { LIB, LIBMAP: LM, CATS, FEELINGS: FEEL, FEELMAP: FM, ARCS, ARCMAP, OPT, SPACES: SP, PV, Diag, Sun, Store } = VAO;
  const CATMAP = Object.fromEntries(CATS.map((c) => [c.id, c]));
  const framed = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const round = (v, d = 1) => { const k = Math.pow(10, d); return Math.round(v * k) / k; };
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const tc = (s) => { s = Math.max(0, Math.round(s)); return pad(Math.floor(s / 60)) + ':' + pad(s % 60); };
  const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

  function toast(msg, action) {
    const el = $('#toast');
    el.innerHTML = esc(msg) + (action ? ' <button class="btn small ghost" style="margin-left:8px;color:inherit;border-color:currentColor">' + esc(action.label) + '</button>' : '');
    el.classList.add('show');
    el.style.pointerEvents = action ? 'auto' : 'none';
    if (action) $('button', el).onclick = () => { el.classList.remove('show'); action.fn(); };
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { el.classList.remove('show'); el.style.pointerEvents = 'none'; }, action ? 4200 : 2200);
  }

  async function copyText(text, what) {
    try {
      await navigator.clipboard.writeText(text);
      toast((what || 'Text') + ' copied');
    } catch (err) {
      openSheet({
        label: 'Copy',
        html: '<div class="sec"><span class="label">Select and copy</span><p class="hint">Your browser blocked automatic copying. The text is selected below.</p></div><textarea class="in" id="copy-area" rows="16" readonly>' + esc(text) + '</textarea>',
        onMount: (root) => { const ta = $('#copy-area', root); ta.focus(); ta.select(); },
      });
    }
  }

  function download(name, text, type) {
    const blob = new Blob([text], { type: type || 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function fileToDataURL(file, max = 1600) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k);
        c.height = Math.round(img.naturalHeight * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read this image')); };
      img.src = url;
    });
  }

  const I = (() => {
    const s = (d, extra) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>';
    return {
      feel: s('<circle cx="12" cy="12" r="8.5"/><path d="M8.6 14.2c.9 1.3 2 1.9 3.4 1.9s2.5-.6 3.4-1.9"/><path d="M9.2 9.6h.01M14.8 9.6h.01"/>'),
      library: s('<path d="M4 4.5h4v15H4zM10 4.5h4v15h-4z"/><path d="m16 5.2 3.6-.9 3 14.2-3.6.9z"/>'),
      arcs: s('<path d="M3 16.5c2.2-6 4.8-9 7.5-9s4.3 5 6.5 5 3-1.8 4-3.5"/><circle cx="3" cy="16.5" r="1.2"/><circle cx="21" cy="9" r="1.2"/>'),
      board: s('<rect x="3" y="4" width="8" height="6" rx=".8"/><rect x="13" y="4" width="8" height="6" rx=".8"/><rect x="3" y="14" width="8" height="6" rx=".8"/><rect x="13" y="14" width="8" height="6" rx=".8"/>'),
      tools: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5 15 12M20.5 12 12 15M12 20.5 9 12M3.5 12 12 9"/>'),
      sun: s('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3"/>'),
      moon: s('<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>'),
      play: s('<path d="M7 5v14l12-7z" fill="currentColor" stroke="none"/>'),
      pause: s('<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" stroke="none"/>'),
      plus: s('<path d="M12 5v14M5 12h14"/>'),
      copy: s('<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>'),
      trash: s('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>'),
      up: s('<path d="m6 14 6-6 6 6"/>'),
      down: s('<path d="m6 10 6 6 6-6"/>'),
      grip: s('<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>'),
      close: s('<path d="M6 6l12 12M18 6 6 18"/>'),
      camera: s('<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
      image: s('<rect x="3.5" y="5" width="17" height="14" rx="1"/><path d="m3.5 16 5-5 4 4 3-3 5 5"/><circle cx="15.5" cy="9" r="1.3"/>'),
      restart: s('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>'),
      prev: s('<path d="M18 6 9 12l9 6zM6 6v12"/>'),
      next: s('<path d="M6 6l9 6-9 6zM18 6v12"/>'),
      menu: s('<path d="M5 7h14M5 12h14M5 17h14"/>'),
      edit: s('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
      link: s('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    };
  })();

  /* ------------------------------------------------------------------ */
  /* State & persistence                                                  */
  /* ------------------------------------------------------------------ */
  const S = {
    route: 'feel',
    feel: 'grandeur',
    lib: { cat: 'all', q: '', level: 0, feel: '' },
    boardView: 'frames',
    tool: 'lens',
    index: [],
    project: null,
  };

  const FIELD_LIGHTS = ['dawn', 'day', 'overcast', 'any', 'golden', 'blue', 'night'];
  const SPACE_ORDER = ['context', 'street', 'arrival', 'facade', 'entrance', 'courtyard', 'living', 'kitchen', 'dining', 'stairs', 'bedroom', 'bathroom', 'detail', 'terrace', 'pool', 'garden', 'view', 'rooftop', 'amenity'];

  function speedFor(move) {
    return { timelapse: 'tl', hyperlapse: 'hl', speedramp: 'ramp', static: 'rt' }[move] || 'slow';
  }
  function newShot(o) {
    const s = Object.assign({
      id: uid(), title: 'New shot', beat: '', space: 'facade', size: 'ws', angle: 'eye', lens: 24, move: 'static',
      light: 'golden', speed: null, trans: 'cut', duration: 4, purpose: '', feel: '', comp: [], talent: '', sound: '',
      notes: '', photo: null, done: false,
    }, o || {});
    s.id = uid();
    if (!s.speed) s.speed = speedFor(s.move);
    s.lens = Number(s.lens) || 24;
    s.duration = Number(s.duration) || 4;
    return s;
  }
  function defaultLoc() { return Object.assign({}, Sun.CITIES[0]); }
  function newProject(arc, extra) {
    extra = extra || {};
    const shots = [];
    if (arc) arc.beats.forEach((b) => b.shots.forEach((s) => shots.push(newShot(Object.assign({}, s, { beat: b.name })))));
    return {
      id: uid(), v: 1, name: extra.name || (arc ? arc.name : 'Untitled project'), created: Date.now(), updated: Date.now(),
      arc: arc ? arc.id : null, sample: !!extra.sample,
      settings: Object.assign({
        type: arc && /Riad/.test(arc.for) ? 'Riad' : 'Villa', format: arc ? arc.format : '16:9', target: arc ? arc.target : 60,
        bpm: arc ? arc.bpm : 100, fps: 25, date: todayISO(), loc: defaultLoc(), facade: 180, persona: '',
      }, extra.settings || {}),
      shots,
    };
  }

  async function loadIndex() {
    const idx = await Store.get('index');
    S.index = Array.isArray(idx) ? idx : [];
    return S.index;
  }
  async function saveNow(p) {
    p = p || S.project;
    if (!p) return;
    p.updated = Date.now();
    await Store.set('p:' + p.id, p);
    const row = { id: p.id, name: p.name, updated: p.updated, shots: p.shots.length, sample: !!p.sample };
    const i = S.index.findIndex((x) => x.id === p.id);
    if (i >= 0) S.index[i] = row; else S.index.unshift(row);
    await Store.set('index', S.index);
    Store.pref('current', p.id);
    const pill = $('#proj-pill');
    if (pill) pill.textContent = p.name;
  }
  const saveSoon = debounce(() => saveNow(), 350);
  async function openProject(id) {
    const p = await Store.get('p:' + id);
    if (p) { S.project = p; Store.pref('current', id); }
    return p;
  }
  async function ensureProject() {
    if (S.project) return S.project;
    await loadIndex();
    const cur = Store.pref('current');
    if (cur && (await openProject(cur))) return S.project;
    if (S.index.length && (await openProject(S.index[0].id))) return S.project;
    const p = newProject(ARCMAP.visit, {
      name: 'Villa Palmeraie · Marrakech', sample: true,
      settings: { type: 'Villa', persona: 'Couple in their 40s buying a second home', facade: 180 },
    });
    S.project = p;
    await saveNow(p);
    return p;
  }
  async function switchTo(p) { S.project = p; S.boardView = 'frames'; await saveNow(p); go('board'); }

  /* ------------------------------------------------------------------ */
  /* Sheet (detail panel)                                                 */
  /* ------------------------------------------------------------------ */
  let sheetCleanup = null, sheetReturnFocus = null;
  function openSheet({ label, html, onMount, onClose, wide }) {
    closeSheet(true);
    const scrim = $('#scrim'), sheet = $('#sheet');
    sheetReturnFocus = document.activeElement;
    $('.sheet-head .label', sheet).textContent = label || '';
    const body = $('.sheet-body', sheet);
    body.innerHTML = html;
    body.scrollTop = 0;
    sheet.style.width = wide ? 'min(980px, 100%)' : '';
    scrim.hidden = false;
    sheet.hidden = false;
    requestAnimationFrame(() => { scrim.classList.add('open'); sheet.classList.add('open'); });
    sheetCleanup = onClose || null;
    if (onMount) onMount(body);
    lazyThumbs(body);
    setTimeout(() => $('.sheet-close', sheet).focus({ preventScroll: true }), 30);
  }
  function closeSheet(instant) {
    const scrim = $('#scrim'), sheet = $('#sheet');
    if (sheet.hidden) return;
    if (sheetCleanup) { try { sheetCleanup(); } catch (e) { /* ignore */ } sheetCleanup = null; }
    if (sheetPlayer) { sheetPlayer.destroy(); sheetPlayer = null; }
    scrim.classList.remove('open');
    sheet.classList.remove('open');
    const done = () => { scrim.hidden = true; sheet.hidden = true; $('.sheet-body', sheet).innerHTML = ''; };
    if (instant) done(); else setTimeout(done, 240);
    if (sheetReturnFocus && document.contains(sheetReturnFocus)) sheetReturnFocus.focus({ preventScroll: true });
    if (viewPlayerSpec && !instant) remountViewPlayer();
  }

  /* ------------------------------------------------------------------ */
  /* Thumbnails and players                                               */
  /* ------------------------------------------------------------------ */
  let io = null;
  const thumbSpecs = new WeakMap();
  const tempShots = {};
  function lazyThumbs(root) {
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); loadThumb(en.target); } });
      }, { rootMargin: '400px 0px' });
    }
    $$('[data-thumb]', root).forEach((el) => { if (!el.dataset.loaded) io.observe(el); });
  }
  function specForThumb(el) {
    const k = el.dataset.thumb;
    if (thumbSpecs.has(el)) return thumbSpecs.get(el);
    if (k.startsWith('pv:')) return PV[k.slice(3)];
    if (k.startsWith('tmp:')) { const sh = tempShots[k.slice(4)]; return sh ? VAO.shotSpec(sh, el.dataset.portrait === '1' ? 9 / 16 : 16 / 9).spec : null; }
    if (k.startsWith('shot:')) {
      const shot = S.project && S.project.shots.find((s) => s.id === k.slice(5));
      return shot ? VAO.shotSpec(shot, aspectOf()).spec : null;
    }
    return null;
  }
  function loadThumb(el) {
    el.dataset.loaded = '1';
    const spec = specForThumb(el);
    const img = $('img', el) || el.appendChild(document.createElement('img'));
    img.alt = el.dataset.alt || '';
    if (!spec) return;
    if (!P.init()) {
      el.classList.remove('loading');
      if (!$('.ph', el)) el.insertAdjacentHTML('beforeend', '<div class="ph">3D preview unavailable</div>');
      img.remove();
      return;
    }
    const portrait = el.dataset.portrait === '1';
    const w = Number(el.dataset.w) || (portrait ? 270 : 480), h = Number(el.dataset.h) || (portrait ? 480 : 270);
    el.classList.add('loading');
    P.thumb(spec, { w, h, t: Number(el.dataset.t || 0) }).then((url) => {
      img.src = url;
      el.classList.remove('loading');
    }).catch(() => el.classList.remove('loading'));
  }
  // Render every pending thumbnail now (used before printing).
  function loadAllThumbs(root) {
    $$('[data-thumb]', root).forEach((el) => { if (!el.dataset.loaded) { if (io) io.unobserve(el); loadThumb(el); } });
    return new Promise((resolve) => {
      let n = 0;
      const check = () => { if (!$('[data-thumb].loading', root) || ++n > 120) resolve(); else setTimeout(check, 250); };
      setTimeout(check, 100);
    });
  }
  function thumb(key, opts = {}) {
    const ratio = opts.portrait ? '9 / 16' : '16 / 9';
    return '<div class="frame' + (opts.cls ? ' ' + opts.cls : '') + '" style="aspect-ratio:' + ratio + '" data-thumb="' + esc(key) + '"' +
      (opts.t ? ' data-t="' + opts.t + '"' : '') + (opts.portrait ? ' data-portrait="1"' : '') + (opts.w ? ' data-w="' + opts.w + '" data-h="' + opts.h + '"' : '') +
      ' data-alt="' + esc(opts.alt || '') + '"><img alt="' + esc(opts.alt || '') + '">' + (opts.overlay || '') + '</div>';
  }
  function isAnimated(spec) {
    return !!((spec.keys && spec.keys.length > 1) || spec.orbit || spec.todTo || (spec.person && spec.person.path) || Array.isArray(spec.door) || spec.handheld);
  }

  const TOD_OPTIONS = [['', 'Light: as set'], ['morning', 'Morning'], ['noon', 'Midday'], ['afternoon', 'Afternoon'], ['overcast', 'Overcast'], ['golden', 'Golden hour'], ['blue', 'Blue hour'], ['night', 'Night']];
  const GUIDE_OPTIONS = [['', 'No guides'], ['thirds', 'Thirds'], ['phi', 'Golden ratio'], ['center', 'Center'], ['diagonals', 'Diagonals'], ['v916', '9:16 crop'], ['safe', 'Reel safe zones']];

  function playerHTML(opts = {}) {
    const portrait = opts.portrait;
    return '<div class="player" data-player>' +
      '<div class="frame pv-frame" style="aspect-ratio:' + (portrait ? '9 / 16' : '16 / 9') + ';' + (portrait ? 'max-width:360px;margin:0 auto;width:100%' : '') + '">' +
      '<div class="ph">' + (P.ok || !P.failed ? '' : '3D preview needs WebGL') + '</div><div class="gslot"></div></div>' +
      '<div class="pctl">' +
      '<button class="iconbtn" data-pc="play" aria-label="Play or pause">' + I.pause + '</button>' +
      '<input class="scrub" type="range" min="0" max="1000" value="0" aria-label="Scrub">' +
      '<span class="tc">0.0 s</span>' +
      '<select class="in" data-pc="tod" aria-label="Time of day">' + TOD_OPTIONS.map((o) => '<option value="' + o[0] + '">' + o[1] + '</option>').join('') + '</select>' +
      '<select class="in" data-pc="guide" aria-label="Guides">' + GUIDE_OPTIONS.map((o) => '<option value="' + o[0] + '"' + (opts.guide === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>' +
      (opts.noAspect ? '' : '<button class="btn small ghost" data-pc="aspect">' + (portrait ? '9:16' : '16:9') + '</button>') +
      '</div></div>';
  }

  let sheetPlayer = null, viewPlayer = null, viewPlayerSpec = null, viewPlayerRoot = null;
  function mountPlayer(root, spec, opts = {}) {
    const wrap = $('[data-player]', root);
    if (!wrap || !spec) return null;
    const frame = $('.pv-frame', wrap);
    let aspect = opts.portrait ? 9 / 16 : 16 / 9;
    let cur = Object.assign({}, spec);
    const anim = isAnimated(spec);
    const playBtn = $('[data-pc="play"]', wrap), scrub = $('.scrub', wrap), tcEl = $('.tc', wrap);
    const todSel = $('[data-pc="tod"]', wrap), guideSel = $('[data-pc="guide"]', wrap), aspBtn = $('[data-pc="aspect"]', wrap);
    if (!anim) { playBtn.hidden = true; scrub.hidden = true; tcEl.hidden = true; }
    const ctl = P.player(frame, cur, {
      aspect, autoplay: anim && !window.matchMedia('(prefers-reduced-motion: reduce)').matches, t: opts.t || 0,
      onTick: (t) => {
        scrub.value = String(Math.round(t * 1000));
        tcEl.textContent = (t * (cur.dur || 6)).toFixed(1) + ' s';
      },
    });
    const ph = $('.ph', frame);
    if (!ctl) { if (ph) ph.textContent = '3D preview needs WebGL'; return null; }
    if (ph) ph.remove();
    const setIcon = () => { playBtn.innerHTML = ctl.playing ? I.pause : I.play; };
    setIcon();
    playBtn.onclick = () => { ctl.toggle(); setIcon(); };
    scrub.oninput = () => { ctl.pause(); setIcon(); ctl.seek(scrub.value / 1000); };
    todSel.onchange = () => {
      cur = Object.assign({}, spec);
      if (todSel.value) { cur.tod = todSel.value; delete cur.todTo; }
      ctl.setSpec(cur, true);
    };
    const drawGuides = () => { $('.gslot', frame).innerHTML = guideSel.value ? Diag.guides(guideSel.value, aspect) : ''; };
    guideSel.onchange = drawGuides;
    drawGuides();
    if (aspBtn) aspBtn.onclick = () => {
      const portrait = aspect < 1;
      aspect = portrait ? 16 / 9 : 9 / 16;
      frame.style.aspectRatio = portrait ? '16 / 9' : '9 / 16';
      frame.style.maxWidth = portrait ? '' : '360px';
      frame.style.margin = portrait ? '' : '0 auto';
      aspBtn.textContent = portrait ? '16:9' : '9:16';
      ctl.setAspect(aspect);
      drawGuides();
    };
    return ctl;
  }
  function remountViewPlayer() {
    if (!viewPlayerRoot || !document.contains(viewPlayerRoot)) return;
    if (viewPlayer) viewPlayer.destroy();
    viewPlayer = mountPlayer(viewPlayerRoot, viewPlayerSpec);
  }

  /* ------------------------------------------------------------------ */
  /* Visual for a library entry (card and detail)                         */
  /* ------------------------------------------------------------------ */
  function entryVisualCard(e) {
    if (e.pv && e.portrait) {
      return '<div class="frame"><div class="frame" data-thumb="pv:' + e.pv + '" data-portrait="1" style="position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);height:100%;width:auto;aspect-ratio:9/16"><img alt="">' + (e.guide ? Diag.guides(e.guide, 9 / 16) : '') + '</div></div>';
    }
    if (e.pv) return thumb('pv:' + e.pv, { portrait: false, overlay: e.guide ? Diag.guides(e.guide, 16 / 9) : '', alt: e.name });
    if (e.pair) {
      return '<div class="frame">' +
        '<div data-thumb="pv:' + e.pair[0] + '" class="frame" style="position:absolute;inset:0 50% 0 0;aspect-ratio:auto"><img alt=""></div>' +
        '<div data-thumb="pv:' + e.pair[1] + '" class="frame" style="position:absolute;inset:0 0 0 50%;aspect-ratio:auto;border-left:2px solid var(--bg)"><img alt=""></div></div>';
    }
    if (e.tx) {
      const ab = e.ab || ['tr-a', 'tr-b'];
      return '<div class="frame">' +
        '<div data-thumb="pv:' + ab[0] + '" class="frame" style="position:absolute;inset:0 50% 0 0;aspect-ratio:auto"><img alt=""></div>' +
        '<div data-thumb="pv:' + ab[1] + '" class="frame" style="position:absolute;inset:0 0 0 50%;aspect-ratio:auto;border-left:2px solid var(--bg)"><img alt=""></div>' +
        '<span class="tx-label">A → B</span></div>';
    }
    if (e.grade) {
      return '<div class="frame' + (e.grade === 'film' ? ' grain' : '') + '" data-thumb="pv:size-ws" data-grade="' + e.grade + '"><img alt="" class="g-' + e.grade + '"></div>';
    }
    if (e.dg) return '<div class="frame"><div class="dgwrap">' + Diag.render(e.dg) + '</div></div>';
    return '<div class="frame"><div class="ph">' + esc(CATMAP[e.cat].name) + '</div></div>';
  }

  function entryVisualDetail(e) {
    if (e.pv) return playerHTML({ portrait: !!e.portrait, guide: e.guide || '' });
    if (e.pair) {
      const lb = e.pairLabels || ['A', 'B'];
      return '<div class="split2"><figure>' + thumb('pv:' + e.pair[0], { alt: lb[0] }) + '<figcaption>' + esc(lb[0]) + '</figcaption></figure><figure>' + thumb('pv:' + e.pair[1], { alt: lb[1] }) + '<figcaption>' + esc(lb[1]) + '</figcaption></figure></div>';
    }
    if (e.tx) {
      const ab = e.ab || ['tr-a', 'tr-b'];
      return '<div class="frame" data-txdemo="' + e.tx + '" data-a="' + ab[0] + '" data-b="' + ab[1] + '"><div class="ph">Loading demo…</div></div>' +
        '<div class="row" style="margin-top:8px"><span class="hint">Looping demo: shot A to shot B with this transition.</span></div>';
    }
    if (e.grade) {
      return '<div class="frame' + (e.grade === 'film' ? ' grain' : '') + '" data-gradedemo="' + e.grade + '"><div class="ph">Loading…</div></div>' +
        '<p class="hint" style="margin-top:8px">Drag the divider: left is neutral, right is the ' + esc(e.name.toLowerCase()) + ' grade.</p>';
    }
    if (e.dg) return '<div class="frame" style="aspect-ratio:16/9"><div class="dgwrap">' + Diag.render(e.dg) + '</div></div>';
    return '';
  }

  async function mountDemos(root) {
    const tx = $('[data-txdemo]', root);
    if (tx && P.init()) {
      try {
        const [a, b] = await Promise.all([P.thumb(PV[tx.dataset.a], { w: 640, h: 360 }), P.thumb(PV[tx.dataset.b], { w: 640, h: 360 })]);
        tx.innerHTML = '<div class="tx tx-' + tx.dataset.txdemo + '"><img class="A" src="' + a + '" alt=""><img class="B" src="' + b + '" alt=""><div class="fx"></div></div>';
      } catch (err) { /* keep placeholder */ }
    }
    const gd = $('[data-gradedemo]', root);
    if (gd && P.init()) {
      const url = await P.thumb(PV['size-ws'], { w: 640, h: 360 });
      gd.innerHTML = '<div class="grade"><img src="' + url + '" alt="Neutral"><img class="gB g-' + gd.dataset.gradedemo + '" src="' + url + '" alt="Graded"><div class="bar" role="slider" aria-label="Compare" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div></div>';
      const g = $('.grade', gd), bar = $('.bar', g), B = $('.gB', g);
      const set = (pct) => { pct = clamp(pct, 2, 98); bar.style.left = pct + '%'; B.style.clipPath = 'inset(0 0 0 ' + pct + '%)'; bar.setAttribute('aria-valuenow', Math.round(pct)); };
      let dragging = false;
      const move = (ev) => { if (!dragging) return; const r = g.getBoundingClientRect(); set(((ev.clientX - r.left) / r.width) * 100); };
      g.addEventListener('pointerdown', (ev) => { dragging = true; g.setPointerCapture(ev.pointerId); move(ev); });
      g.addEventListener('pointermove', move);
      g.addEventListener('pointerup', () => { dragging = false; });
      bar.addEventListener('keydown', (ev) => {
        const v = Number(bar.getAttribute('aria-valuenow'));
        if (ev.key === 'ArrowLeft') set(v - 5);
        if (ev.key === 'ArrowRight') set(v + 5);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Library entry sheet                                                  */
  /* ------------------------------------------------------------------ */
  const LEVELS = { 1: 'Essential', 2: 'Pro', 3: 'Signature' };
  function levelBadge(e) { return '<span class="badge' + (e.level === 3 ? ' sig' : '') + '">' + LEVELS[e.level] + '</span>'; }
  function libChip(id, extra) {
    const e = LM[id];
    if (!e) return '';
    return '<button class="chip' + (extra || '') + '" data-open="' + id + '">' + esc(e.name) + '</button>';
  }
  function openEntry(id) {
    const e = LM[id];
    if (!e) return;
    const cat = CATMAP[e.cat];
    const html =
      '<div class="entry-visual">' + entryVisualDetail(e) + '</div>' +
      '<div class="entry-head"><div class="row"><span class="label">' + esc(cat.name) + '</span>' + levelBadge(e) + '</div>' +
      '<h2>' + esc(e.name) + '</h2><p class="lead">' + esc(e.line) + '</p></div>' +
      '<div class="sections">' +
      '<div class="sec"><span class="label">Effect on the viewer</span><p>' + esc(e.effect) + '</p></div>' +
      (e.film ? '<div class="sec"><span class="label">In film</span><p>' + esc(e.film) + '</p></div>' : '') +
      '<div class="sec"><span class="label">In architecture & real estate</span><p>' + esc(e.archi) + '</p></div>' +
      '<div class="sec"><span class="label">How to shoot it</span><p>' + esc(e.how) + '</p></div>' +
      '<div class="sec avoid"><span class="label">Avoid</span><p>' + esc(e.avoid) + '</p></div>' +
      (e.feel && e.feel.length ? '<div class="sec"><span class="label">Serves these feelings</span><div class="chips">' + e.feel.map((f) => FM[f] ? '<button class="chip" data-feel="' + f + '">' + esc(FM[f].name) + '</button>' : '').join('') + '</div></div>' : '') +
      (e.spaces && e.spaces.length ? '<div class="sec"><span class="label">Best spaces</span><div class="chips">' + e.spaces.map((s) => SP[s] ? '<span class="chip" style="cursor:default">' + esc(SP[s].name) + '</span>' : '').join('') + '</div></div>' : '') +
      (e.pairs && e.pairs.length ? '<div class="sec"><span class="label">Pairs well with</span><div class="chips">' + e.pairs.map((p) => libChip(p)).join('') + '</div></div>' : '') +
      '</div>' +
      '<div class="row"><button class="btn primary" data-act="entry-add" data-id="' + e.id + '">' + I.plus + 'Add to the board</button>' +
      (framed ? '' : '<button class="btn ghost" data-act="entry-link" data-id="' + e.id + '">' + I.link + 'Copy link</button>') + '</div>';
    if (viewPlayer) { viewPlayer.destroy(); viewPlayer = null; }
    openSheet({
      label: cat.name + ' · ' + e.name,
      html,
      onMount: (root) => {
        if (e.pv) sheetPlayer = mountPlayer(root, PV[e.pv], { portrait: !!e.portrait });
        mountDemos(root);
      },
    });
  }

  function shotFromEntry(e) {
    const o = { title: e.name, purpose: e.line, space: (e.spaces && e.spaces[0]) || 'facade' };
    const find = (kind) => (OPT[kind].find((r) => r[3] === e.id) || [])[0];
    if (e.cat === 'size') o.size = find('size');
    if (e.cat === 'angle') o.angle = find('angle');
    if (e.cat === 'move' || e.cat === 'drone') {
      const mv = find('move');
      if (mv) o.move = mv;
      if (e.cat === 'drone') { o.angle = 'bird'; o.space = o.space || 'context'; if (!mv) o.move = e.id === 'd-pullback' ? 'rise' : e.id === 'd-lowglide' ? 'pushin' : 'orbit'; }
    }
    if (e.cat === 'trans') o.trans = find('trans') || 'cut';
    if (e.cat === 'light') { const l = find('light'); if (l) o.light = l; }
    if (e.cat === 'speed') { const sp = find('speed'); if (sp) o.speed = sp; if (e.id === 'timelapse') o.move = 'timelapse'; if (e.id === 'hyperlapse') o.move = 'hyperlapse'; }
    if (e.cat === 'comp') o.comp = [e.id];
    if (e.cat === 'lens') {
      const m = { 'l-ultra': 14, 'l-wide': 20, 'l-35': 35, 'l-50': 50, 'l-85': 85, 'l-tele': 135, 'l-macro': 100, 'l-ts': 17 }[e.id];
      if (m) o.lens = m;
      if (e.id === 'l-macro') o.size = 'ecu';
    }
    if (e.cat === 'human') o.talent = e.name;
    if (['focus', 'format', 'color', 'sound', 'rule'].includes(e.cat)) o.notes = e.name + ': ' + e.how;
    if (e.feel && e.feel[0]) o.feel = e.feel[0];
    return newShot(o);
  }
  async function addShotsToBoard(shots, msg) {
    const p = await ensureProject();
    shots.forEach((s) => p.shots.push(s));
    await saveNow(p);
    toast(msg || plural(shots.length, 'shot') + ' added to “' + p.name + '”', { label: 'Open board', fn: () => { closeSheet(true); go('board'); } });
  }

  /* ------------------------------------------------------------------ */
  /* View: Feel                                                           */
  /* ------------------------------------------------------------------ */
  const RECIPE_ROWS = [['size', 'Shot size'], ['angle', 'Angle & height'], ['lens', 'Lens'], ['move', 'Movement'], ['comp', 'Composition'], ['focus', 'Focus'], ['light', 'Light & time'], ['speed', 'Speed'], ['trans', 'Transitions'], ['sound', 'Sound & music'], ['color', 'Grade'], ['human', 'People'], ['format', 'Format'], ['rule', 'Rule']];

  function renderFeel(v, arg) {
    const f = FM[arg] || FM[S.feel] || FEEL[0];
    S.feel = f.id;
    v.innerHTML =
      '<section class="phead"><div class="eyebrow">Feel → Frame</div>' +
      '<h1>Start from the feeling. The frame follows.</h1>' +
      '<p>In films, a close-up makes us feel close to a character and a very wide shot makes us feel their loneliness. Buildings work the same way: the space is the character. Pick what the viewer should feel and get the camera recipe for architecture and real estate, then send it to your storyboard.</p>' +
      '<div class="principles"><span><b>■</b>The space is the character</span><span><b>■</b>Film the visit, not the rooms</span><span><b>■</b>The sun is the director</span></div></section>' +
      '<div class="feel-layout"><div class="feel-list" role="tablist" aria-label="Feelings">' +
      FEEL.map((x) => '<a class="feel-item" href="#feel-' + x.id + '" role="tab" aria-selected="' + (x.id === f.id) + '" data-feelpick="' + x.id + '">' + thumb('pv:' + x.pv, { w: 320, h: 180, alt: x.name }) + '<div><b>' + esc(x.name) + '</b><span>' + esc(x.tag) + '</span></div></a>').join('') +
      '</div><article class="recipe" id="recipe"></article></div>' + footer();
    renderRecipe(f);
    lazyThumbs(v);
  }

  function renderRecipe(f) {
    const el = $('#recipe');
    if (!el) return;
    const rows = RECIPE_ROWS.filter((r) => f.recipe[r[0]] && f.recipe[r[0]].length).map((r) =>
      '<div class="rrow"><span class="label">' + r[1] + '</span><div class="chips">' + f.recipe[r[0]].map((id) => libChip(id)).join('') + '</div></div>').join('');
    const nTech = LIB.filter((e) => e.feel && e.feel.includes(f.id)).length;
    el.innerHTML =
      '<div class="recipe-top">' + playerHTML({ guide: '' }) +
      '<div class="recipe-title"><span class="label">' + esc(f.tag) + '</span><h2>' + esc(f.name) + '</h2><p class="voice">' + esc(f.voice) + '</p>' +
      '<div class="why"><p><b>In film</b>' + esc(f.film) + '</p><p><b>In architecture</b>' + esc(f.archi) + '</p><p><b>Why it works</b>' + esc(f.why) + '</p></div></div></div>' +
      '<div><span class="label">The recipe</span><div class="rtable" style="margin-top:8px">' + rows + '</div></div>' +
      '<div class="facts">' +
      '<div class="fact"><span class="label">Pace</span><p>' + esc(f.pace) + '</p></div>' +
      '<div class="fact"><span class="label">Music</span><p>' + esc(f.music) + '</p></div>' +
      '<div class="fact"><span class="label">Best spaces</span><p>' + f.spaces.map((s) => esc(SP[s] ? SP[s].name : s)).join(', ') + '</p></div>' +
      '<div class="fact"><span class="label accent">Avoid</span><p>' + esc(f.avoid) + '</p></div></div>' +
      '<div><span class="label">Starter sequence</span><div class="mini-shots" style="margin-top:8px">' +
      f.seq.map((s) => { const sh = newShot(s); tempShots[sh.id] = sh; return '<div class="mini-shot">' + seqThumb(sh) + '<b>' + esc(s.title) + '</b><span class="codes">' + codes(sh) + '</span></div>'; }).join('') +
      '</div></div>' +
      '<div class="row"><button class="btn primary" data-act="feel-add" data-id="' + f.id + '">' + I.plus + 'Add this sequence to the board</button>' +
      '<button class="btn" data-act="feel-lib" data-id="' + f.id + '">See all ' + nTech + ' techniques for ' + esc(f.name.toLowerCase()) + '</button></div>';
    viewPlayerSpec = PV[f.pv];
    viewPlayerRoot = el;
    if (viewPlayer) viewPlayer.destroy();
    viewPlayer = mountPlayer(el, viewPlayerSpec);
    lazyThumbs(el);
    $$('.feel-item').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.feelpick === f.id)));
  }
  function seqThumb(sh) {
    const el = '<div class="frame" data-thumb="tmp:' + sh.id + '" style="aspect-ratio:16/9"><img alt="">' + Diag.notation(sh.move, 16 / 9) + '</div>';
    return el;
  }

  /* ------------------------------------------------------------------ */
  /* View: Library                                                        */
  /* ------------------------------------------------------------------ */
  function renderLibrary(v, openId) {
    const L = S.lib;
    v.innerHTML =
      '<section class="phead"><div class="eyebrow">Reference library</div><h1>' + LIB.length + ' techniques and what they do to the viewer</h1>' +
      '<p>Each entry covers the effect on the viewer, a film reference, how it translates to architecture and real estate, how to shoot it and what to avoid. The visuals are rendered on the same previs villa so you can compare choices side by side.</p></section>' +
      '<div class="lib-tools"><div class="lib-search">' +
      '<input id="lib-q" class="in" type="search" placeholder="Search: reveal, twilight, lens, drone…" value="' + esc(L.q) + '" aria-label="Search the library">' +
      '<select id="lib-feel" class="in" aria-label="Filter by feeling"><option value="">Any feeling</option>' + FEEL.map((f) => '<option value="' + f.id + '"' + (L.feel === f.id ? ' selected' : '') + '>' + esc(f.name) + '</option>').join('') + '</select>' +
      '<select id="lib-level" class="in" aria-label="Filter by level"><option value="0">All levels</option><option value="1"' + (L.level == 1 ? ' selected' : '') + '>Essentials</option><option value="2"' + (L.level == 2 ? ' selected' : '') + '>Pro</option><option value="3"' + (L.level == 3 ? ' selected' : '') + '>Signature</option></select>' +
      '</div><div class="scroll-x" id="lib-cats" role="tablist" aria-label="Categories">' +
      '<button class="chip' + (L.cat === 'all' ? ' on' : '') + '" data-cat="all">All <small>' + LIB.length + '</small></button>' +
      CATS.map((c) => '<button class="chip' + (L.cat === c.id ? ' on' : '') + '" data-cat="' + c.id + '">' + esc(c.name) + ' <small>' + LIB.filter((e) => e.cat === c.id).length + '</small></button>').join('') +
      '</div></div><div id="lib-results"></div>' + footer();
    renderLibResults();
    const q = $('#lib-q');
    q.addEventListener('input', debounce(() => { S.lib.q = q.value; renderLibResults(); }, 160));
    $('#lib-feel').onchange = (ev) => { S.lib.feel = ev.target.value; renderLibResults(); };
    $('#lib-level').onchange = (ev) => { S.lib.level = Number(ev.target.value); renderLibResults(); };
    if (openId && LM[openId]) setTimeout(() => openEntry(openId), 50);
  }
  function libFilter() {
    const L = S.lib, q = L.q.trim().toLowerCase();
    return LIB.filter((e) => {
      if (L.cat !== 'all' && e.cat !== L.cat) return false;
      if (L.level && e.level !== L.level) return false;
      if (L.feel && !(e.feel || []).includes(L.feel)) return false;
      if (q) {
        const hay = [e.name, e.line, e.effect, e.film, e.archi, e.how, CATMAP[e.cat].name].join(' ').toLowerCase();
        return q.split(/\s+/).every((w) => hay.includes(w));
      }
      return true;
    });
  }
  function card(e) {
    return '<a class="card" href="#lib-' + e.id + '" data-open="' + e.id + '">' + entryVisualCard(e) +
      '<div class="meta"><span class="label">' + esc(CATMAP[e.cat].name) + '</span>' + (e.level === 3 ? levelBadge(e) : '') + '</div>' +
      '<h3>' + esc(e.name) + '</h3><p>' + esc(e.line) + '</p></a>';
  }
  function renderLibResults() {
    const out = $('#lib-results');
    if (!out) return;
    const list = libFilter();
    $$('#lib-cats .chip').forEach((c) => c.classList.toggle('on', c.dataset.cat === S.lib.cat));
    if (!list.length) { out.innerHTML = '<p class="empty">No technique matches. Try another word or clear the filters.</p>'; return; }
    const grouped = S.lib.cat === 'all' && !S.lib.q && !S.lib.feel && !S.lib.level;
    if (grouped) {
      out.innerHTML = CATS.map((c) => {
        const items = list.filter((e) => e.cat === c.id);
        return '<section class="cat-block"><h2>' + esc(c.name) + ' <small>' + items.length + '</small></h2><p>' + esc(c.blurb) + '</p></section><div class="grid">' + items.map(card).join('') + '</div>';
      }).join('');
    } else {
      const head = S.lib.cat !== 'all' ? '<section class="cat-block"><h2>' + esc(CATMAP[S.lib.cat].name) + ' <small>' + list.length + '</small></h2><p>' + esc(CATMAP[S.lib.cat].blurb) + '</p></section>' : '<p class="label" style="margin-top:6px">' + plural(list.length, 'result') + '</p>';
      out.innerHTML = head + '<div class="grid">' + list.map(card).join('') + '</div>';
    }
    lazyThumbs(out);
  }

  /* ------------------------------------------------------------------ */
  /* View: Arcs                                                           */
  /* ------------------------------------------------------------------ */
  function arcDuration(a) { return a.beats.reduce((t, b) => t + b.shots.reduce((u, s) => u + s.duration, 0), 0); }
  function beatsStrip(a, hot) {
    const tot = arcDuration(a);
    return '<div class="beats">' + a.beats.map((b) => {
      const d = b.shots.reduce((u, s) => u + s.duration, 0);
      return '<div style="flex:' + d / tot + '"' + (hot && hot === b.name ? ' class="hot"' : '') + ' title="' + esc(b.name) + ' · ' + round(d) + ' s">' + esc(b.name) + '</div>';
    }).join('') + '</div>';
  }
  function renderArcs(v) {
    v.innerHTML =
      '<section class="phead"><div class="eyebrow">Story arcs</div><h1>Ready-made structures for property films</h1>' +
      '<p>Each arc is a complete storyboard: beats that explain why they exist, and shots with size, angle, lens, movement, light, duration and transition. Start from one, then adapt it to the property.</p></section>' +
      '<div class="arc-grid">' + ARCS.map((a) =>
        '<article class="arc' + (a.signature ? ' sig' : '') + '"><div class="row" style="justify-content:space-between"><span class="label">' + esc(a.for) + '</span>' + (a.signature ? '<span class="badge sig">VAO signature</span>' : '') + '</div>' +
        '<h2>' + esc(a.name) + '</h2><div class="arc-meta"><span class="badge">' + a.format + '</span><span class="badge">' + tc(arcDuration(a)) + '</span><span class="badge">' + a.bpm + ' BPM</span><span class="badge">' + a.beats.reduce((n, b) => n + b.shots.length, 0) + ' shots</span></div>' +
        beatsStrip(a) + '<p>' + esc(a.blurb) + '</p>' +
        '<div class="row"><button class="btn primary" data-act="arc-use" data-id="' + a.id + '">Start a board from this arc</button><button class="btn ghost" data-act="arc-view" data-id="' + a.id + '">See the shots</button></div></article>').join('') +
      '</div>' + footer();
  }
  function openArc(id) {
    const a = ARCMAP[id];
    if (!a) return;
    const portrait = a.format === '9:16';
    const html =
      '<div class="entry-head"><div class="row"><span class="label">' + esc(a.for) + '</span><span class="badge">' + a.format + '</span><span class="badge">' + tc(arcDuration(a)) + '</span><span class="badge">' + a.bpm + ' BPM</span></div>' +
      '<h2>' + esc(a.name) + '</h2><p class="lead">' + esc(a.blurb) + '</p></div>' + beatsStrip(a) +
      '<div class="beat-list">' + a.beats.map((b) =>
        '<section class="beat-block"><header><span class="label accent">' + esc(b.name) + '</span><p class="hint">' + esc(b.why) + '</p></header><div class="mini-shots">' +
        b.shots.map((s) => { const sh = newShot(s); tempShots[sh.id] = sh; return '<div class="mini-shot">' + '<div class="frame" data-thumb="tmp:' + sh.id + '" style="aspect-ratio:' + (portrait ? '9/16' : '16/9') + '"' + (portrait ? ' data-portrait="1"' : '') + '><img alt="">' + Diag.notation(sh.move, portrait ? 9 / 16 : 16 / 9) + '</div><b>' + esc(s.title) + '</b><span class="codes">' + codes(sh) + ' · ' + s.duration + 's</span><span class="hint">' + esc(s.purpose) + '</span></div>'; }).join('') +
        '</div></section>').join('') + '</div>' +
      '<div class="row"><button class="btn primary" data-act="arc-use" data-id="' + a.id + '">Start a board from this arc</button></div>';
    openSheet({ label: 'Story arc · ' + a.name, html, wide: true });
  }
  async function useArc(id) {
    const a = ARCMAP[id];
    const p = newProject(a, { name: a.name + ' · ' + new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) });
    closeSheet(true);
    await switchTo(p);
    toast('New board from “' + a.name + '”');
  }

  /* ------------------------------------------------------------------ */
  /* Board                                                               */
  /* ------------------------------------------------------------------ */
  function aspectOf() { return VAO.aspectOf(S.project ? S.project.settings.format : '16:9'); }
  function code(kind, v) { const o = VAO.opt(kind, v); return o ? o[2] : String(v || '').toUpperCase(); }
  function codes(s) { return [code('size', s.size), code('angle', s.angle), s.lens + 'MM', code('move', s.move), code('light', s.light)].join(' · '); }
  function total(p) { return p.shots.reduce((t, s) => t + (Number(s.duration) || 0), 0); }

  async function renderBoard(v) {
    const p = await ensureProject();
    if (S.route !== 'board') return;
    const st = p.settings;
    v.innerHTML =
      (p.sample ? '<div class="banner no-print" style="margin-bottom:16px"><span class="badge sample">Sample</span><p>This sample board follows the VAO signature arc on the previs villa. Edit anything, or start fresh from an arc.</p><span class="menu"><button class="btn small" data-act="board-new">New board</button></span></div>' : '') +
      '<div class="print-head"><h1>' + esc(p.name) + '</h1><p>' + esc(st.type) + ' · ' + st.format + ' · ' + tc(total(p)) + ' · ' + plural(p.shots.length, 'shot') + '</p></div>' +
      '<div class="board-head no-print"><div class="title-row"><input class="proj-title" id="proj-title" value="' + esc(p.name) + '" aria-label="Project name">' +
      '<div class="row board-actions"><div class="menu"><button class="btn" data-act="menu-projects">Projects</button></div><div class="menu"><button class="btn" data-act="menu-export">Share & export</button></div></div></div>' +
      '<details class="meta"' + (window.innerWidth > 760 ? ' open' : '') + '><summary>Project settings \u00b7 ' + esc(st.type) + ' \u00b7 ' + st.format + ' \u00b7 ' + esc((st.loc || {}).name || '') + '</summary><div class="meta-grid">' +
      field('Property', '<select class="in" data-set="type">' + OPT.types.map((t) => '<option' + (st.type === t ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>') +
      field('Format', '<select class="in" data-set="format">' + OPT.format.map((f) => '<option' + (st.format === f[0] ? ' selected' : '') + '>' + f[0] + '</option>').join('') + '</select>') +
      field('Target (s)', '<input class="in num" type="number" min="5" max="900" step="1" data-set="target" value="' + st.target + '">') +
      field('Music BPM', '<input class="in num" type="number" min="40" max="200" step="1" data-set="bpm" value="' + st.bpm + '">') +
      field('Frame rate', '<select class="in" data-set="fps">' + [24, 25, 30].map((f) => '<option' + (Number(st.fps) === f ? ' selected' : '') + '>' + f + '</option>').join('') + '</select>') +
      field('Location', '<select class="in" data-set="loc">' + Sun.CITIES.map((c) => '<option' + (st.loc && st.loc.name === c.name ? ' selected' : '') + '>' + c.name + '</option>').join('') + (st.loc && !Sun.CITIES.some((c) => c.name === st.loc.name) ? '<option selected>' + esc(st.loc.name) + '</option>' : '') + '</select>') +
      field('Shoot date', '<input class="in" type="date" data-set="date" value="' + esc(st.date) + '">') +
      field('Facade faces', '<select class="in" data-set="facade">' + COMPASS.map((c) => '<option value="' + c[1] + '"' + (Number(st.facade) === c[1] ? ' selected' : '') + '>' + c[0] + ' (' + c[1] + '°)</option>').join('') + (COMPASS.some((c) => c[1] === Number(st.facade)) ? '' : '<option value="' + Number(st.facade) + '" selected>' + Number(st.facade) + '°</option>') + '</select>') +
      '</div></details><div class="runtime" id="runtime"></div></div>' +
      '<div class="tabs no-print" role="tablist">' + [['frames', 'Frames'], ['timeline', 'Timeline'], ['plan', 'Shoot plan'], ['animatic', 'Animatic']].map((t) => '<button role="tab" aria-selected="' + (S.boardView === t[0]) + '" data-bview="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div id="board-body"></div>' + footer();
    updateRuntime();
    const title = $('#proj-title');
    title.addEventListener('input', () => { p.name = title.value || 'Untitled project'; saveSoon(); });
    $$('[data-set]', v).forEach((el) => el.addEventListener('change', () => {
      const k = el.dataset.set;
      if (k === 'loc') st.loc = Object.assign({}, Sun.CITIES.find((c) => c.name === el.value) || st.loc);
      else if (['target', 'bpm', 'fps', 'facade'].includes(k)) st[k] = Number(el.value);
      else st[k] = el.value;
      p.sample = false;
      saveSoon();
      updateRuntime();
      if (k === 'format' || (S.boardView === 'plan' && ['loc', 'date', 'facade'].includes(k))) renderBoardBody();
    }));
    renderBoardBody();
  }
  const COMPASS = [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]];
  function field(label, control) { return '<label class="f"><span>' + label + '</span>' + control + '</label>'; }

  function updateRuntime() {
    const el = $('#runtime');
    if (!el || !S.project) return;
    const p = S.project, t = total(p), target = Number(p.settings.target) || 60;
    const pct = clamp((t / target) * 100, 0, 100);
    const over = t > target * 1.05;
    const n = p.shots.length;
    el.innerHTML = '<div class="rt-bar"><i class="' + (over ? 'over' : '') + '" style="width:' + pct + '%"></i></div>' +
      '<div class="rt-row"><span>Runtime <b>' + tc(t) + '</b> / target ' + tc(target) + (over ? ' · <b class="accent">' + tc(t - target) + ' over</b>' : '') + '</span>' +
      '<span>' + plural(n, 'shot') + ' · average ' + (n ? round(t / n) : 0) + ' s · ' + round(240 / (p.settings.bpm || 100), 2) + ' s per bar</span></div>';
  }

  function renderBoardBody() {
    const body = $('#board-body');
    if (!body) return;
    if (viewPlayer) { viewPlayer.destroy(); viewPlayer = null; }
    stopAnimatic();
    $$('.tabs [data-bview]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.bview === S.boardView)));
    if (S.boardView === 'timeline') renderTimeline(body);
    else if (S.boardView === 'plan') renderPlan(body);
    else if (S.boardView === 'animatic') renderAnimatic(body);
    else renderFrames(body);
  }

  function shotCard(s, i, portrait) {
    const media = s.photo
      ? '<div class="frame" data-edit="' + s.id + '" style="aspect-ratio:' + (portrait ? '9/16' : '16/9') + '"><img src="' + s.photo + '" alt="' + esc(s.title) + '">' + Diag.notation(s.move, aspectOf()) + '</div>'
      : '<div class="frame" data-edit="' + s.id + '" data-thumb="shot:' + s.id + '" data-t="0.3" style="aspect-ratio:' + (portrait ? '9/16' : '16/9') + '"' + (portrait ? ' data-portrait="1"' : '') + '><img alt="' + esc(s.title) + '">' + Diag.notation(s.move, aspectOf()) + '<span class="kind">PREVIS</span></div>';
    return '<article class="shot' + (s.done ? ' done' : '') + '" data-id="' + s.id + '">' +
      '<div style="position:relative">' + media + '<div class="slate"><span class="no">' + pad(i + 1) + '</span></div><span class="dur">' + round(s.duration) + ' s</span></div>' +
      '<div class="shot-body"><span class="beat">' + esc(s.beat || '—') + ' · ' + esc(SP[s.space] ? SP[s.space].name : s.space) + '</span>' +
      '<h3>' + esc(s.title) + '</h3>' + (s.purpose ? '<p class="purpose">' + esc(s.purpose) + '</p>' : '') +
      '<span class="codes">' + codes(s) + '</span><span class="codes">→ ' + code('trans', s.trans) + (s.talent ? ' · TALENT' : '') + '</span></div>' +
      '<div class="shot-tools"><button class="grip" aria-label="Drag to reorder" title="Drag to reorder">' + I.grip + '</button>' +
      '<button data-sact="up" aria-label="Move earlier">' + I.up + '</button><button data-sact="down" aria-label="Move later">' + I.down + '</button>' +
      '<button data-sact="dup" aria-label="Duplicate">' + I.copy + '</button><button data-sact="edit" aria-label="Edit">' + I.edit + '</button></div></article>';
  }
  function renderFrames(body) {
    const p = S.project, portrait = aspectOf() < 1;
    body.innerHTML = '<div class="frames' + (portrait ? ' portrait' : '') + '" id="frames">' + p.shots.map((s, i) => shotCard(s, i, portrait)).join('') +
      '<button class="add-shot no-print" data-act="shot-add" style="aspect-ratio:' + (portrait ? '9/16' : '16/9') + '">' + '+ Add a shot' + '</button></div>';
    lazyThumbs(body);
    enableDrag($('#frames'));
  }
  function refreshCard(id) {
    const p = S.project, i = p.shots.findIndex((s) => s.id === id), el = $('.shot[data-id="' + id + '"]');
    if (!el || i < 0) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = shotCard(p.shots[i], i, aspectOf() < 1);
    el.replaceWith(tmp.firstChild);
    lazyThumbs($('#frames'));
  }
  function moveShot(id, delta) {
    const a = S.project.shots, i = a.findIndex((s) => s.id === id), j = clamp(i + delta, 0, a.length - 1);
    if (i < 0 || i === j) return;
    const [s] = a.splice(i, 1);
    a.splice(j, 0, s);
    S.project.sample = false;
    saveSoon();
    renderFrames($('#board-body'));
  }
  function enableDrag(grid) {
    if (!grid) return;
    let drag = null;
    const hover = () => {
      const el = document.elementFromPoint(drag.x, drag.y);
      const over = el && (el.closest('.shot') || el.closest('.add-shot'));
      $$('.drop-before', grid).forEach((x) => x.classList.remove('drop-before'));
      drag.over = null;
      if (over && over !== drag.card && grid.contains(over)) {
        if (over.classList.contains('shot')) over.classList.add('drop-before');
        drag.over = over.dataset.id || 'end';
      }
    };
    // keep scrolling while the pointer rests near the top or bottom edge
    const edgeScroll = () => {
      if (!drag) return;
      const top = 96, bottom = window.innerHeight - (window.innerWidth <= 760 ? 110 : 60);
      const dy = drag.y < top ? -Math.ceil((top - drag.y) / 6) : drag.y > bottom ? Math.ceil((drag.y - bottom) / 6) : 0;
      if (dy) { window.scrollBy(0, dy); hover(); }
      drag.raf = requestAnimationFrame(edgeScroll);
    };
    grid.addEventListener('pointerdown', (ev) => {
      const grip = ev.target.closest('.grip');
      if (!grip) return;
      ev.preventDefault();
      const cardEl = grip.closest('.shot');
      drag = { id: cardEl.dataset.id, card: cardEl, over: null, x: ev.clientX, y: ev.clientY, raf: 0 };
      grip.setPointerCapture(ev.pointerId);
      cardEl.classList.add('dragging');
      drag.raf = requestAnimationFrame(edgeScroll);
    });
    grid.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      drag.x = ev.clientX;
      drag.y = ev.clientY;
      hover();
    });
    const end = () => {
      if (!drag) return;
      cancelAnimationFrame(drag.raf);
      const { id, over, card: c } = drag;
      drag = null;
      c.classList.remove('dragging');
      $$('.drop-before', grid).forEach((x) => x.classList.remove('drop-before'));
      if (!over) return;
      const a = S.project.shots, i = a.findIndex((s) => s.id === id);
      const [s] = a.splice(i, 1);
      const j = over === 'end' ? a.length : a.findIndex((x) => x.id === over);
      a.splice(j < 0 ? a.length : j, 0, s);
      S.project.sample = false;
      saveSoon();
      renderFrames($('#board-body'));
    };
    grid.addEventListener('pointerup', end);
    grid.addEventListener('pointercancel', end);
  }

  /* ---- Shot editor ---- */
  function optSelect(kind, value, attr) {
    return '<select class="in" data-f="' + attr + '">' + OPT[kind].map((o) => '<option value="' + o[0] + '"' + (o[0] === value ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
  }
  function whyLine(kind, value) {
    const o = VAO.opt(kind, value);
    const e = o && o[3] ? LM[o[3]] : null;
    return e ? esc(e.line) + ' <a href="#" data-open="' + e.id + '">More</a>' : '';
  }
  function lensLine(f) {
    const h = (2 * Math.atan(18 / f) * 180) / Math.PI;
    const ch = f < 16 ? 'ultra-wide: exaggerates space' : f < 24 ? 'wide: interior standard' : f < 40 ? 'natural perspective' : f < 70 ? 'normal: calm, isolates' : f < 150 ? 'short tele: compression' : 'telephoto: strong compression';
    return 'Horizontal view ' + Math.round(h) + '° on full frame · ' + ch;
  }
  function durLine(d) {
    const bpm = S.project.settings.bpm || 100, beat = 60 / bpm;
    return round(d / beat, 1) + ' beats · ' + round(d / (beat * 4), 2) + ' bars at ' + bpm + ' BPM';
  }
  function openShot(id) {
    const p = S.project, s = p.shots.find((x) => x.id === id);
    if (!s) return;
    const i = p.shots.indexOf(s);
    const portrait = aspectOf() < 1;
    const html =
      '<div class="ed">' +
      '<div class="row"><button class="btn small' + (s.photo ? '' : ' primary') + '" data-ed="show-previs">Previs</button><button class="btn small' + (s.photo ? ' primary' : '') + '" data-ed="show-photo"' + (s.photo ? '' : ' disabled') + '>Photo</button>' +
      '<label class="btn small ghost">' + I.camera + 'Take photo<input type="file" accept="image/*" capture="environment" hidden data-ed="photo"></label>' +
      '<label class="btn small ghost">' + I.image + 'Choose image<input type="file" accept="image/*" hidden data-ed="photo"></label>' +
      (s.photo ? '<button class="btn small ghost danger" data-ed="photo-del">Remove photo</button>' : '') + '</div>' +
      '<div id="ed-media">' + (s.photo ? photoFrame(s, portrait) : playerHTML({ portrait, noAspect: true })) + '</div>' +
      '<div class="ed-note" id="ed-note" hidden></div>' +
      '<div class="ed-grid">' +
      '<label class="f full"><span>Title</span><input class="in" data-f="title" value="' + esc(s.title) + '"></label>' +
      '<label class="f"><span>Beat</span><input class="in" data-f="beat" value="' + esc(s.beat) + '" list="beats-list"></label>' +
      '<label class="f"><span>Space</span><select class="in" data-f="space">' + Object.keys(SP).map((k) => '<option value="' + k + '"' + (k === s.space ? ' selected' : '') + '>' + esc(SP[k].name) + '</option>').join('') + '</select></label>' +
      '<label class="f"><span>Feeling</span><select class="in" data-f="feel"><option value="">—</option>' + FEEL.map((f) => '<option value="' + f.id + '"' + (f.id === s.feel ? ' selected' : '') + '>' + esc(f.name) + '</option>').join('') + '</select></label>' +
      '<label class="f"><span>Duration (s)</span><input class="in num" type="number" min="0.5" max="120" step="0.5" data-f="duration" value="' + s.duration + '"><span class="why-line" data-why="duration">' + durLine(s.duration) + '</span></label>' +
      '<label class="f full"><span>Purpose: what should the viewer feel or learn?</span><textarea class="in" data-f="purpose" rows="2">' + esc(s.purpose) + '</textarea></label>' +
      '<label class="f"><span>Shot size</span>' + optSelect('size', s.size, 'size') + '<span class="why-line" data-why="size">' + whyLine('size', s.size) + '</span></label>' +
      '<label class="f"><span>Angle & height</span>' + optSelect('angle', s.angle, 'angle') + '<span class="why-line" data-why="angle">' + whyLine('angle', s.angle) + '</span></label>' +
      '<label class="f"><span>Lens (mm, full-frame eq.)</span><input class="in num" type="number" min="8" max="400" step="1" list="lens-list" data-f="lens" value="' + s.lens + '"><span class="why-line" data-why="lens">' + lensLine(s.lens) + '</span></label>' +
      '<label class="f"><span>Movement</span>' + optSelect('move', s.move, 'move') + '<span class="why-line" data-why="move">' + whyLine('move', s.move) + '</span></label>' +
      '<label class="f"><span>Light & time</span>' + optSelect('light', s.light, 'light') + '<span class="why-line" data-why="light">' + whyLine('light', s.light) + '</span></label>' +
      '<label class="f"><span>Speed & frame rate</span>' + optSelect('speed', s.speed, 'speed') + '<span class="why-line" data-why="speed">' + whyLine('speed', s.speed) + '</span></label>' +
      '<label class="f full"><span>Transition to the next shot</span>' + optSelect('trans', s.trans, 'trans') + '<span class="why-line" data-why="trans">' + whyLine('trans', s.trans) + '</span></label>' +
      '<div class="f full"><span class="label">Composition</span><div class="chips comp-chips">' + LIB.filter((e) => e.cat === 'comp').map((e) => '<button type="button" class="chip' + (s.comp.includes(e.id) ? ' on' : '') + '" data-comp="' + e.id + '">' + esc(e.name) + '</button>').join('') + '</div></div>' +
      '<label class="f"><span>Talent</span><input class="in" data-f="talent" value="' + esc(s.talent) + '" placeholder="e.g. back to camera, hands only"></label>' +
      '<label class="f"><span>Sound</span><input class="in" data-f="sound" value="' + esc(s.sound) + '" placeholder="e.g. fountain ambience, music drop"></label>' +
      '<label class="f full"><span>Notes for the shoot</span><textarea class="in" data-f="notes" rows="3" placeholder="Gear, settings, props, prep">' + esc(s.notes) + '</textarea></label>' +
      '<label class="f full" style="grid-template-columns:auto 1fr;align-items:center;gap:10px"><input type="checkbox" data-f="done"' + (s.done ? ' checked' : '') + ' style="width:18px;height:18px;accent-color:var(--accent)"><span style="text-transform:none;letter-spacing:0;font-family:var(--font);font-size:13px;color:var(--ink)">Shot captured</span></label>' +
      '</div>' +
      '<datalist id="lens-list">' + OPT.lens.map((l) => '<option value="' + l + '">').join('') + '</datalist>' +
      '<datalist id="beats-list">' + Array.from(new Set(p.shots.map((x) => x.beat).filter(Boolean))).map((b) => '<option value="' + esc(b) + '">').join('') + '</datalist>' +
      '<div class="row" style="justify-content:space-between"><div class="row"><button class="btn" data-ed="dup">' + I.copy + 'Duplicate</button><span id="del-slot"><button class="btn danger" data-ed="del">' + I.trash + 'Delete</button></span></div>' +
      '<div class="row"><button class="btn ghost" data-ed="prev"' + (i === 0 ? ' disabled' : '') + '>' + I.prev + 'Previous</button><button class="btn ghost" data-ed="next"' + (i === p.shots.length - 1 ? ' disabled' : '') + '>Next' + I.next + '</button></div></div>' +
      '</div>';
    openSheet({
      label: 'Shot ' + pad(i + 1) + ' · ' + s.title,
      html,
      onMount: (root) => wireEditor(root, s),
      onClose: () => { if (S.route === 'board' && S.boardView !== 'frames') setTimeout(renderBoardBody, 0); },
    });
  }
  function photoFrame(s, portrait) {
    return '<div class="frame" style="aspect-ratio:' + (portrait ? '9/16' : '16/9') + ';' + (portrait ? 'max-width:360px;margin:0 auto' : '') + '"><img src="' + s.photo + '" alt=""><div class="gslot">' + Diag.guides('thirds', portrait ? 9 / 16 : 16 / 9) + '</div>' + Diag.notation(s.move, portrait ? 9 / 16 : 16 / 9) + '</div>';
  }
  function wireEditor(root, s) {
    const portrait = aspectOf() < 1;
    let showPhoto = !!s.photo;
    const mountMedia = () => {
      if (sheetPlayer) { sheetPlayer.destroy(); sheetPlayer = null; }
      const box = $('#ed-media', root);
      if (showPhoto && s.photo) { box.innerHTML = photoFrame(s, portrait); }
      else {
        box.innerHTML = playerHTML({ portrait, noAspect: true });
        const r = VAO.shotSpec(s, aspectOf());
        sheetPlayer = mountPlayer(box, r.spec, { portrait });
      }
      updateNote();
    };
    const updateNote = () => {
      const r = VAO.shotSpec(s, aspectOf());
      const n = $('#ed-note', root);
      n.hidden = !r.note;
      n.textContent = r.note;
    };
    const refreshPrevis = debounce(() => {
      if (showPhoto && s.photo) return;
      const r = VAO.shotSpec(s, aspectOf());
      if (sheetPlayer) sheetPlayer.setSpec(r.spec);
      updateNote();
    }, 120);
    mountMedia();
    const commit = () => { S.project.sample = false; saveSoon(); refreshCard(s.id); updateRuntime(); $('.sheet-head .label').textContent = 'Shot ' + pad(S.project.shots.indexOf(s) + 1) + ' · ' + s.title; };
    root.addEventListener('input', (ev) => {
      const el = ev.target, k = el.dataset.f;
      if (!k) return;
      if (k === 'done') s.done = el.checked;
      else if (k === 'lens' || k === 'duration') { const n = Number(el.value); if (!n) return; s[k] = n; }
      else s[k] = el.value;
      if (k === 'move') { s.speed = speedFor(s.move); const sp = $('[data-f="speed"]', root); if (sp) sp.value = s.speed; $('[data-why="speed"]', root).innerHTML = whyLine('speed', s.speed); }
      const why = $('[data-why="' + k + '"]', root);
      if (why) why.innerHTML = k === 'lens' ? lensLine(s.lens) : k === 'duration' ? durLine(s.duration) : whyLine(k, s[k]);
      if (['space', 'size', 'angle', 'lens', 'move', 'light', 'duration', 'talent'].includes(k)) refreshPrevis();
      commit();
    });
    root.addEventListener('click', async (ev) => {
      const comp = ev.target.closest('[data-comp]');
      if (comp) {
        const id = comp.dataset.comp;
        s.comp = s.comp.includes(id) ? s.comp.filter((x) => x !== id) : s.comp.concat(id);
        comp.classList.toggle('on');
        commit();
        return;
      }
      const b = ev.target.closest('[data-ed]');
      if (!b || b.tagName === 'INPUT') return;
      const a = b.dataset.ed, p = S.project, i = p.shots.indexOf(s);
      if (a === 'show-previs') { showPhoto = false; mountMedia(); setMediaBtns(); }
      if (a === 'show-photo' && s.photo) { showPhoto = true; mountMedia(); setMediaBtns(); }
      if (a === 'photo-del') { s.photo = null; showPhoto = false; commit(); openShot(s.id); }
      if (a === 'dup') { const c = newShot(Object.assign({}, s, { title: s.title + ' (copy)', done: false })); p.shots.splice(i + 1, 0, c); saveSoon(); renderFrames($('#board-body')); openShot(c.id); }
      if (a === 'del') {
        $('#del-slot', root).innerHTML = '<span class="confirm">Delete this shot? <button class="btn small danger" data-ed="del-yes">Delete</button><button class="btn small ghost" data-ed="del-no">Keep</button></span>';
      }
      if (a === 'del-no') $('#del-slot', root).innerHTML = '<button class="btn danger" data-ed="del">' + I.trash + 'Delete</button>';
      if (a === 'del-yes') { p.shots.splice(i, 1); saveSoon(); closeSheet(); renderFrames($('#board-body')); updateRuntime(); toast('Shot deleted'); }
      if (a === 'prev' && i > 0) openShot(p.shots[i - 1].id);
      if (a === 'next' && i < p.shots.length - 1) openShot(p.shots[i + 1].id);
    });
    const setMediaBtns = () => {
      const bp = $('[data-ed="show-previs"]', root), bph = $('[data-ed="show-photo"]', root);
      bp.classList.toggle('primary', !showPhoto);
      bph.classList.toggle('primary', showPhoto);
    };
    $$('input[type=file][data-ed="photo"]', root).forEach((inp) => inp.addEventListener('change', async () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      try {
        s.photo = await fileToDataURL(f, 1600);
        commit();
        openShot(s.id);
      } catch (err) { toast(err.message); }
    }));
  }

  /* ---- Timeline ---- */
  function renderTimeline(body) {
    const p = S.project, t = total(p) || 1, bpm = p.settings.bpm || 100, bar = 240 / bpm, target = Number(p.settings.target) || t;
    const span = Math.max(t, target);
    let ticks = '';
    const nBeats = Math.floor(span / (bar / 4));
    for (let b = 0; b <= nBeats; b++) {
      const x = ((b * bar) / 4 / span) * 100, isBar = b % 4 === 0;
      if (nBeats > 240 && !isBar) continue;
      ticks += '<i class="' + (isBar ? 'bar' : '') + '" style="left:' + x + '%"></i>';
      if (isBar && (b / 4) % 4 === 0) ticks += '<b style="left:' + x + '%">' + tc((b * bar) / 4) + '</b>';
    }
    const beats = [];
    p.shots.forEach((s) => {
      const last = beats[beats.length - 1];
      if (last && last.name === (s.beat || '—')) { last.shots.push(s); last.d += s.duration; }
      else beats.push({ name: s.beat || '—', shots: [s], d: s.duration });
    });
    body.innerHTML =
      '<div class="tl-wrap"><div class="tl" style="min-width:' + Math.max(640, span * 9) + 'px">' +
      p.shots.map((s, i) => '<div class="tl-seg" data-edit="' + s.id + '" style="flex:0 0 ' + (s.duration / span) * 100 + '%"' + (s.photo ? '' : ' data-thumb="shot:' + s.id + '" data-w="240" data-h="135" data-t="0.3"') + ' title="' + esc(s.title) + ' · ' + s.duration + ' s">' + (s.photo ? '<img src="' + s.photo + '" alt="">' : '<img alt="">') + '<span>' + pad(i + 1) + '</span></div>').join('') +
      (target ? '<div class="tl-target" style="left:min(' + (target / span) * 100 + '%, calc(100% - 2px))" title="Target ' + tc(target) + '"></div>' : '') +
      '</div><div class="tl-ticks" style="min-width:' + Math.max(640, span * 9) + 'px">' + ticks + '</div></div>' +
      '<p class="hint">Blocks are proportional to duration. Ticks show beats and bars at ' + bpm + ' BPM (1 bar = ' + round(bar, 2) + ' s). The red line is the target length.</p>' +
      '<div class="row" style="margin-top:10px"><button class="btn small" data-act="snap" data-unit="beat">Snap durations to beats</button><button class="btn small" data-act="snap" data-unit="bar">Snap durations to half bars</button></div>' +
      '<div class="tl-beats">' + beats.map((b) => '<div class="tl-beat"><b>' + esc(b.name) + '</b><p class="hint">' + b.shots.map((s) => esc(s.title)).join(' · ') + '</p><span class="mono">' + round(b.d) + ' s</span></div>').join('') + '</div>';
    lazyThumbs(body);
  }
  function snapDurations(unit) {
    const p = S.project, beat = 60 / (p.settings.bpm || 100), q = unit === 'bar' ? beat * 2 : beat;
    p.shots.forEach((s) => { s.duration = round(Math.max(q, Math.round(s.duration / q) * q), 2); });
    saveSoon();
    updateRuntime();
    renderBoardBody();
    toast('Durations snapped to ' + (unit === 'bar' ? 'half bars' : 'beats'));
  }

  /* ---- Shoot plan ---- */
  const SLOT_INFO = {
    dawn: ['Sunrise & morning', 'East facades, calm pools, mist, breakfast lifestyle, drone flights in still air.'],
    day: ['Midday', 'Interiors with windows, pools from above, anything that needs even daylight.'],
    overcast: ['Overcast', 'Soft light: interiors and details. Reschedule hero exteriors if you can.'],
    any: ['Interiors (any time)', 'Shoot while the exterior light is not ready. Lights on, blinds even.'],
    golden: ['Golden hour', 'Hero exteriors on the lit facade, terraces, lifestyle. Be set up 45 minutes early.'],
    blue: ['Blue hour', 'Twilight heroes and aerials. Every light on inside and out, pool lights on. Short window.'],
    night: ['Night', 'City views, fire, lit interiors.'],
  };
  function planWindows(st) {
    const loc = st.loc || defaultLoc();
    let d;
    try { d = Sun.day(st.date || todayISO(), loc.lat, loc.lng, loc.tz, Number(st.facade)); } catch (e) { return null; }
    const f = (x) => Sun.fmt(x, d.tz);
    const range = (a, b) => (a && b ? f(a < b ? a : b) + '–' + f(a < b ? b : a) : '—');
    return {
      d, f,
      win: {
        dawn: d.sunrise ? f(d.sunrise) + '–' + f(new Date(d.sunrise.getTime() + 2.5 * 3600000)) : '—',
        day: d.noon ? f(new Date(d.noon.getTime() - 2.5 * 3600000)) + '–' + f(new Date(d.noon.getTime() + 2.5 * 3600000)) : '—',
        overcast: 'any time',
        any: 'between exterior windows',
        golden: range(d.eveningGolden[0], d.eveningGolden[1]),
        blue: range(d.eveningBlue[0], d.eveningBlue[1]),
        night: d.eveningBlue[1] ? 'after ' + f(d.eveningBlue[1]) : '—',
      },
    };
  }
  function renderPlan(body) {
    const p = S.project, st = p.settings, w = planWindows(st);
    const groups = FIELD_LIGHTS.map((k) => ({ k, shots: p.shots.filter((s) => (s.light || 'any') === k) })).filter((g) => g.shots.length);
    const facadeName = (COMPASS.find((c) => c[1] === Number(st.facade)) || ['', st.facade])[0];
    const lit = w && w.d.facadeLit && w.d.facadeLit.length ? w.d.facadeLit.map((l) => w.f(l.from) + '–' + w.f(l.to)).join(', ') : 'not in direct sun';
    const hero = w && w.d.hero && w.d.hero.length ? w.d.hero.map((h) => w.f(h[0]) + '–' + w.f(h[1])).join(', ') : '—';
    const doneN = p.shots.filter((s) => s.done).length;
    body.innerHTML =
      '<div class="plan-sum kv">' +
      '<div><span>Shoot date</span><b>' + esc(st.date) + '</b></div>' +
      '<div><span>' + esc((st.loc || {}).name || '') + ' · sunrise / sunset</span><b>' + (w ? w.f(w.d.sunrise) + ' / ' + w.f(w.d.sunset) : '—') + '</b></div>' +
      '<div><span>Golden hour (evening)</span><b class="acc">' + (w ? w.win.golden : '—') + '</b></div>' +
      '<div><span>Blue hour (evening)</span><b>' + (w ? w.win.blue : '—') + '</b></div>' +
      '<div><span>Facade faces ' + facadeName + ' · in sun</span><b style="font-size:13px">' + lit + '</b></div>' +
      '<div><span>Hero light on the facade</span><b class="acc" style="font-size:13px">' + hero + '</b></div>' +
      '</div>' +
      '<div class="row no-print"><button class="btn small" data-act="plan-copy">' + I.copy + 'Copy shot list</button><button class="btn small ghost" data-act="plan-prep">' + I.copy + 'Copy prep list for the owner</button><span class="hint">' + doneN + ' of ' + p.shots.length + ' captured · ordered by light, then by space</span></div>' +
      groups.map((g) => {
        const info = SLOT_INFO[g.k];
        const bySpace = SPACE_ORDER.map((sp) => ({ sp, shots: g.shots.filter((s) => s.space === sp) })).filter((x) => x.shots.length);
        return '<section class="slot"><header><h3>' + info[0] + '</h3><span class="mono">' + (w ? w.win[g.k] : '') + '</span><span class="hint">' + plural(g.shots.length, 'shot') + ' · ' + round(g.shots.reduce((t, s) => t + s.duration, 0)) + ' s of screen time</span><p>' + info[1] + '</p></header>' +
          bySpace.map((b) => '<div class="plan-space">' + esc(SP[b.sp] ? SP[b.sp].name : b.sp) + '</div>' + b.shots.map((s) => {
            const n = p.shots.indexOf(s) + 1;
            return '<div class="plan-item' + (s.done ? ' done' : '') + '"><input type="checkbox" data-done="' + s.id + '"' + (s.done ? ' checked' : '') + ' aria-label="Captured">' +
              (s.photo ? '<div class="frame" data-edit="' + s.id + '"><img src="' + s.photo + '" alt=""></div>' : '<div class="frame" data-edit="' + s.id + '" data-thumb="shot:' + s.id + '" data-w="240" data-h="135" data-t="0.3"><img alt=""></div>') +
              '<div class="t"><b>' + pad(n) + ' · ' + esc(s.title) + '</b><span>' + codes(s) + ' · ' + code('speed', s.speed) + (s.talent ? ' · ' + esc(s.talent) : '') + '</span></div><span class="mono">' + s.duration + ' s</span></div>';
          }).join('')).join('') + '</section>';
      }).join('');
    lazyThumbs(body);
  }
  function planText() {
    const p = S.project, st = p.settings, w = planWindows(st);
    const lines = ['VAO SHOTBOOK — ' + p.name, 'Shoot ' + st.date + ' · ' + ((st.loc || {}).name || '') + ' · ' + st.format + ' · target ' + tc(st.target), ''];
    FIELD_LIGHTS.forEach((k) => {
      const shots = p.shots.filter((s) => s.light === k);
      if (!shots.length) return;
      lines.push(SLOT_INFO[k][0].toUpperCase() + (w ? '  ' + w.win[k] : ''));
      SPACE_ORDER.forEach((sp) => shots.filter((s) => s.space === sp).forEach((s) => {
        lines.push((s.done ? '[x] ' : '[ ] ') + pad(p.shots.indexOf(s) + 1) + ' ' + s.title + ' — ' + (SP[s.space] ? SP[s.space].name : s.space) + ' · ' + codes(s) + ' · ' + s.duration + 's' + (s.talent ? ' · ' + s.talent : ''));
      }));
      lines.push('');
    });
    return lines.join('\n');
  }
  function prepText() {
    const p = S.project;
    return ['Preparing your property for filming — ' + p.name, '',
      'The day before', '[ ] Replace dead bulbs; use warm bulbs (2700–3000 K) everywhere', '[ ] Clean windows, mirrors and glass balustrades', '[ ] Pool cleaned, cover off, pump can be switched off on request', '[ ] Garden watered and swept, hoses rolled away', '',
      'On the day', '[ ] Cars out of the driveway and street frontage if possible', '[ ] Bins, cleaning products and chargers hidden', '[ ] Counters cleared except 1–2 styled items', '[ ] Beds made, pillows plumped, towels folded', '[ ] Toilet lids down, TV screens off', '[ ] All lights on (inside and outside), blinds opened evenly', '[ ] Pets and personal photos out of sight', '',
      'Twilight', '[ ] Every light on, pool and garden lights on, fire lit if possible', '', '— VAO'].join('\n');
  }

  /* ---- Animatic ---- */
  let anim = null;
  function renderAnimatic(body) {
    const p = S.project, portrait = aspectOf() < 1;
    if (!p.shots.length) { body.innerHTML = '<p class="empty">Add shots to play the animatic.</p>'; return; }
    body.innerHTML =
      '<div class="anim"><div class="anim-stage' + (portrait ? ' portrait' : '') + '" style="aspect-ratio:' + (portrait ? '9/16' : '16/9') + '">' +
      '<div class="pvslot frame" style="aspect-ratio:auto;border:0;border-radius:0"></div><img class="anim-photo" alt="" hidden><img class="anim-prev" alt="" hidden>' +
      '<div class="anim-veil"></div><div class="anim-over"><div class="lt"><div><span id="an-no"></span><b id="an-title"></b></div><span id="an-tc"></span></div></div></div>' +
      '<div class="anim-bar" id="an-bar">' + p.shots.map((s) => '<i style="flex:' + s.duration + '"><b></b></i>').join('') + '</div>' +
      '<div class="row"><button class="btn primary" data-an="play">' + I.play + 'Play</button><button class="btn ghost" data-an="restart">' + I.restart + 'Restart</button>' +
      '<button class="btn ghost" data-an="prev">' + I.prev + '</button><button class="btn ghost" data-an="next">' + I.next + '</button>' +
      '<span class="hint">Previs plays each shot’s real camera move for its duration; photos get a move that follows the shot’s movement. Transitions follow the board.</span></div></div>';
    anim = { i: 0, t: 0, playing: false, raf: 0, last: 0, player: null, shotStart: 0 };
    const slot = $('.pvslot', body);
    if (P.init()) anim.player = P.player(slot, { pos: [0, 1.6, 24], target: [-1, 3, 3], focal: 24 }, { aspect: aspectOf(), autoplay: false, loop: false });
    showAnimShot(0, true);
    $$('[data-an]', body).forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.an;
      if (a === 'play') toggleAnim();
      if (a === 'restart') { showAnimShot(0, true); if (!anim.playing) toggleAnim(); }
      if (a === 'prev') showAnimShot(Math.max(0, anim.i - 1), true);
      if (a === 'next') showAnimShot(Math.min(S.project.shots.length - 1, anim.i + 1), true);
    }));
  }
  function stopAnimatic() {
    if (!anim) return;
    cancelAnimationFrame(anim.raf);
    if (anim.player) anim.player.destroy();
    anim = null;
  }
  function kenBurns(img, move, dur) {
    const k = {
      pushin: [['scale(1)', 'scale(1.14)']], walkthrough: [['scale(1)', 'scale(1.14)']], pushthrough: [['scale(1)', 'scale(1.25)']], speedramp: [['scale(1)', 'scale(1.2)']],
      pullout: [['scale(1.14)', 'scale(1)']], rise: [['scale(1.12) translateY(4%)', 'scale(1.02) translateY(0)']],
      truck: [['scale(1.12) translateX(4%)', 'scale(1.12) translateX(-4%)']], track: [['scale(1.12) translateX(4%)', 'scale(1.12) translateX(-4%)']], pan: [['scale(1.12) translateX(4%)', 'scale(1.12) translateX(-4%)']],
      tilt: [['scale(1.12) translateY(4%)', 'scale(1.12) translateY(-4%)']], pedestal: [['scale(1.12) translateY(4%)', 'scale(1.12) translateY(-4%)']], crane: [['scale(1.14) translateY(5%)', 'scale(1.06) translateY(-2%)']],
      arc: [['scale(1.12) translateX(-3%)', 'scale(1.12) translateX(3%)']], orbit: [['scale(1.12) translateX(-3%)', 'scale(1.12) translateX(3%)']],
      zoom: [['scale(1)', 'scale(1.2)']], topdown: [['scale(1.2) rotate(0deg)', 'scale(1.2) rotate(8deg)']],
    }[move] || [['scale(1.02)', 'scale(1.05)']];
    img.getAnimations().forEach((a) => a.cancel());
    return img.animate([{ transform: k[0][0] }, { transform: k[0][1] }], { duration: dur * 1000, easing: 'ease-in-out', fill: 'forwards' });
  }
  function showAnimShot(i, instant) {
    if (!anim) return;
    const p = S.project, s = p.shots[i];
    if (!s) return;
    const stage = $('.anim-stage'), photo = $('.anim-photo', stage), prev = $('.anim-prev', stage), veil = $('.anim-veil', stage), slot = $('.pvslot', stage);
    const prevShot = p.shots[anim.i];
    const trans = instant ? 'cut' : (prevShot && prevShot.trans) || 'cut';
    // capture the outgoing frame for dissolves
    if (!instant && ['dissolve', 'daynight', 'plan', 'beforeafter', 'matchcut'].includes(trans)) {
      const src = prevShot.photo || (anim.player ? anim.player.snapshot() : null);
      if (src) {
        prev.src = src; prev.hidden = false; prev.style.opacity = '1';
        prev.getAnimations().forEach((a) => a.cancel());
        prev.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => { prev.hidden = true; };
      }
    }
    if (!instant && (trans === 'dip' || trans === 'end')) veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, easing: 'ease-out' });
    if (!instant && trans === 'flash') veil.animate([{ opacity: 0.0, background: '#ffb35a' }, { opacity: 0.8, background: '#ffb35a' }, { opacity: 0, background: '#ffb35a' }], { duration: 450 });
    if (!instant && (trans === 'whip' || trans === 'push' || trans === 'ramp' || trans === 'spin')) stage.animate([{ filter: 'blur(10px)' }, { filter: 'blur(0px)' }], { duration: 260, easing: 'ease-out' });
    anim.i = i;
    anim.t = 0;
    if (s.photo) {
      slot.style.visibility = 'hidden';
      photo.hidden = false;
      photo.src = s.photo;
      anim.kb = kenBurns(photo, s.move, s.duration);
      if (!anim.playing) anim.kb.pause();
    } else {
      photo.hidden = true;
      slot.style.visibility = '';
      if (anim.player) {
        const spec = Object.assign({}, VAO.shotSpec(s, aspectOf()).spec, { dur: s.duration });
        anim.player.setSpec(spec);
        anim.player.pause();
        anim.player.seek(0);
      }
    }
    $('#an-no').textContent = pad(i + 1) + ' · ' + (s.beat || '').toUpperCase() + ' · ' + codes(s);
    $('#an-title').textContent = s.title;
    updateAnimUI();
  }
  function updateAnimUI() {
    if (!anim) return;
    const p = S.project;
    const before = p.shots.slice(0, anim.i).reduce((t, s) => t + s.duration, 0);
    $('#an-tc').textContent = tc(before + anim.t) + ' / ' + tc(total(p));
    $$('#an-bar i b').forEach((b, k) => { b.style.width = k < anim.i ? '100%' : k === anim.i ? clamp((anim.t / p.shots[k].duration) * 100, 0, 100) + '%' : '0%'; });
  }
  function toggleAnim() {
    if (!anim) return;
    anim.playing = !anim.playing;
    const btn = $('[data-an="play"]');
    if (btn) btn.innerHTML = anim.playing ? I.pause + 'Pause' : I.play + 'Play';
    if (anim.kb) { if (anim.playing) anim.kb.play(); else anim.kb.pause(); }
    if (anim.playing) { anim.last = 0; anim.raf = requestAnimationFrame(tickAnim); }
    else cancelAnimationFrame(anim.raf);
  }
  function tickAnim(now) {
    if (!anim || !anim.playing) return;
    const dt = anim.last ? (now - anim.last) / 1000 : 0;
    anim.last = now;
    const p = S.project, s = p.shots[anim.i];
    anim.t += dt;
    if (!s.photo && anim.player) anim.player.seek(clamp(anim.t / s.duration, 0, 1));
    if (anim.t >= s.duration) {
      if (anim.i < p.shots.length - 1) showAnimShot(anim.i + 1, false);
      else { anim.t = s.duration; toggleAnim(); }
    }
    updateAnimUI();
    if (anim && anim.playing) anim.raf = requestAnimationFrame(tickAnim);
  }

  /* ---- Projects & export menus ---- */
  function menu(anchor, html, wire) {
    closeMenus();
    const pop = document.createElement('div');
    pop.className = 'menu-pop';
    pop.innerHTML = html;
    anchor.parentNode.appendChild(pop);
    wire(pop);
    setTimeout(() => document.addEventListener('click', closeMenusOnce), 0);
  }
  function closeMenus() { $$('.menu-pop').forEach((m) => m.remove()); document.removeEventListener('click', closeMenusOnce); }
  function closeMenusOnce(ev) { if (!ev.target.closest('.menu-pop')) closeMenus(); }
  async function projectsMenu(anchor) {
    await loadIndex();
    const cur = S.project && S.project.id;
    menu(anchor,
      '<span class="label">Start new</span><button data-m="new-blank">Blank board</button>' + ARCS.map((a) => '<button data-m="new-arc" data-id="' + a.id + '">From arc: ' + esc(a.name) + '</button>').join('') +
      '<hr><span class="label">Your boards</span>' + S.index.map((x) => '<button data-m="open" data-id="' + x.id + '">' + (x.id === cur ? '● ' : '') + esc(x.name) + ' <span class="muted">(' + x.shots + ')</span></button>').join('') +
      '<hr><button data-m="dup">Duplicate this board</button><span id="m-del"><button data-m="del" class="danger" style="color:var(--accent-text)">Delete this board</button></span>',
      (pop) => pop.addEventListener('click', async (ev) => {
        const b = ev.target.closest('[data-m]');
        if (!b) return;
        ev.stopPropagation();
        const m = b.dataset.m;
        if (m === 'new-blank') { closeMenus(); await switchTo(newProject(null, { name: 'Untitled board' })); }
        if (m === 'new-arc') { closeMenus(); await useArc(b.dataset.id); }
        if (m === 'open') { closeMenus(); if (await openProject(b.dataset.id)) render(); }
        if (m === 'dup') { closeMenus(); const c = JSON.parse(JSON.stringify(S.project)); c.id = uid(); c.name += ' (copy)'; c.sample = false; c.shots.forEach((s) => { s.id = uid(); }); await switchTo(c); toast('Board duplicated'); }
        if (m === 'del') { $('#m-del', pop).innerHTML = '<span class="confirm" style="padding:6px 10px">Delete for good? <button data-m="del-yes" class="btn small danger">Delete</button></span>'; }
        if (m === 'del-yes') {
          closeMenus();
          const id = S.project.id;
          await Store.del('p:' + id);
          S.index = S.index.filter((x) => x.id !== id);
          await Store.set('index', S.index);
          S.project = null;
          if (S.index.length) await openProject(S.index[0].id);
          else { S.project = newProject(null, { name: 'Untitled board' }); await saveNow(); }
          toast('Board deleted');
          render();
        }
      }));
  }
  function exportMenu(anchor) {
    menu(anchor,
      '<button data-m="copy-list">Copy shot list (text)</button><button data-m="copy-prep">Copy owner prep list</button><button data-m="copy-json">Copy board as JSON</button>' +
      (framed ? '' : '<button data-m="dl-json">Download board file (.json)</button><button data-m="print">Print or save as PDF</button>') +
      '<hr><button data-m="import">Import a board (.json)</button>' +
      (framed ? '<span class="label" style="text-transform:none;letter-spacing:0">Printing and file downloads work in the hosted app.</span>' : ''),
      (pop) => pop.addEventListener('click', (ev) => {
        const b = ev.target.closest('[data-m]');
        if (!b) return;
        closeMenus();
        const m = b.dataset.m, p = S.project;
        if (m === 'copy-list') copyText(planText(), 'Shot list');
        if (m === 'copy-prep') copyText(prepText(), 'Prep list');
        if (m === 'copy-json') copyText(JSON.stringify(p), 'Board');
        if (m === 'dl-json') download((p.name || 'board').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') + '.shotbook.json', JSON.stringify(p, null, 1));
        if (m === 'print') {
          S.boardView = 'frames';
          renderBoardBody();
          toast('Preparing frames for print\u2026');
          loadAllThumbs($('#board-body')).then(() => window.print());
        }
        if (m === 'import') openImport();
      }));
  }
  function openImport() {
    openSheet({
      label: 'Import a board',
      html: '<div class="sec"><span class="label">From a file</span><p class="hint">Choose a .json board exported from the Shotbook.</p><input type="file" accept="application/json,.json" id="imp-file" class="in"></div>' +
        '<div class="sec"><span class="label">Or paste</span><textarea class="in" id="imp-text" rows="10" placeholder="Paste board JSON here"></textarea><div class="row" style="margin-top:8px"><button class="btn primary" id="imp-go">Import</button><span class="hint" id="imp-msg"></span></div></div>',
      onMount: (root) => {
        const run = async (text) => {
          try {
            const p = JSON.parse(text);
            if (!p || !Array.isArray(p.shots) || !p.settings) throw new Error('This file is not a Shotbook board.');
            p.id = uid();
            p.sample = false;
            p.shots = p.shots.map((s) => Object.assign(newShot(), s, { id: uid() }));
            closeSheet(true);
            await switchTo(p);
            toast('Board imported');
          } catch (err) { $('#imp-msg', root).textContent = err.message || 'Could not read that JSON.'; }
        };
        $('#imp-go', root).onclick = () => run($('#imp-text', root).value);
        $('#imp-file', root).onchange = async (ev) => { const f = ev.target.files[0]; if (f) run(await f.text()); };
      },
    });
  }

  /* ------------------------------------------------------------------ */
  /* View: Tools                                                          */
  /* ------------------------------------------------------------------ */
  const TOOLS = [['lens', 'Lens lab'], ['sun', 'Sun planner'], ['frame', 'Frame check'], ['speed', 'Speed & shutter'], ['lapse', 'Timelapse'], ['beat', 'Beat grid']];
  function renderTools(v, arg) {
    if (arg && TOOLS.some((t) => t[0] === arg)) S.tool = arg;
    v.innerHTML =
      '<section class="phead"><div class="eyebrow">Tools</div><h1>Technical details, calculated</h1><p>Lens and field of view, the sun on your facade, composition checks for your own photos, frame rates and shutter, timelapse intervals and music timing.</p></section>' +
      '<div class="tabs" role="tablist">' + TOOLS.map((t) => '<button role="tab" data-tool="' + t[0] + '" aria-selected="' + (S.tool === t[0]) + '">' + t[1] + '</button>').join('') + '</div><div id="tool-body"></div>' + footer();
    renderTool();
  }
  function renderTool() {
    const b = $('#tool-body');
    if (!b) return;
    if (viewPlayer) { viewPlayer.destroy(); viewPlayer = null; }
    viewPlayerSpec = null;
    $$('[data-tool]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.tool === S.tool)));
    ({ lens: toolLens, sun: toolSun, frame: toolFrame, speed: toolSpeed, lapse: toolLapse, beat: toolBeat })[S.tool](b);
  }

  // Lens lab
  const SENSORS = [['Full frame', 1], ['APS-C (Sony, Nikon, Fuji)', 1.5], ['APS-C (Canon)', 1.6], ['Micro Four Thirds', 2], ['1-inch (drones, compacts)', 2.7], ['Phone main camera', 3.7]];
  function toolLens(b) {
    b.innerHTML =
      '<div class="tools-grid"><div class="tool-panel">' +
      '<label class="f"><span>Focal length (full-frame equivalent)</span><input type="range" id="ln-f" min="0" max="1000" value="' + Math.round((Math.log(24 / 12) / Math.log(200 / 12)) * 1000) + '"></label>' +
      '<div class="formrow"><label class="f"><span>Focal (mm)</span><input class="in num" id="ln-fn" type="number" min="8" max="400" value="24"></label>' +
      '<label class="f"><span>Your sensor</span><select class="in" id="ln-s">' + SENSORS.map((s, i) => '<option value="' + i + '">' + s[0] + '</option>').join('') + '</select></label></div>' +
      '<div class="row"><button class="btn small primary" data-lm="pos">Same camera position</button><button class="btn small" data-lm="subj">Same subject size</button></div>' +
      '<p class="hint" id="ln-mode-hint"></p>' +
      '<div class="kv" id="ln-out"></div>' +
      '<div><span class="label">Honest range for interiors</span><div class="honesty" style="margin-top:6px"><i style="background:var(--accent);flex:.5"></i><i style="background:var(--good);flex:1"></i><i style="background:var(--line-2);flex:2"></i></div><div class="rt-row" style="margin-top:4px"><span>12–16 exaggerated</span><span>16–24 honest wide</span><span>28+ natural to tele</span></div></div>' +
      '</div><div class="tool-panel">' + playerHTML({ noAspect: false }) + '<p class="hint" id="ln-caption"></p></div></div>';
    let mode = 'pos', f = 24;
    const out = $('#ln-out', b), range = $('#ln-f', b), num = $('#ln-fn', b), sens = $('#ln-s', b);
    const spec = () => mode === 'pos'
      ? { pos: [22, 1.6, 22], target: [0, 2.5, 3], focal: f, tod: 'golden' }
      : { pos: [5, 1.6, 7.5 + f * 0.2417], target: [5, 1.5, 7.5], focal: f, tod: 'golden', person: { at: [5, 7.5], face: 180 } };
    viewPlayerRoot = b;
    viewPlayerSpec = spec();
    viewPlayer = mountPlayer(b, viewPlayerSpec);
    const update = () => {
      const crop = SENSORS[sens.value][1];
      const hf = (2 * Math.atan(18 / f) * 180) / Math.PI, vf = (2 * Math.atan(10.125 / f) * 180) / Math.PI, df = (2 * Math.atan(Math.hypot(18, 10.125) / f) * 180) / Math.PI;
      const ch = f < 16 ? 'Ultra-wide: rooms look bigger than they are' : f < 24 ? 'Wide: the interior standard' : f < 40 ? 'Natural perspective' : f < 70 ? 'Normal: calm, isolates subjects' : f < 150 ? 'Short tele: layers compress' : 'Telephoto: backgrounds loom';
      out.innerHTML =
        '<div><span>Horizontal field (16:9)</span><b>' + round(hf) + '°</b></div>' +
        '<div><span>Vertical field</span><b>' + round(vf) + '°</b></div>' +
        '<div><span>Diagonal field</span><b>' + round(df) + '°</b></div>' +
        '<div><span>Frame width at 5 m</span><b>' + round((5 * 36) / f, 2) + ' m</b></div>' +
        '<div><span>Distance to fit a 6 m wall</span><b>' + round((6 * f) / 36, 2) + ' m</b></div>' +
        '<div><span>Real focal on your sensor</span><b class="acc">' + round(f / crop, 1) + ' mm</b></div>' +
        '<div style="grid-column:1/-1"><span>Character</span><b style="font-size:14px;font-family:var(--font)">' + ch + '</b></div>';
      $('#ln-mode-hint', b).textContent = mode === 'pos' ? 'The camera stays put: a longer lens only crops the image.' : 'The camera moves back as the focal length grows so the person keeps the same size: watch the house and mountains grow behind. That is compression.';
      $('#ln-caption', b).textContent = (mode === 'pos' ? 'Same position, ' : 'Same subject size, ') + f + ' mm on full frame.';
      viewPlayerSpec = spec();
      if (viewPlayer) viewPlayer.setSpec(viewPlayerSpec, true);
    };
    range.oninput = () => { f = Math.round(12 * Math.pow(200 / 12, range.value / 1000)); num.value = f; update(); };
    num.oninput = () => { const v = Number(num.value); if (v >= 8 && v <= 400) { f = v; range.value = Math.round((Math.log(clamp(v, 12, 200) / 12) / Math.log(200 / 12)) * 1000); update(); } };
    sens.onchange = update;
    $$('[data-lm]', b).forEach((x) => x.addEventListener('click', () => {
      mode = x.dataset.lm;
      $$('[data-lm]', b).forEach((y) => y.classList.toggle('primary', y === x));
      update();
    }));
    update();
  }

  // Sun planner
  function toolSun(b) {
    const st = S.project ? S.project.settings : null;
    const loc0 = st && st.loc ? st.loc : defaultLoc();
    const cityIdx = Math.max(0, Sun.CITIES.findIndex((c) => c.name === loc0.name));
    b.innerHTML =
      '<div class="tools-grid"><div class="tool-panel">' +
      '<div class="formrow"><label class="f"><span>Location</span><select class="in" id="sn-city">' + Sun.CITIES.map((c, i) => '<option value="' + i + '"' + (i === cityIdx ? ' selected' : '') + '>' + c.name + '</option>').join('') + '<option value="custom">Custom coordinates…</option></select></label>' +
      '<label class="f"><span>Date</span><input class="in" type="date" id="sn-date" value="' + esc((st && st.date) || todayISO()) + '"></label></div>' +
      '<div class="formrow" id="sn-custom" hidden><label class="f"><span>Latitude</span><input class="in num" id="sn-lat" type="number" step="0.0001" value="' + loc0.lat + '"></label><label class="f"><span>Longitude</span><input class="in num" id="sn-lng" type="number" step="0.0001" value="' + loc0.lng + '"></label></div>' +
      '<label class="f"><span>Facade faces <b class="accent" id="sn-fv"></b></span><input type="range" id="sn-fac" min="0" max="359" value="' + (st ? st.facade : 180) + '"></label>' +
      '<div class="compass">' + COMPASS.map((c) => '<button class="btn small" data-fac="' + c[1] + '">' + c[0] + '</button>').join('') + '</div>' +
      '<div class="kv" id="sn-out"></div>' +
      '<div class="row">' + (S.project ? '<button class="btn primary small" id="sn-apply">Use for my board’s shoot plan</button>' : '') + '</div>' +
      '</div><div class="tool-panel"><div id="sn-chart"></div>' +
      '<label class="f"><span>Time on the day <b id="sn-tv"></b></span><input type="range" id="sn-time" min="0" max="1439" value="1080"></label>' +
      playerHTML({ noAspect: true }) + '<p class="hint">Previs of a facade facing your chosen direction, lit by the real sun position at that time.</p></div></div>';
    let loc = Object.assign({}, loc0);
    const city = $('#sn-city', b), date = $('#sn-date', b), fac = $('#sn-fac', b), time = $('#sn-time', b), out = $('#sn-out', b);
    viewPlayerRoot = b;
    viewPlayerSpec = Object.assign({}, PV['sun-facade']);
    viewPlayer = mountPlayer(b, viewPlayerSpec);
    let day = null;
    const facName = (deg) => { const i = Math.round(deg / 45) % 8; return COMPASS[i][0] + ' ' + deg + '°'; };
    const compute = () => {
      const facade = Number(fac.value);
      $('#sn-fv', b).textContent = facName(facade);
      try { day = Sun.day(date.value || todayISO(), loc.lat, loc.lng, loc.tz || Sun.deviceTz, facade); } catch (err) { day = null; }
      if (!day) { out.innerHTML = '<div><span>Error</span><b>Check the date</b></div>'; return; }
      const f = (x) => Sun.fmt(x, day.tz);
      const rng = (w) => (w[0] && w[1] ? f(w[0] < w[1] ? w[0] : w[1]) + '–' + f(w[0] < w[1] ? w[1] : w[0]) : '—');
      out.innerHTML =
        '<div><span>Sunrise</span><b>' + f(day.sunrise) + '</b></div><div><span>Sunset</span><b>' + f(day.sunset) + '</b></div>' +
        '<div><span>Golden hour AM</span><b>' + rng(day.morningGolden) + '</b></div><div><span>Golden hour PM</span><b class="acc">' + rng(day.eveningGolden) + '</b></div>' +
        '<div><span>Blue hour AM</span><b>' + rng(day.morningBlue) + '</b></div><div><span>Blue hour PM</span><b>' + rng(day.eveningBlue) + '</b></div>' +
        '<div><span>Solar noon · max height</span><b>' + f(day.noon) + ' · ' + round(day.noonAlt) + '°</b></div>' +
        '<div><span>Facade in direct sun</span><b style="font-size:13px">' + (day.facadeLit.length ? day.facadeLit.map((l) => f(l.from) + '–' + f(l.to)).join(', ') : 'Never today') + '</b></div>' +
        '<div style="grid-column:1/-1"><span>Best hero light on this facade (sun lit + golden hour)</span><b class="acc" style="font-size:14px">' + (day.hero.length ? day.hero.map((h) => f(h[0]) + '–' + f(h[1])).join(' and ') : 'No golden-hour sun on this facade: shoot it at blue hour with lights on, or in soft light.') + '</b></div>';
      drawChart();
      scene();
    };
    const drawChart = () => {
      const Wd = 600, Hd = 210, x0 = 34, x1 = Wd - 10, yTop = 12, yBot = Hd - 34;
      const maxAlt = Math.max(30, Math.ceil((day.noonAlt + 5) / 10) * 10), minAlt = -20;
      const X = (m) => x0 + (m / 1440) * (x1 - x0), Y = (a) => yBot - ((a - minAlt) / (maxAlt - minAlt)) * (yBot - yTop);
      let s = '';
      const runs = (test) => { const out2 = []; let st2 = null; day.samples.forEach((p, i) => { if (test(p.alt)) { if (st2 == null) st2 = i; } else if (st2 != null) { out2.push([st2, i]); st2 = null; } }); if (st2 != null) out2.push([st2, 1440]); return out2; };
      runs((a) => a < -6).forEach((r) => { s += '<rect class="night" x="' + X(r[0]) + '" y="' + yTop + '" width="' + (X(r[1]) - X(r[0])) + '" height="' + (yBot - yTop) + '"/>'; });
      runs((a) => a >= -6 && a < -4).forEach((r) => { s += '<rect class="band-b" x="' + X(r[0]) + '" y="' + yTop + '" width="' + (X(r[1]) - X(r[0])) + '" height="' + (yBot - yTop) + '"/>'; });
      runs((a) => a >= -4 && a <= 6).forEach((r) => { s += '<rect class="band-g" x="' + X(r[0]) + '" y="' + yTop + '" width="' + (X(r[1]) - X(r[0])) + '" height="' + (yBot - yTop) + '"/>'; });
      s += '<line class="ax" x1="' + x0 + '" y1="' + Y(0) + '" x2="' + x1 + '" y2="' + Y(0) + '"/>';
      for (let h = 0; h <= 24; h += 3) s += '<line class="ax" x1="' + X(h * 60) + '" y1="' + yBot + '" x2="' + X(h * 60) + '" y2="' + (yBot + 4) + '"/><text x="' + X(h * 60) + '" y="' + (yBot + 16) + '" text-anchor="' + (h === 24 ? 'end' : h === 0 ? 'start' : 'middle') + '">' + pad(h) + ':00</text>';
      [0, 30, 60].filter((a) => a <= maxAlt).forEach((a) => { s += '<text x="' + (x0 - 4) + '" y="' + (Y(a) + 3) + '" text-anchor="end">' + a + '°</text>'; });
      s += '<path class="curve" d="' + day.samples.filter((p, i) => i % 5 === 0).map((p, i) => (i ? 'L' : 'M') + X(p.min).toFixed(1) + ' ' + Y(clamp(p.alt, minAlt, maxAlt)).toFixed(1)).join(' ') + '"/>';
      day.facadeLit.forEach((l) => { const m0 = (l.from - day.start) / 60000, m1 = (l.to - day.start) / 60000; s += '<line class="lit" x1="' + X(m0) + '" y1="' + (yBot + 26) + '" x2="' + X(m1) + '" y2="' + (yBot + 26) + '"/>'; });
      s += '<line class="now" id="sn-now" x1="0" y1="' + yTop + '" x2="0" y2="' + yBot + '"/>';
      $('#sn-chart', b).innerHTML = '<svg class="sunchart" viewBox="0 0 ' + Wd + ' ' + (Hd + 4) + '" role="img" aria-label="Sun height through the day">' + s + '</svg>' +
        '<div class="rt-row"><span>Sun height through the day</span><span><span style="color:#d08a3a">■</span> golden · <span style="color:#4f6fb0">■</span> blue · <span class="accent">━</span> facade in sun</span></div>';
      chartX = X;
    };
    let chartX = null;
    const scene = () => {
      if (!day) return;
      const m = Number(time.value);
      const smp = day.samples[m];
      $('#sn-tv', b).textContent = Sun.fmt(smp.t, day.tz) + ' · sun ' + round(smp.alt) + '° high';
      const now = $('#sn-now', b);
      if (now && chartX) { now.setAttribute('x1', chartX(m)); now.setAttribute('x2', chartX(m)); }
      const rel = (smp.az - Number(fac.value) + 180 + 360) % 360;
      const tod = P.todFromSun ? P.todFromSun(smp.alt, rel) : 'golden';
      viewPlayerSpec = Object.assign({}, PV['sun-facade'], { tod });
      if (viewPlayer) viewPlayer.setSpec(viewPlayerSpec, true);
    };
    city.onchange = () => {
      $('#sn-custom', b).hidden = city.value !== 'custom';
      if (city.value !== 'custom') { loc = Object.assign({}, Sun.CITIES[Number(city.value)]); $('#sn-lat', b).value = loc.lat; $('#sn-lng', b).value = loc.lng; }
      else loc = { name: 'Custom', lat: Number($('#sn-lat', b).value), lng: Number($('#sn-lng', b).value), tz: Sun.deviceTz };
      compute();
    };
    ['#sn-lat', '#sn-lng'].forEach((id) => { $(id, b).oninput = () => { if (city.value === 'custom') { loc = { name: 'Custom ' + round(Number($('#sn-lat', b).value), 2) + ', ' + round(Number($('#sn-lng', b).value), 2), lat: Number($('#sn-lat', b).value), lng: Number($('#sn-lng', b).value), tz: Sun.deviceTz }; compute(); } }; });
    date.onchange = compute;
    fac.oninput = compute;
    time.oninput = scene;
    $$('[data-fac]', b).forEach((x) => x.addEventListener('click', () => { fac.value = x.dataset.fac; compute(); }));
    const apply = $('#sn-apply', b);
    if (apply) apply.onclick = async () => {
      const p = await ensureProject();
      p.settings.loc = Object.assign({}, loc);
      p.settings.date = date.value;
      p.settings.facade = Number(fac.value);
      await saveNow(p);
      toast('Shoot plan updated for ' + p.name, { label: 'Open plan', fn: () => { S.boardView = 'plan'; go('board'); } });
    };
    // start on golden hour of the chosen day
    compute();
    if (day && day.eveningGolden[0]) { time.value = Math.round((day.eveningGolden[0] - day.start) / 60000) + 10; scene(); }
  }

  // Frame check
  let fcPhoto = null;
  function toolFrame(b) {
    b.innerHTML =
      '<div class="tools-grid"><div class="tool-panel">' +
      '<p>Check the composition of a scouting photo or a reference image. Your images stay on this device.</p>' +
      '<div class="row"><label class="btn primary">' + I.camera + 'Take a photo<input type="file" accept="image/*" capture="environment" hidden id="fc-cam"></label><label class="btn">' + I.image + 'Choose an image<input type="file" accept="image/*" hidden id="fc-file"></label></div>' +
      '<label class="f"><span>Crop to format</span><select class="in" id="fc-ar"><option value="">Original</option>' + OPT.format.map((f) => '<option value="' + f[1] + '">' + f[0] + '</option>').join('') + '</select></label>' +
      '<div><span class="label">Guides</span><div class="chips" style="margin-top:6px">' + GUIDE_OPTIONS.filter((g) => g[0]).concat([['level', 'Level cross']]).map((g) => '<button class="chip' + (g[0] === 'thirds' ? ' on' : '') + '" data-g="' + g[0] + '">' + g[1] + '</button>').join('') + '</div></div>' +
      '<div class="sec"><span class="label">Checklist</span><ul class="check-list"><li>Verticals straight and horizon level?</li><li>Subject on a third, or perfectly on the axis?</li><li>A foreground layer for depth?</li><li>Windows exposed, lights on?</li><li>Nothing important under the reel safe zones?</li><li>Crew, camera or clutter in reflections?</li></ul></div>' +
      '<button class="btn" id="fc-add" disabled>' + I.plus + 'Add to the board as a shot</button>' +
      '</div><div class="tool-panel"><div class="fc-stage" id="fc-stage"></div></div></div>';
    const on = new Set(['thirds']);
    const draw = () => {
      const st = $('#fc-stage', b), arSel = $('#fc-ar', b).value;
      if (!fcPhoto) { st.innerHTML = '<div class="fc-drop">' + I.image.replace('<svg', '<svg style="width:32px;height:32px"') + '<span>Drop an image here or use the buttons.</span></div>'; $('#fc-add', b).disabled = true; return; }
      const ar = arSel ? Number(arSel) : fcPhoto.w / fcPhoto.h;
      st.innerHTML = '<div class="frame" style="aspect-ratio:' + ar + ';' + (ar < 1 ? 'max-width:' + Math.round(ar * 560) + 'px' : '') + '"><img src="' + fcPhoto.src + '" alt="Your image" style="object-fit:cover"></div>';
      const fr = $('.frame', st);
      on.forEach((g) => fr.insertAdjacentHTML('beforeend', Diag.guides(g, ar)));
      $('#fc-add', b).disabled = false;
    };
    const load = async (file) => {
      if (!file) return;
      try {
        const src = await fileToDataURL(file, 1600);
        const img = new Image();
        img.onload = () => { fcPhoto = { src, w: img.naturalWidth, h: img.naturalHeight }; draw(); };
        img.src = src;
      } catch (err) { toast(err.message); }
    };
    $('#fc-cam', b).onchange = (ev) => load(ev.target.files[0]);
    $('#fc-file', b).onchange = (ev) => load(ev.target.files[0]);
    $('#fc-ar', b).onchange = draw;
    const stage = $('#fc-stage', b);
    stage.addEventListener('dragover', (ev) => { ev.preventDefault(); });
    stage.addEventListener('drop', (ev) => { ev.preventDefault(); load(ev.dataTransfer.files[0]); });
    $$('[data-g]', b).forEach((c) => c.addEventListener('click', () => { const g = c.dataset.g; if (on.has(g)) on.delete(g); else on.add(g); c.classList.toggle('on'); draw(); }));
    $('#fc-add', b).onclick = () => { if (fcPhoto) addShotsToBoard([newShot({ title: 'Scouting frame', photo: fcPhoto.src, move: 'static' })]); };
    draw();
  }

  // Speed & shutter
  function toolSpeed(b) {
    b.innerHTML =
      '<div class="tools-grid"><div class="tool-panel"><h2>Slow motion & shutter</h2>' +
      '<div class="formrow"><label class="f"><span>Capture fps</span><select class="in" id="sp-cap">' + [24, 25, 30, 48, 50, 60, 100, 120, 200, 240].map((x) => '<option' + (x === 50 ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></label>' +
      '<label class="f"><span>Timeline fps</span><select class="in" id="sp-tl">' + [24, 25, 30].map((x) => '<option' + (x === 25 ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></label>' +
      '<label class="f"><span>Mains power</span><select class="in" id="sp-hz"><option value="50" selected>50 Hz (Morocco, Europe)</option><option value="60">60 Hz (Americas)</option></select></label></div>' +
      '<div class="kv" id="sp-out"></div></div>' +
      '<div class="tool-panel"><h2>ND filter</h2><p class="hint">Meter the scene at your chosen aperture and ISO, read the shutter the camera wants, then pick the ND that brings it to your target shutter.</p>' +
      '<div class="formrow"><label class="f"><span>Metered shutter 1/x</span><input class="in num" id="nd-m" type="number" min="1" value="800"></label><label class="f"><span>Target shutter 1/x</span><input class="in num" id="nd-t" type="number" min="1" value="50"></label></div>' +
      '<div class="kv" id="nd-out"></div>' + '<div class="frame" style="aspect-ratio:16/9"><div class="dgwrap">' + Diag.render('flicker') + '</div></div></div></div>';
    const upd = () => {
      const cap = Number($('#sp-cap', b).value), tl = Number($('#sp-tl', b).value), hz = Number($('#sp-hz', b).value);
      const speed = (tl / cap) * 100, sh180 = cap * 2;
      const ripple = hz * 2;
      const safe = [];
      for (let k = 1; k <= 8; k++) { const d = ripple / k; if (d >= cap * 0.9) safe.push(d); }
      const safeList = safe.filter((d) => Number.isInteger(d)).map((d) => '1/' + d);
      const best = safe.length ? safe.reduce((a, c) => (Math.abs(c - sh180) < Math.abs(a - sh180) ? c : a)) : null;
      const angle = best ? round((cap / best) * 360, 0) : null;
      $('#sp-out', b).innerHTML =
        '<div><span>Playback speed</span><b class="acc">' + round(speed, 1) + '%</b></div>' +
        '<div><span>Slow-motion factor</span><b>' + round(cap / tl, 2) + '×</b></div>' +
        '<div><span>180° shutter</span><b>1/' + sh180 + '</b></div>' +
        '<div><span>Flicker-safe at ' + hz + ' Hz</span><b style="font-size:13px">' + (safeList.length ? safeList.join(', ') : 'none at this frame rate') + '</b></div>' +
        '<div style="grid-column:1/-1"><span>Recommendation</span><b style="font-size:13.5px;font-family:var(--font)">' +
        (best ? (best === sh180 ? 'Use 1/' + sh180 + ': natural motion blur and no flicker under ' + hz + ' Hz lights.' : 'Under ' + hz + ' Hz lighting use 1/' + best + ' (' + angle + '°) instead of 1/' + sh180 + ' to avoid flicker. Outdoors in daylight 1/' + sh180 + ' is fine.') : 'At ' + cap + ' fps no shutter avoids flicker under ' + hz + ' Hz lights: shoot this frame rate in daylight only.') + '</b></div>';
    };
    const nd = () => {
      const m = Number($('#nd-m', b).value), t = Number($('#nd-t', b).value);
      if (!(m > 0 && t > 0)) return;
      const stops = Math.log2(m / t);
      const n = Math.max(0, Math.round(stops));
      $('#nd-out', b).innerHTML = stops <= 0.2
        ? '<div style="grid-column:1/-1"><span>Result</span><b style="font-size:14px;font-family:var(--font)">No ND needed. Your target shutter is already reachable.</b></div>'
        : '<div><span>Light to cut</span><b class="acc">' + round(stops, 1) + ' stops</b></div><div><span>Filter</span><b>ND' + Math.pow(2, n) + '</b></div><div><span>Optical density</span><b>' + round(n * 0.3, 1) + '</b></div>';
    };
    ['#sp-cap', '#sp-tl', '#sp-hz'].forEach((id) => { $(id, b).onchange = upd; });
    ['#nd-m', '#nd-t'].forEach((id) => { $(id, b).oninput = nd; });
    upd();
    nd();
  }

  // Timelapse & hyperlapse
  function toolLapse(b) {
    b.innerHTML =
      '<div class="tools-grid"><div class="tool-panel"><h2>Timelapse</h2>' +
      '<div class="formrow"><label class="f"><span>Event lasts (min)</span><input class="in num" id="tl-ev" type="number" min="1" value="60"></label><label class="f"><span>Clip length (s)</span><input class="in num" id="tl-cl" type="number" min="1" value="10"></label><label class="f"><span>Timeline fps</span><select class="in" id="tl-fps"><option>24</option><option selected>25</option><option>30</option></select></label></div>' +
      '<div class="kv" id="tl-out"></div><p class="hint">Sunset or day-to-night: start 30–45 min before sunset and run until 20 min after. Manual exposure, manual white balance, or a "holy grail" ramp.</p></div>' +
      '<div class="tool-panel"><h2>Hyperlapse</h2>' +
      '<div class="formrow"><label class="f"><span>Route length (m)</span><input class="in num" id="hl-d" type="number" min="1" value="80"></label><label class="f"><span>Clip length (s)</span><input class="in num" id="hl-cl" type="number" min="1" value="6"></label><label class="f"><span>Timeline fps</span><select class="in" id="hl-fps"><option>24</option><option selected>25</option><option>30</option></select></label></div>' +
      '<div class="kv" id="hl-out"></div><p class="hint">Aim at the same point in every frame, keep focal length and exposure fixed, and walk the same distance between shots. Stabilize in post.</p></div></div>';
    const tl = () => {
      const ev = Number($('#tl-ev', b).value), cl = Number($('#tl-cl', b).value), fps = Number($('#tl-fps', b).value);
      if (!(ev > 0 && cl > 0)) return;
      const frames = cl * fps, interval = (ev * 60) / frames;
      $('#tl-out', b).innerHTML = '<div><span>Photos needed</span><b>' + frames + '</b></div><div><span>Interval</span><b class="acc">' + round(interval, 1) + ' s</b></div><div><span>Speed-up</span><b>' + Math.round((ev * 60) / cl) + '×</b></div><div><span>Longest exposure for smooth motion</span><b>' + round(interval / 2, 1) + ' s</b></div>';
    };
    const hl = () => {
      const d = Number($('#hl-d', b).value), cl = Number($('#hl-cl', b).value), fps = Number($('#hl-fps', b).value);
      if (!(d > 0 && cl > 0)) return;
      const frames = cl * fps, step = d / frames;
      $('#hl-out', b).innerHTML = '<div><span>Photos needed</span><b>' + frames + '</b></div><div><span>Step between photos</span><b class="acc">' + round(step * 100, 0) + ' cm</b></div><div><span>At 70 cm per step</span><b>' + round(step / 0.7, 1) + ' steps per photo</b></div><div><span>Time at 1 photo / 2 s</span><b>' + round((frames * 2) / 60, 1) + ' min</b></div>';
    };
    ['#tl-ev', '#tl-cl'].forEach((id) => { $(id, b).oninput = tl; });
    $('#tl-fps', b).onchange = tl;
    ['#hl-d', '#hl-cl'].forEach((id) => { $(id, b).oninput = hl; });
    $('#hl-fps', b).onchange = hl;
    tl();
    hl();
  }

  // Beat grid
  function toolBeat(b) {
    const st = S.project ? S.project.settings : { bpm: 100, target: 60 };
    b.innerHTML =
      '<div class="tools-grid"><div class="tool-panel"><h2>Beat grid</h2>' +
      '<div class="formrow"><label class="f"><span>Track BPM</span><input class="in num" id="bt-bpm" type="number" min="40" max="220" value="' + st.bpm + '"></label><label class="f"><span>Beats per bar</span><select class="in" id="bt-bpb"><option>3</option><option selected>4</option><option>6</option></select></label><label class="f"><span>Target length (s)</span><input class="in num" id="bt-len" type="number" min="5" value="' + st.target + '"></label></div>' +
      '<div class="kv" id="bt-out"></div>' +
      '<div class="row">' + (S.project ? '<button class="btn primary small" id="bt-apply">Use this BPM on my board</button>' : '') + '</div></div>' +
      '<div class="tool-panel"><div class="frame" style="aspect-ratio:16/9"><div class="dgwrap">' + Diag.render('beats') + '</div></div><p class="hint">Cut on downbeats. Change pace on musical phrases (every 4 or 8 bars). Calm films hold 2–4 bars per shot; reels cut every 2–4 beats.</p></div></div>';
    const upd = () => {
      const bpm = Number($('#bt-bpm', b).value), bpb = Number($('#bt-bpb', b).value), len = Number($('#bt-len', b).value);
      if (!(bpm > 0)) return;
      const beat = 60 / bpm, bar = beat * bpb;
      $('#bt-out', b).innerHTML =
        '<div><span>1 beat</span><b>' + round(beat, 3) + ' s</b></div><div><span>2 beats</span><b>' + round(beat * 2, 2) + ' s</b></div>' +
        '<div><span>1 bar</span><b class="acc">' + round(bar, 2) + ' s</b></div><div><span>2 bars</span><b>' + round(bar * 2, 2) + ' s</b></div>' +
        '<div><span>Bars in ' + len + ' s</span><b>' + Math.floor(len / bar) + '</b></div><div><span>Shots at 1 bar each</span><b>' + Math.floor(len / bar) + '</b></div>';
    };
    ['#bt-bpm', '#bt-bpb', '#bt-len'].forEach((id) => { $(id, b).oninput = upd; $(id, b).onchange = upd; });
    const ap = $('#bt-apply', b);
    if (ap) ap.onclick = async () => { const p = await ensureProject(); p.settings.bpm = Number($('#bt-bpm', b).value); await saveNow(p); toast('BPM set to ' + p.settings.bpm); };
    upd();
  }

  /* ------------------------------------------------------------------ */
  /* Shell: routing, nav, theme, global events                            */
  /* ------------------------------------------------------------------ */
  function footer() {
    return '<footer class="foot"><span>VAO Shotbook · reference and storyboard for architecture and real estate films</span><span>Visuals are live previs renders of one procedural villa, not film stills</span><span>Your boards are stored on this device only' + (Store.persistent ? '' : ' (storage is blocked here, so boards last until you close the page)') + '</span></footer>';
  }
  const ROUTES = [['feel', 'Feel', I.feel], ['library', 'Library', I.library], ['arcs', 'Arcs', I.arcs], ['board', 'Board', I.board], ['tools', 'Tools', I.tools]];
  function parseHash() {
    const h = decodeURIComponent((location.hash || '').slice(1));
    if (!h) return { route: Store.pref('route') || 'feel' };
    if (h.startsWith('lib-')) return { route: 'library', arg: h.slice(4) };
    if (h.startsWith('feel-')) return { route: 'feel', arg: h.slice(5) };
    if (h.startsWith('tools-')) return { route: 'tools', arg: h.slice(6) };
    if (h.startsWith('arc-')) return { route: 'arcs', arg: h.slice(4) };
    if (ROUTES.some((r) => r[0] === h)) return { route: h };
    return { route: 'feel' };
  }
  function go(route) {
    if (location.hash.slice(1) === route) render();
    else location.hash = route;
  }
  let lastRoute = null;
  function render() {
    closeSheet(true);
    closeMenus();
    if (viewPlayer) { viewPlayer.destroy(); viewPlayer = null; }
    viewPlayerSpec = null;
    viewPlayerRoot = null;
    stopAnimatic();
    P.clearQueue && P.clearQueue();
    const r = parseHash();
    S.route = r.route;
    Store.pref('route', r.route);
    $$('[data-route]').forEach((a) => { if (a.dataset.route === r.route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const v = $('#view');
    if (lastRoute !== r.route) window.scrollTo(0, 0);
    lastRoute = r.route;
    if (r.route === 'feel') renderFeel(v, r.arg);
    else if (r.route === 'library') renderLibrary(v, r.arg);
    else if (r.route === 'arcs') { renderArcs(v); if (r.arg && ARCMAP[r.arg]) setTimeout(() => openArc(r.arg), 50); }
    else if (r.route === 'board') renderBoard(v);
    else if (r.route === 'tools') renderTools(v, r.arg);
    document.title = 'VAO Shotbook';
  }

  function applyTheme(t) {
    if (t) document.documentElement.setAttribute('data-theme', t);
    const cur = document.documentElement.getAttribute('data-theme');
    const dark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const b = $('#theme');
    if (b) { b.innerHTML = dark ? I.sun : I.moon; b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); }
  }

  function shell() {
    const nav = ROUTES.map((r) => '<a href="#' + r[0] + '" data-route="' + r[0] + '">' + r[1] + '</a>').join('');
    const tabs = ROUTES.map((r) => '<a href="#' + r[0] + '" data-route="' + r[0] + '">' + r[2] + '<span>' + r[1] + '</span></a>').join('');
    $('#app-nav').innerHTML = nav;
    $('#tabbar').innerHTML = tabs;
    applyTheme(Store.pref('theme'));
    $('#theme').onclick = () => {
      const cur = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      Store.pref('theme', next);
      applyTheme(next);
    };
    $('#scrim').onclick = () => closeSheet();
    $('.sheet-close').onclick = () => closeSheet();
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') { if (!$('#sheet').hidden) closeSheet(); else closeMenus(); }
      if (ev.key === ' ' && S.route === 'board' && S.boardView === 'animatic' && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)) { ev.preventDefault(); toggleAnim(); }
    });
    window.addEventListener('hashchange', render);

    // Global click delegation
    document.addEventListener('click', async (ev) => {
      const t = ev.target;
      const open = t.closest('[data-open]');
      if (open) { ev.preventDefault(); openEntry(open.dataset.open); return; }
      const fp = t.closest('[data-feelpick]');
      if (fp) { ev.preventDefault(); S.feel = fp.dataset.feelpick; history.replaceState(null, '', '#feel-' + S.feel); renderRecipe(FM[S.feel]); if (window.innerWidth <= 760) $('#recipe').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const fl = t.closest('[data-feel]');
      if (fl) { closeSheet(true); go('feel-' + fl.dataset.feel); return; }
      const cat = t.closest('[data-cat]');
      if (cat) { S.lib.cat = cat.dataset.cat; renderLibResults(); return; }
      const bv = t.closest('[data-bview]');
      if (bv) { S.boardView = bv.dataset.bview; renderBoardBody(); return; }
      const tl = t.closest('[data-tool]');
      if (tl) { S.tool = tl.dataset.tool; history.replaceState(null, '', '#tools-' + S.tool); renderTool(); return; }
      const ed = t.closest('[data-edit]');
      if (ed && !t.closest('#sheet')) { openShot(ed.dataset.edit); return; }
      const sa = t.closest('[data-sact]');
      if (sa) {
        const id = sa.closest('.shot').dataset.id;
        if (sa.dataset.sact === 'up') moveShot(id, -1);
        if (sa.dataset.sact === 'down') moveShot(id, 1);
        if (sa.dataset.sact === 'edit') openShot(id);
        if (sa.dataset.sact === 'dup') { const a = S.project.shots, i = a.findIndex((s) => s.id === id); const c = newShot(Object.assign({}, a[i], { title: a[i].title + ' (copy)', done: false })); a.splice(i + 1, 0, c); saveSoon(); renderFrames($('#board-body')); updateRuntime(); }
        return;
      }
      const dn = t.closest('[data-done]');
      if (dn) { const s = S.project.shots.find((x) => x.id === dn.dataset.done); if (s) { s.done = dn.checked; saveSoon(); dn.closest('.plan-item').classList.toggle('done', s.done); } return; }
      const act = t.closest('[data-act]');
      if (!act) return;
      const a = act.dataset.act;
      if (a === 'entry-add') { const e = LM[act.dataset.id]; await addShotsToBoard([shotFromEntry(e)]); }
      if (a === 'entry-link') copyText(location.href.split('#')[0] + '#lib-' + act.dataset.id, 'Link');
      if (a === 'feel-add') { const f = FM[act.dataset.id]; await addShotsToBoard(f.seq.map((s) => newShot(Object.assign({ feel: f.id, beat: f.name }, s)))); }
      if (a === 'feel-lib') { S.lib = { cat: 'all', q: '', level: 0, feel: act.dataset.id }; go('library'); }
      if (a === 'arc-use') await useArc(act.dataset.id);
      if (a === 'arc-view') openArc(act.dataset.id);
      if (a === 'board-new') projectsMenu(act);
      if (a === 'menu-projects') projectsMenu(act);
      if (a === 'menu-export') exportMenu(act);
      if (a === 'shot-add') {
        const p = S.project, last = p.shots[p.shots.length - 1];
        const s = newShot(last ? { beat: last.beat, space: last.space, light: last.light } : {});
        p.shots.push(s);
        p.sample = false;
        saveSoon();
        renderFrames($('#board-body'));
        updateRuntime();
        openShot(s.id);
      }
      if (a === 'snap') snapDurations(act.dataset.unit);
      if (a === 'plan-copy') copyText(planText(), 'Shot list');
      if (a === 'plan-prep') copyText(prepText(), 'Prep list');
    });
  }

  async function boot() {
    shell();
    await loadIndex();
    render();
    if ('serviceWorker' in navigator && !framed && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
