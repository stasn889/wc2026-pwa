const CACHE_NAME = 'wc2026-v4.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/base.css',
  '/css/screens.css',
  '/css/components.css',
  '/js/config.js',
  '/js/i18n.js',
  '/js/data.js',
  '/js/auth.js',
  '/js/team.js',
  '/js/nav.js',
  '/js/picker.js',
  '/js/screen.groups.js',
  '/js/screen.squad.js',
  '/js/screen.myteam.js',
  '/js/screen.lb.js',
  '/js/screen.bets.js',
  '/js/screen.rules.js',
  '/js/screen.admin.js',
  '/js/screen.user.js',
  '/js/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
