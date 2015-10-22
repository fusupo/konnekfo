"use strict";

var Board = function(cols) {

  // 1. Init the board
  this.cols = cols || [2, 2, 2, 2, 2, 2, 2];
  this.winner = null;

  // function MOVE, takes a column and a player as input and puts the 'piece' at the right row in that column or returns error if no space
  this.move = function(col, playerID) {
    var idx = ((this.cols[col] << 28) >>> 28); //this operation removes all digits except those that represent the insertion index
    var currCols = (this.cols[col] >> 4) << 4; //this operation removes all digits except those that represent rows on the gameboard
    ////////// Notes on bitwise opperators
    //  a >> b  Shifts a in binary representation b (< 32) bits to the right, discarding bits shifted off.
    //  a >>> b Shifts a in binary representation b (< 32) bits to the right, discarding bits shifted off, and shifting in zeroes from the left.
    // for future reference on bitwise operators https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
    var mv = playerID << (idx * 2);
    idx++;
    this.cols[col] = idx + currCols + mv;
  };

  this.hasWinner = function() {
    return false;
  };

  // function HASWINNER, calculates if either player has won, returns the direction of any win

  // function CLONE_CELLS, returns a copy of the current state of the board

  // this.cells = cells || [];
  // this.winnner = null;

  // if (this.cells.length === 0) {
  //   for (var y = 0; y < 6; y++) {
  //     var row = [];
  //     for (var x = 0; x < 7; x++) {
  //       row.push(null);
  //     }

  //     this.cells.push(row);
  //   }
  // }

  // this.move = function(col, del) {
  //   for (var y = 0; y < 6; y++) {
  //     if (this.cells[y][col] === null) {
  //       this.cells[y][col] = del;
  //       return true;
  //     };
  //   };

  //   return false;
  // };

  // this.hasWinner = function() {
  //   for (var y = 0; y < 6; y++) {
  //     for (var x = 0; x < 7; x++) {
  //       // HORIZONTAL
  //       if (x <= 3 &&
  //           this.cells[y][x] !== null &&
  //           this.cells[y][x] === this.cells[y][x + 1] &&
  //           this.cells[y][x] === this.cells[y][x + 2] &&
  //           this.cells[y][x] === this.cells[y][x + 3]) {
  //         this.winner = this.cells[y][x];
  //         return 'HORIZONTAL';
  //       }

  //       // VERTICAL
  //       if (y <= 2 &&
  //           this.cells[y][x] !== null &&
  //           this.cells[y][x] === this.cells[y + 1][x] &&
  //           this.cells[y][x] === this.cells[y + 2][x] &&
  //           this.cells[y][x] === this.cells[y + 3][x]) {
  //         this.winner = this.cells[y][x];
  //         return 'VERTICAL';
  //       }

  //       // DIAGONAL 1
  //       if (x <= 3 && y <= 2 &&
  //           this.cells[y][x] !== null &&
  //           this.cells[y][x] === this.cells[y + 1][x + 1] &&
  //           this.cells[y][x] === this.cells[y + 2][x + 2] &&
  //           this.cells[y][x] === this.cells[y + 3][x + 3]) {
  //         this.winner = this.cells[y][x];
  //         return 'DIAGONAL 1';
  //       }

  //       // DIAGONAL 2
  //       if (x <= 3 && y >= 3 &&
  //           this.cells[y][x] !== null &&
  //           this.cells[y][x] === this.cells[y - 1][x + 1] &&
  //           this.cells[y][x] === this.cells[y - 2][x + 2] &&
  //           this.cells[y][x] === this.cells[y - 3][x + 3]) {
  //         this.winner = this.cells[y][x];
  //         return 'DIAGONAL 2';
  //       }
  //     }
  //   }

  //   return false;
  // };

  // this.cloneCells = function() {
  //   return R.clone(this.cells);
  // };

};
