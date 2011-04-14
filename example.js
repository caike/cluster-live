
/**
 * Module dependencies.
 */

var http = require('http')
  , cluster = require('cluster')
  , live = require('./');

var server = http.createServer(function(req, res){
  res.end('Hello World');
});

// $ npm install express cluster socket.io

// localhost:3000 is our server
// localhost:8888 (by default) is cluster-live 

cluster(server)
  .set('workers', 6)
  .use(cluster.debug())
  .use(cluster.repl(9999))
  .use(cluster.stats({ connections: true, requests: true }))
  .use(live())
  .listen(3000);

