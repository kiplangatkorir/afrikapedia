const CACHE_NAME = "afrikapedia-v1";
const OFFLINE_URL = "/offline";

const STATIC_ASSETS = ["/", "/offline", "/manifest.json"];

const CACHE_STRATEGIES = {
  cacheFirst: [/\.(?:png|jpg|jpeg|svg|gif|webp)$/, /\/icons\//, /\/fonts\//],
  networkFirst: [/\.(?:js|css)$/, /\/api\//],
  staleWhileRevalidate: [/\.(?:js|css)$/],
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.origin !== location.origin) return;

  if (request.destination === "document") {
    if (navigator.onLine) {
      event.respondWith(fetch(request));
    } else {
      event.respondWith(
        caches.match(request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        }),
      );
    }
    return;
  }

  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (pattern.test(url.pathname)) {
      event.respondWith(cacheFirst(request));
      return;
    }
  }

  for (const pattern of CACHE_STRATEGIES.networkFirst) {
    if (pattern.test(url.pathname)) {
      event.respondWith(networkFirst(request));
      return;
    }
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      return cached || new Response("Offline", { status: 503 });
    });

  return cached || fetchPromise;
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_ARTICLE") {
    const { article } = event.data;
    caches.open(CACHE_NAME).then((cache) => {
      const response = new Response(JSON.stringify(article), {
        headers: { "Content-Type": "application/json" },
      });
      cache.put(`/api/articles/${article.slug}`, response);
      console.log("[SW] Cached article:", article.slug);
    });
  }
});
