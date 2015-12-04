"use strict";

var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');
var sockConst = require('./SocketConstants.js');
var Colors = require('./Colors.js');
var Clipboard = require('clipboard');

var React = require('react');
var ReactDOM = require('react-dom');

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
  
  var MenuView = React.createClass({
    getInitialState: function(){
      return {menuState: "main"};   
    },
    handleVsHumanLocalClick: function(e){
      var s = "return";
      this.setState({menuState: s});
      this.props.handleChange("vsHumanLocal");
    },
    handleVsHumanNetworkClick: function(e){
      var s = "network";
      this.setState({menuState: s});
      this.props.handleChange("vsHumanNetwork");
    },
    handleVsCPULocalClick: function(e){
      var s = "return";
      this.setState({menuState: s});
      this.props.handleChange("vsCPULocal");
    },
    handleNewNetworkGameClick: function(e){
      var s = "return";
      this.setState({menuState: s});
      this.props.handleChange("newNetwork");
    },
    handleConnectNetworkGameClick: function(e){
      var s = "return";
      this.setState({menuState: s});
      this.props.handleChange("connectNetwork");
    },
    handleBackToMainClick: function(e){
      var s = "main";
      this.setState({menuState: s});
      this.props.handleChange(this.state.menuState);
    },
    render: function() {
      console.log('render menu view');
      var r;
      if(this.state.menuState === "main"){
        r = (
            <div>
            <h2>menu **</h2>
            <ul>
            <li>
            <span onClick={this.handleVsHumanLocalClick}>versus human local</span>
            </li>
            <li>
            <span onClick={this.handleVsHumanNetworkClick}>versus human network</span>
            </li>
            <li>
            <span onClick={this.handleVsCPULocalClick}>versus computer</span>
            </li>
            </ul>
            </div>
        );
      }else if(this.state.menuState === "network"){
        r = (
            <div>
            <h2>connect**</h2>
            <span onClick={this.handleBackToMainClick}>return</span>
            <ul>
            <li>
            <span onClick={this.handleNewNetworkGameClick}>start new game as player 1</span>
            </li>
            <li>
            <span onClick={this.handleConnectNetworkGameClick}>connect to a game </span>
            </li>
            </ul>
            </div>
        );
      }else if(this.state.menuState === "return"){
        r = (
            <div>
            <span onClick={this.handleBackToMainClick}>return</span>
            </div>
        );
      }
      return r;
      
    }
  });

  var GameBoardButtons = React.createClass({
    handleMouseEnter:function(e){
      e.currentTarget.style.opacity = 0.9;
    },
    handleMouseLeave:function(e){
      e.currentTarget.style.opacity = 0;
    },
    render:function(){
      console.log('render GameBoardButtons');
      var hitStyle = {
        opacity: 0
      };
      return(<g>
             {[0,1,2,3,4,5,6].map(function(i) {
               return <rect
               key={i}
               data-key={i}
               onMouseEnter={this.handleMouseEnter}
               onMouseLeave={this.handleMouseLeave}
               onMouseUp={this.props.handleMouseUp.bind(null, i)}
               x={i * (this.props.w/7)}
               y="0"
               width={this.props.w/7}
               height={this.props.h}
               fill="#ffffff"
               style={hitStyle}></rect>;
             }, this)}
             </g>);
    }
  });

  var GameBoardPieces = React.createClass({
    render:function(){
      return(<g>
             {this.props.data.map(function(i,idxx){
               console.log(i);
               return i.map(function(j, idxy){
                 return (function (that) {
                   var color;
                   if(j === "00"){
                     return;
                   }else if(j === "01"){
                     color = Colors.p1Color;
                   }else if(j === "10"){
                     color = Colors.p2Color;
                   }
                   return <circle
                   key = {idxx+idxy}
                   cx = {(that.props.cw / 2) + (idxx * that.props.cw)} 
                   cy = {(that.props.h) - (idxy * that.props.ch) - that.props.ch/2} 
                   r = {that.props.r}
                   fill = {color}></circle>;
                 })(this);
               }, this);
             }, this)}
             </g>);
    }
  });

  var GameBoardView = React.createClass({
    componentWillReceiveProps: function(nextProps) {
      console.log("gameBoardView", nextProps);
      // this.setState({
      //   game: nextProps.game,
      //   board: nextProps.board
      // });
    },
    componentWillUpdate(nextProps, nextState){
      console.log('gameBoardView, will update', nextProps, nextState);
    },
    render: function(){
      console.log('render GameBoardView', this.props.board);
      
      var bgColor = Colors.bgColor;
      var boardColor = Colors.boardColor;
      var p1Color = Colors.p1Color;
      var p2Color = Colors.p2Color;
      var w = 140;
      var h = 120;
      var boardWidth = w;
      var boardHeight = h - h / 7;
      var cellWidth = boardWidth / 7;
      var cellHeight = boardHeight / 6;
      var r = .35 * cellWidth;
      var topMargin = cellHeight;
      var pathDef = "M0," + topMargin + "H" + boardWidth + "V" + (topMargin + boardHeight) + "H0V" + topMargin;
      for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 7; x++) {
          var cx = (cellWidth / 2) + (x * cellWidth);
          var cy = (cellHeight / 2 + topMargin) + (y * cellHeight);
          pathDef += "M" + (cx - r) + "," + cy;
          pathDef += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
          pathDef += "a" + r + "," + r + " 0 1,0 " + (r * -2) + ",0";
        }
      }
      var pieces = [["00"],["00"],["00"],["00"],["00"],["00"],["00"]];
      if(this.props.board){
        for(var i = 0; i < this.props.board.length; i++) {
          var col = this.props.board[i] >> 4;
          col = col.toString(2);
          if(col.length % 2){
            col = 0 + col;
          }
          col = R.splitEvery(2, col).reverse();
          pieces[i]=col;
        }
      }
      return(
          <div className="gameboardHolder">
          <svg width={w} height={h}>
          <defs></defs>
          <rect x="0" y="0" width={w} height={h} fill="#ffffff"></rect>
          <g></g>
          <path d={pathDef} fill="#33658a"></path>
          <GameBoardButtons w={w} h={h} handleMouseUp={this.props.handleMouseUp}/> 
          <GameBoardPieces w={w} h={h} cw={cellWidth} ch={cellHeight} r={r} data={pieces}/>
          </svg>
          </div>
      );
    } 
  });

  var GameScoreBoard = React.createClass({
    render: function(){
      var tablePaddingStyle={
        padding: "0px 10px 0px 10px"
      };
      var resetNetworkStyle={
        borderCollapse: "collapse"
      };
      var gameStatusStr = this.props.status[0];
      var gameStatusStyle;
      switch(this.props.status[1]){
      case "p":
        gameStatusStyle = {
          color: this.props.status[2] === 1 ? Colors.p1Color : Colors.p2Color 
        };
        break;
      case "!":
        gameStatusStyle = {
          color: this.props.status[2] === 1 ? Colors.p1Color : Colors.p2Color 
        };
        break;
      case "x":
        break;
      }
      return (
          <div>
          <div id="gameStatus" style={gameStatusStyle}>{gameStatusStr}</div>
          <table id="game-win-tally" style={resetNetworkStyle}>
          <thead>
          <tr>
          <th style={tablePaddingStyle}>p1</th>
          <th style={tablePaddingStyle}>p2</th>
          <th style={tablePaddingStyle}>draws</th>
          </tr>
          </thead>
          <tbody>
          <tr>
          <td style={tablePaddingStyle}>
          <div id="p1">{this.props.tally[1]}</div>
          </td>
          <td style={tablePaddingStyle}>
          <div id="p2">{this.props.tally[2]}</div>
          </td>
          <td style={tablePaddingStyle}>
          <div id="draws">{this.props.tally[0]}</div>
          </td>
          </tr>
          </tbody>
          </table>
          </div>
      );
    }
  });

  var GameView = React.createClass({
    handleMouseUp: function(colIdx){
      console.log(colIdx);
      this.props.game.commitMove(colIdx);
      this.forceUpdate();
    },
    render: function(){
      var style = {
        display: this.props.game ? "block" : "none"
      };
      var indicatorStyle={
        display: "inline-block",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        backgroundColor: "#ff0000"
      };
      var status=this.props.gameState ? this.props.gameState.status : [undefined, undefined, undefined]; 
      return (
          <div id="game" style={style}>
          <h2>game</h2>
          <GameScoreBoard tally={this.props.gameState ? this.props.gameState.winTally : [0,0,0]} status={status} />
          <ConclusionView isLocal={this.props.isLocal} resetGame={this.props.resetGame} status={status}/>
          <GameBoardView game={this.props.game} board={this.props.board} handleMouseUp={this.handleMouseUp}/>
          </div>
      );
    }
  });

  // <div id="session-id"></div>
// <button id="copy-button" data-clipboard-target="#session-id" title="Click to copy me.">Copy to Clipboard</button>
// <div id="opponent-connection">
// </div>
// <div id="indicator" style={indicatorStyle}></div>
// <span id="text">Opponent Not Connected</span>
  
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
        isLocal: undefined
      };
    },
    handleChange: function(s){
      switch(s){
      case 'vsHumanLocal':
        var p1 = new Players.Player(1/*, view*/);
        var p2 = new Players.Player(2/*, view*/);
        var game = new Game(p1, p2);
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
        break;
      case 'return':
        if(this.state.game){
          // kill any existant game
          this.setState({game: null}); 
        }
        break;
      }
    },
    render: function() {
      console.log('render AppView');
      return (
          <div className="app">
          <MenuView handleChange={this.handleChange}/>
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

/*
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
 };*/
