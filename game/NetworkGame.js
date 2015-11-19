"use strict";

var Players = require('../game/Player.js');
var Game = require('../game/Game.js');

module.exports = function() {

  console.log('NEW NETWORK GAME');

  var p1, p2;
  var currPlayer;
  var game;

  // this.new = function(cbk) {
  //   cbk();
  // };

  // this.connect = function(connId, cbk) {
  //   cbk();
  // };

  this.provisionPlayer = function(socket) {
    if (p1 === undefined) {
      p1 = new Players.RemotePlayer(1, socket);
      return 1;
    } else if (p2 === undefined) {
      p2 = new Players.RemotePlayer(2, socket);
      game = new Game(p1, p2);
      return 2;
    }

    return 0;
  };

  this.attemptMove = function(playerId, colIdx) {
    console.log('palyer ' + playerId + ' wants to make move at ' + colIdx + ', it is player ' + game.currPlayer.id + "'s turn");
    if (playerId === game.currPlayer.id) {
      game.currPlayer.socket.emit('their turn');
      game.commitMove(colIdx);
      var updateObj = {
        colIdx: colIdx,
        rowIdx: 6 - (game.board.getNextRowIdx(colIdx) - 2),
        playerId: playerId,
        hasWin: game.board.hasWinner()
      };
      p1.socket.emit('board update', updateObj);
      p2.socket.emit('board update', updateObj);
    }
  };

  this.reset = function() {
    game.reset();
  };
};