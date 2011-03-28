
var cluster = new EventEmitter;

window.onload = function(){
  var socket = new io.Socket(window.location.hostname)
    , workers = {}
    , master = new Master;

  socket.connect();

  // relay events
  socket.on('message', function(obj){
    switch (obj.type) {
      case 'event':
        cluster.emit.apply(cluster, obj.args);
        break;
    }
  });

  // add / remove workers
  document.getElementById('add-worker').addEventListener('click', function(){
    master.addWorker();
    return false;
  }, false);
  
  document.getElementById('remove-worker').addEventListener('click', function(){
    master.removeWorker();
    return false;
  }, false);

  // get / initialize a worker
  function getWorker(worker) {
    return workers[worker.id] = workers[worker.id] || new Worker(worker.id);
  }

  cluster.on('master closing', function(){
    utils.notify('master shutting down');
  });

  cluster.on('master restarting', function(){
    utils.notify('master restarting');
  });

  cluster.on('master change', function(_master){
    master.emit('change', _master);
  });

  cluster.on('worker change', function(_worker){
    var worker = getWorker(_worker);
    worker.emit('stats', _worker.stats);
  });

  cluster.on('worker killed', function(_worker){
    var worker = getWorker(_worker);
    worker.stopReporting().overlay('killed');
  });
  
  cluster.on('worker spawned', function(_worker){
    var worker = getWorker(_worker);
    worker.removeOverlay();
  });

  cluster.on('client request', function(_worker, request){
    var worker = getWorker(_worker);
    worker.emit('stats', _worker.stats);
    worker.emit('request', request);
  });

  cluster.on('client connection', function(_worker){
    var worker = getWorker(_worker);
    worker.emit('stats', _worker.stats);
    worker.emit('connection');
  });
};