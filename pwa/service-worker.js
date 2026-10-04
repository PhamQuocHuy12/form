const VERSION = __BUILD_VERSION__;
const FILES = __APP_FILES__;
const ROOT = self.registration.scope;
const CACHE_PREFIX = `form-shell:${new URL(ROOT).pathname}:`;
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
const SHELL = new URL("index.html", ROOT).href;
const URLS = FILES.map((file) => new URL(file, ROOT).href);
const STATIC_URLS = new Set(URLS);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(URLS.map((url) => new Request(url, { cache: "reload" }))),
      ),
  );
  // Updates wait until all app windows close, preserving active workout edits.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
          )
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== new URL(ROOT).origin) return;
  const rootPath = new URL(ROOT).pathname;
  const navigation =
    request.mode === "navigate" &&
    (url.pathname === rootPath || url.pathname === `${rootPath}index.html`);
  url.search = "";
  url.hash = "";
  const cacheKey = navigation ? SHELL : url.href;
  if (!navigation && !STATIC_URLS.has(cacheKey)) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(cacheKey);
      return cached || fetch(request);
    })(),
  );
});
