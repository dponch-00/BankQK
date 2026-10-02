const BASE = new URL('./', self.registration.scope);
const CACHE = 'banqk-pages-v2';
const shell = [BASE.href, new URL('offline.html', BASE).href, new URL('icon-192.png', BASE).href, new URL('icon-512.png', BASE).href];
// Guarda el shell y los assets con hash que referencia index.html, para que la app abra sin conexión desde la primera visita.
async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(shell.map(href => new Request(href, { cache: 'reload' })));
  const html = await (await cache.match(BASE.href)).text();
  const assets = [...html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g)].map(match => new URL(match[1], BASE).href);
  await cache.addAll(assets.map(href => new Request(href, { cache: 'reload' })));
}
self.addEventListener('install', event => {
  event.waitUntil(precache());
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('banqk-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
// El clone debe hacerse antes de devolver la respuesta; después el cuerpo ya está en uso y put() falla.
function store(event, key, response) {
  if (response.ok) {
    const copy = response.clone();
    event.waitUntil(caches.open(CACHE).then(cache => cache.put(key, copy)));
  }
  return response;
}
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(BASE.href)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => store(event, BASE.href, response)).catch(() => caches.match(BASE.href)));
  } else if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => store(event, request, response))));
  }
});
