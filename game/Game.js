"use strict";

var Board = require("./Board.js");

module.exports = function(p1, p2) {

  console.log('GAME INIT');

  this.board = new Board();
  var firstToPlay = this.currPlayer = p1;

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
      if (!winningDirection) {
        this.currPlayer.promptMove(this);
      }
      return true;
    } else {
      this.currPlayer.promptMove(this);
      return false;
    }
  };

  this.currPlayer.promptMove(this);

  this.reset = function() {
    console.log('reset the fuggin game!!');
    this.board = new Board();
    // switch who starts every other game...(now I'm gonna have to keep a tally of games won overall #eyeROll)
    firstToPlay = this.currPlayer = firstToPlay === p1 ? p2 : p1;
    this.currPlayer.promptMove(this);
  };

};