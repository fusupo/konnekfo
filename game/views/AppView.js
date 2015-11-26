"use strict";

var Backbone = require('backbone');
var _ = require('underscore');
var colors = require('../Colors.js');

var MenuView = require('./MenuView.js');
var BoardModel = require('../models/BoardModel.js');
var BoardView = require('./BoardView.js');

module.exports = Backbone.View.extend((function() {
  return {

    initialize: function() {
      console.log("new app view");
      var menu = new MenuView({
        el: this.$("#menuHolder")
      });
      this.boardView = new BoardView();
      this.$('#boardHolder').append(this.boardView.$el);
      this.boardView.render();
      this.boardView.hide();
      menu.on('select:vsHumanLocal', this.startVsHumanLocalGame.bind(this));
      menu.on('select:vsComputer', this.startVsComputerGame.bind(this));
      menu.on('select:backToMain', this.backToMain.bind(this));
      //this.render();
    },

    // render: function() {
    //   this.$el.html('MUTHER FUCKING APP VIEW');
    // },
    
    events: {},
    
    startVsHumanLocalGame: function() {
      this.boardView.show();
    },
    
    startVsComputerGame: function() {
      this.boardView.show();
    },
    
    backToMain: function() {
      this.boardView.hide();
    }
    
  };
})());
