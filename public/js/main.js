"use strict";

var Game = function() {

    this.board = new Board();
    this.view = new View();

    var playerID;
    var p1; // = new CPUPlayerClI(2);
    var p2; // = /*new Player(2);*/ new Player(1);
    var currPlayer; // = p2;
    var winner = 'none';
    var gameOver = false;
    
    this.saveMove = function(colIdx){
        if (currPlayer === p1) {
            this.board.move(colIdx, p1.id);
            currPlayer = p2;
        } else {
            this.board.move(colIdx, p2.id);
            currPlayer = p1;
        }

        this.view.addPiece(colIdx, 6 - (this.board.getNextRowIdx(colIdx) - 2), currPlayer.id ^ 0b11, (function () {
            var winningDirection = this.board.hasWinner();
            if (winningDirection) {
                alert(this.board.winner + ' won! ' + winningDirection);
            } else {
                currPlayer.promptMove(this);
            }
        }).bind(this));
    };
    
    this.commitMove = function(colIdx) {

        console.log('commit move', colIdx);
        this.saveMove(colIdx);
        this.socket.emit('commit move', colIdx);

    };

    this.socket = io();

    this.socket.on('confirm player', (function(id) {
        console.log('According to the server, I am player #' + id);
        playerID = id;

        document.getElementById('playerID').innerHTML = playerID;
        
        if (id === 1) {
            p1 = new Player(1);
            p2 = new RemotePlayer(2, this.socket);
            p1.promptMove(this);
        } else {
            p1 = new RemotePlayer(1, this.socket);
            p2 = new Player(2);
        }

        currPlayer = p1;

    }).bind(this));

    this.socket.on('your turn', (function(colIdx) {

        this.saveMove(colIdx);
        console.log(colIdx);
        
    }).bind(this));

    this.view.drawBoard();

    return this;
};

//////////////////////////////////////////////////////////// INIT

window.onload = function() {

    var g = new Game();
};
