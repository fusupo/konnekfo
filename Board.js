"use strict";

var Board = function(data) {

  // 1. Init the board
  this.cols = data && data.cols || [2, 2, 2, 2, 2, 2, 2];
  this.rows = data && data.rows || [0, 0, 0, 0, 0, 0];
  this.diag1 = data && data.diag1 || [0, 0, 0, 0, 0, 0]; // bottom right to top left
  this.diag2 = data && data.diag2 || [0, 0, 0, 0, 0, 0]; // top right to bottom left
  this.winner = null;

  this.move = function(col, playerID) {
    var idx = ((this.cols[col] << 28) >>> 28); //this operation removes all digits except those that represent the insertion index
    var currCols = (this.cols[col] >> 4) << 4; //this operation removes all digits except those that represent rows on the gameboard
    ////////// Notes on bitwise opperators
    //  a >> b  Shifts a in binary representation b (< 32) bits to the right, discarding bits shifted off.
    //  a >>> b Shifts a in binary representation b (< 32) bits to the right, discarding bits shifted off, and shifting in zeroes from the left.
    // for future reference on bitwise operators https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
    var mv = playerID << (idx * 2);
    this.cols[col] = (idx + 1) + currCols + mv;

    this.rows[idx - 2] += playerID << (col * 2);
    this.diag1[idx - 2] += playerID << ((col * 2) + ((idx - 2) * 2));
    this.diag2[idx - 2] += playerID << ((col * 2) + ((5 - (idx - 2)) * 2));

  };

  this.hasWinner = function() {

    for (var i = 0; i <= 3; i++) {
      var c1 = this.cols[i] >> 4;
      var c2 = this.cols[i + 1] >> 4;
      var c3 = this.cols[i + 2] >> 4;
      var c4 = this.cols[i + 3] >> 4;
      var check = (c1 & c2 & c3 & c4);
      if (check > 0) {
        this.winner = check;
        return ('horizontal win!!');
      }
    }

    for (var j = 0; j <= 2; j++) {
      console.log(this.cols[0] >> 4)
      var r1 = this.rows[j];
      var r2 = this.rows[j + 1];
      var r3 = this.rows[j + 2];
      var r4 = this.rows[j + 3];
      var check = (r1 & r2 & r3 & r4);
      if (check > 0) {
        this.winner = check;
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
        this.winner = check;
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
        this.winner = check;
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

};
