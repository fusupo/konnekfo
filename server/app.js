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
  var resetCount = 0;

  sessions[sessionId] = new Game();

  nsp.on('connection', function(socket) {

    var game = sessions[sessionId]; 
    var playerId = game.provisionPlayer(socket);

    socket.emit(sockConst.DICTATE_PLAYER_ID, playerId);

    if(playerId === 2){
      game.p1.socket.emit('opponent-connect');
      game.p2.socket.emit('opponent-connect');
      game.p2.socket.emit('their turn');
      game.p1.socket.emit('your turn');
    }
    socket.on(sockConst.ATTEMPT_COMMIT_MOVE, function(d) {
      sessions[sessionId].attemptMove(d.playerId, d.colIdx);
    });

    socket.on('opt-in-reset', function(d) {
      resetCount++;
      if (resetCount === 2) {
        nsp.emit('reset');
        resetCount = 0;
        sessions[sessionId].reset();
      } else {
        nsp.emit('opt-in-reset', d);
        console.log('player ' + d.playerId + ' opts in to reset the game!!');
      }
    });

    socket.on('disconnect', function() {
      sessions[sessionId].removePlayer(playerId);
    });

    socket.on('manual-disconnect', function() {
      sessions[sessionId].removePlayer(playerId);
    });

    console.log(socket.id + 'connected to ' + sessionId);

  });

  res.send(sessionId);

});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
