"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || '3000';
var io = require('socket.io')(http);

var numUsers = 0;
var users = {};

app.use(express.static(__dirname + '/../public'));

io.on('connection', function(socket) {

  console.log('a user connected ' + socket.id);
  users[socket.id] = 1;
  numUsers++;

  if (numUsers === 1) {
    console.log('1 PLAYERS CONNECTED !!');
    socket.emit('confirm player', 1);
  } else if (numUsers === 2) {
    console.log('2 PLAYERS CONNECTED !!');
    socket.emit('confirm player', 2);
  }

  socket.on('commit move', onCommitMove.bind(socket));
  socket.on('disconnect', onDisconnect.bind(socket));

});

function onCommitMove(colIdx) {
  console.log(this.id);
  game.commitMove(colIdx);
}

function onDisconnect() {
  console.log('user disconnected ' + this.id);
  delete users[this.id];
  numUsers--;
}

http.listen(port, function() {
  console.log('listening on *:' + port);
});
