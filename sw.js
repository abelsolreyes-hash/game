const CACHE_NAME = "multi-games-cache-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./menu.css",
    "./menu.js",

    // Cinnamo Fly
    "./cinnamo-fly/index.html",
    "./cinnamo-fly/fly.css",
    "./cinnamo-fly/fly.js",

    // Pastel Memory
    "./pastel-memory/index.html",
    "./pastel-memory/memory.css",
    "./pastel-memory/memory.js",

    // Snoopy Car Run
    "./snoopy-car-run/index.html",
    "./snoopy-car-run/run.css",
    "./snoopy-car-run/run.js",

    // Bubble Reflex
    "./bubble-reflex/index.html",
    "./bubble-reflex/bubble.css",
    "./bubble-reflex/bubble.js"
];

// Instalación y cache inicial
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// Activación y limpieza de cache antigua
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar requests y servir archivos cacheados
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
});
