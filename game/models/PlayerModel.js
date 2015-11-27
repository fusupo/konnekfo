"use strict";

var Backbone = require('backbone');

module.exports = Backbone.Model.extend((function() {
  return {
    initialize: function(initObj) {
      console.log('new player', initObj);
      //this.playerId = initObj.playerId;
    },
    prompt: function() {
      console.log('make a move fool');
    },
    attemptMove: function(colIdx){
      this.trigger('attemptMove', colIdx);
    }
  };
})());
