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
    var recur = function(bo) {
      for (var i = 0; i < 7; i++) {

        var b = new Board(bo.cloneCells());
        var moveResult = b.move(i, id);
        var hasWin = b.hasWinner();
        console.table(b.cells);

      };
    };

    recur(board);

    return Math.round(Math.random() * 7);

  };

  this.promptMove = function(game) {
    var move = figureOutThePlan(game.board);
    game.commitMove(move);
  };

  this.TreeNode = function() {
    this.board = null;
    this.children = [];
  };

};
