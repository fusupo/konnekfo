"use strict";

var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');
var sockConst = require('./SocketConstants.js');
var Colors = require('./Colors.js');
var Clipboard = require('clipboard');

var React = require('react');
var ReactDOM = require('react-dom');

var MenuView = require('../components/MenuView.js');
var GameBoardView = require('../components/GameView.js');
var GameScoreBoard = require('../components/GameScoreView.js');

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


  var GameView = React.createClass({
    handleMouseUp: function(colIdx){
      this.props.game.commitMove(colIdx);
    },
    render: function(){
      var UIenabled = false;
      if(this.props.game!==null) {
        UIenabled = this.props.game.currPlayer.UIenabled;
        this.handleMouseUp = this.props.game.currPlayer.UIenabled ? (function(colIdx){this.props.game.commitMove(colIdx);}).bind(this) : function(){};
      };
      var style = {
        display: this.props.game ? "block" : "none"
      };
      var status=this.props.gameState ? this.props.gameState.status : [undefined, undefined, undefined]; 
      return (
          <div id="game" style={style}>
          <h2>game</h2>
          <GameScoreBoard tally={this.props.gameState ? this.props.gameState.winTally : [0,0,0]} status={status} />
          <ConclusionView isLocal={this.props.isLocal} resetGame={this.props.resetGame} status={status}/>
          <GameBoardView board={this.props.board} handleMouseUp={this.handleMouseUp} UIenabled={UIenabled}/>
          </div>
      );
    }
  });

  var NetworkPanel = React.createClass({
    handleMouseUp: function(){
    },
    render: function(){
      var style = {};
      if(!this.props.sessionId){
        style.display = "none";
      }
      var indicatorStyle={
        display: "inline-block",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        backgroundColor: this.props.opponentConnected ? "#00ff00" : "#ff0000"
      };
      var copyBtnStyle={
        display: this.props.networkPlayerId === 1 && !this.props.opponentConnected ? "block" : "none" 
      };
      var connectedStr = this.props.opponentConnected ? "opponent connected" : "opponent not connected";
      return(
          <div style={style}>
          <div>You Are Player #{this.props.networkPlayerId}</div>
          <div id="session-id">{this.props.sessionId}</div>
          <button style={copyBtnStyle} id="copy-button" data-clipboard-target="#session-id" title="Click to copy me." onMouseUp={this.handleMouseUp}>Copy to Clipboard</button>
          <br /><div id="indicator" style={indicatorStyle}></div>
          <span id="text">{connectedStr}</span>
          </div>
      );
    }
  });

  
  var ConclusionView = React.createClass({
    render: function(){
      console.log('render ConclusionView');
      var tablePaddingStyle={
        padding: "0px 10px 0px 10px"
      };
      var resetNetworkStyle={
        borderCollapse: "collapse"
      };
      var resetLocalStyle={
      };
      if(this.props.isLocal!=undefined){
        if(this.props.isLocal){
          resetLocalStyle.display="block";
          resetNetworkStyle.display="none";
        }else{
          resetLocalStyle.display="none";
          resetNetworkStyle.display="block";
        }
      }else{
        resetLocalStyle.display="none";
        resetNetworkStyle.display="none";
      }
      var visibilityStyle = {
        visibility: "hidden"
      };
      switch(this.props.status[1]){
      case "!":
      case "x":
        visibilityStyle.visibility = "visible";
        break;
      case "p":
      default:
        visibilityStyle.visibility = "hidden";
        break;
      }
      return (
          <div id="conclusion" style={visibilityStyle}>
          <div id="reset-local" style={resetLocalStyle} onMouseUp={this.props.resetGame}>[reset]</div>
          <table id="reset-network" style={resetNetworkStyle}>
          <thead>
          <tr>
          <th style={tablePaddingStyle}>you</th>
          <th style={tablePaddingStyle}>them</th>
          </tr>
          </thead>
          <tbody>
          <tr>
          <td style={tablePaddingStyle}>
          <input id="check-reset-you" type="checkbox"></input>
          </td>
          <td style={tablePaddingStyle}>
          <input id="check-reset-them" type="checkbox" disabled="true"></input>
          </td>
          </tr>
          </tbody>
          </table>
          </div>
      );
    }
  });

  var AppView = React.createClass({
    getInitialState: function(){
      return {
        game: null,
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
        var p1 = new Players.Player(1/*, view*/);
        var p2 = new Players.Player(2/*, view*/);
        var game = new Game(p1, p2);
        game.moveCommitted = ( function(){
          this.forceUpdate();
        } ).bind(this);
        var board = game.board;
        var resetGame = function(){
          game.reset();
          this.setState({
            isLocal: true,
            game: game,
            gameState: game.state,
            board: board.cols,
            resetGame: resetGame.bind(this)
          });
        };
        (resetGame.bind(this))();
        break;
      case 'vsCPULocal':
        var p1 = new Players.Player(1/*, view*/);
        var p2 = new Players.CPUPlayerClI(2/*, view*/);
        var game = new Game(p1, p2);
        game.moveCommitted = ( function(){
          this.forceUpdate();
        } ).bind(this);
        var board = game.board;
        var resetGame = function(){
          game.reset();
          this.setState({
            isLocal: true,
            game: game,
            gameState: game.state,
            board: board.cols,
            resetGame: resetGame.bind(this)
          });
        };
        (resetGame.bind(this))();
        break;
      case 'return':
        if(this.state.game){
          // kill any existant game
          this.setState({game: null}); 
        }
        break;
      case 'newNetwork':
        var sessionId;
        $.get("/session/new", ( function(data, status) {
          sessionId = data;
          this.setState({sessionId: sessionId}); 
          initSocket(sessionId, this);//, view);
          //this.forceUpdate();
        } ).bind(this));
        break;
      case 'connectNetwork':
        var sessionId = prompt('session id');
        //if sessionId is valid
        if (sessionId) {
          //$('#game').show();
          //$('#connect').hide();
          //var view = new View();
          //view.drawBoard();
          this.setState({sessionId: sessionId}); 
          initSocket(sessionId, this);//, view);
        }
        break;
      default:
        // console.log(s,'FOOBARBAZQUX');
        break;
      }
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
        game={this.state.game}
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

function initSocket(sessionId, view) {
  var socket = io(window.location.href + sessionId);
  //var playerId;

  socket.on(sockConst.DICTATE_PLAYER_ID, function(d) {
    view.setState({ networkPlayerId: d }); 
  });

  socket.on('your turn', function() {
    //showWhosTurn(playerId, "It's Your Turn!");
    // view.setState({gameState: {status: ['Player 1', 'p', 1] }});
  });

  socket.on('their turn', function() {
    //showWhosTurn(playerId ^ 3, "It's Their Turn.");
    // view.setState({gameState: {status: ['Player 2', 'p', 2] }});
  });

  socket.on('board update', function(d) {
    console.log(d);
    // view.addPiece(d.colIdx, d.rowIdx, d.playerId, function() {
    //   if (d.hasWin) {
    //     $('#conclusion').show();
    //     $('#reset-local').hide();
    //     $('#conclusion #result').html(d.playerId + ' won! ' + d.hasWin);
    //     updateGameTally(d.winTally);
    //   } else if (d.isDraw) {
    //     $('#conclusion').show();
    //     $('#reset-local').hide();
    //     $('#conclusion #result').html('game is draw');
    //     updateGameTally(d.winTally);
    //   }
    // });
  });

  socket.on('opt-in-reset', function(d) {
    // console.log(d.playerId, " OPT IN RESET");
    // if (d.playerId !== playerId) {
    //   console.log($('#check-reset-them'));
    //   $('#check-reset-them').prop('checked', true);
    // }
  });

  socket.on('reset', function(d) {
    console.log('reset fool!');
    //view.drawBoard();
    $('#check-reset-you').attr({
      'checked': false,
      'disabled': false
    });
    $('#check-reset-them').prop('checked', false);
    $('#conclusion').hide();
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

  // view.onColSelect = function(colIdx) {
  //   console.log('PLAYER ' + playerId + ' COMMIT MOVE ON COL ' + colIdx);
  //   socket.emit(sockConst.ATTEMPT_COMMIT_MOVE, {
  //     playerId: playerId,
  //     colIdx: colIdx
  //   });
  // };

  $('#check-reset-you').change(function(e) {
    $('#check-reset-you').attr('disabled', true);
    // socket.emit('opt-in-reset', {
    //   playerId: playerId
    // });
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
/*
 $networkNew.click(function() {
 
 });

 $networkConnect.click(function() {
 
 });
 */
