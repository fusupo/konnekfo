"use strict";

var Player = function(id) {
  this.id = id;
  this.promptMove = function(game) {
    game.view.onColSelect = function(idx) {
      game.view.onColSelect = null;
      game.commitMove(idx);
    };
  };
};

var RandomPlayer = function(id) {
  this.id = id;
  this.promptMove = function(game) {
    game.commitMove(Math.floor(Math.random() * 7));
  };
};

var CPUPlayerClI = function(id) {
  this.id = id;
  
  this.promptMove = function(game) {
    var move = figureOutThePlan.bind(this)(game.board);
    game.commitMove(move);
  };



  var winBlock = function(board, id){
    var returnMove = false;
    for (var i = 0; i < 7; i++) {    
      var testBoard = new Board(board.cloneCells());
      testBoard.move(i, id);
      if(testBoard.hasWinner()){
        returnMove = i;
        break;
      }
    }
    return returnMove;
  };

  var offense = function(board, thisID, r){

    var tally = [0,0,0];

    // console.log(r);
    if(r >= 7){
      return tally;
    }

    // base cases
    if (board.hasWinner()){
    // win
    console.log('HAS WINNER !!!!!!!!!!!!!!!!!!!!!!!!!! ');
      tally[board.winner]++;
      return tally;

    } else if(board.isBoardFull()){
    // draw - all cells are filled and
      tally[0]++;
      return tally;        
    }        

    // plan for best offensive move //////////////////////////////////
      // start with current board
      
      // figure out which move (ie which column) will give us the highest possiblity of winning by calculating all games states with a recursive fxn
      // recursive fxn (input includes: current player)
        // initialize our tally ([w,l,d]) note: tally is stats for computer
        // make each of the hypothetical moves for the current player (ie chose a column, go from left to right)
    
    for(var k = 0; k<7; k++){
      
      if(!board.isColFull(k)){
        var testBoard = new Board(board.cloneCells());
        testBoard.move(k, thisID);

        var tempTally = offense(testBoard, thisID^0b11, r + 1);
        tally[0] += tempTally[0];
        tally[1] += tempTally[1];
        tally[2] += tempTally[2];
      }
    }
    // is the game over?
      // if so return win/lose/draw (base case) [1,0,0]
      // if not then recurse() and fold results into tally
    // return tally
    return tally;

  };



  var figureOutThePlan = function(board) {

   
    var returnMove = 0;
    while(board.isColFull(returnMove) && returnMove<7){
      returnMove ++; 
    }

    // if I can wan win in the next move, win    
    console.log('win?', winBlock(board, this.id) );
    console.log('block?', winBlock(board, this.id^0b11) );
    // console.log('offense', offense(board) );

    if (winBlock(board, this.id) !== false){
      returnMove = winBlock(board, this.id);
    }

    // if my opp win in the next move (ie does my opp have 3 in a row/col/diag, etc),
      // if yes, can I stop opp from winning on their next move?
        // if yes, block
        // else, in checkmate. opp will win. this move doesn't matter    
    
    else if (winBlock(board, this.id^0b11) !== false){
      returnMove = winBlock(board, this.id^0b11);
    }


    // else play best offensive move
    else {
      var columnStats = [];
      for (var i = 0; i< 7; i++){
        if(!board.isColFull(i)){
          var testBoard = new Board(board.cloneCells());
          testBoard.move(i, id);
          columnStats[i] = offense(testBoard, id, 0);
        }
      }

      console.table(columnStats);

    }
    
    console.log('returnMove', returnMove);
    return returnMove;
  };

};

var CPUPlayerMkI = function(id) {
  this.id = id;

  var figureOutThePlan = function(board) {

    var result;
    var recur = function(node) {
      var xo = arguments[1] || id;
      var i = 0;
      while (i < 7 && result === undefined) {

        var b = new Board(node.value.cloneCells());
        var n = new Tree(b);
        var moveResult = b.move(i, id);
        var hasWin = b.hasWinner();

        if (!hasWin && moveResult) {
          //console.log(arguments);
          //node.addChild(recur.bind(this)(n, xo)); //xo === "x" ? "o" : "x"));
          var j = 0;
          while (j < 7 && result === undefined) {

            var b2 = new Board(n.value.cloneCells());
            var n2 = new Tree(b2);
            var moveResult2 = b2.move(i, xo === "x" ? "o" : "x");
            var hasWin2 = b2.hasWinner();

            if (!hasWin2 && moveResult2) {
              n.addChild(recur.bind(this)(n2, xo)); //xo === "x" ? "o" : "x"));
            } else {
              if (hasWin2) {
                result = b2;
              }

              n.addChild(n2);
            }

            j++;
          }

          node.addChild(n);
        } else {
          if (hasWin) {
            result = b;
          }

          node.addChild(n);
        }

        i++;
      }

      return node;
    };

    var n = new Tree(board);
    var tree = recur.bind(this)(n);

    //console.log(tree);
    // console.log(tree.DFTraverse(function(value) {
    //   return value === result;
    // }));
    tree.DFTraverse(function(value) {
      return value === result;
    });

    return tree.DFTraverse(function(value) {
      return value === result;
    })[0];

  };

  this.promptMove = function(game) {
    var move = figureOutThePlan.bind(this)(game.board);
    game.commitMove(move);
  };

};
