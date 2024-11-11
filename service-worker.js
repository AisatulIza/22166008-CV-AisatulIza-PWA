// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const CACHE_NAME = 'portofolio-v1';
const urlsToCache = [
  '/',
  '/style.css',
  '/images/zz.png',
  '/images/ser1.jpg',
  '/images/ser2.jpg',
  '/images/ser3.jpg',
  '/images/ser4.jpg',
  '/images/CRUD.png',
  '/images/data.png',
  '/images/from.png',
  '/images/toko.png',
  '/images/icon.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  '/main.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  '/CV_IZA.pdf'
];

// Install event: lakukan penginstallan service worker dan cache file
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Failed to cache:", error);
      })
  );
});

// Activate event: mulai service worker dan hapus cache lama jika ada
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
      .catch((error) => {
        console.error("Failed to activate:", error);
      })
  );
});

// Fetch event: tangani permintaan jaringan dan memuat static assets
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Untuk file HTML, ambil dari jaringan dengan fallback ke cache
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            // Hanya cache permintaan dengan skema yang didukung
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request)) // Fallback ke cache jika jaringan gagal
    );
  } else {
    // Untuk aset statis, gunakan cache-first
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            // Hanya cache permintaan dengan skema yang didukung
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
});

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBX1zH3tqOO1jTbU4ge9CHgqOoU3pVerm0",
  authDomain: "cvportofolio-e156d.firebaseapp.com",
  projectId: "cvportofolio-e156d",
  storageBucket: "cvportofolio-e156d.firebasestorage.app",
  messagingSenderId: "871829475917",
  appId: "1:871829475917:web:0a2b2b5f658a336a938204",
  measurementId: "G-PEMC88LRQK"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Website Portofolio";
  const notificationOptions = {
    body: "Website Anda, saat ini aktif dan berjalan lancar.",
    icon: "/images/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});