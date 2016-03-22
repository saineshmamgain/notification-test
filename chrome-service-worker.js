'use strict';
var _wingifyPush = {
    hash: 'b5d4f30314f1dbee60a5b1229431aca0',
    serverUrl: 'https://pushcrew.com',
    defaultIcon: '/logo_192_by_192.png'
}

var splitEndPointSubscription =  function (subscriptionDetails) {
    var endpointURL = 'https://android.googleapis.com/gcm/send/',
    endpoint = subscriptionDetails.endpoint,
    subscriptionId;

    if(endpoint.indexOf(endpointURL) === 0) {
       return subscriptionId = endpoint.replace(endpointURL , '');
    }

    return subscriptionDetails.subscriptionId;
};

self.addEventListener('push', function(event) {
     event.waitUntil(
        self.registration.pushManager.getSubscription()
        .then(function(subscription) {
            var subscriptionId = splitEndPointSubscription(subscription);

            return fetch(_wingifyPush.serverUrl + '/getMessage.php?hash='+ _wingifyPush.hash + '&subscriptionId=' +
            subscriptionId).then(function(response) {
                var notificationDetails = {};

                if (response.status !== 200) {
                    throw new Error();
                }

                return response.json().then(function(data) {
                    var trackDeliveryURL = '';

                    if (data.error || !data.notification) {
                        console.error('The API returned an error.', data.error);
                        throw new Error();
                    }

                    notificationDetails.title = data.notification.title;
                    notificationDetails.message = data.notification.message;
                    notificationDetails.icon = data.notification.icon + '?notificationURL=' + encodeURIComponent(data.notification.url);
                    notificationDetails.notificationTag = data.notification.tag;
                    notificationDetails.url = data.notification.url;

                    trackDeliveryURL =  _wingifyPush.serverUrl + '/trackDelivery.php' +
                    '?subscriptionId=' + subscriptionId +
                    '&notificationTag=' + notificationDetails.notificationTag +
                    '&hash=' + _wingifyPush.hash;

                    fetch(trackDeliveryURL).
                    catch(function(err) {
                    });

                    return self.registration.showNotification(notificationDetails.title, {
                        body: notificationDetails.message,
                        icon: notificationDetails.icon,
                        requireInteraction: false,
                        tag: notificationDetails.notificationTag
                    });
                });
            }).catch(function(err) {
                var title = 'Oops! We couldn\'t fetch the notification';
                var message = 'Sorry, due to some error the notification that was sent couldn\'t be displayed.';
                var icon = _wingifyPush.defaultIcon + '?notificationURL=' + encodeURIComponent('https://pushcrew.com/error-fetching-push-notifications/?hash='+_wingifyPush.hash);
                var notificationTag = 'notification-error';

                var logSwErrorUrl =  _wingifyPush.serverUrl + '/logServiceWorkerError.php' +
                    '?subscriptionId=' + subscriptionId +
                    '&error=' + err.toString() +
                    '&hash=' + _wingifyPush.hash;

                fetch(logSwErrorUrl);

                return self.registration.showNotification(title, {
                    body: message,
                    icon: icon,
                    tag: notificationTag
                });
            });
        })
    );
});

self.addEventListener('notificationclick', function(event) {

    self.registration.pushManager.getSubscription()
    .then(function(subscription) {
        var subscriptionId = splitEndPointSubscription(subscription),
        clickDeliveryURL =  _wingifyPush.serverUrl + '/trackClick.php' +
        '?subscriptionId=' + subscriptionId +
        '&notificationTag=' + event.notification.tag +
        '&hash=' + _wingifyPush.hash;

        // send update to server
        fetch(clickDeliveryURL).
        catch(function(err) {
        });
    });

    event.notification.close();

    function notificationURL () {
        var query = event.notification.icon,
        url,
        queryString;

        if(query.indexOf('?') > -1) {
            queryString = query.substring(query.indexOf('?'));
            url = decodeURIComponent(queryString.split('=')[1]);
        }
        else {
            console.error('failed to extract url value');
            url = '';
        }
        return url;
    }

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === notificationURL() && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(notificationURL());
            }
        })
    );
});
