
function Master() {
  this.view = new MasterView(this);
};

Master.prototype.update = function(obj){
  Object.keys(obj).forEach(function(key){
    this[key] = obj[key];
  }, this);
  this.view.render();
};

function MasterView(master) {
  View.call(this, 'master', master, 'div');
  var el = document.getElementById('master');
  el.appendChild(this.el);
}

MasterView.prototype = Object.create(View.prototype);
