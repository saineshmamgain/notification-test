'use strict';
var _wingifyPush = {
    hash: 'b5d4f30314f1dbee60a5b1229431aca0',
    serverUrl: 'https://pushcrew.com',
    defaultIcon: '/logo_192_by_192.png'
}

/*Function used split subsciption id from endpoint URL*/
var splitEndPointSubscription =  function (subscriptionDetails) {
    var endpointURL = 'https://updates.push.services.mozilla.com/push/',
    endpoint = subscriptionDetails.endpoint,
    subscriptionId;

    if(endpoint.indexOf(endpointURL) === 0) {
       return subscriptionId = endpoint.replace(endpointURL , '');
    }

    return subscriptionDetails.subscriptionId;
};

//event listener for Push Notifications
self.addEventListener('push', function(event) {
    var obj = event.data.json();
    var title = obj.title;
    var body = obj.msg;
    var icon = obj.icon + '?notificationURL=' + encodeURIComponent(obj.url);
    var tag = obj.tag;
    
    //Track delivery of notifications
    var trackDeliveryURL =  _wingifyPush.serverUrl + '/trackDelivery.php' +
    '?subscriptionId=' + obj.subscriptionId +
    '&notificationTag=' + obj.tag +
    '&browser=firefox&hash=' + _wingifyPush.hash;

    fetch(trackDeliveryURL).
    catch(function(err) {
    });
    
    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag,
            requireInteration:false
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
        '&browser=firefox&hash=' + _wingifyPush.hash;

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

//Event listener for subscriptio change
//Description: Sometimes push subscriptions expire prematurely, without PushSubscription.unsubscribe() being called.
self.addEventListener('pushsubscriptionchange', function() {
  // do something, usually resubscribe to push and
  // send the new subscription details back to the
  // server via XHR or Fetch
});
