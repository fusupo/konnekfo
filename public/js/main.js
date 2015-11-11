var Game = function() {

  this.board = new Board();
  this.view = new View();
  this.view.drawBoard();

  var p1 = new CPUPlayerClI(2);
  var p2 = /*new Player(2);*/ new Player(1);

  var gameOver = false;
  var currPlayer = p2;

  var winner = 'none';

  this.commitMove = function(colIdx) {

    console.log('commitmove', colIdx);
    socket.emit('commit move', colIdx);

    // if (currPlayer === p1) {
    //   this.board.move(colIdx, p1.id);
    //   currPlayer = p2;
    // } else {
    //   this.board.move(colIdx, p2.id);
    //   currPlayer = p1;
    // }

    // this.view.addPiece(colIdx, 6 - (this.board.getNextRowIdx(colIdx) - 2), currPlayer.id ^ 0b11, (function () {
    //   var winningDirection = this.board.hasWinner();
    //   if (winningDirection) {
    //     alert(this.board.winner + ' won! ' + winningDirection);
    //   } else {
    //     currPlayer.promptMove(this);
    //   }
    // }).bind(this));

  };

  currPlayer.promptMove(this);

};

//////////////////////////////////////////////////////////// INIT

window.onload = function() {
  this.socket = io();
  this.socket.on('confirm player', function(id) {
    console.log('According to the server, I am player #' + id);
  });

  var g = new Game();
};
