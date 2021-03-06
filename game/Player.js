"use strict";

module.exports.Player = function(id, view) {
  this.id = id;
  this.UIenabled = false;
  this.disableUI = function() {
    this.UIenabled = false;
  };
  this.promptMove = function(game) {
    this.UIenabled = true;
  };
};

// module.exports.RandomPlayer = function(id) {
//   this.id = id;
//   this.promptMove = function(game) {
//     game.commitMove(Math.floor(Math.random() * 7));
//   };
// };

module.exports.RemotePlayer = function(id, socket) {
  console.log('NEW REMOTE PLAYER');
  this.id = id;
  this.socket = socket;
  this.UIenabled = false;
  this.disableUI = function() {
    this.UIenabled = false;
  };
  this.promptMove = function(game) {
    socket.emit('your turn');
    console.log('its your turn, player ' + this.id);
  };
};

module.exports.CPUPlayerClI = function(id) {
  this.id = id;
  this.UIenabled = false;
  this.disableUI = function() {
    this.UIenabled = false;
  };
  this.promptMove = function(game) {
    console.log('BEGINNING THINKING');
    var startDate = new Date();
    var move = figureOutThePlan.bind(this)(game.board);
    var endDate = new Date();
    var diff = Math.abs(endDate - startDate);
    console.log('THINKING DURATION: ', diff);
    setTimeout(function() {
      game.commitMove(move);
    }, 750);
  };

  var winBlock = function(board, id) {
    var returnMove = false;
    for (var i = 0; i < 7; i++) {
      if (!board.isColFullP(i)) {
        board.move(i, id);
        if (board.hasWinnerP()) {
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
    if (board.hasWinnerP()) {
      // win
      tally[board.winner]++;
      return tally;
    } else if (board.isBoardFullP()) {
      // draw - all cells are filled and
      tally[0]++;
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
      if (!board.isColFullP(k)) {
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
    while (board.isColFullP(returnMove) && returnMove < 7) {
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
        if (!board.isColFullP(i)) {
          board.move(i, id);
          columnStats[i] = offense(board, id ^ 3, 0);
          board.unmove(i, id);
        }
      }
      //console.table(columnStats);
      //console.log(columnStats);
      var thisStats = R.map(function(item) {
        var result = 0;
        if (item !== undefined) {
          result = item[id] - item[id^ 3];
        }
        return result;
      }, columnStats);
      //console.log(thisStats);
      // var max = 0;
      // for (var i = 0; i < thisStats.length; i++) {
      //   if (thisStats[i] > max) {
      //     max = thisStats[i];
      //     returnMove = i;
      //   }
      // }
      var tempArr = [];
      for (var i = 0; i < thisStats.length; i++) {
        tempArr.push({
          idx: i,
          stats: thisStats[i]
        });
      }
      console.log(tempArr);
      var sortByStats = R.sortBy(R.prop('stats'));
      tempArr = sortByStats(tempArr).reverse();
      var maybe = R.reduce(function(acc, val){
        if(acc === -1 && !board.isColFullP(val['idx'])){
          acc = val['idx'];
        }
        return acc;
      }, -1, tempArr);
      console.log('SWASTICA', maybe);
      returnMove = maybe;
    }

    return returnMove;
  };
};
