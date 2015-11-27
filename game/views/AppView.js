"use strict";

var Backbone = require('backbone');
var _ = require('underscore');
var colors = require('../Colors.js');

var MenuView = require('./MenuView.js');
var BoardModel = require('../models/BoardModel.js');
var BoardView = require('./BoardView.js');
var LocalPlayerModel = require('../models/LocalPlayerModel.js');
var CPUPlayerModel = require('../models/CPUPlayerModel.js');
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
    },

    events: {},

    startVsHumanLocalGame: function() {
      console.log('///////////////////////// NEW HUMAN VS HUMAN GAME ////////////////////');
      this.boardModel = new BoardModel();
      this.boardView = new BoardView();
      this.createLocalGame(new LocalPlayerModel({
        playerId: 1,
        boardView: this.boardView
      }), new LocalPlayerModel({
        playerId: 2,
        boardView: this.boardView
      }));
    },

    startVsComputerGame: function() {
      console.log('///////////////////////// NEW HUMAN VS CPU GAME ////////////////////');
      this.boardModel = new BoardModel();
      this.boardView = new BoardView();
      this.createLocalGame(new LocalPlayerModel({
        playerId: 1,
        boardView: this.boardView
      }), new CPUPlayerModel({
        playerId: 2,
        boardModel: this.boardModel
      }));
    },

    backToMain: function() {
      this.boardModel.off('moveCommitted');
      this.boardModel = null;
      this.gameModel.terminate();
      this.gameModel = null;
      this.boardView.remove();
      this.boardView = null;
    },

    createLocalGame: function(p1, p2) {
      this.boardModel.on('moveCommitted', (function(x) {
        console.log('boardView addPiece', x);
        this.boardView.addPiece(x.colIdx, x.rowIdx, x.playerId);
      }).bind(this));
      this.$('#boardHolder').append(this.boardView.$el);
      this.boardView.render();
      this.gameModel = new LocalGameModel({
        p1: p1,
        p2: p2,
        board: this.boardModel
      });
      this.gameModel.startGameLoop();
    }

  };
})());
