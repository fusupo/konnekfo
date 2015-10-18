"use strict";

var Board = function(cells) {
  this.cells = cells || [];
  this.winnner = null;

  if (this.cells.length === 0) {
    for (var y = 0; y < 6; y++) {
      var row = [];
      for (var x = 0; x < 7; x++) {
        row.push(null);
      }
      this.cells.push(row);
    }
  }

  this.move = function(col, del) {
    for (var y = 0; y < 6; y++) {
      if (this.cells[y][col] === null) {
        this.cells[y][col] = del;
        return true;
      };
    };

    return false;
  };

  this.hasWinner = function() {
    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        // HORIZONTAL
        if (x <= 3 &&
            this.cells[y][x] !== null &&
            this.cells[y][x] === this.cells[y][x + 1] &&
            this.cells[y][x] === this.cells[y][x + 2] &&
            this.cells[y][x] === this.cells[y][x + 3]) {
          // console.log('HORIZONTAL WIN!!! -', this.cells[y][x]);
          this.winner = this.cells[y][x];
          return true;
        }

        // VERTICAL
        if (y <= 2 &&
            this.cells[y][x] !== null &&
            this.cells[y][x] === this.cells[y + 1][x] &&
            this.cells[y][x] === this.cells[y + 2][x] &&
            this.cells[y][x] === this.cells[y + 3][x]) {
          console.log('VERTICAL WIN!!! -', this.cells[y][x]);
          this.winner = this.cells[y][x];
          return true;
        }

        // DIAGONAL 1
        if (x <= 3 && y <= 2 &&
            this.cells[y][x] !== null &&
            this.cells[y][x] === this.cells[y + 1][x + 1] &&
            this.cells[y][x] === this.cells[y + 2][x + 2] &&
            this.cells[y][x] === this.cells[y + 3][x + 3]) {
          console.log('DIAGONAL 1 WIN!!! -', this.cells[y][x]);
          this.winner = this.cells[y][x];
          return true;
        }

        // DIAGONAL 2
        if (x <= 3 && y >= 3 &&
            this.cells[y][x] !== null &&
            this.cells[y][x] === this.cells[y - 1][x + 1] &&
            this.cells[y][x] === this.cells[y - 2][x + 2] &&
            this.cells[y][x] === this.cells[y - 3][x + 3]) {
          // console.log('DIAGONAL 2 WIN!!! -', this.cells[y][x]);
          this.winner = this.cells[y][x];
          return true;
        }
      }
    }
    return false;
  };

  this.cloneCells = function(){
    return R.clone(this.cells);
  };

};
