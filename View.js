"use strict";

var View = function() {

  var bgColor = "#ffffff";
  var boardWidth = 280 * 1.5;
  var boardHeight = 240 * 1.5;
  var cellWidth = boardWidth / 7;
  var cellHeight = boardHeight / 6;
  var topMargin = cellHeight;

  this.onColSelect = null;
  this.circles = [];

  this.drawCircles = function(s, color) {
    for (var y = 0; y < 6; y++) {
      var row = [];
      for (var x = 0; x < 7; x++) {
        var c = s.circle((cellWidth / 2) + (x * cellWidth), (cellHeight / 2 + topMargin) + (y * cellHeight), .3 * cellWidth);
        c.attr({
          fill: color
        });
        row.push(c);
      }
      this.circles.push(row);
    }
  };

  this.drawButtons = function(s, color) {
    for (var x = 0; x < 7; x++) {
      var b = s.rect(cellWidth * x, 0, cellWidth, cellHeight);
      b.attr({
        fill: color
      });

      var click = function(foo) {
        return function() {
          if (this.onColSelect !== null) {
            this.onColSelect(foo);
          }
        };
      }(x);

      var over = function(foo) {
        return function() {
          foo.attr({
            fill: '#ccc'
          });
        };
      }(b);

      var out = function(foo) {
        return function() {
          foo.attr({
            fill: bgColor
          });
        };
      }(b);

      b.mouseover(over.bind(this));
      b.mouseout(out.bind(this));
      b.click(click.bind(this));
    };
  };

  this.drawBoard = function() {
    var s = Snap(boardWidth, boardHeight + topMargin);
    // console.log(s);
    var bg = s.rect(0, 0, boardWidth, boardHeight + topMargin);
    bg.attr({
      fill: bgColor
    });

    var fg = s.rect(0, topMargin, boardWidth, boardHeight);
    fg.attr({
      fill: "#0000bb"
    });

    this.drawCircles(s, bgColor);
    this.drawButtons(s, bgColor);
  };

  this.update = function(board) {
    console.log(board.cols);
    for (var col = 0; col < 7; col++) {
      //col = 6;
      var binStr = Number(board.cols[col] >> 4).toString(2);
      // console.log(board.cols[col].toString(2));
      for (var row = binStr.length - 1; row >= 0; row -= 2) {
        var s = row-1 >= 0 ? binStr.substr(row-1, 2) : '0' + binStr[0];
        var c = this.circles[Math.floor(row/2)][col];
        var fillColor = bgColor;
        if (s === '01'|| s === '1') {
          fillColor = '#f00';
        } else if (s === '10') {
          fillColor = '#ff0';
        }
        c.attr({
          fill: fillColor
        });
      }
    };
  };
};
