var Game = function() {

  this.board = new Board();;
  this.view = new View();
  this.view.drawBoard();

  var p1 = new CPUPlayerMkI('x');
  var p2 = new Player('o');

  var gameOver = false;
  var currPlayer = p1;

  var winner = 'none';
  this.commitMove = function(colIdx) {

    if (currPlayer === p1) {
      this.board.move(colIdx, p1.id);
      currPlayer = p2;
    } else {
      this.board.move(colIdx, p2.id);
      currPlayer = p1;
    }

    //redraw board
    this.view.update(this.board);
    var winningDirection = this.board.hasWinner();
    if (winningDirection) {
      alert(this.board.winner + ' won! ' + winningDirection);      
    } else {
      currPlayer.promptMove(this);
    }
  };

  currPlayer.promptMove(this);

};

//////////////////////////////////////////////////////////// INIT
window.onload = function() {
  var g = new Game();
};
