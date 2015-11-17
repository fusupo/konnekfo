"use strict";

var Board = require("./Board.js");

module.exports = function(p1, p2) {

  console.log('GAME INIT');

  this.board = new Board();
  this.currPlayer = p1;

  this.commitMove = function(colIdx) {
    if (this.currPlayer === p1) {
      this.board.move(colIdx, p1.id);
      this.currPlayer = p2;
    } else {
      this.board.move(colIdx, p2.id);
      this.currPlayer = p1;
    }

    this.moveCommitted(colIdx);

    var winningDirection = this.board.hasWinner();
    if (!winningDirection) {
      this.currPlayer.promptMove(this);
    }
  };

  this.currPlayer.promptMove(this);
};

