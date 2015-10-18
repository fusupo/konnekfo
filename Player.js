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
    game.commitMove(Math.floor(Math.random() * 7));
  };
};

var CPUPlayerMkI = function(id) {
  this.id = id;

  var figureOutThePlan = function(board) {

    var result;
    var recur = function(node) {
      var xo = arguments[1] || id;
      var i = 0;
      while (i < 7 && result === undefined) {

        var b = new Board(node.value.cloneCells());
        var n = new Tree(b);
        var moveResult = b.move(i, id);
        var hasWin = b.hasWinner();

        if (!hasWin && moveResult) {
          //console.log(arguments);
          //node.addChild(recur.bind(this)(n, xo)); //xo === "x" ? "o" : "x"));
          var j = 0;
          while (j < 7 && result === undefined) {

            var b2 = new Board(n.value.cloneCells());
            var n2 = new Tree(b2);
            var moveResult2 = b2.move(i, xo === "x" ? "o" : "x");
            var hasWin2 = b2.hasWinner();

            if (!hasWin2 && moveResult2) {
              n.addChild(recur.bind(this)(n2, xo)); //xo === "x" ? "o" : "x"));
            } else {
              if (hasWin2) {
                result = b2;
              }

              n.addChild(n2);
            }

            j++;
          }

          node.addChild(n);
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

    //console.log(tree);
    // console.log(tree.DFTraverse(function(value) {
    //   return value === result;
    // }));
    tree.DFTraverse(function(value) {
      return value === result;
    });

    return tree.DFTraverse(function(value) {
      return value === result;
    })[0];

  };

  this.promptMove = function(game) {
    var move = figureOutThePlan.bind(this)(game.board);
    game.commitMove(move);
  };

};
