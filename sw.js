const CACHE_NAME = 'news-synth-v1.0.1';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'main.js',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Let AI models be handled by the library/browser optimization
  if (event.request.url.includes('huggingface.co')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
