"use strict";

var Backbone = require('backbone');
var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');
var sockConst = require('./SocketConstants.js');
var Colors = require('./Colors.js');
var Clipboard = require('clipboard');

var AppView = require('./views/AppView.js');
var BoardModel = require('./models/BoardModel.js');
var BoardView = require('./views/BoardView.js');

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
    $('#return').click(function() {
      $('#menu').show();
      $('#connect').hide();
      $('#game').hide();
      $('#conclusion').hide();
      $('#return').click(function() {});
    });

    $('#game').show();
    $('#menu').hide();
    var view = new View();
    var p1 = new Players.Player(1, view);
    var p2 = new Players.Player(2, view);
    view.drawBoard();
    var game = new Game(p1, p2);
    showWhosTurn(game.currPlayer.id);
    $('#conclusion #reset-local').click(function(e) {
      console.log('reset click');
      game.reset();
      view.drawBoard();
      $('#conclusion').hide();
      $('#conclusion #reset-local').click(function() {});
      showWhosTurn(game.currPlayer.id);
    });
    game.moveCommitted = function(colIdx) {
      view.addPiece(colIdx, 6 - (game.board.getNextRowIdx(colIdx) - 2),
                    game.currPlayer.id ^ 3, //0 b11,
                    function() {
                      var winningDirection = game.board.hasWinner();
                      if (winningDirection) {
                        $('#conclusion').show();
                        $('#reset-network').hide();
                        $('#conclusion #result').html(game.board.winner + ' won! ' + winningDirection);
                        updateGameTally(game.winTally);
                      } else if (game.board.isBoardFull()) {
                        $('#conclusion').show();
                        $('#reset-network').hide();
                        $('#conclusion #result').html('game is draw');
                        updateGameTally(game.winTally);
                      }
                    });
      showWhosTurn(game.currPlayer.id);
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
      showWhosTurn(playerId, "It's Your Turn!");
    });
    socket.on('their turn', function() {
      showWhosTurn(playerId ^ 3, "It's Their Turn.");
    });
    socket.on('board update', function(d) {
      console.log(d);
      view.addPiece(d.colIdx, d.rowIdx, d.playerId, function() {
        if (d.hasWin) {
          $('#conclusion').show();
          $('#reset-local').hide();
          $('#conclusion #result').html(d.playerId + ' won! ' + d.hasWin);
          updateGameTally(d.winTally);
        } else if (d.isDraw) {
          $('#conclusion').show();
          $('#reset-local').hide();
          $('#conclusion #result').html('game is draw');
          updateGameTally(d.winTally);
        }
      });
    });
    socket.on('opt-in-reset', function(d) {
      console.log(d.playerId, " OPT IN RESET");
      if (d.playerId !== playerId) {
        console.log($('#check-reset-them'));
        $('#check-reset-them').prop('checked', true);
      }
    });
    socket.on('reset', function(d) {
      console.log('reset fool!');
      view.drawBoard();
      $('#check-reset-you').attr({
        'checked': false,
        'disabled': false
      });
      $('#check-reset-them').prop('checked', false);
      $('#conclusion').hide();
    });
    socket.on('opponent-connect', function() {
      $('#opponent-connection #indicator').css('background-color', '#00ff00');
      $('#opponent-connection #text').html('Opponent Connected');
    });
    socket.on('opponent-disconnect', function() {
      $('#opponent-connection #indicator').css('background-color', '#ff0000');
      $('#opponent-connection #text').html('Opponent Disconnected');
    });
    view.onColSelect = function(colIdx) {
      console.log('PLAYER ' + playerId + ' COMMIT MOVE ON COL ' + colIdx);
      socket.emit(sockConst.ATTEMPT_COMMIT_MOVE, {
        playerId: playerId,
        colIdx: colIdx
      });
    };
    $('#check-reset-you').change(function(e) {
      $('#check-reset-you').attr('disabled', true);
      socket.emit('opt-in-reset', {
        playerId: playerId
      });
    });
    $('#return').click(function() {
      $('#menu').show();
      $('#connect').hide();
      $('#game').hide();
      $('#conclusion').hide();
      socket.emit('manual-disconnect');
      $('#return').click(function() {});
    });
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
    if (sessionId) {
      $('#game').show();
      $('#connect').hide();
      var view = new View();
      view.drawBoard();
      $('#session-id').html(sessionId);
      initSocket(sessionId, view);
    }
  });

  function showWhosTurn(playerId, msg) {
    msg = msg || 'it\'s player ' + playerId + '\'s turn';
    $('#whos-turn')
      .html(msg)
      .css('color', Colors['p' + playerId + 'Color']);
  }

  function updateGameTally(tally) {
    $('#game-win-tally #p1').html(tally[0]);
    $('#game-win-tally #p2').html(tally[1]);
    $('#game-win-tally #draws').html(tally[2]);
  }

  $vsComputer.click(function() {
    $('#return').click(function() {
      $('#menu').show();
      $('#connect').hide();
      $('#game').hide();
      $('#conclusion').hide();
      $('#return').click(function() {});
    });
    $('#game').show();
    $('#menu').hide();
    var view = new View();
    var p1 = new Players.Player(1, view);
    var p2 = new Players.CPUPlayerClI(2);
    view.drawBoard();
    var game = new Game(p1, p2);
    showWhosTurn(game.currPlayer.id);
    $('#conclusion #reset-local').click(function(e) {
      console.log('reset click');
      game.reset();
      view.drawBoard();
      $('#conclusion').hide();
      $('#conclusion #reset-local').click(function() {});
      showWhosTurn(game.currPlayer.id);
    });
    game.moveCommitted = function(colIdx) {
      view.addPiece(colIdx, 6 - (game.board.getNextRowIdx(colIdx) - 2),
                    game.currPlayer.id ^ 3, //0 b11,
                    function() {
                      var winningDirection = game.board.hasWinner();
                      if (winningDirection) {
                        $('#conclusion').show();
                        $('#reset-network').hide();
                        $('#conclusion #result').html(game.board.winner + ' won! ' + winningDirection);
                        updateGameTally(game.winTally);
                      } else if (game.board.isBoardFull()) {
                        $('#conclusion').show();
                        $('#reset-network').hide();
                        $('#conclusion #result').html('game is draw');
                        updateGameTally(game.winTally);
                      }
                    });
      showWhosTurn(game.currPlayer.id);
    };
  });

  new Clipboard('#copy-button');

  ////////////////////////////////////////////////////////////////////////////////
  
  window.av = new AppView({
    el: $('#tempAppView')
  });

  //   window.bm = new BoardModel();
  // window.bv = new BoardView({
  //   el: $("#tempBoardView")
  // });

  // var pID = 1;
  // window.bv.on("suck", function(x){
  //   window.bm.move(x, pID);
  //   //window.bm.logTable();
  //   pID = pID ^ 3;
  // });
  // window.bm.on("moveCommitted", function(x){
  //   window.bv.addPiece(x.colIdx, x.rowIdx, x.playerId);
  // });
  //
};
