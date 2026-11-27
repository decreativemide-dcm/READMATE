
self.addEventListener('push', (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = {
        title: 'READMATE',
        body: event.data.text()
      };
    }
  }

  const title = data.title || 'READMATE';

  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/readmate-icon.svg',
    badge: '/readmate-icon.svg',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || '/',
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clients) => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin)) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
