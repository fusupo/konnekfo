"use strict";

module.exports = function() {
  console.log('NEW NETWORK GAME');

  var p1, p2;

  this.new = function(cbk) {
    cbk();
  };

  this.connect = function(connId, cbk) {
    cbk();
  };

  this.provisionPlayer = function() {
    if (p1 === undefined) {
      p1 = 'x';
      return 1;
    } else if (p2 === undefined) {
      p2 = 'x';
      return 2;
    }
    return 0;
  };

  // this.board = new Board();
  // this.view = new View();
  // this.view.drawBoard();

  // var p1 = p1;
  // var p2 = p2;

  // var gameOver = false;
  // var currPlayer = p1;

  // var winner = 'none';

  // this.commitMove = function(colIdx) {

  //   console.log('commitmove', colIdx);
  //   socket.emit('commit move', colIdx);

  //   // if (currPlayer === p1) {
  //   //   this.board.move(colIdx, p1.id);
  //   //   currPlayer = p2;
  //   // } else {
  //   //   this.board.move(colIdx, p2.id);
  //   //   currPlayer = p1;
  //   // }

  //   // this.view.addPiece(colIdx, 6 - (this.board.getNextRowIdx(colIdx) - 2), currPlayer.id ^ 0b11, (function () {
  //   //   var winningDirection = this.board.hasWinner();
  //   //   if (winningDirection) {
  //   //     alert(this.board.winner + ' won! ' + winningDirection);
  //   //   } else {
  //   //     currPlayer.promptMove(this);
  //   //   }
  //   // }).bind(this));

  // };

  // currPlayer.promptMove(this);

};
