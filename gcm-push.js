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
