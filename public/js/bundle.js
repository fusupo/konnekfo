(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = function(data) {

  console.log('New Board');
  //  1. Init the board
  this.cols = data && data.cols || [2, 2, 2, 2, 2, 2, 2];
  this.rows = data && data.rows || [0, 0, 0, 0, 0, 0];
  this.diag1 = data && data.diag1 || [0, 0, 0, 0, 0, 0]; // bottom right to top left
  this.diag2 = data && data.diag2 || [0, 0, 0, 0, 0, 0]; // top right to bottom left
  this.winner = null;

  ////////////////////////////////////////  HELPER FNs

  var checkToPlayer = function(c) {
    var str = c.toString(2);
    if (str.length % 2 !== 0) str = '0' + str;
    return parseInt(str.substr(0, 2), 2);
    // while(c > 2){
    //   c = c >> 1;
    // }
    //return c;
  };

  this.getNextRowIdx = function(colIdx) {
    return ((this.cols[colIdx] << 28) >>> 28);
  };

  var removeIdxFromCol = function(col) {
    return (col >> 4) << 4;
  };

  //////////////////////////////////////// END HELPER FNs

  this.move = function(colIdx, playerID) {

    var idx = this.getNextRowIdx(colIdx); //this operation removes all digits except those that represent the insertion index
    var currCols = removeIdxFromCol(this.cols[colIdx]); //this operation removes all digits except those that represent rows on the gameboard

    ////////// Notes on bitwise opperators
    //  a >> b  Shifts a in binary representation b (< 32) bits to the right, discarding bits shifted off.
    //  a >>> b Shifts a in binary representation b (< 32) bits to the right, discarding bits shifted off, and shifting in zeroes from the left.
    // for future reference on bitwise operators https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
    var mv = playerID << (idx * 2);
    this.cols[colIdx] = (idx + 1) + currCols + mv;

    this.rows[idx - 2] += playerID << (colIdx * 2);
    this.diag1[idx - 2] += playerID << ((colIdx * 2) + ((idx - 2) * 2));
    this.diag2[idx - 2] += playerID << ((colIdx * 2) + ((5 - (idx - 2)) * 2));

  };

  this.unmove = function(colIdx, playerID) {
    var idx = this.getNextRowIdx(colIdx); //this operation removes all digits except those that represent the insertion index
    var currCols = removeIdxFromCol(this.cols[colIdx]); //this operation removes all digits except those that represent rows on the gameboard
    var shiftCount = 32 - ((idx - 1) * 2);
    currCols = (currCols << shiftCount) >>> shiftCount;
    idx--;
    this.cols[colIdx] = idx + currCols;
    this.rows[idx - 2] -= playerID << (colIdx * 2);
    this.diag1[idx - 2] -= playerID << ((colIdx * 2) + ((idx - 2) * 2));
    this.diag2[idx - 2] -= playerID << ((colIdx * 2) + ((5 - (idx - 2)) * 2));
  };

  this.isBoardFull = function() {
    var result = true;
    for (var i = 0; i < 7; i++) {
      if (!this.isColFull(i)) {
        result = false;
        break;
      }
    }

    return result;
  };

  this.isColFull = function(colIdx) {
    return this.getNextRowIdx(colIdx) >= 8;
  };

  this.hasWinner = function() {

    for (var i = 0; i <= 3; i++) {
      var c1 = this.cols[i] >> 4;
      var c2 = this.cols[i + 1] >> 4;
      var c3 = this.cols[i + 2] >> 4;
      var c4 = this.cols[i + 3] >> 4;
      var check = (c1 & c2 & c3 & c4);
      if (check > 0) {
        this.winner = checkToPlayer(check);
        return ('h');
      }
    }

    for (var j = 0; j <= 2; j++) {
      // console.log(this.cols[0] >> 4)
      var r1 = this.rows[j];
      var r2 = this.rows[j + 1];
      var r3 = this.rows[j + 2];
      var r4 = this.rows[j + 3];
      var check = (r1 & r2 & r3 & r4);
      if (check > 0) {
        this.winner = checkToPlayer(check);
        return ('v');
      }
    }

    for (var k = 0; k <= 2; k++) {
      var d1 = this.diag1[k];
      var d2 = this.diag1[k + 1];
      var d3 = this.diag1[k + 2];
      var d4 = this.diag1[k + 3];
      var check = (d1 & d2 & d3 & d4);
      if (check > 0) {
        this.winner = checkToPlayer(check);
        return ('d1');
      }
    }

    for (var m = 0; m <= 2; m++) {
      var d1 = this.diag2[m];
      var d2 = this.diag2[m + 1];
      var d3 = this.diag2[m + 2];
      var d4 = this.diag2[m + 3];
      var check = (d1 & d2 & d3 & d4);
      if (check > 0) {
        this.winner = checkToPlayer(check);
        return ('d2');
      }
    }

    return false;
  };

  this.cloneCells = function() {
    return {
      cols: R.clone(this.cols),
      rows: R.clone(this.rows),
      diag1: R.clone(this.diag1),
      diag2: R.clone(this.diag2)
    };
  };

  this.logTable = function() {
    console.table(R.reverse(this.rows.map(function(i) {
      var binStr = i.toString(2);
      binStr = binStr.length % 2 === 0 ? binStr : "0" + binStr;
      return R.reverse(R.splitEvery(2, binStr));
    })));
  };

};
},{}],2:[function(require,module,exports){
"use strict"

module.exports = {
  p1Color: "#DE6B48",
  p2Color: "#F6AE2D",
  boardColor: "#33658A",
  bgColor: "#FFFFFF"
}
},{}],3:[function(require,module,exports){
"use strict";

var Board = require("./Board.js");

module.exports = function(p1, p2) {

  console.log('GAME INIT');

  this.board = new Board();
  var firstToPlay = this.currPlayer = p1;

  this.commitMove = function(colIdx) {
    if (!this.board.isColFull(colIdx)) {
      if (this.currPlayer === p1) {
        this.board.move(colIdx, p1.id);
        this.currPlayer = p2;
      } else {
        this.board.move(colIdx, p2.id);
        this.currPlayer = p1;
      }

      if (this.moveCommitted !== undefined) {
        this.moveCommitted(colIdx);
      }

      var winningDirection = this.board.hasWinner();
      if (!winningDirection) {
        this.currPlayer.promptMove(this);
      }
      return true;
    } else {
      this.currPlayer.promptMove(this);
      return false;
    }
  };

  this.currPlayer.promptMove(this);

  this.reset = function() {
    console.log('reset the fuggin game!!');
    this.board = new Board();
    // switch who starts every other game...(now I'm gonna have to keep a tally of games won overall #eyeROll)
    firstToPlay = this.currPlayer = firstToPlay === p1 ? p2 : p1;
    this.currPlayer.promptMove(this);
  };

};
},{"./Board.js":1}],4:[function(require,module,exports){
"use strict";

var Game = require('./Game.js');
var Players = require('./Player.js');
var View = require('./View.js');
var sockConst = require('./SocketConstants.js');
var Colors = require('./Colors.js');
var Clipboard = require('clipboard');

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
        };
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

  $vsComputer.click(function() {
    console.log("adsadsa");
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
          }
        });
      showWhosTurn(game.currPlayer.id);
    };
  });

  new Clipboard('#copy-button');
};
},{"./Colors.js":2,"./Game.js":3,"./Player.js":5,"./SocketConstants.js":6,"./View.js":7,"clipboard":9}],5:[function(require,module,exports){
"use strict";

module.exports.Player = function(id, view) {
  this.id = id;
  this.promptMove = function(game) {
    console.log('its player #' + id + '\'s turn!!');
    view.onColSelect = function(idx) {
      console.log('woot!');
      view.onColSelect = null;
      game.commitMove(idx);
    };
  };
};

module.exports.RandomPlayer = function(id) {
  this.id = id;
  this.promptMove = function(game) {
    game.commitMove(Math.floor(Math.random() * 7));
  };
};

module.exports.RemotePlayer = function(id, socket) {
  console.log('NEW REMOTE PLAYER');
  this.id = id;
  this.socket = socket;
  this.promptMove = function(game) {
    socket.emit('your turn');
    console.log('its your turn, player ' + this.id);
  };
};

module.exports.CPUPlayerClI = function(id) {

  this.id = id;

  this.promptMove = function(game) {
    var startDate = new Date();
    var move = figureOutThePlan.bind(this)(game.board);
    var endDate = new Date();
    var diff = Math.abs(endDate - startDate);
    console.log('THINKING DURATION: ', diff);
    setTimeout(function() {
      game.commitMove(move);
    }, 1000);
  };

  var winBlock = function(board, id) {
    var returnMove = false;
    for (var i = 0; i < 7; i++) {
      if (!board.isColFull(i)) {
        board.move(i, id);
        if (board.hasWinner()) {
          returnMove = i;
        }
        board.unmove(i, id);
      }
    }
    return returnMove;
  };

  var offense = function(board, thisID, r) {
    var tally = [0, 0, 0];

    // base cases
    if (board.hasWinner()) {
      // win
      tally[board.winner] ++;
      return tally;
    } else if (board.isBoardFull()) {
      // draw - all cells are filled and
      tally[0] ++;
      return tally;
    }

    if (r >= 6) {
      return tally;
    }

    // plan for best offensive move //////////////////////////////////
    // start with current board

    // figure out which move (ie which column) will give us the highest possiblity of winning by calculating all games states with a recursive fxn
    // recursive fxn (input includes: current player)
    // initialize our tally ([w,l,d]) note: tally is stats for computer
    // make each of the hypothetical moves for the current player (ie chose a column, go from left to right)

    for (var k = 0; k < 7; k++) {

      if (!board.isColFull(k)) {
        board.move(k, thisID);
        var tempTally = offense(board, thisID ^ 3, r + 1);
        tally[0] += tempTally[0];
        tally[1] += tempTally[1];
        tally[2] += tempTally[2];

        board.unmove(k, thisID);
      }
    }
    // is the game over?
    // if so return win/lose/draw (base case) [1,0,0]
    // if not then recurse() and fold results into tally
    // return tally
    return tally;

  };

  var figureOutThePlan = function(board) {

    var returnMove = Math.floor(Math.random() * 7);

    while (board.isColFull(returnMove) && returnMove < 7) {
      returnMove++;
    }

    // if I can wan win in the next move, win
    // if my opp win in the next move (ie does my opp have 3 in a row/col/diag, etc),
    // if yes, can I stop opp from winning on their next move?
    // if yes, block
    // else, in checkmate. opp will win. this move doesn't matter
    if (winBlock(board, this.id) !== false) {
      returnMove = winBlock(board, this.id);
    } else if (winBlock(board, this.id ^ 3) !== false) {
      returnMove = winBlock(board, this.id ^ 3); // 0b11);
    } else {
      // else play best offensive move
      var columnStats = [];
      for (var i = 0; i < 7; i++) {
        if (!board.isColFull(i)) {
          board.move(i, id);
          columnStats[i] = offense(board, id ^ 3, 0); // 0b11, 0);
          board.unmove(i, id);
        }
      }

      console.table(columnStats);
      console.log(columnStats);

      var thisStats = R.map(function(item) {
        var result = item !== undefined ? item[id] : 0;
        return result;
      }, columnStats);

      console.log(thisStats);

      var max = 0;
      for (var i = 0; i < thisStats.length; i++) {
        if (thisStats[i] > max) {
          max = thisStats[i];
          returnMove = i;
        }
      }
    }

    console.log('returnMove', returnMove);
    return returnMove;
  };
};

// module.exports.CPUPlayerMkI = function(id) {
//   this.id = id;

//   var figureOutThePlan = function(board) {

//     var result;
//     var recur = function(node) {
//       var xo = arguments[1] || id;
//       var i = 0;
//       while (i < 7 && result === undefined) {

//         var b = new Board(node.value.cloneCells());
//         var n = new Tree(b);
//         var moveResult = b.move(i, id);
//         var hasWin = b.hasWinner();

//         if (!hasWin && moveResult) {
//           //console.log(arguments);
//           //node.addChild(recur.bind(this)(n, xo)); //xo === "x" ? "o" : "x"));
//           var j = 0;
//           while (j < 7 && result === undefined) {

//             var b2 = new Board(n.value.cloneCells());
//             var n2 = new Tree(b2);
//             var moveResult2 = b2.move(i, xo === "x" ? "o" : "x");
//             var hasWin2 = b2.hasWinner();

//             if (!hasWin2 && moveResult2) {
//               n.addChild(recur.bind(this)(n2, xo)); //xo === "x" ? "o" : "x"));
//             } else {
//               if (hasWin2) {
//                 result = b2;
//               }

//               n.addChild(n2);
//             }

//             j++;
//           }

//           node.addChild(n);
//         } else {
//           if (hasWin) {
//             result = b;
//           }

//           node.addChild(n);
//         }

//         i++;
//       }

//       return node;
//     };

//     var n = new Tree(board);
//     var tree = recur.bind(this)(n);

//     //console.log(tree);
//     // console.log(tree.DFTraverse(function(value) {
//     //   return value === result;
//     // }));
//     tree.DFTraverse(function(value) {
//       return value === result;
//     });

//     return tree.DFTraverse(function(value) {
//       return value === result;
//     })[0];

//   };

//   this.promptMove = function(game) {
//     var move = figureOutThePlan.bind(this)(game.board);
//     game.commitMove(move);
//   };

// };
},{}],6:[function(require,module,exports){
"use strict";

module.exports = {
  ATTEMPT_COMMIT_MOVE: "attempt commit move",
  DICTATE_PLAYER_ID: "dictate player id"
};

},{}],7:[function(require,module,exports){
"use strict";

var colors = require('./Colors.js');

module.exports = function() {

  var bgColor = colors.bgColor;
  var boardColor = colors.boardColor;
  var p1Color = colors.p1Color;
  var p2Color = colors.p2Color;
  var gameboardSVG = document.getElementById('gameboard');
  var boardWidth = gameboardSVG.clientWidth;
  var boardHeight = gameboardSVG.clientHeight - gameboardSVG.clientHeight / 7;
  var cellWidth = boardWidth / 7;
  var cellHeight = boardHeight / 6;
  var topMargin = cellHeight;

  this.onColSelect = null;
  this.drawCircles = function(s, color) {
    for (var y = 0; y < 6; y++) {
      var row = [];
      for (var x = 0; x < 7; x++) {
        var c = s.circle((cellWidth / 2) + (x * cellWidth), (cellHeight / 2 + topMargin) + (y * cellHeight), .3 * cellWidth);
        c.attr({
          fill: color,
          opacity: 0.2
        });
        row.push(c);
      }

      this.circles.push(row);
    }
  };

  this.drawButtons = function(s, color) {
    for (var x = 0; x < 7; x++) {
      var b = s.rect(cellWidth * x, 0, cellWidth, cellHeight * 7);
      b.attr({
        fill: color,
        opacity: 0
      });

      var click = (function(foo) {
        return function() {
          if (this.onColSelect !== null) {
            this.onColSelect(foo);
          }
        };
      })(x);

      var over = (function(foo) {
        return function() {
          foo.attr({
            fill: '#ccc',
            opacity: 0.5
          });
        };
      })(b);

      var out = (function(foo) {
        return function() {
          foo.attr({
            fill: bgColor,
            opacity: 0
          });
        };
      })(b);

      b.mouseover(over.bind(this));
      b.mouseout(out.bind(this));
      b.click(click.bind(this));
    };
  };

  var s;

  this.drawBoard = function() {
    s = Snap(gameboardSVG);
    var bg = s.rect(0, 0, boardWidth, boardHeight + topMargin);
    bg.attr({
      fill: bgColor
    });

    this.circles = s.g();

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

    var bg2 = s.path(pathDef).attr({
      fill: boardColor
    });

    //this.drawCircles(s, bgColor);
    this.drawButtons(s, bgColor);
  };

  this.addPiece = function(colIdx, rowIdx, playerID, cbk) {
    var c = s.circle((cellWidth / 2) + (colIdx * cellWidth), 0, 0.4 * cellWidth);
    c.attr({
      fill: playerID === 1 ? p1Color : p2Color,
      opacity: 1
    });
    this.circles.add(c);
    c.animate({
      cy: (cellHeight / 2 + topMargin) + (rowIdx * cellHeight)
    }, 500, mina.bounce, cbk);
  };
};
},{"./Colors.js":2}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _select = require('select');

var _select2 = _interopRequireDefault(_select);

/**
 * Inner class which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 */

var ClipboardAction = (function () {
    /**
     * @param {Object} options
     */

    function ClipboardAction(options) {
        _classCallCheck(this, ClipboardAction);

        this.resolveOptions(options);
        this.initSelection();
    }

    /**
     * Defines base properties passed from constructor.
     * @param {Object} options
     */

    ClipboardAction.prototype.resolveOptions = function resolveOptions() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.action = options.action;
        this.emitter = options.emitter;
        this.target = options.target;
        this.text = options.text;
        this.trigger = options.trigger;

        this.selectedText = '';
    };

    /**
     * Decides which selection strategy is going to be applied based
     * on the existence of `text` and `target` properties.
     */

    ClipboardAction.prototype.initSelection = function initSelection() {
        if (this.text && this.target) {
            throw new Error('Multiple attributes declared, use either "target" or "text"');
        } else if (this.text) {
            this.selectFake();
        } else if (this.target) {
            this.selectTarget();
        } else {
            throw new Error('Missing required attributes, use either "target" or "text"');
        }
    };

    /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     */

    ClipboardAction.prototype.selectFake = function selectFake() {
        var _this = this;

        this.removeFake();

        this.fakeHandler = document.body.addEventListener('click', function () {
            return _this.removeFake();
        });

        this.fakeElem = document.createElement('textarea');
        this.fakeElem.style.position = 'absolute';
        this.fakeElem.style.left = '-9999px';
        this.fakeElem.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
        this.fakeElem.setAttribute('readonly', '');
        this.fakeElem.value = this.text;

        document.body.appendChild(this.fakeElem);

        this.selectedText = _select2['default'](this.fakeElem);
        this.copyText();
    };

    /**
     * Only removes the fake element after another click event, that way
     * a user can hit `Ctrl+C` to copy because selection still exists.
     */

    ClipboardAction.prototype.removeFake = function removeFake() {
        if (this.fakeHandler) {
            document.body.removeEventListener('click');
            this.fakeHandler = null;
        }

        if (this.fakeElem) {
            document.body.removeChild(this.fakeElem);
            this.fakeElem = null;
        }
    };

    /**
     * Selects the content from element passed on `target` property.
     */

    ClipboardAction.prototype.selectTarget = function selectTarget() {
        this.selectedText = _select2['default'](this.target);
        this.copyText();
    };

    /**
     * Executes the copy operation based on the current selection.
     */

    ClipboardAction.prototype.copyText = function copyText() {
        var succeeded = undefined;

        try {
            succeeded = document.execCommand(this.action);
        } catch (err) {
            succeeded = false;
        }

        this.handleResult(succeeded);
    };

    /**
     * Fires an event based on the copy operation result.
     * @param {Boolean} succeeded
     */

    ClipboardAction.prototype.handleResult = function handleResult(succeeded) {
        if (succeeded) {
            this.emitter.emit('success', {
                action: this.action,
                text: this.selectedText,
                trigger: this.trigger,
                clearSelection: this.clearSelection.bind(this)
            });
        } else {
            this.emitter.emit('error', {
                action: this.action,
                trigger: this.trigger,
                clearSelection: this.clearSelection.bind(this)
            });
        }
    };

    /**
     * Removes current selection and focus from `target` element.
     */

    ClipboardAction.prototype.clearSelection = function clearSelection() {
        if (this.target) {
            this.target.blur();
        }

        window.getSelection().removeAllRanges();
    };

    /**
     * Sets the `action` to be performed which can be either 'copy' or 'cut'.
     * @param {String} action
     */

    /**
     * Destroy lifecycle.
     */

    ClipboardAction.prototype.destroy = function destroy() {
        this.removeFake();
    };

    _createClass(ClipboardAction, [{
        key: 'action',
        set: function set() {
            var action = arguments.length <= 0 || arguments[0] === undefined ? 'copy' : arguments[0];

            this._action = action;

            if (this._action !== 'copy' && this._action !== 'cut') {
                throw new Error('Invalid "action" value, use either "copy" or "cut"');
            }
        },

        /**
         * Gets the `action` property.
         * @return {String}
         */
        get: function get() {
            return this._action;
        }

        /**
         * Sets the `target` property using an element
         * that will be have its content copied.
         * @param {Element} target
         */
    }, {
        key: 'target',
        set: function set(target) {
            if (target !== undefined) {
                if (target && typeof target === 'object' && target.nodeType === 1) {
                    this._target = target;
                } else {
                    throw new Error('Invalid "target" value, use a valid Element');
                }
            }
        },

        /**
         * Gets the `target` property.
         * @return {String|HTMLElement}
         */
        get: function get() {
            return this._target;
        }
    }]);

    return ClipboardAction;
})();

exports['default'] = ClipboardAction;
module.exports = exports['default'];
},{"select":15}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _clipboardAction = require('./clipboard-action');

var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _goodListener = require('good-listener');

var _goodListener2 = _interopRequireDefault(_goodListener);

/**
 * Base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `ClipboardAction` on each click.
 */

var Clipboard = (function (_Emitter) {
    _inherits(Clipboard, _Emitter);

    /**
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     * @param {Object} options
     */

    function Clipboard(trigger, options) {
        _classCallCheck(this, Clipboard);

        _Emitter.call(this);

        this.resolveOptions(options);
        this.listenClick(trigger);
    }

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */

    /**
     * Defines if attributes would be resolved using internal setter functions
     * or custom functions that were passed in the constructor.
     * @param {Object} options
     */

    Clipboard.prototype.resolveOptions = function resolveOptions() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
        this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
        this.text = typeof options.text === 'function' ? options.text : this.defaultText;
    };

    /**
     * Adds a click event listener to the passed trigger.
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     */

    Clipboard.prototype.listenClick = function listenClick(trigger) {
        var _this = this;

        this.listener = _goodListener2['default'](trigger, 'click', function (e) {
            return _this.onClick(e);
        });
    };

    /**
     * Defines a new `ClipboardAction` on each click event.
     * @param {Event} e
     */

    Clipboard.prototype.onClick = function onClick(e) {
        var trigger = e.delegateTarget || e.currentTarget;

        if (this.clipboardAction) {
            this.clipboardAction = null;
        }

        this.clipboardAction = new _clipboardAction2['default']({
            action: this.action(trigger),
            target: this.target(trigger),
            text: this.text(trigger),
            trigger: trigger,
            emitter: this
        });
    };

    /**
     * Default `action` lookup function.
     * @param {Element} trigger
     */

    Clipboard.prototype.defaultAction = function defaultAction(trigger) {
        return getAttributeValue('action', trigger);
    };

    /**
     * Default `target` lookup function.
     * @param {Element} trigger
     */

    Clipboard.prototype.defaultTarget = function defaultTarget(trigger) {
        var selector = getAttributeValue('target', trigger);

        if (selector) {
            return document.querySelector(selector);
        }
    };

    /**
     * Default `text` lookup function.
     * @param {Element} trigger
     */

    Clipboard.prototype.defaultText = function defaultText(trigger) {
        return getAttributeValue('text', trigger);
    };

    /**
     * Destroy lifecycle.
     */

    Clipboard.prototype.destroy = function destroy() {
        this.listener.destroy();

        if (this.clipboardAction) {
            this.clipboardAction.destroy();
            this.clipboardAction = null;
        }
    };

    return Clipboard;
})(_tinyEmitter2['default']);

function getAttributeValue(suffix, element) {
    var attribute = 'data-clipboard-' + suffix;

    if (!element.hasAttribute(attribute)) {
        return;
    }

    return element.getAttribute(attribute);
}

exports['default'] = Clipboard;
module.exports = exports['default'];
},{"./clipboard-action":8,"good-listener":13,"tiny-emitter":16}],10:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":14}],11:[function(require,module,exports){
var closest = require('closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function delegate(element, selector, type, callback) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector, true);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"closest":10}],12:[function(require,module,exports){
/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.function = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};

},{}],13:[function(require,module,exports){
var is = require('./is');
var delegate = require('delegate');

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.function(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;

},{"./is":12,"delegate":11}],14:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],15:[function(require,module,exports){
function select(element) {
    var selectedText;

    if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        element.focus();
        element.setSelectionRange(0, element.value.length);

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;

},{}],16:[function(require,module,exports){
function E () {
	// Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
	on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}]},{},[4]);
