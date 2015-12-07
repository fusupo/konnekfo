"use strict";

var Players = require('../game/Player.js');
var Game = require('../game/Game.js');
var GameState = require('../game/GameState.js');

module.exports = function() {
  
  console.log('NEW NETWORK GAME');
  //var this.p1, this.p2;
  var currPlayer;
  var game;
  var gameState;

  this.provisionPlayer = function(socket) {
    if (this.p1 === undefined) {
      console.log('NEW PLAYER 1');
      this.p1 = new Players.RemotePlayer(1, socket);
      return 1;
    } else if (this.p2 === undefined) {
      this.p2 = new Players.RemotePlayer(2, socket);
      gameState = new GameState();
      game = new Game(this.p1, this.p2, gameState);
      game.reset();
      return 2;
    }
    return 0;
  };

  this.attemptMove = function(playerId, colIdx) {
    console.log('palyer ' + playerId + ' wants to make move at ' + colIdx + ', it is player ' + game.currPlayer.id + "'s turn");
    if (playerId === game.currPlayer.id && !game.board.hasWinnerP()) {
      game.currPlayer.socket.emit('their turn');
      if (game.commitMove(colIdx)) {
        this.p1.socket.emit('board update', gameState);
        this.p2.socket.emit('board update', gameState);
      }
    }
  };

  this.reset = function() {
    game.reset();
    //this.p1.socket.emit('board update', gameState);
    //this.p2.socket.emit('board update', gameState);
  };

  this.removePlayer = function(playerId) {
    if (playerId === 1) {
      console.log('RMEOV PLAYER ONE!!!');
      this.p2.socket.emit('opponent-disconnect');
    } else if (playerId === 2) {
      console.log('REMOVE PLAYER TWO!!!');
      this.p1.socket.emit('opponent-disconnect');
    }
  };

  this.getGameState = function(){
    return gameState;
  };
};
