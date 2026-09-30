/* VAO Shotbook service worker: keeps the app usable offline on shoot days.
 * Stale-while-revalidate for same-origin files; fonts cached when fetched.
 * Bump VERSION when files are renamed or removed.
 */
const VERSION = 'shotbook-v1';
const CORE = [
  './', 'index.html', 'css/app.css', 'vendor/three.min.js', 'js/previs.js', 'js/shots.js', 'js/data-library.js',
  'js/data-feel.js', 'js/data-arcs.js', 'js/data-options.js', 'js/sun.js', 'js/diagrams.js', 'js/store.js', 'js/app.js',
  'icon.svg', 'manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const cacheable = url.origin === self.location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!cacheable) return;
  event.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(req).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
