
var cluster = new EventEmitter;

window.onload = function(){
  var socket = new io.Socket(window.location.hostname)
    , workers = {};

  socket.connect();

  function getWorker(worker) {
    return workers[worker.id] = workers[worker.id] || new Worker(worker.id);
  }

  socket.on('message', function(obj){
    switch (obj.type) {
      case 'event':
        cluster.emit.apply(cluster, obj.args);
        break;
    }
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