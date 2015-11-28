(function() {

  "use strict";

  var Backbone = require('backbone');
  var _ = require('underscore');
  var colors = require('../Colors.js');

  var MenuView = require('./MenuView.js');
  var BoardModel = require('../models/BoardModel.js');
  var BoardView = require('./BoardView.js');
  var OutcomePanelView = require('./OutcomePanelView.js');
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

        this.outcomePanelView = new OutcomePanelView();
        this.$('#outcomeHolder').append(this.outcomePanelView.$el);
        this.hideOutcomePanelView();
      },

      events: {},

      startVsHumanLocalGame: function() {
        console.log('///////////////////////// NEW HUMAN VS HUMAN GAME ////////////////////');
        this.createLocalGame(['human', 'human']);
      },

      startVsComputerGame: function() {
        console.log('///////////////////////// NEW HUMAN VS CPU GAME ////////////////////');
        this.createLocalGame(['human', 'cpu']);
      },

      backToMain: function() {
        this.boardModel.off('moveCommitted');
        this.boardModel = null;
        this.gameModel.terminate();
        this.gameModel = null;
      },

      createLocalGame: function(playerTypes) {
        this.boardModel = new BoardModel();
        this.boardView = new BoardView({
          model: this.boardModel
        });
        this.$('#boardHolder').append(this.boardView.$el);
        this.boardView.render();
        var players = playerTypes.map(function(pt, i, l) {
          var p;
          switch (pt) {
          case 'human':
            p = new LocalPlayerModel({
              playerId: i + 1,
              boardView: this.boardView
            });
            break;
          case 'cpu':
            p = new CPUPlayerModel({
              playerId: i + 1,
              boardModel: this.boardModel
            });
          }
          return p;
        }, this);
        console.log('PLAYERS',players);
        this.gameModel = new LocalGameModel({
          p1: players[0],
          p2: players[1],
          board: this.boardModel
        });
        this.gameModel.on('gameComplete', this.showOutcomePanelView.bind(this));
        this.outcomePanelView.on('click:reset', (function() {
          console.log('resetGame');
          this.gameModel.reset();
          this.boardModel.reset();
          this.gameModel.startGameLoop();
          this.hideOutcomePanelView();
        }).bind(this));
        this.gameModel.startGameLoop();
      },

      hideOutcomePanelView: function() {
        this.outcomePanelView.$el.hide();
      },

      showOutcomePanelView: function() {
        this.outcomePanelView.$el.show();
        console.log(this.boardModel.hasWinner,
                    this.boardModel.winner,
                    this.boardModel.winDir,
                    this.boardModel.winPos);
        console.log(this.gameModel.get('tally'));
      }
    };
  })());

}());
