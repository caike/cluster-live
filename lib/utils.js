
/**
 * Faster `Array.prototype.slice.call()` util.
 *
 * @param {Arguments} args
 * @param {Number} index
 * @return {Array}
 * @api private
 */

exports.toArray = function(args, index){
  var arr = []
    , len = args.length;
  for (var i = index || 0; i < len; ++i) {
    arr.push(args[i]);
  }
  return arr;
};