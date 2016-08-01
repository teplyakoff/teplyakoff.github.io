navigator.serviceWorker.register('/webPushWorker.js')
  .then(function (serviceWorkerRegistration) {
    console.log('Worker ready', serviceWorkerRegistration);

    var isSubscriptionProposed = false;

    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      if (Notification.permission === 'default') {
        isSubscriptionProposed = true;
        console.log('proposed');
      }

      return serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(pushSubscription) {
          return new Promise(function(resolve, reject) {
            if (pushSubscription instanceof PushSubscription) {
              console.log('Get subscription');
              resolve(pushSubscription);
            } else {
                return serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
                  .then(function(pushSubscription) {
                    console.log('Subscribe');
                    resolve(pushSubscription);
                  })
                  .catch(function(e) {
                    reject(e);
                  });
              }
            });
          })
        .then(function(pushSubscription) {
          console.log('permission', Notification.permission);
          if (isSubscriptionProposed) {
            console.log('accepted', pushSubscription);
          } else {
            console.log('got existed', pushSubscription);
          }
        })
        .catch(function(error) {
          if (isSubscriptionProposed && Notification.permission === 'denied') {
            console.log('denied', error);
          } else if (isSubscriptionProposed && Notification.permission === 'default') {
            console.log('ignored', error);
          } else {
            console.log('error', error);
          }
        });
    });
  });
