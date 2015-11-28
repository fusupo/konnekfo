"use strict";

var Backbone = require('backbone');

module.exports = Backbone.Model.extend((function() {
  return {

    defaults: {
      currPlayerId: 1,
      tally: [0, 0, 0]
    },

    initialize: function(foo) {
      console.log(foo);
      this.get('p1').on('attemptMove', (function(colIdx) {
        this.attemptMove(colIdx);
      }).bind(this));
      this.get('p2').on('attemptMove', (function(colIdx) {
        this.attemptMove(colIdx);
      }).bind(this));
    },

    terminate: function() {
      this.get('p1').off('attemptMove');
      this.get('p2').off('attemptMove');
      this.set('p1', null);
      this.set('p2', null);
      this.set('board', null);
    },

    startGameLoop: function() {
      if (this.get('currPlayerId') === 1) {
        this.get('p1').prompt();
      } else {
        this.get('p2').prompt();
      }
    },

    attemptMove: function(colIdx) {
      // prompt current player
      // on player move
      // // if move is valid
      // // // commit move to board
      // // // if board has win
      // // // // end game on player win
      // // // else if board is full
      // // // // end game on draw
      // // // else
      // // // // swap current player
      // // // // restart gameloop
      // // else
      // // // restart gameloop
      var board = this.get('board');
      var currPlayerId = this.get('currPlayerId');
      console.log('p' + currPlayerId + ' attemptMove:', colIdx);
      if (!board.isColFullP(colIdx)) {
        board.move(colIdx, currPlayerId);
        if (board.hasWinnerP()) {
          this.trigger('gameComplete');
        } else if (board.isBoardFullP()) {
          this.trigger('gameComplete');
        } else {
          this.set("currPlayerId", currPlayerId ^ 3);
          this.startGameLoop();
        }
      } else {
        this.startGameLoop();
      }
    },

    reset: function(){
      console.log('reset the model!!'); 
    }
  };
})());
