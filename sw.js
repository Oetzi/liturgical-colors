/*
 * Offline support. Network first, so a visitor who is online always gets the latest files;
 * the cached copy is used only when the network is unavailable.
 */
var CACHE = 'liturgical-colors-v5';
var FILES = ['./', 'index.html', 'styles.css', 'app.js', 'calendar.js', 'saints.js', 'i18n.js', 'bios.js', 'readings-2026.js', 'readings-2027.js', 'scripture.js',
  'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (hit) { return hit || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()); });
    })
  );
});
// The page asks for the Bible books to be saved in the background so readings work offline.
self.addEventListener('message', function (e) {
  if (!e.data || e.data.type !== 'precache' || !Array.isArray(e.data.files)) return;
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(e.data.files.map(function (f) {
      return c.match(f).then(function (hit) { return hit || c.add(f).catch(function () { /* try again next visit */ }); });
    }));
  }));
});
