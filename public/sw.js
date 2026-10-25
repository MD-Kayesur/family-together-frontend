// FamilyRoots Service Worker for Web Push & Device Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : 'You received a new family message.' };
  }

  const title = data.title || 'FamilyRoots Message';
  const options = {
    body: data.body || 'You have a new message from a relative.',
    icon: data.icon || '/icon.png',
    badge: '/icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/user-dashboard?tab=messages',
      conversationId: data.conversationId,
    },
    tag: data.tag || 'family_message',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/user-dashboard?tab=messages';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url && (client.url.includes('/dashboard') || client.url.includes('/messages'))) {
          if ('focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
