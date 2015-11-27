"use strict";

var PlayerModel = require('./PlayerModel.js');

module.exports = PlayerModel.extend((function() {
  return {
    prompt: function() {
      var boardView = this.get("boardView");
      boardView.on('click:column', (function(colIdx){
        boardView.off('click:column');
        this.attemptMove(colIdx);
      }).bind(this));
    }
  };
})());
