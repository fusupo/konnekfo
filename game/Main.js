"use strict";

var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');

window.onload = function() {

  this.game = 'game';
  // this.socket = io();
  // this.socket.on('confirm player', function(id) {
  //   console.log('According to the server, I am player #' + id);
  // });

  $('#connect').hide();
  $('#game').hide();
  $('#conclusion').hide();

  var $vsHumanLocal = $('#vs-human-local');
  var $vsHumanNetwork = $('#vs-human-network');
  var $vsComputer = $('#vs-computer');
  var $networkNew = $('#network-new');
  var $networkConnect = $('#network-connect');

  $vsHumanLocal.click(function() {
    $('#game').show();
    $('#menu').hide();
    var view = new View();
    var p1 = new Players.Player(1, view);
    var p2 = new Players.Player(2, view);
    view.drawBoard();
    var game = new Game(p1, p2);
    game.moveCommitted = function(colIdx) {
      view.addPiece(colIdx, 6 - (game.board.getNextRowIdx(colIdx) - 2),
                    game.currPlayer.id ^ 3, //0 b11,
                    function() {
                      var winningDirection = game.board.hasWinner();
                      if (winningDirection) {
                        alert(game.board.winner + ' won! ' + winningDirection);
                      }
                    });
    };
  });

  $vsHumanNetwork.click(function() {
    $('#connect').show();
    $('#menu').hide();
  });

  $networkNew.click(function() {
    var sessionId;
    $.get("/session/new", function(data, status) {
      sessionId = data;
      var socket = io(window.location.href + sessionId);
      $('#game').show();
      $('#connect').hide();
      var view = new View();
      view.drawBoard();
      $('#session-id').html(sessionId);

      // window.game.new(function() {
      //   console.log('new game created!');
      // });

    });
  });

  $networkConnect.click(function() {
    var sessionId = prompt('session id');

    //if sessionId is valid
    var socket = io(window.location.href + sessionId);

    $('#game').show();
    $('#connect').hide();
    var view = new View();
    view.drawBoard();
    $('#session-id').html(sessionId);

    //   window.game.connect('some connection id', function() {
    //     console.log('connected');
    //   });
  });

  // $('#connect form').submit(function(event) {
  //   alert("Handler for .submit() called.");
  //   console.log();
  //   event.preventDefault();
  // });

  $vsComputer.click(function() {
    $('#game').show();
    $('#menu').hide();
    var view = new View();
    var p1 = new Players.Player(1, view);
    var p2 = new Players.CPUPlayerClI(2);
    view.drawBoard();
    window.game = new Game(p1, p2); //new LocalGame(new Player(1), new CPUPlayerClI(2));
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
};
