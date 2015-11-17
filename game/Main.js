"use strict";

var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');
var sockConst = require('./SocketConstants.js');

window.onload = function() {

  this.game = 'game';

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

  function initSocket(sessionId, view) {
    var socket = io(window.location.href + sessionId);
    var playerId;

    socket.on(sockConst.DICTATE_PLAYER_ID, function(d) {
      playerId = d;
      $('#this-player').html(d);
    });

    socket.on('your turn', function() {
      $('#whos-turn').html('it\'s your turn');
    });

    socket.on('their turn', function() {
      $('#whos-turn').html('it\'s their turn');
    });

    socket.on('board update', function(d) {
      console.log(d);
      view.addPiece(d.colIdx, d.rowIdx, d.playerId, function() {
        if (d.hasWin) {
          console.log('player ' + d.playerId + ': ' + d.hasWin);
        };
      });
    });

    view.onColSelect = function(colIdx) {
      console.log('PLAYER ' + playerId + ' COMMIT MOVE ON COL ' + colIdx);
      socket.emit(sockConst.ATTEMPT_COMMIT_MOVE, {
        playerId: playerId,
        colIdx: colIdx
      });
    };
  }

  $networkNew.click(function() {
    var sessionId;
    $.get("/session/new", function(data, status) {
      sessionId = data;
      $('#game').show();
      $('#connect').hide();
      var view = new View();
      view.drawBoard();
      $('#session-id').html(sessionId);
      initSocket(sessionId, view);
    });
  });

  $networkConnect.click(function() {
    var sessionId = prompt('session id');
    //if sessionId is valid
    $('#game').show();
    $('#connect').hide();
    var view = new View();
    view.drawBoard();
    $('#session-id').html(sessionId);
    initSocket(sessionId, view);
  });

  $vsComputer.click(function() {
    $('#game').show();
    $('#menu').hide();
    var view = new View();
    var p1 = new Players.Player(1, view);
    var p2 = new Players.CPUPlayerClI(2);
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
};
