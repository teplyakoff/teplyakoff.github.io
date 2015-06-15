'use strict';

/**
 * Notification.data is not supported now!
 * So we should store redirect url somewhere
 */
var redirectUrl;

self.addEventListener('push', function(event) {
    console.log('delivery', event);

    // Hardcoded notification options
    var title = 'Title'; // Required, others are optional
    var body = 'Body';
    var icon = ''; // path to icon
    var tag = 'test-push'; // tagged push will erase one with the same tag
    var data = { // additional data, NOT WORKING yet
        url: '/?emlTrack=123'
    };
    redirectUrl = data.url;

    event.waitUntil(
        // Push received, so track delivery

        // Hardcoded notification options above should be fetched from our server here.
        // Chrome Push API doesn't allow to send push payload

        self.registration.showNotification(title, {
            body: body,
            icon: icon, // path to icon
            tag: tag, // tag will group pushes, newest push will erase one before
            data: data // NOT WORKING!!
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('click', event);

    // Hack for android bug
    event.notification.close();

    var url = '/';

    // Check is Notification supports data property
    if (Notification.prototype.hasOwnProperty('data')) {
        console.log('Using data');
        url = event.notification.data.url;
    } else {
        url = redirectUrl;
    }

    event.waitUntil(clients.openWindow(url));
});
