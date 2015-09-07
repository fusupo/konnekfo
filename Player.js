"use strict";

var Player = function(id) {
  this.id = id;
  this.promptMove = function(game) {
    game.view.onColSelect = function(idx) {
      game.view.onColSelect = null;
      game.commitMove(idx);
    };
  };
};

var RandomPlayer = function(id) {
  this.id = id;
  this.promptMove = function(game) {
    game.commitMove(Math.round(Math.random() * 7));
  };
};

var CPUPlayerMkI = function(id) {
  this.id = id;

  var figureOutThePlan = function(board) {

    var result;
    var recur = function(node) {
      var i = 0;
      while (i < 7 && result === undefined) {

        var b = new Board(node.value.cloneCells());
        var n = new Tree(b);
        var moveResult = b.move(i, id);
        var hasWin = b.hasWinner();

        if (!hasWin && moveResult) {
          node.addChild(recur.bind(this)(n));
        } else {
          if (hasWin) {
            result = b;
          }

          node.addChild(n);

        }

        i++;

      }

      return node;
    };

    var n = new Tree(board);
    var tree = recur.bind(this)(n);

    console.log(tree);

    return Math.floor(Math.random() * 7);

  };

  this.promptMove = function(game) {
    var move = figureOutThePlan.bind(this)(game.board);
    game.commitMove(move);
  };

};
