
var cluster = new EventEmitter;

window.onload = function(){
  var socket = new io.Socket(window.location.hostname)
    , workers = {};

  socket.connect();

  // relay events
  socket.on('message', function(obj){
    switch (obj.type) {
      case 'event':
        cluster.emit.apply(cluster, obj.args);
        break;
    }
  });

  // get / initialize a worker
  function getWorker(worker) {
    return workers[worker.id] = workers[worker.id] || new Worker(worker.id);
  }

  cluster.on('worker change', function(worker){
    var _worker = getWorker(worker);
    _worker.emit('stats', worker.stats);
  });

  cluster.on('client request', function(worker, request){
    var _worker = getWorker(worker);
    _worker.emit('stats', worker.stats);
    _worker.emit('request', request);
  });

  cluster.on('client connection', function(worker){
    var _worker = getWorker(worker);
    _worker.emit('stats', worker.stats);
    _worker.emit('connection');
  });
};