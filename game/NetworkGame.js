"use strict";

var Players = require('../game/Player.js');
var Game = require('../game/Game.js');

module.exports = function() {

  console.log('NEW NETWORK GAME');

  var p1, p2;
  var currPlayer;
  var game;

  this.provisionPlayer = function(socket) {
    if (p1 === undefined) {
      p1 = new Players.RemotePlayer(1, socket);
      return 1;
    } else if (p2 === undefined) {
      p2 = new Players.RemotePlayer(2, socket);
      game = new Game(p1, p2);
      p1.socket.emit('opponent-connect');
      p2.socket.emit('opponent-connect');
      p2.socket.emit('their turn');
      return 2;
    }

    return 0;
  };

  this.attemptMove = function(playerId, colIdx) {
    console.log('palyer ' + playerId + ' wants to make move at ' + colIdx + ', it is player ' + game.currPlayer.id + "'s turn");
    if (playerId === game.currPlayer.id && !game.board.hasWinner()) {
      game.currPlayer.socket.emit('their turn');
      if (game.commitMove(colIdx)) {
        var updateObj = {
          colIdx: colIdx,
          rowIdx: 6 - (game.board.getNextRowIdx(colIdx) - 2),
          playerId: playerId,
          hasWin: game.board.hasWinner(),
          isDraw: game.board.isBoardFull(),
          winTally: game.winTally
        };
        p1.socket.emit('board update', updateObj);
        p2.socket.emit('board update', updateObj);
      }
    }
  };

  this.reset = function() {
    game.reset();
  };

  this.removePlayer = function(playerId) {
    if (playerId === 1) {
      console.log('RMEOV PLAYER ONE!!!');
      p2.socket.emit('opponent-disconnect');
    } else if (playerId === 2) {
      console.log('REMOVE PLAYER TWO!!!');
      p1.socket.emit('opponent-disconnect');
    }
  };
};