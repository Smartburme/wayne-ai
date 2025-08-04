const CACHE_NAME = 'wayne-ai-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/pages.css',
    '/js/main.js',
    '/js/pages.js',
    '/assets/images/ai-logo.png',
    // Add other essential assets
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
