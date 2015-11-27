"use strict";

var Backbone = require('backbone');

module.exports = Backbone.Model.extend((function() {

  ////////////////////////////////////////  HELPER FNs

  var checkToPlayer = function(c) {
    var str = c.toString(2);
    if (str.length % 2 !== 0) str = '0' + str;
    return parseInt(str.substr(0, 2), 2);
  };

  var getNextRowIdx = function(col) {
    return ((col << 28) >>> 28);
  };

  var removeIdxFromCol = function(col) {
    return (col >> 4) << 4;
  };

  //////////////////////////////////////// END HELPER FNs

  return {

    defaults: function() {
      return {
        cols: [2, 2, 2, 2, 2, 2, 2],
        rows: [0, 0, 0, 0, 0, 0],
        diag1: [0, 0, 0, 0, 0, 0], // bottom right to top left
        diag2: [0, 0, 0, 0, 0, 0],
        winner: null
      };
    },

    initialize: function() {
      console.log("new board model", this);
      console.log(this.attributes);
    },

    move: function(colIdx, playerId, surpressEvents) {
      var cols = this.get("cols");
      var rows = this.get("rows");
      var diag1 = this.get("diag1");
      var diag2 = this.get("diag2");
      var idx = getNextRowIdx(cols[colIdx]);
      var currCols = removeIdxFromCol(cols[colIdx]);
      var mv = playerId << (idx * 2);
      cols[colIdx] = (idx + 1) + currCols + mv;
      rows[idx - 2] += playerId << (colIdx * 2);
      diag1[idx - 2] += playerId << ((colIdx * 2) + ((idx - 2) * 2));
      diag2[idx - 2] += playerId << ((colIdx * 2) + ((5 - (idx - 2)) * 2));
      this.set({
        "cols": cols,
        "rows": rows,
        "diag1": diag1,
        "diag2": diag2
      });
      if (!surpressEvents) {
        this.trigger('moveCommitted', {
          colIdx: colIdx,
          rowIdx: 6 - (idx - 1),
          playerId: playerId
        });
      }
    },

    unmove: function(colIdx, playerId) {
      var cols = this.get("cols");
      var rows = this.get("rows");
      var diag1 = this.get("diag1");
      var diag2 = this.get("diag2");
      var idx = getNextRowIdx(cols[colIdx]);
      var currCols = removeIdxFromCol(cols[colIdx]);
      var shiftCount = 32 - ((idx - 1) * 2);
      currCols = (currCols << shiftCount) >>> shiftCount;
      idx--;
      cols[colIdx] = idx + currCols;
      rows[idx - 2] -= playerId << (colIdx * 2);
      diag1[idx - 2] -= playerId << ((colIdx * 2) + ((idx - 2) * 2));
      diag2[idx - 2] -= playerId << ((colIdx * 2) + ((5 - (idx - 2)) * 2));
      this.set({
        "cols": cols,
        "rows": rows,
        "diag1": diag1,
        "diag2": diag2
      });
    },

    isBoardFullP: function() {
      var result = true;
      for (var i = 0; i < 7; i++) {
        if (!this.isColFullP(i)) {
          result = false;
          break;
        }
      }
      return result;
    },

    isColFullP: function(colIdx) {
      return getNextRowIdx(this.get("cols")[colIdx]) >= 8;
    },

    hasWinnerP: function() {
      var cols = this.get("cols");
      var rows = this.get("rows");
      var diag1 = this.get("diag1");
      var diag2 = this.get("diag2");
      var winner = this.get("winner");
      for (var i = 0; i <= 3; i++) {
        var c1 = cols[i] >> 4;
        var c2 = cols[i + 1] >> 4;
        var c3 = cols[i + 2] >> 4;
        var c4 = cols[i + 3] >> 4;
        var check = (c1 & c2 & c3 & c4);
        if (check > 0) {
          winner = checkToPlayer(check);
          return ('h');
        }
      }
      for (var j = 0; j <= 2; j++) {
        var r1 = rows[j];
        var r2 = rows[j + 1];
        var r3 = rows[j + 2];
        var r4 = rows[j + 3];
        var check = (r1 & r2 & r3 & r4);
        if (check > 0) {
          winner = checkToPlayer(check);
          return ('v');
        }
      }
      for (var k = 0; k <= 2; k++) {
        var d1 = diag1[k];
        var d2 = diag1[k + 1];
        var d3 = diag1[k + 2];
        var d4 = diag1[k + 3];
        var check = (d1 & d2 & d3 & d4);
        if (check > 0) {
          winner = checkToPlayer(check);
          return ('d1');
        }
      }
      for (var m = 0; m <= 2; m++) {
        var d1 = diag2[m];
        var d2 = diag2[m + 1];
        var d3 = diag2[m + 2];
        var d4 = diag2[m + 3];
        var check = (d1 & d2 & d3 & d4);
        if (check > 0) {
          winner = checkToPlayer(check);
          return ('d2');
        }
      }
      return false;
    },

    logTable: function() {
      var rows = this.get("rows");
      console.table(R.reverse(rows.map(function(i) {
        var binStr = i.toString(2);
        binStr = binStr.length % 2 === 0 ? binStr : "0" + binStr;
        return R.reverse(R.splitEvery(2, binStr));
      })));
    }

  };
})());
