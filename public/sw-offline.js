// Cache when load
self.addEventListener('install', (event) => {
  console.log('work đei')
  event.waitUntil(caches.open('templateCache').then(cache => {
    return cache.addAll([
      '/src/offline.html'
    ]);
  }));
});

// Use cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if found, otherwise fetch from network
      return response || fetch(event.request).catch(() => {
        // Return custom offline page when the network is unavailable
        return caches.match('/src/offline.html');
      });
    })
  );
});
