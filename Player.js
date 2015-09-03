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
  this.promptMove = function(game) {
    game.commitMove(Math.round(Math.random() * 7));
  };
};

var CPUPlayerMkI = function() {

  var figureOutThePlan = function() {
    return 3;
  };

  this.promptMove = function(game) {
    var move = figureOutThePlan(game.board);
    game.commitMove(move);
  };
};
