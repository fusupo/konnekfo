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
        var c = s.circle((cellWidth/2) + (x * cellWidth), (cellHeight/2 + topMargin)+ (y * cellHeight), .3 * cellWidth);
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
    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        var c = this.circles[5 - y][x];
        var fillColor = bgColor;
        if (board.cells[y][x] === 'x') {
          fillColor = '#f00';
        } else if (board.cells[y][x] === 'o') {
          fillColor = '#ff0';
        }
        c.attr({
          fill: fillColor
        });
      }
    }
  };
};
