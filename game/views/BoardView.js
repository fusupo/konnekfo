"use strict";

var Backbone = require('backbone');
var Snap = require('snapsvg');
var colors = require('../Colors.js');

module.exports = Backbone.View.extend((function() {

  var bgColor;
  var boardColor;
  var p1Color;
  var p2Color;
  var gameboardSVG; //ocument.getElementById('gameboard');
  var boardWidth;
  var boardHeight;
  var cellWidth;
  var cellHeight;
  var topMargin;
  var s;
  return {
    initialize: function() {
      console.log("new board view");
      this.render();
    },
    render: function() {
      bgColor = colors.bgColor;
      boardColor = colors.boardColor;
      p1Color = colors.p1Color;
      p2Color = colors.p2Color;
      gameboardSVG = this.el; //ocument.getElementById('gameboard');
      boardWidth = gameboardSVG.clientWidth;
      boardHeight = gameboardSVG.clientHeight - gameboardSVG.clientHeight / 7;
      cellWidth = boardWidth / 7;
      cellHeight = boardHeight / 6;
      topMargin = cellHeight;
      s = Snap(this.el);
      console.log(Snap)
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
      this.drawButtons(s, bgColor);
    },
    drawButtons: function(s, color) {
      for (var x = 0; x < 7; x++) {
        var b = s.rect(cellWidth * x, 0, cellWidth, cellHeight * 7);
        b.attr({
          fill: color,
          opacity: 0
        });
        var click = (function(foo) {
          return function(e) {
            this.trigger('suck', foo);
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
        b.mouseup(click.bind(this));
      }
    },
    addPiece: function(colIdx, rowIdx, playerID, cbk) {
      var c = s.circle((cellWidth / 2) + (colIdx * cellWidth), 0, 0.4 * cellWidth);
      c.attr({
        fill: playerID === 1 ? p1Color : p2Color,
        opacity: 1
      });
      this.circles.add(c);
      c.animate({
        cy: (cellHeight / 2 + topMargin) + (rowIdx * cellHeight)
      }, 500, mina.bounce, cbk);
    }
  };
})());
