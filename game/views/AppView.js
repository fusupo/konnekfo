(function() {

  "use strict";

  var Backbone = require('backbone');
  var _ = require('underscore');
  var colors = require('../Colors.js');

  var MenuView = require('./MenuView.js');
  var GameResultModel = require('../models/GameResultModel.js');
  var BoardModel = require('../models/BoardModel.js');
  var BoardView = require('./BoardView.js');
  var OutcomePanelView = require('./OutcomePanelView.js');
  var LocalPlayerModel = require('../models/LocalPlayerModel.js');
  var CPUPlayerModel = require('../models/CPUPlayerModel.js');
  var LocalGameModel = require('../models/LocalGameModel.js');
  var NetworkGameModel = require('../models/NetworkGameModel.js');

  module.exports = Backbone.View.extend((function() {
    
    return {

      initialize: function() {
        console.log("new app view");
        var menu = new MenuView({
          el: this.$("#menuHolder")
        });
        menu.on('select:vsHumanLocal', this.startVsHumanLocalGame.bind(this));
        menu.on('select:vsComputer', this.startVsComputerGame.bind(this));
        menu.on('select:vsHumanNetwork', this.createNetworkGame.bind(this));
        menu.on('select:vsHumanNetwork:new', (function(){
          this.gameModel.initNewSession(); 
        }).bind(this));
        menu.on('select:vsHumanNetwork:connect', (function(){
          this.gameModel.connectToSession(); 
        }).bind(this));
        menu.on('select:backToMain', this.backToMain.bind(this));
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
        // this.boardModel.off('moveCommitted');
        // this.boardModel = null;
        // this.gameModel.terminate();
        // this.gameModel = null;
      },

      createLocalGame: function(playerTypes) {
        this.gameResultModel = new GameResultModel();
        this.boardModel = new BoardModel({gameResultModel: this.gameResultModel});
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
        this.gameModel = new LocalGameModel({
          p1: players[0],
          p2: players[1],
          board: this.boardModel,
          view: this.boardView,
          gameResultModel: this.gameResultModel
        });
        this.outcomePanelView = new OutcomePanelView({
          model: this.gameModel
        });
        this.$('#outcomeHolder').append(this.outcomePanelView.$el);
        this.outcomePanelView.on('click:reset', (function() {
          this.gameResultModel.reset();
          this.gameModel.reset();
          this.boardModel.reset();
          this.gameModel.startGame();
        }).bind(this));
        this.gameModel.startGame();
      },

      createNetworkGame: function(){
        this.gameModel = new NetworkGameModel();        
      }
    };
    
  })());

}());
