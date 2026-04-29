const CACHE_VERSION = 'bt-online-v18';
const PRECACHE_URLS = ['./', './index.html', './style.css', './game.js', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  const isNavigation = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  const isAsset = req.destination === 'script' || req.destination === 'style' || req.destination === 'manifest';

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  if (isAsset) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(req);
        const update = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => null);

        if (cached) {
          update;
          return cached;
        }
        const fresh = await update;
        return fresh || cached;
      })
    );
    return;
  }

  event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
});
