"use strict";

var Backbone = require('backbone');
var _ = require('underscore');
var colors = require('../Colors.js');

var MenuView = require('./MenuView.js');
var BoardModel = require('../models/BoardModel.js');
var BoardView = require('./BoardView.js');
var LocalPlayerModel = require('../models/LocalPlayerModel.js');
var LocalGameModel = require('../models/LocalGameModel.js');

module.exports = Backbone.View.extend((function() {
  return {

    initialize: function() {
      console.log("new app view");
      var menu = new MenuView({
        el: this.$("#menuHolder")
      });
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
      var boardModel = new BoardModel();
      this.createBoard(boardModel);
      var gameModel = new LocalGameModel({
        board: boardModel,
        p1: new LocalPlayerModel({
          playerId: 1,
          boardView: this.boardView
        }),
        p2: new LocalPlayerModel({
          playerId: 2,
          boardView: this.boardView
        })
      });
      gameModel.startGameLoop();
    },

    startVsComputerGame: function() {
      this.createBoard();
    },

    backToMain: function() {
      this.boardView.remove();
    },

    createBoard: function(boardModel) {
      this.boardView = new BoardView({
        model: boardModel
      });
      this.$('#boardHolder').append(this.boardView.$el);
      this.boardView.render();
    }

  };
})());
