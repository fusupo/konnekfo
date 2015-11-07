"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || '3000';
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});

//

// var app = require('express')();
// var http = require('http').Server(app);

// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });
