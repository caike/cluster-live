
function EventEmitter() {
  this.callbacks = {};
}

EventEmitter.prototype.on = function(event, fn){
  (this.callbacks[event] = this.callbacks[event] || [])
    .push(fn);
  return this;
};

EventEmitter.prototype.emit = function(event){
  var args = Array.prototype.slice.call(arguments, 1)
    , callbacks = this.callbacks[event];

  if (callbacks) {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }

  return this;
};
