"use strict";

var Backbone = require('backbone');

module.exports = Backbone.Model.extend((function() {
  return {

    defaults: {
      startPlayerId: 1,
      currPlayerId: 1,
      tally: [0, 0, 0]
    },

    initialize: function() {
      console.log('new LocalGameModel');
      this.get('p1').on('attemptMove', (function(colIdx) {
        this.attemptMove(colIdx);
      }).bind(this));
      this.get('p2').on('attemptMove', (function(colIdx) {
        this.attemptMove(colIdx);
      }).bind(this));
      console.log(this.attributes);
    },

    terminate: function() {
      this.get('p1').off('attemptMove');
      this.get('p2').off('attemptMove');
      this.set('p1', null);
      this.set('p2', null);
      this.set('board', null);
    },

    startGame: function(){
      this.startGameLoop();
      this.trigger('gameStart');
    },

    startGameLoop: function() {
      if (this.get('currPlayerId') === 1) {
        this.get('p1').prompt();
        this.trigger('promptPlayer', 1);
      } else {
        this.get('p2').prompt();
        this.trigger('promptPlayer', 2);
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
      if (!board.isColFullP(colIdx)) {
        board.move(colIdx, currPlayerId);
        var tempTally;
        if (board.hasWinnerP()) {
          tempTally = this.get('tally');
          tempTally[this.get('gameResultModel').get('winner')]++;
          this.set('tally', tempTally);
          this.trigger('gameComplete');
        } else if (board.isBoardFullP()) {
          tempTally = this.get('tally');
          tempTally[0]++;
          this.set('tally', tempTally);
          this.trigger('gameComplete');
        } else {
          this.set("currPlayerId", currPlayerId ^ 3);
          this.startGameLoop();
        }
      } else {
        this.startGameLoop();
      }
    },

    reset: function() {
      var tempStartPlayerId = this.get('startPlayerId');
      tempStartPlayerId = tempStartPlayerId ^ 3;
      this.set('startPlayerId', tempStartPlayerId);
      this.set('currPlayerId', tempStartPlayerId);
    }
    
  };
})());
