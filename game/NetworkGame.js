"use strict";

var Players = require('../game/Player.js');
var Game = require('../game/Game.js');
var GameState = require('../game/GameState.js');
var sockConst = require('../game/SocketConstants.js');

module.exports = function() {
  
  console.log('NEW NETWORK GAME');
  //var this.p1, this.p2;
  var game;
  var gameState;

  this.provisionPlayer = function(socket) {
    if (this.p1 === undefined) {
      console.log('NEW PLAYER 1');
      this.p1 = new Players.RemotePlayer(1, socket);
      return this.p1;
    } else if (this.p2 === undefined) {
      this.p2 = new Players.RemotePlayer(2, socket);
      gameState = new GameState();
      game = new Game(this.p1, this.p2, gameState);
      game.reset();
      return this.p2;
    }
    return 0;
  };

  this.attemptMove = function(playerId, colIdx) {
    console.log('palyer ' + playerId + ' wants to make move at ' + colIdx + ', it is player ' + game.currPlayer.id + "'s turn");
    if (playerId === game.currPlayer.id && !game.board.hasWinnerP()) {
      if (game.commitMove(colIdx)) {
        console.log('I COMMITED THE MOVE')
        // game.currPlayer.socket.emit('their turn');
        this.emitUpdate();
      }
    }
  };

  this.reset = function() {
    game.reset();
    // this.emitUpdate(); 
  };

  this.removePlayer = function(playerId) {
    if (playerId === 1) {
      console.log('RMEOV PLAYER ONE!!!');
      if(this.p2){
        this.p2.socket.emit('opponent-disconnect');
        this.p1 = this.p2;
        this.p1.id = 1;
        this.p2 = undefined;
        this.p1.socket.emit(sockConst.DICTATE_PLAYER_ID, playerId);
      }else{
        this.p1 = undefined;
      }
    } else if (playerId === 2) {
      console.log('REMOVE PLAYER TWO!!!');
      this.p1.socket.emit('opponent-disconnect');
      this.p2 = undefined;
    }
  };

  this.emitUpdate = function(){
    this.p1.socket.emit('board update', gameState);
    this.p2.socket.emit('board update', gameState);
  };

  this.emitStart = function(){
    this.p1.socket.emit('game-start', gameState);
    this.p2.socket.emit('game-start', gameState);
  }; 

  this.getGameState = function(){
    return gameState;
  };
};
