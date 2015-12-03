"use strict";

module.exports = function(data) {

  console.log('New Board');

  ////////////////////////////////////////  HELPER FNs

  var checkToPlayer = function(c) {
    var str = c.toString(2);
    if (str.length % 2 !== 0) str = '0' + str;
    return parseInt(str.substr(0, 2), 2);
  };

  this.getNextRowIdx = function(colIdx) {
    return ((this.cols[colIdx] << 28) >>> 28);
  };

  var removeIdxFromCol = function(col) {
    return (col >> 4) << 4;
  };

  //////////////////////////////////////// END HELPER FNs

  this.move = function(colIdx, playerID) {
    var idx = this.getNextRowIdx(colIdx); 
    var currCols = removeIdxFromCol(this.cols[colIdx]); 
    var mv = playerID << (idx * 2);
    this.cols[colIdx] = (idx + 1) + currCols + mv;
    this.rows[idx - 2] += playerID << (colIdx * 2);
    this.diag1[idx - 2] += playerID << ((colIdx * 2) + ((idx - 2) * 2));
    this.diag2[idx - 2] += playerID << ((colIdx * 2) + ((5 - (idx - 2)) * 2));
  };

  this.unmove = function(colIdx, playerID) {
    var idx = this.getNextRowIdx(colIdx); 
    var currCols = removeIdxFromCol(this.cols[colIdx]);
    var shiftCount = 32 - ((idx - 1) * 2);
    currCols = (currCols << shiftCount) >>> shiftCount;
    idx--;
    this.cols[colIdx] = idx + currCols;
    this.rows[idx - 2] -= playerID << (colIdx * 2);
    this.diag1[idx - 2] -= playerID << ((colIdx * 2) + ((idx - 2) * 2));
    this.diag2[idx - 2] -= playerID << ((colIdx * 2) + ((5 - (idx - 2)) * 2));
  };

  this.isBoardFullP = function() {
    for (var i = 0; i < 7; i++) {
      if (!this.isColFullP(i)) {
        return false;
        break;
      }
    }
    return true;
  };

  this.isColFullP = function(colIdx) {
    return this.getNextRowIdx(colIdx) >= 8;
  };

  this.hasWinnerP = function() {
    for (var i = 0; i <= 3; i++) {
      var c1 = this.cols[i] >> 4;
      var c2 = this.cols[i + 1] >> 4;
      var c3 = this.cols[i + 2] >> 4;
      var c4 = this.cols[i + 3] >> 4;
      var check = (c1 & c2 & c3 & c4);
      if (check > 0) {
        this.winner = checkToPlayer(check);
        this.winningDirection = 'h';
        return true;
      }
    }
    for (var j = 0; j <= 2; j++) {
      var r1 = this.rows[j];
      var r2 = this.rows[j + 1];
      var r3 = this.rows[j + 2];
      var r4 = this.rows[j + 3];
      var check = (r1 & r2 & r3 & r4);
      if (check > 0) {
        this.winner = checkToPlayer(check);
        this.winningDirection = 'v';
        return true;
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
        this.winningDirection = 'd1';
        return true;
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
        this.winningDirection = 'd2';
        return true;
      }
    }
    return false;
  };

  this.logTable = function() {
    console.table(R.reverse(this.rows.map(function(i) {
      var binStr = i.toString(2);
      binStr = binStr.length % 2 === 0 ? binStr : "0" + binStr;
      return R.reverse(R.splitEvery(2, binStr));
    })));
  };

  this.reset = function(data){
    this.cols = data && data.cols || [2, 2, 2, 2, 2, 2, 2];
    this.rows = data && data.rows || [0, 0, 0, 0, 0, 0];
    this.diag1 = data && data.diag1 || [0, 0, 0, 0, 0, 0]; // bottom right to top left
    this.diag2 = data && data.diag2 || [0, 0, 0, 0, 0, 0]; // top right to bottom left
    this.winner = null;   
    this.winningDirection = null;
  };

  this.reset(data);
  
};
