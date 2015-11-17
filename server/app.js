"use strict";

var express = require('express');
var app = express();
var url = require('url');
var http = require('http').Server(app);
var port = process.env.PORT || '3000';
var io = require('socket.io')(http);
var R = require('ramda');
var uid = require('uid');
var sockConst = require('../game/SocketConstants.js');
var Game = require('../game/NetworkGame.js');

app.use('/', express.static(__dirname + '/../public'));
app.use('/game', express.static(__dirname + '/../game'));

io.on('connection', function(socket) {

  console.log('a user connected ' + socket.id);

});

var sessions = {};

app.get('/session/new', function(req, res) {

  var sessionId = uid(5);
  var nsp = io.of(sessionId);

  sessions[sessionId] = new Game();

  nsp.on('connection', function(socket) {
    socket.on(sockConst.ATTEMPT_COMMIT_MOVE, function(d) {
      sessions[sessionId].attemptMove(d.playerId, d.colIdx);
    });

    console.log(socket.id + 'connected to ' + sessionId);

    var playerId = sessions[sessionId].provisionPlayer(socket);
    socket.emit(sockConst.DICTATE_PLAYER_ID, playerId);
  });

  res.send(sessionId);

});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
