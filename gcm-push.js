'use strict';

function subscribe(pushSubscription)
{
    return new Promise(function(resolve, reject) {
        if (pushSubscription instanceof PushSubscription) {
            document.write('<p>get</p>');
            resolve(pushSubscription);
        } else {
            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
                serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
                    .then(function (pushSubscription) {
                        document.write('<p>subscribe</p>');
                        resolve(pushSubscription);
                    })
                    .catch(function (e) {
                        // Check for a permission prompt issue
                        if ('permissions' in navigator) {
                            navigator.permissions.query({name: 'push', userVisibleOnly: true})
                                .then(function (permissionStatus) {
                                    document.write('<p>subscribe() Error: Push permission status = ' + permissionStatus.status + '</p>');
                                    console.log(permissionStatus);
                                    if (permissionStatus.status === 'denied') {
                                        // The user blocked the permission prompt
                                        document.write('<p>Ooops Notifications are Blocked',
                                            'Unfortunately you just permanently blocked notifications. ' +
                                            'Please unblock / allow them to switch on push ' +
                                            'notifications.</p>');
                                    } else if (permissionStatus.status === 'prompt') {
                                        document.write('<p>The user didn\'t accept the permission prompt</p>');
                                    } else {
                                        document.write('Ooops Push Couldn\'t Register',
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
                                    document.write('Ooops Push Couldn\'t Register',
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
                                document.write('<p>Ooops Notifications are Blocked',
                                    'Unfortunately you just permanently blocked notifications. ' +
                                    'Please unblock / allow them to switch on push notifications.</p>');
                            } else {
                                document.write('Ooops Push Couldn\'t Register',
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
                        document.write('<p>' + pushSubscription.subscriptionId + '</p>');
                    })
                    .catch(function(error) {
                        console.log(error);
                        document.write('<p>' + error.message + '</p>');
                    });
            })
            .catch(function (error) {
                console.log(error);
                document.write('<p>' + error.message + '</p>');
            });

        navigator.serviceWorker.register('service-worker.js')
            .catch(function(error) {
                console.log(error);
                document.write('<p>' + error.message + '</p>')
            });
    } else {
        document.write('<p>Push messaging not supported</p>');
    }
});
