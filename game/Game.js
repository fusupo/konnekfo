"use strict";

var Board = require("./Board.js");

module.exports = function(p1, p2) {

  console.log('GAME INIT');

  this.state = {
    winTally : [0, 0, 0],
    currPlayer: "noone"
  };
  this.winTally = [0, 0, 0];
  this.isComplete = true;
  var firstToPlay; // = this.currPlayer = p1;

  this.commitMove = function(colIdx) {
    if (!this.isComplete) {
      if (!this.board.isColFullP(colIdx)) {
        if (this.currPlayer === p1) {
          this.board.move(colIdx, p1.id);
          this.currPlayer = p2;
        } else {
          this.board.move(colIdx, p2.id);
          this.currPlayer = p1;
        }
        this.state.currPlayer = this.currPlayer.id;
        if (this.moveCommitted !== undefined) {
          this.moveCommitted(colIdx);
        }
        if (this.board.hasWinnerP()) {
          this.isComplete = true;
          //var winningDirection = this.board.winningDirection;
          this.winTally[this.board.winner]++;
          this.state.winTally[this.board.winner]++;
          console.log('//////////////////////////////////////// ',this.board.winner, 'won the game!');
        } else if (this.board.isBoardFullP()) {
          this.isComplete =  true;
          this.winTally[0]++;
          this.state.winTally[0]++;
          console.log('game is draw');
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
      firstToPlay = this.currPlayer = p1;
    } else {
      firstToPlay = this.currPlayer = firstToPlay === p1 ? p2 : p1;
    }
    this.state.currPlayer = this.currPlayer.id;
    this.currPlayer.promptMove(this);
  };

  this.reset();

};
