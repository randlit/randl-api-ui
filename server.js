/**************
 * Declaration
 **************/

/** @type {object} */
var express = require('express');

/** @type {object} */
var path = require('path');

/** @type {object} */
var server = express();

/** @type {object} **/
var httpProxy = require( "http-proxy" );

/** @type {object} */
var routingProxy = new httpProxy.RoutingProxy();

/** @type {number} */
var port = process.env.PORT || 3000;

/** @type {object} */
var https = require('https');

/** @type {object} */
var markdown = require('markdown').markdown;



/*****************
 * Implementation
 *****************/

/** 
 * Proxies requests to the Randl POST API
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
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


server.get( "/md/:repo/:doc", function (req, res, next) {
  var repo = req.params.repo;
  var doc = req.params.doc;
  var url = 'https://raw.github.com/randlit/' + repo + '/master/docs/' + doc + '.md';

  https.get(url, function (_res) {

    var data = '';
    _res.setEncoding('utf8');

    _res.on('data', function (_data) {
      data += _data;
    })

    _res.on('end', function () {
      res.end(markdown.toHTML(data));
    });
  }).on('error', function(e) {
    res.end(500, e.stack);
  });
});


/**
 * Default route that delivers application
 */
server.get('*', function (req, res, next) {
  res.sendfile(path.join(__dirname, 'index.html'));
});


/**************
 * Proxy setup
 **************/
server.post('/create', proxy);
server.post('/remove', proxy);
server.post('/update', proxy);
server.post('/checkout', proxy);
server.post('/checkin', proxy);



server.listen(port, function () {
  console.log('Listening on ' + port);
});