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
      if (d.playerId !== playerId) {
        $('#check-reset-them').attr('checked', true);
      }
    });

    socket.on('reset', function(d) {
      console.log('reset fool!');
      view.drawBoard();
      $('#check-reset-you').attr({
        'checked': false,
        'disabled': false
      });
      $('#check-reset-them').attr('checked', false);
      $('#conclusion').hide();
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
};
},{"./Colors.js":2,"./Game.js":3,"./Player.js":5,"./SocketConstants.js":6,"./View.js":7}],5:[function(require,module,exports){
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
},{"./Colors.js":2}]},{},[4]);
