(function(d,l,h,m){
    var link, fjs = d.getElementsByTagName(h)[0];
    link = d.createElement(l);
    link.href = m+".json";
    link.rel = m;
    fjs.appendChild(link);
}(document,'link','head','manifest'));
function submitToServer(e){
    var xhttp = new XMLHttpRequest();
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    var url ='https://localhost/gp/main.php?endpoint='+e+'&website='+http+'//'+window.location.hostname;
    if('withCredentials' in xhttp) {
        xhttp.open("GET", url, true);
        //xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status >= 200 && xhttp.status < 400) {
                    console.log(xhttp.responseText);
                } else {
                    console.log(new Error('Response returned with non-OK status'));
                }
            }
        };
    }
    //console.log(e);
    xhttp.send();
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
        registration.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(sub) {
            var ep=sub.endpoint.split('/');
            submitToServer(ep[ep.length-1]);
        });
    }).catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}
