"use strict";

var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');
var sockConst = require('./SocketConstants.js');
var Colors = require('./Colors.js');
var Clipboard = require('clipboard');

var React = require('react');
var ReactDOM = require('react-dom');

var Board = require("./Board.js");
var GameState = require('./GameState.js');
var MenuView = require('../components/MenuView.js');
var GameView = require('../components/GameView.js');
var NetworkPanel = require('../components/NetworkPanelView.js');

window.onload = function() {

  ReactDOM.render(
      <h1>Hello, world!</h1>,
    document.getElementById('example')
  );

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

  var AppView = React.createClass({
    getInitialState: function(){
      return {
        gameState: new GameState(),
        board: null,
        isLocal: undefined,
        sessionId: undefined,
        opponentConnected: false,
        networkPlayerId: null
      };
    },
    handleChange: function(s){
      switch(s){
      case 'vsHumanLocal':
        var p1 = new Players.Player(1, this);
        var p2 = new Players.Player(2, this);
        var game = new Game(p1, p2, this.state.gameState);
        game.moveCommitted = (function(){
          this.forceUpdate();
        }).bind(this);
        var board = game.board;
        var resetGame = (function(){
          game.reset();
          this.setState({
            isLocal: true,
            gameState: this.state.gameState,
            board: board.cols,
            resetGame: resetGame.bind(this)
          });
        }).bind(this);
        this.handleMouseUp = function(colIdx){
          game.commitMove(colIdx);
        };
        resetGame();
        break;
      case 'vsCPULocal':
        var p1 = new Players.Player(1, this);
        var p2 = new Players.CPUPlayerClI(2/*, view*/);
        var game = new Game(p1, p2, this.state.gameState);
        game.moveCommitted = ( function(){
          this.forceUpdate();
        }).bind(this);
        var board = game.board;
        var resetGame = (function(){
          game.reset();
          this.setState({
            isLocal: true,
            gameState: this.state.gameState,
            board: board.cols,
            resetGame: resetGame.bind(this)
          });
        }).bind(this);
        this.handleMouseUp = function(colIdx){
          game.commitMove(colIdx);
        };
        resetGame();
        break;
      case 'return':
        this.state.gameState.reset();
        this.forceUpdate();
        break;
      case 'newNetwork':
        var board = new Board();
        $.get("/session/new", ( function(sessionId, status) {
          this.setState({
            isLocal: false,
            sessionId: sessionId,
            board: board.cols,
            gameState: this.state.gameState
          });
          initSocket(sessionId, this, this.state.gameState, board);
        }).bind(this));
        break;
      case 'connectNetwork':
        var board = new Board();
        var sessionId = prompt('session id');
        //if sessionId is valid
        if (sessionId) {
          this.setState({
            isLocal: false,
            sessionId: sessionId,
            board: board.cols,
            gameState: this.state.gameState
          });
          initSocket(sessionId, this, this.state.gameState, board);
        }
        break;
      default:
        // console.log(s,'FOOBARBAZQUX');
        break;
      }
    },
    handleMouseUp: function(colIdx){
      console.log('MOUSE UP!');
    },
    render: function() {
      console.log('render AppView');
      return (
          <div className="app">
          <MenuView handleChange={this.handleChange}/>
          <NetworkPanel
        networkPlayerId={this.state.networkPlayerId}
        sessionId={this.state.sessionId}
        opponentConnected={this.state.opponentConnected}/>
          <GameView
        isLocal = {this.state.isLocal}
        gameState={this.state.gameState}
        handleMouseUp = {this.handleMouseUp}
        board={this.state.board}
        resetGame={this.state.resetGame}
          />
          </div>
      );
    }
  });

  window.foo = ReactDOM.render(
      <AppView />,
    document.getElementById('example')
  );

};

function initSocket(sessionId, view, gameState, board) {
  var socket = io(window.location.href + sessionId);
  //var playerId;

  socket.on(sockConst.DICTATE_PLAYER_ID, function(d) {
    view.setState({ networkPlayerId: d }); 
  });

  socket.on('your turn', function() {
    gameState.status = ["It's Your Turn.", "p", view.state.networkPlayerId];
    view.forceUpdate();
  });

  socket.on('their turn', function() {
    gameState.status = ["It's Their Turn.", "p", view.state.networkPlayerId^3];
    view.forceUpdate();
  });

  socket.on('board update', function(d) {
    var prevMove = d.prevMove;
    board.move(prevMove.colIdx, prevMove.playerId);
    view.setState({gameState: d});
  });

  socket.on('opt-in-reset', function(d) {
    var playerId = view.state.networkPlayerId;
    console.log(d.playerId, " OPT IN RESET");
    if (d.playerId !== playerId) {
      console.log($('#check-reset-them'));
      $('#check-reset-them').prop('checked', true);
    }
  });

  socket.on('reset', function(d) {
    console.log('reset fool!');
    board.reset();
    view.setState({
      gameState: d,
      board: board.cols
    });
    $('#check-reset-you').attr({
      'checked': false,
      'disabled': false
    });
    $('#check-reset-them').prop('checked', false);
    view.forceUpdate();
  });

  socket.on('opponent-connect', function() {
    view.setState({
      opponentConnected:true
    });
  });

  socket.on('opponent-disconnect', function() {
    view.setState({
      opponentConnected:false
    });
  });

  view.handleMouseUp = function(colIdx) {
    var playerId = view.state.networkPlayerId;
    //console.log('PLAYER ' + playerId + ' COMMIT MOVE ON COL ' + colIdx);
    socket.emit(sockConst.ATTEMPT_COMMIT_MOVE, {
      playerId: playerId,
      colIdx: colIdx
    });
  };

  $('#check-reset-you').change(function(e) {
    var playerId = view.state.networkPlayerId;
    $('#check-reset-you').attr('disabled', true);
    socket.emit('opt-in-reset', {
      playerId: playerId
    });
  });

  // $('#return').click(function() {
  //   $('#menu').show();
  //   $('#connect').hide();
  //   $('#game').hide();
  //   $('#conclusion').hide();
  //   socket.emit('manual-disconnect');
  //   $('#return').click(function() {});
  // });
}
