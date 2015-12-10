"use strict";

var Board = require("./Board.js");
var gameState = require("./GameState.js");
module.exports = function(p1, p2, state) {

  console.log('GAME INIT');
  
  this.state = state;
  this.isComplete = true;
  this.board = new Board();

  var firstToPlay = undefined; 

  this.commitMove = function(colIdx) {
    if (!this.isComplete) {
      if (!this.board.isColFullP(colIdx)) {
        //commit the move
        if (this.currPlayer === p1) {
          this.board.move(colIdx, p1.id);
          this.currPlayer = p2;
        } else {
          this.board.move(colIdx, p2.id);
          this.currPlayer = p1;
        }
        //update game state
        this.state.currPlayer = this.currPlayer.id;
        // this.state.status = ["It's Player " + this.currPlayer.id + "'s Turn.", "p", this.currPlayer.id];
        this.state.statusCode = "p";
        this.state.statusValue = this.currPlayer.id;
        this.state.statusMessage = "It's Player " + this.currPlayer.id + "'s Turn.";
        this.state.prevMove = {
          colIdx: colIdx,
          rowIdx: 6 - (this.board.getNextRowIdx(colIdx) - 2),//this is pretty ugly
          playerId: this.currPlayer.id^3
        };
        if (this.board.hasWinnerP()) {
          this.isComplete = true;
          //var winningDirection = this.board.winningDirection;
          this.state.hasWin = true;
          this.state.winTally[this.board.winner]++;
          console.log('//////////////////////////////////////// ',this.board.winner, 'won the game!');
          // this.state.status = ["Player " + this.board.winner + " Has Won The Game!", "!", this.board.winner];
          this.state.statusCode = "!";
          this.state.statusValue = this.board.winner;
          this.state.statusMessage = "Player " + this.board.winner + " Has Won The Game!";
        } else if (this.board.isBoardFullP()) {
          this.isComplete = true;
          this.state.isDraw = true;
          this.state.winTally[0]++;
          console.log('game is draw');
          //this.state.status = ["The Game Is Draw.", "x", undefined];
          this.state.statusCode = "x";
          this.state.statusValue = undefined;
          this.state.statusMessage = "The Game Is Draw.";
        }else{
          // this.currPlayer.promptMove(this);
          //
          this.currPlayer.disableUI();
        }
        if (this.moveCommitted !== undefined) {
          this.moveCommitted(colIdx);
        }
        return true;
      } else {
        // this.currPlayer.promptMove(this);
      }
    }
    return false;
  };

  this.promptNextPlayer = function(){
    if(this.state.statusCode === "x" || this.state.statusCode === "!"){
      
    }else{
      this.currPlayer.promptMove(this);
    }
  };

  this.reset = function() {
  this.isComplete = false;
  this.board.reset();
  // switch who starts  every other game
  if (!firstToPlay) {
    firstToPlay = 1;
    this.currPlayer = p1;
  } else {
    firstToPlay = firstToPlay^3;
    this.currPlayer = firstToPlay === 1 ? p1 : p2;
  }
  this.state.currPlayer = this.currPlayer.id;
    // this.state.status = ["It's Player " + this.currPlayer.id + "'s Turn.", "p", this.currPlayer.id];
    this.state.statusCode = "p";
    this.state.statusValue = this.currPlayer.id;
    this.state.statusMessage = "It's Player " + this.currPlayer.id + "'s Turn.";
    this.promptNextPlayer();
  };
};
