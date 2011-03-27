
/*!
 * cluster-live
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var os = require('os')
  , utils = require('./utils');

/**
 * Export plugin.
 */

module.exports = live;

/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Enable with the given `port`, `host` and `options`.
 *
 * @param {Number|Object} port or options
 * @param {String|Object} host or options
 * @param {Object} options
 * @return {Function}
 * @api public
 */

function live(port, host, options) {
  // juggle arguments
  if ('object' == typeof port) options = port, port = null;
  if ('object' == typeof host) options = host, host = null;
  if (null == port) port = 8888; 

  function live(master) {
    if (!master.stats) throw new Error('cluster-live requires the stats() plugin');

    // setup app
    var app = require('./app')(options);
    app.listen(port, host);

    // websockets
    var sockets = [];
    app.io.on('connection', function(sock){
      // maintain array of clients
      var len = sockets.push(sock);
      sock.id = len - 1;
      sock.on('disconnect', function(){
        sockets.splice(sock.id, 1);
      });

      // "emit" an event

      sock.emit = function(){
        this.send({
            type: 'event'
          , args: utils.toArray(arguments)
        });
      };

      // emit "master change" to initialize master data
      sock.emit('master change', stripMaster(master));

      // emit "worker change" event to initialize
      // all worker charts on connection
      master.children.forEach(function(worker){
        sock.emit('worker change', stripWorker(worker));
      });
    });

    // "emit" event to all clients

    sockets.emit = function(event){
      for (var i = 0, len = sockets.length; i < len; ++i) {
        sockets[i].emit.apply(sockets[i], arguments);
      }
    };

    // cluster events

    master.on('client connection', function(worker){
      sockets.emit('client connection', stripWorker(worker));
    });

    master.on('client request', function(worker, request){
      sockets.emit('client request', stripWorker(worker), request);
    });
  }

  return live;
};

/**
 * Prep master for JSON.
 */

function stripMaster(master) {
  return {
      stats: master.stats
    , state: master.state
    , startup: master.startup
    , env: master.env
  }
}

/**
 * Prep work for JSON.
 */

function stripWorker(worker) {
  return {
      id: worker.id
    , stats: worker.stats
  }
};