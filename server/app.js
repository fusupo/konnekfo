"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || '3000';
var io = require('socket.io')(http);
var R = require('ramda');



var users = [];

app.use('/', express.static(__dirname + '/../public'));
app.use('/game', express.static(__dirname + '/../game'));

io.on('connection', function(socket) {

  console.log('a user connected ' + socket.id);
  var newPlayer = {
    id: socket.id,
    socket: socket
  };

  if (users.length === 0) {
    console.log('1 PLAYERS CONNECTED !!');
    newPlayer.gameID = 1;
  } else if (users.length === 1) {
    console.log('2 PLAYERS CONNECTED !!');
    newPlayer.gameID = users[0].gameID === 1 ? 2 : 1;
  }

  socket.emit('confirm player', newPlayer.gameID);
  users.push(newPlayer);

  socket.on('commit move', onCommitMove.bind(socket));
  socket.on('disconnect', onDisconnect.bind(socket));

});

function onCommitMove(colIdx) {
  console.log('broadcast commit move: ', this.id);
  R.reject((function(user) {
    return user.id === this.id;
  }).bind(this), users)[0].socket.emit('your turn', colIdx);
}

function onDisconnect() {
  console.log('user disconnected ' + this.id);
  users = R.reject((function(user) {
    return user.id === this.id;
  }).bind(this), users);
  console.log(users);
}

http.listen(port, function() {
  console.log('listening on *:' + port);
});
