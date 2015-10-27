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

    // console.table(R.reverse(board.cols.map(function(i) {
    //   var binStr = i.toString(2);
    //   binStr = binStr.length % 2 === 0 ? binStr : "0" + binStr;
    //   return R.reverse(R.splitEvery(2, binStr));
    // })));

    for (var col = 0; col < 7; col++) {

      var binStr = (board.cols[col] >> 4).toString(2);
      binStr = binStr.length % 2 === 0 ? binStr : "0" + binStr;
      var binList = R.reverse(R.splitEvery(2, binStr));

      for (var row = 0; row < binList.length; row++) {

        var s = binList[row];
        var c = this.circles[5 - row][col];
        var fillColor = bgColor;

        if (s === '01' || s === '1') {
          fillColor = '#f00';
        } else if (s === '10') {
          fillColor = '#ff0';
        }

        c.attr({
          fill: fillColor
        });
      }
    }
  };
};
