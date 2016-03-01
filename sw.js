var location='http://localhost'
self.addEventListener('install', function(event) {
    self.skipWaiting();
});
self.addEventListener('activate', function(event) {
});
self.addEventListener('push', function(event) {
    event.waitUntil(
        fetch('https://localhost/gp/getJson.php?website='+location+'&_='+Math.random(), {method:'GET',mode: 'cors'}).then(function(response) {
            if (response.status !== 200) {
                console.log('Problem. Status Code: ' + response.status);
                throw new Error();
            }
            // Examine the text in the response
            return response.json().then(function(data) {
                //console.log(data);
                var title = data.title;
                var body = data.message;
                var icon = data.image;
                var notificationTag = 'hello';
               return self.registration.showNotification(title, {body: body,icon:icon,tag:notificationTag});
            });
        })
    );

});
self.addEventListener('notificationclick', function(event) {
    //console.log('Notification click: tag ', event.notification.tag);
    event.notification.close();
    var url = '';
    event.waitUntil(
        clients.matchAll({
                type: 'window'
            })
            .then(function(windowClients) {
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});
