"use strict";

var Board = function(cols) {

  // 1. Init the board
  this.cols = cols || [2, 2, 2, 2, 2, 2];
  this.winner = null;

  // function MOVE, takes a column and a player as input and puts the 'piece' at the right row in that column or returns error if no space
  this.move = function(col, playerID) {
    var idx = ((this.cols[col] << 28) >>> 28); //shift left 28 discarding piece placement info, zero shift back right to get the index info
    var currCols = (this.cols[col] >> 4) << 4;
    // console.log('currCols ', currCols.toString(2));
    var mvStr = playerID;
    for (var i = 0; i < idx; i++) {
      mvStr += '00';
    }

    //console.log(mvStr, parseInt(mvStr, 2), (idx + 1).toString(2));
    idx++;
    this.cols[col] = idx + currCols + parseInt(mvStr, 2);

      console.log('this.cols ', this.cols[col].toString(2));

    // if (this.cols[col] <= 63) {
    //   // << - shifts the representation on the col left (adding a zero player to top of col)
    //   // playerID is either 1 or 0, possibly changing zero player piece to a one player piece
    //   this.cols[col] = (this.cols[col] << 1) + playerID;
    // } else {
    //   console.log('cant put piece there!!!!');
    //   return false;
    // };
    
  }

  this.hasWinner = function() {
    return false;
  }

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
