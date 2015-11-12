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
        return ('horizontal win!!');
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
        return ('vertical win!!');
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
        return ('diag1 win!!');
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
        return ('diag2 win!!');
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
