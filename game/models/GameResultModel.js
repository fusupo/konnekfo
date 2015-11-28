"use strict";

var Backbone = require('backbone');

module.exports = Backbone.Model.extend((function() {

  return {

    defaults : {
      hasOutcome : false,
      hasWinner : false,
      winner : null,
      winDir : null,
      winPos : null
    },

    initialize: function() {
      console.log("new game result model");
      console.log(this.attributes);
    },

    reset: function(){
      this.set('hasOutcome', false);
      this.set('hasWinner', false);
      this.set('winner', null);
      this.set('winDir', null);
      this.set('winPos', null);
    }

  };
})());
