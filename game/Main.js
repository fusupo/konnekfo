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
  
  // var CommentList = React.createClass({
  //   render: function() {
  //     return (
  //       <div className="commentList">
  //         Hello, world! I am a CommentList.
  //       </div>
  //     );
  //   }
  // });
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

  var GameBoardView = React.createClass({
    handleMouseUp: function(colIdx){
      console.log(colIdx);
    },
    render: function(){
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
      var topMargin = cellHeight;

      var pathDef = "M0," + topMargin + "H" + boardWidth + "V" + (topMargin + boardHeight) + "H0V" + topMargin;
      for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 7; x++) {
          var cx = (cellWidth / 2) + (x * cellWidth);
          var cy = (cellHeight / 2 + topMargin) + (y * cellHeight);
          var r = .35 * cellWidth;
          pathDef += "M" + (cx - r) + "," + cy;
          pathDef += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
          pathDef += "a" + r + "," + r + " 0 1,0 " + (r * -2) + ",0";
        }
      }
      return(
        <div className="gameboardHolder">
          <svg width={w} height={h}>
            <defs></defs>
            <rect x="0" y="0" width={w} height={h} fill="#ffffff"></rect>
            <g></g>
            <path d={pathDef} fill="#33658a"></path>
            <GameBoardButtons w={w} h={h} handleMouseUp={this.handleMouseUp}/> 
          </svg>
        </div>
      );
    } 
  });

  var GameView = React.createClass({
    render: function(){
      return (
        <div id="game" >
          <div id="return">main menu</div>
          <h2>game</h2>
          
          <div id="session-id"></div>
          <button id="copy-button" data-clipboard-target="#session-id" title="Click to copy me.">Copy to Clipboard</button>
          <div id="opponent-connection">
          </div>
          
          <div id="this-player"></div>
          <div id="whos-turn"></div>
          <GameBoardView />
          <div>{this.props.data.boardState}</div>
        </div>
      );
    }

    // <table id="game-win-tally" style="border-collapse: collapse;">
    //   <tr>
    // <th style="padding: 0px 10px 0px 10px">p1</th>
    // <th style="padding: 0px 10px 0px 10px">p2</th>
    // <th style="padding: 0px 10px 0px 10px">draws</th>
    // </tr>
    // <tr>
    // <td style="padding: 0px 10px 0px 10px">
    //   <div id="p1"></div>
    // </td>
    // <td style="padding: 0px 10px 0px 10px">
    //   <div id="p2"></div>
    // </td>
    // <td style="padding: 0px 10px 0px 10px">
    //   <div id="draws"></div>
    // </td>
    //   </tr>
    // </table>
    
    // <div id="indicator" style="display:inline-block; border-radius:50%; width:20px; height:20px; background-color:#ff0000"></div>
    // <span id="text">Opponent Not Connected</span>

  });

  var ConclusionView = React.createClass({
    render: function(){
      return (
        <div id="conclusion" >
          <h2>conclusion</h2>
          <div id="result"></div>
          <div id="reset-local">RESET!</div>
          
        </div>
      );
    }
    
    //   <table id="reset-network" style="border-collapse: collapse;">
    //     <tr>
    //       <th style="padding: 0px 10px 0px 10px">you</th>
    //       <th style="padding: 0px 10px 0px 10px">them</th>
    //     </tr>
    //     <tr>
    //       <td style="padding: 0px 10px 0px 10px">
    //         <input id="check-reset-you" type="checkbox">
    //       </td>
    //       <td style="padding: 0px 10px 0px 10px">
    //         <input id="check-reset-them" type="checkbox" disabled="true">
    //       </td>
    //     </tr>
    //   </table>

  });

  var AppView = React.createClass({
    // shouldComponentUpdate: function(x,y){
    //   console.log('ghjkghjkhgj',x,y);
    //   return true;
    // },
    handleChange: function(s){
      console.log('HANDLING CHANGE FROM SUBCOMPONENT: ', s); 
    },
    render: function() {
      console.log('appview render');
      return (
        <div className="app">
          <MenuView data={this.props.data.menuState} handleChange={this.handleChange}/>
          <GameView data={this.props.data.gameState}/>
          <ConclusionView />
          <div>{this.props.data.menuState} suckkah</div>
          <div>{this.props.foobar} suckkah</div>
        </div>        
      );
    }
  });

  window.data = {
    menuState: 'MENU_STATE SHITHEAD',
    gameState: {
      boardState: 'GAME_STATE'
    }
  };

  window.foo = ReactDOM.render(
    <AppView data={window.data} foobar="57"/>,
    document.getElementById('example')
  );

  setTimeout(function(){
    console.log('suck my dick');
    window.data = {
      menuState: 'MENU_STATE MUTHER',
      gameState: {
        boardState: 'GAME_STATE MUTHER'
      }
    };
    ReactDOM.render(
      <AppView data={window.data} foobar="999999"/>,
      document.getElementById('example')
    );
  }, 2500);
  console.log(window.foo);

};
