const CACHE_NAME = 'fariq-v1.0.2';
const APP_SHELL = [
  'fariq.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap'
];
const OFFLINE_FALLBACK = 'fariq.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        APP_SHELL.map(async (resource) => {
          try {
            await cache.add(resource);
          } catch (error) {
            console.warn('SW install failed for resource:', resource, error);
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  try {
    const networkResponse = await fetch(request);

    if (shouldCacheResponse(networkResponse)) {
      cache.put(request, networkResponse.clone()).catch((error) => {
        console.warn('SW failed to update cache for request:', request.url, error);
      });
    }

    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
      const fallbackResponse = await cache.match(OFFLINE_FALLBACK);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

function shouldCacheResponse(response) {
  if (!response) {
    return false;
  }

  if (response.type === 'opaque') {
    return true;
  }

  return response.status === 200;
}
