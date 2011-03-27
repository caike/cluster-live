
/*!
 * cluster-live - app
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , stylus = require('stylus')
  , io = require('socket.io');

module.exports = function(options){
  var app = module.exports = 'production' == process.env.NODE_ENV
    ? express.createServer(options)
    : express.createServer();

  // configuration

  app.configure(function(){
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
  });

  app.configure('development', function(){
    app.use(stylus.middleware({ src: __dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));
  });

  app.configure('production', function(){
    var day = 86400000;
    app.use(express.basicAuth(function(user, pass){
      return user == options.user && pass == options.pass;
    }));
    app.use(stylus.middleware({ src: __dirname + '/public', compress: true }));
    app.use(express.static(__dirname + '/public', { maxAge: day * 30 }));
  });

  // routes

  app.get('/', routes.index);

  // socket.io

  var socket = app.io = io.listen(app, { log: false });

  return app;
};