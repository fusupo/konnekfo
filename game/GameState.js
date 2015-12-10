"use strict";

module.exports = function(){
  this.reset = function(){
    this.winTally = [0,0,0];
    this.currPlayer = 0;
    this.statusCode = undefined;
    this.statusValue = undefined;
    this.statusMessage = undefined;
    this.prevMove = {
      colIdx: null,
      rowIdx: null,
      playerId: null
    };
    this.hasWin = false;
    this.isDraw = false;
  };
  this.reset();
};
