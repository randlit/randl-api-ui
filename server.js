var express = require('express');
var path = require('path');
var server = express();
var httpProxy = require( "http-proxy" );
var routingProxy = new httpProxy.RoutingProxy();

function proxy (req, res, next) {
    req.headers.host = process.env.API_HOST;
    routingProxy.proxyRequest(req, res, {
        host: process.env.API_HOST,
        port: process.env.API_PORT
    });
}

server.use('/assets', express.static(__dirname));
server.use(express.logger('short'));
server.use(express.favicon(path.join(__dirname, 'favicon.ico'), {maxAge: 31557600000}));
server.get('*', function (req, res, next) {
  res.sendfile(path.join(__dirname, 'index.html'));
});

server.post('/create', proxy);
server.post('/remove', proxy);
server.post('/update', proxy);
server.post('/checkout', proxy);
server.post('/checkin', proxy);


var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Listening on ' + port);
});