var Board = function() {
  var b = [];
  for (var y = 0; y < 6; y++) {
    var row = [];
    for (var x = 0; x < 7; x++) {
      row.push(null);
    }
    b.push(row);
  }
  return b;
};

var move = function(board, col, del) {
  for (var y = 0; y < 6; y++) {
    if (board[y][col] === null) {
      board[y][col] = del;
      return true;
    };
  }
  return false;
};

var Player = function(id) {
  this.id = id;
  this.promptMove = function(game) {
    game.view.onColSelect = function(idx) {
      game.view.onColSelect = null;
      game.commitMove(idx);
    };
    console.log(game.view.onColSelect);
  };
};

var Game = function() {

  var b = new Board();
  this.view = new View();
  this.view.drawBoard();

  var p1 = new Player('p1');
  var p2 = new Player('p2');

  var gameOver = false;
  var currPlayer = p1;

  var winner = 'none';
  this.commitMove = function(colIdx) {

    if (currPlayer === p1) {
      move(b, colIdx, "x");
      currPlayer = p2;
    } else {
      move(b, colIdx, "o");
      currPlayer = p1;
    }

    //redraw board
    this.view.update(b);
    if (this.hasWinner()) {
      console.log(winner);
    } else {
      currPlayer.promptMove(this);
    }
  };

  this.hasWinner = function(){
    //recursive winning scenario solver
    return false;
  };
  
  currPlayer.promptMove(this);

};

//////////////////////////////////////////////////////////// BOARD

var View = function() {
  var bgColor = "#ffffff";

  this.onColSelect = null;
  this.circles = [];

  this.drawCircles = function(s, color) {
    for (var y = 0; y < 6; y++) {
      var row = [];
      for (var x = 0; x < 7; x++) {
        var c = s.circle(10 + (x * 20), 30 + (y * 20), 6);
        c.attr({
          fill: color
        });
        row.push(c);
      }
      this.circles.push(row);
    }
  };

  this.drawButtons = function(s, color) {
    for (var x = 0; x < 7; x++) {
      var b = s.rect(20 * x, 0, 20, 20);
      b.attr({
        fill: color //(Math.round(Math.random() * 255 * 255 * 255)).toString(16)
      });

      var click = function(foo) {
        return function() {
          if (this.onColSelect !== null) {
            this.onColSelect(foo);
          }
        };
      }(x);

      var over = function(foo) {
        return function() {
          foo.attr({
            fill: '#ccc' //(Math.round(Math.random() * 255 * 255 * 255)).toString(16)
          });
        };
      }(b);

      var out = function(foo) {
        return function() {
          foo.attr({
            fill: bgColor //(Math.round(Math.random() * 255 * 255 * 255)).toString(16)
          });
        };
      }(b);

      b.mouseover(over.bind(this));
      b.mouseout(out.bind(this));
      b.click(click.bind(this));
    };
  };

  this.drawBoard = function() {
    var s = Snap("#svg");
    var bg = s.rect(0, 0, 140, 140);
    bg.attr({
      fill: bgColor
    });

    var fg = s.rect(0, 20, 140, 120);
    fg.attr({
      fill: "#0000bb"
    });

    this.drawCircles(s, bgColor);
    this.drawButtons(s, bgColor);
  };

  this.update = function(board) {
    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        var c = this.circles[5 - y][x];
        var fillColor = bgColor;
        if (board[y][x] === 'x') {
          fillColor = '#f00';
        } else if (board[y][x] === 'o') {
          fillColor = '#ff0';
        }
        c.attr({
          fill: fillColor
        });
      }
    }
  };
};

//////////////////////////////////////////////////////////// INIT
window.onload = function() {
  var g = new Game();
};
