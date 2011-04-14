
// mini query :)

$ = function(id){
  var el = document.getElementById(id);
  el.on = function(event, fn){
    el.addEventListener(event, fn, false);
  };
  return el;
};