'use strict';

self.addEventListener('install', function(event) {
  console.log('install');
  // Update previously registered service worker
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  console.log('activate');
  // Apply worker changes immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('push delivery', event);

  event.waitUntil(self.registration.showNotification('Hi', {
    body: 'there'
  }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('push click', event);

  // Hack for android bug
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
