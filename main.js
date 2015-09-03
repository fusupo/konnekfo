var Game = function() {

  var b = new Board();
  this.view = new View();
  this.view.drawBoard();

  var p1 = new CPUPlayerMkI('p1');
  var p2 = new Player('p2');

  var gameOver = false;
  var currPlayer = p1;

  var winner = 'none';
  this.commitMove = function(colIdx) {

    if (currPlayer === p1) {
      b.move(colIdx, "x");
      currPlayer = p2;
    } else {
      b.move(colIdx, "o");
      currPlayer = p1;
    }

    //redraw board
    this.view.update(b);
    if (b.hasWinner()) {
      console.log(b.winner);
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
