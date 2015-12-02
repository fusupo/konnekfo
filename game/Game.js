"use strict";

var Board = require("./Board.js");

module.exports = function(p1, p2) {
  console.log('GAME INIT');
  this.winTally = [0, 0, 0];
  var firstToPlay; // = this.currPlayer = p1;
  this.commitMove = function(colIdx) {
    if (!this.board.isColFull(colIdx)) {
      if (this.currPlayer === p1) {
        this.board.move(colIdx, p1.id);
        this.currPlayer = p2;
      } else {
        this.board.move(colIdx, p2.id);
        this.currPlayer = p1;
      }

      if (this.moveCommitted !== undefined) {
        this.moveCommitted(colIdx);
      }

      var winningDirection = this.board.hasWinner();
      if (!winningDirection && !this.board.isBoardFull()) {
        this.currPlayer.promptMove(this);
      }

      if (winningDirection) {
        this.winTally[(this.currPlayer.id ^ 3) - 1]++;
      } else if (this.board.isBoardFull()) {
        this.winTally[2]++;
      }

      return true;
    } else {
      this.currPlayer.promptMove(this);
      return false;
    }
  };

  this.reset = function() {
    this.board = new Board();

    // switch who starts every other game...
    if (!firstToPlay) {
      firstToPlay = this.currPlayer = p1;
    } else {
      firstToPlay = this.currPlayer = firstToPlay === p1 ? p2 : p1;
    }

    this.currPlayer.promptMove(this);
  };

  this.reset();

};
