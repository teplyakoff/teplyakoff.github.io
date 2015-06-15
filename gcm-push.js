'use strict';

function subscribe(pushSubscription)
{
    return new Promise(function(resolve, reject) {
        if (pushSubscription instanceof PushSubscription) {
            console.log('get');
            resolve(pushSubscription);
        } else {
            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
                serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
                    .then(function (pushSubscription) {
                        console.log('subscribe');
                        resolve(pushSubscription);
                    })
                    .catch(function (e) {
                        // Check for a permission prompt issue
                        if ('permissions' in navigator) {
                            navigator.permissions.query({name: 'push', userVisibleOnly: true})
                                .then(function (permissionStatus) {
                                    console.log('subscribe() Error: Push permission status = ',
                                        permissionStatus);
                                    if (permissionStatus.status === 'denied') {
                                        // The user blocked the permission prompt
                                        console.log('Ooops Notifications are Blocked',
                                            'Unfortunately you just permanently blocked notifications. ' +
                                            'Please unblock / allow them to switch on push ' +
                                            'notifications.');
                                    } else if (permissionStatus.status === 'prompt') {
                                        console.log('The user didn\'t accept the permission prompt');
                                    } else {
                                        console.log('Ooops Push Couldn\'t Register',
                                            '<p>When we tried to ' +
                                            'get the subscription ID for GCM, something went wrong,' +
                                            ' not sure why.</p>' +
                                            '<p>Have you defined "gcm_sender_id" and ' +
                                            '"gcm_user_visible_only" in the manifest?</p>' +
                                            '<p>Error message: ' +
                                            e.message +
                                            '</p>');
                                    }
                                    reject(e);
                                }).catch(function (err) {
                                    console.log('Ooops Push Couldn\'t Register',
                                        '<p>When we tried to ' +
                                        'get the subscription ID for GCM, something went wrong, not ' +
                                        'sure why.</p>' +
                                        '<p>Have you defined "gcm_sender_id" and ' +
                                        '"gcm_user_visible_only" in the manifest?</p>' +
                                        '<p>Error message: ' +
                                        err.message +
                                        '</p>');
                                    reject(err);
                                });
                        } else {
                            // Use notification permission to do something
                            if (Notification.permission === 'denied') {
                                console.log('Ooops Notifications are Blocked',
                                    'Unfortunately you just permanently blocked notifications. ' +
                                    'Please unblock / allow them to switch on push notifications.');
                            } else {
                                console.log('Ooops Push Couldn\'t Register',
                                    '<p>When we tried to ' +
                                    'get the subscription ID for GCM, something went wrong, not ' +
                                    'sure why.</p>' +
                                    '<p>Have you defined "gcm_sender_id" and ' +
                                    '"gcm_user_visible_only" in the manifest?</p>' +
                                    '<p>Error message: ' +
                                    e.message +
                                    '</p>');
                            }
                        }
                        reject(e);
                    });
            });
        }
    });
}

window.addEventListener('load', function() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready
            .then(function(serviceWorkerRegistration) {
                serviceWorkerRegistration.pushManager.getSubscription()
                    .then(subscribe)
                    .then(function(pushSubscription) {
                        console.log(pushSubscription);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });

        navigator.serviceWorker.register('/service-worker.js')
            .catch(function(error) {
                console.log(error);
            });
    } else {
        console.log('Push messaging not supported');
    }
});
