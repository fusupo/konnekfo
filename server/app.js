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
    var player = game.provisionPlayer(socket);
    console.log('PROVISIONED PLAYER', player.id);
    socket.emit(sockConst.DICTATE_PLAYER_ID, player.id);
    
    if(player.id === 2){
      game.p1.socket.emit('opponent-connect');
      game.p2.socket.emit('opponent-connect');
      game.emitStart();
    }
    socket.on(sockConst.ATTEMPT_COMMIT_MOVE, function(d) {
      sessions[sessionId].attemptMove(d.playerId, d.colIdx);
    });

    socket.on('opt-in-reset', function(d) {
      resetCount++;
      if (resetCount === 2) {
        resetCount = 0;
        sessions[sessionId].reset();
        var gameState = sessions[sessionId].getGameState();
        console.log(gameState);
        nsp.emit('reset', gameState);
      } else {
        nsp.emit('opt-in-reset', d);
        console.log('player ' + d.playerId + ' opts in to reset the game!!');
      }
    });

    socket.on('disconnect', function() {
      console.log('DISCONNECT', player.id);
      sessions[sessionId].removePlayer(player.id);
      if(sessions[sessionId].p1 === undefined){
        // remove the session
      }
    });

    socket.on('manual-disconnect', function(pId) {
      console.log('MANUAL-DISCONNECT', player.id);
      //sessions[sessionId].removePlayer(player.id);
      socket.disconnect();
    });

    console.log(socket.id + 'connected to :' + sessionId);

  });

  res.send(sessionId);

});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
