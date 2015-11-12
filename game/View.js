"use strict";

module.exports = function() {

  var bgColor = "#ffffff";
  var boardColor = "#33658A";
  var p1Color = "#DE6B48";
  var p2Color = "#F6AE2D";
  var gameboardSVG = document.getElementById('gameboard');
  var boardWidth = gameboardSVG.clientWidth;
  var boardHeight = gameboardSVG.clientHeight - gameboardSVG.clientHeight/7;
  var cellWidth = boardWidth / 7;
  var cellHeight = boardHeight / 6;
  var topMargin = cellHeight;

  this.onColSelect = null;
  this.drawCircles = function(s, color) {
    for (var y = 0; y < 6; y++) {
      var row = [];
      for (var x = 0; x < 7; x++) {
        var c = s.circle((cellWidth / 2) + (x * cellWidth), (cellHeight / 2 + topMargin) + (y * cellHeight), .3 * cellWidth);
        c.attr({
          fill: color,
          opacity: 0.2
        });
        row.push(c);
      }

      this.circles.push(row);
    }
  };

  this.drawButtons = function(s, color) {
    for (var x = 0; x < 7; x++) {
      var b = s.rect(cellWidth * x, 0, cellWidth, cellHeight * 7);
      b.attr({
        fill: color,
        opacity: 0
      });

      var click = (function(foo) {
        return function() {
          if (this.onColSelect !== null) {
            this.onColSelect(foo);
          }
        };
      })(x);

      var over = (function(foo) {
        return function() {
          foo.attr({
            fill: '#ccc',
            opacity: 0.5
          });
        };
      })(b);

      var out = (function(foo) {
        return function() {
          foo.attr({
            fill: bgColor,
            opacity: 0
          });
        };
      })(b);

      b.mouseover(over.bind(this));
      b.mouseout(out.bind(this));
      b.click(click.bind(this));
    };
  };

  var s;

  this.drawBoard = function() {
    s = Snap(gameboardSVG);
    var bg = s.rect(0, 0, boardWidth, boardHeight + topMargin);
    bg.attr({
      fill: bgColor
    });

    this.circles = s.g();

    var pathDef = "M0," + topMargin + "H" + boardWidth + "V" + (topMargin + boardHeight) + "H0V" + topMargin;

    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {

        var cx = (cellWidth / 2) + (x * cellWidth);
        var cy = (cellHeight / 2 + topMargin) + (y * cellHeight);
        var r = .35 * cellWidth;

        pathDef += "M" + (cx - r) + "," + cy;
        pathDef += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
        pathDef += "a" + r + "," + r + " 0 1,0 " + (r * -2) + ",0";

      }
    }

    var bg2 = s.path(pathDef).attr({
      fill: boardColor
    });

    //this.drawCircles(s, bgColor);
    this.drawButtons(s, bgColor);
  };

  this.update = function(board) {

    for (var col = 0; col < 7; col++) {

      var binStr = (board.cols[col] >> 4).toString(2);
      binStr = binStr.length % 2 === 0 ? binStr : "0" + binStr;
      var binList = R.reverse(R.splitEvery(2, binStr));

      //for (var row = 0; row < binList.length; row++) {
      // var s = binList[row];
      // var c = this.circles[5 - row][col];
      // var fillColor = bgColor;

      // if (s === '01' || s === '1') {
      //   fillColor = '#f00';
      // } else if (s === '10') {
      //   fillColor = '#ff0';
      // }

      // c.attr({
      //   fill: fillColor
      // });
      //}
    }
  };

  this.addPiece = function(colIdx, rowIdx, playerID, cbk) {
    var c = s.circle((cellWidth / 2) + (colIdx * cellWidth), 0, 0.4 * cellWidth);
    c.attr({
      fill: playerID === 1 ? p1Color : p2Color,
      opacity: 1
    });
    this.circles.add(c);
    c.animate({
      cy: (cellHeight / 2 + topMargin) + (rowIdx * cellHeight)
    }, 500, mina.bounce, cbk);
  };
};
