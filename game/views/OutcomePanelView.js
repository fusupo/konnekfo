"use strict";

var Backbone = require('backbone');
var _ = require('underscore');
var Colors = require('../Colors.js');

module.exports = Backbone.View.extend((function() {
  return {

    initialize: function() {
      console.log("new menu view");
      this.listenTo(this.model, "gameStart", (function() {
        this.showPlayerPrompt();
        this.hideReset();
        this.hideResult();
      }).bind(this));
      this.listenTo(this.model, "promptPlayer", (function(playerId) {
        this.promptPlayer(playerId);
      }).bind(this));
      this.listenTo(this.model, "gameComplete", (function() {
        this.hidePlayerPrompt();
        this.showReset();
        this.showResult();
        this.updateGameTally(this.model.get('tally'));
      }).bind(this));
      this.render();
    },

    render: function() {
      var template = _.template($("#conclusion_panel_template").html());
      this.$el.html(template);
      this.$gameWinTally = this.$el.find('#game-win-tally');
      this.$result = this.$el.find('#result');
      this.$reset = this.$el.find('#reset-local');
      this.$whosTurn = this.$el.find('#whos-turn');
      this.hideReset();
      this.hideResult();
      this.updateGameTally(this.model.get('tally'));
    },

    events: {
      "click #reset-local": function() {
        this.trigger("click:reset");
      }
    },

    updateGameTally: function(tally) {
      this.$gameWinTally.find('#p1').html(tally[1]);
      this.$gameWinTally.find('#p2').html(tally[2]);
      this.$gameWinTally.find('#draws').html(tally[0]);
    },

    promptPlayer: function(playerId, msg) {
      msg = msg || 'it\'s player ' + playerId + '\'s turn';
      this.$whosTurn
        .html(msg)
        .css('color', Colors['p' + playerId + 'Color']);
    },

    hidePlayerPrompt: function() {
      this.$whosTurn.hide();
    },

    showPlayerPrompt: function() {
      this.$whosTurn.show();
    },

    hideResult: function() {
      this.$result.hide();
    },

    showResult: function() {
      if (this.model.get('gameResultModel').get('hasWinner')) {
        this.$result.html(this.model.get('gameResultModel').get('winner')+' has won the game')
          .css('color', Colors['p' + this.model.get('gameResultModel').get('winner') + 'Color']);
      } else {
        this.$result.html('game is draw');
      }
      this.$result.show();
    },

    hideReset: function() {
      this.$reset.hide();
    },

    showReset: function() {
      this.$reset.show();
    }

  };
})());
