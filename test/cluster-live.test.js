
/**
 * Module dependencies.
 */

var cluster-live = require('cluster-live')
  , should = require('should');

module.exports = {
  'test .version': function(){
    cluster-live.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};