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
          var UIenabled = game.currPlayer.UIenabled;
          if(UIenabled){
            game. commitMove(colIdx);
          };
        };
        resetGame();
        break;
      case 'vsCPULocal':
        var p1 = new Players.Player(1, this);
        var p2 = new Players.CPUPlayerClI(2/*, view*/);
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
          game.currPlayer.promptMove(game);
        }).bind(this);
        this.handleMouseUp = function(colIdx){
          var UIenabled = game.currPlayer.UIenabled;
          if(UIenabled){
            game. commitMove(colIdx);
          };
        };
        resetGame();
        break;
      case 'returnHome':
        if(this.state.gameState.reset){
          this.state.gameState.reset();
        };
        // if(this.state.resetGame){
        //   this.state.resetGame();
        // }
        if(this.state.isLocal === false){
          this.onReturnHome();  
        }
        var gameState = this.state.gameState;
        gameState.status = [undefined, undefined, undefined];
        this.setState({
          gameState: gameState
        });
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
        console.log('CONNECT NETWORK!!');
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
        break;
      }
    },
    handleMouseUp: function(colIdx){
      console.log('MOUSE UP!');
    },
    onReturnHome: function(){
      console.log('RETURN HOME!');
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
  var socket = io(window.location.href + sessionId,{multiplex:false});
  socket.on(sockConst.DICTATE_PLAYER_ID, function(d) {
    view.setState({ networkPlayerId: d }); 
    console.log('DICTATE_PLAYER_ID', d);
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
  });

  socket.on('opponent-connect', function() {
    view.setState({
      opponentConnected:true
    });
  });

  socket.on('game-start', function(d){
    console.log('//////////////////// GAME START ////////////////////');
    board.reset();
    view.setState({
      gameState: d,
      board: board.cols
    });
  });
   
  socket.on('opponent-disconnect', function() {
    board.reset();
    var gameState = view.state.gameState;
    gameState.status = [undefined, undefined, undefined];
    view.setState({
      board: board.cols,
      gameState: gameState,
      opponentConnected:false
    });
  });

  view.handleMouseUp = function(colIdx) {
    var playerId = view.state.networkPlayerId;
    socket.emit(sockConst.ATTEMPT_COMMIT_MOVE, {
      playerId: playerId,
      colIdx: colIdx
    });
  };

  view.onReturnHome = function(){
    var playerId = view.state.networkPlayerId;
    socket.emit('manual-disconnect', playerId);
    board.reset();
    var gameState = view.state.gameState;
    gameState.status = [undefined, undefined, undefined];
    view.setState({
      sessionId: undefined,
      board: board.cols,
      gameState: gameState,
      opponentConnected:false,
      networkPlayerId: null
    });
  };

  $('#check-reset-you').change(function(e) {
    var playerId = view.state.networkPlayerId;
    $('#check-reset-you').attr('disabled', true);
    socket.emit('opt-in-reset', {
      playerId: playerId
    });
  });
}
