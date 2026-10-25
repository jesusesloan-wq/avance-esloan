// Guarda solo la "cáscara" de la app (logo y pantalla de carga).
// El contenido siempre viene en vivo de Google, por eso se actualiza solo.
var CACHE = 'avance-esloan-v1';
var ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // lo de Google pasa directo
  e.respondWith(fetch(e.request).then(function (r) {
    var copia = r.clone();
    caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
    return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); }); }));
});
