var Game = function() {

  var b = new Board();
  this.board = b;
  this.view = new View();
  this.view.drawBoard();

  var p1 = new CPUPlayerMkI('x');
  var p2 = new Player('o');

  var gameOver = false;
  var currPlayer = p1;

  var winner = 'none';
  this.commitMove = function(colIdx) {

    if (currPlayer === p1) {
      b.move(colIdx, p1.id);
      currPlayer = p2;
    } else {
      b.move(colIdx, p2.id);
      currPlayer = p1;
    }

    //redraw board
    this.view.update(b);
    if (b.hasWinner()) {
      console.log(b.winner);
      alert(b.winner + ' won!');      
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
