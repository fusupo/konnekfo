"use strict";

var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');

window.onload = function() {

  this.game = 'game';
  this.socket = io();
  this.socket.on('confirm player', function(id) {
    console.log('According to the server, I am player #' + id);
  });

  $('#connect').hide();
  $('#game').hide();
  $('#conclusion').hide();

  var $vsHumanLocal = $('#vs-human-local');
  $vsHumanLocal.click(function() {
    $('#game').show();
    $('#menu').hide();
    var view = new View();
    var p1 = new Players.Player(1, view);
    var p2 = new Players.Player(2, view);
    view.drawBoard();
    window.game = new Game(p1, p2);
    window.game.moveCommitted = function(colIdx) {
      view.addPiece(colIdx, 6 - (window.game.board.getNextRowIdx(colIdx) - 2),
        window.game.currPlayer.id ^ 3, //0 b11,
        function() {
          var winningDirection = window.game.board.hasWinner();
          if (winningDirection) {
            alert(window.game.board.winner + ' won! ' + winningDirection);
          }
        });
    };
  });

  // $('#vs-human-network').click(function() {
  //   $('#connect').show();
  //   $('#menu').hide();
  //   window.game = new NetworkGame();
  // });

  // $('#vs-computer').click(function() {
  //   $('#game').show();
  //   $('#menu').hide();
  //   window.game = new LocalGame(new Player(1), new CPUPlayerClI(2));
  // });

  // $('#network-new').click(function() {
  //   $('#game').show();
  //   $('#connect').hide();
  //   window.game.new(function() {
  //     console.log('new game created!');
  //   });
  // });

  // $('#network-connect').click(function() {
  //   $('#game').show();
  //   $('#connect').hide();
  //   window.game.connect('some connection id', function() {
  //     console.log('connected');
  //   });
  // });

};
