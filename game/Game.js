"use strict";

var Board = require("./Board.js");
var gameState = require("./GameState.js");
module.exports = function(p1, p2, state) {

  console.log('GAME INIT');
  
  this.state = state;
  this.isComplete = true;
  var firstToPlay = undefined; // = this.currPlayer = p1;

  this.commitMove = function(colIdx) {
    if (!this.isComplete) {
      if (!this.board.isColFullP(colIdx)) {
        if (this.currPlayer === p1) {
          console.log('1',this.currPlayer.id);
          this.board.move(colIdx, p1.id);
          this.currPlayer = p2;
        } else {
          console.log('2',this.currPlayer.id);
          this.board.move(colIdx, p2.id);
          this.currPlayer = p1;
        }
        this.state.currPlayer = this.currPlayer.id;
        this.state.status = ["It's Player " + this.currPlayer.id + "'s Turn.", "p", this.currPlayer.id];
        this.state.prevMove = {
          colIdx: colIdx,
          rowIdx: 6 - (this.board.getNextRowIdx(colIdx) - 2),
          playerId: this.currPlayer.id^3
        };
        if (this.board.hasWinnerP()) {
          this.isComplete = true;
          //var winningDirection = this.board.winningDirection;
          this.state.hasWin = true;
          this.state.winTally[this.board.winner]++;
          console.log('//////////////////////////////////////// ',this.board.winner, 'won the game!');
          this.state.status = ["Player " + this.board.winner + " Has Won The Game!", "!", this.board.winner];
        } else if (this.board.isBoardFullP()) {
          this.isComplete = true;
          this.state.isDraw = true;
          this.state.winTally[0]++;
          console.log('game is draw');
          this.state.status = ["The Game Is Draw.", "x", undefined];
        }else{
          this. currPlayer.promptMove(this);
        }
        if (this.moveCommitted !== undefined) {
          this.moveCommitted(colIdx);
        }
        return true;
      } else {
        this.currPlayer.promptMove(this);
      }
    }
    return false;
  };

  this.board = new Board();
  this.reset = function() {
    this.isComplete = false;
    this.board.reset();
    // switch who starts  every other game...
    if (!firstToPlay) {
      firstToPlay = 1;
      this.currPlayer = p1;
    } else {
      firstToPlay = firstToPlay^3;
      this.currPlayer = firstToPlay === 1 ? p1 : p2;
    }
    this.state.currPlayer = this.currPlayer.id;
    this.state.status = ["It's Player " + this.currPlayer.id + "'s Turn.", "p", this.currPlayer.id];
    //this.currPlayer.promptMove(this);
  };

};
