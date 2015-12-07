"use strict"

var React = require('react');
var Colors = require('../game/Colors.js');
var GameScoreBoard = require('./GameScoreView.js');
var ConclusionView = require('./ConclusionView.js');

var GameBoardButtons = React.createClass({
  handleMouseEnter:function(e){
    e.currentTarget.style.opacity = 0.9;
  },
  handleMouseLeave:function(e){
    e.currentTarget.style.opacity = 0;
  },
  render:function(){
    console.log('render GameBoardButtons');
    var hitStyle = {
      opacity: 0
    };
    return(<g>
           {[0,1,2,3,4,5,6].map(function(i) {
             return <rect
             key={i}
             data-key={i}
             onMouseEnter={this.handleMouseEnter}
             onMouseLeave={this.handleMouseLeave}
             onMouseUp={this.props.handleMouseUp.bind(null, i)}
             x={i * (this.props.w/7)}
             y="0"
             width={this.props.w/7}
             height={this.props.h}
             fill="#ffffff"
             style={hitStyle}></rect>;
           }, this)}
           </g>);
  }
});

var GameBoardPieces = React.createClass({
  render:function(){
    return(<g>
           {this.props.data.map(function(i,idxx){
             return i.map(function(j, idxy){
               return (function (that) {
                 var color;
                 if(j === "00"){
                   return;
                 }else if(j === "01"){
                   color = Colors.p1Color;
                 }else if(j === "10"){
                   color = Colors.p2Color;
                 }
                 return <circle
                 key = {idxx+idxy}
                 cx = {(that.props.cw / 2) + (idxx * that.props.cw)} 
                 cy = {(that.props.h) - (idxy * that.props.ch) - that.props.ch/2} 
                 r = {that.props.r}
                 fill = {color}></circle>;
               })(this);
             }, this);
           }, this)}
           </g>);
  }
});

var GameBoardView = React.createClass({
  render: function(){
    console.log('render GameBoardView', this.props.board);
      
    var bgColor = Colors.bgColor;
    var boardColor = Colors.boardColor;
    var p1Color = Colors.p1Color;
    var p2Color = Colors.p2Color;
    var w = 140;
    var h = 120;
    var boardWidth = w;
    var boardHeight = h - h / 7;
    var cellWidth = boardWidth / 7;
    var cellHeight = boardHeight / 6;
    var r = .35 * cellWidth;
    var topMargin = cellHeight;
    var pathDef = "M0," + topMargin + "H" + boardWidth + "V" + (topMargin + boardHeight) + "H0V" + topMargin;
    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        var cx = (cellWidth / 2) + (x * cellWidth);
        var cy = (cellHeight / 2 + topMargin) + (y * cellHeight);
        pathDef += "M" + (cx - r) + "," + cy;
        pathDef += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
        pathDef += "a" + r + "," + r + " 0 1,0 " + (r * -2) + ",0";
      }
    }
    var pieces = [["00"],["00"],["00"],["00"],["00"],["00"],["00"]];
    if(this.props.board){
      for(var i = 0; i < this.props.board.length; i++) {
        var col = this.props.board[i] >> 4;
        col = col.toString(2);
        if(col.length % 2){
          col = 0 + col;
        }
        col = R.splitEvery(2, col).reverse();
        pieces[i]=col;
      }
    }
    return(
        <div className="gameboardHolder">
        <svg width={w} height={h}>
        <defs></defs>
        <rect x="0" y="0" width={w} height={h} fill="#ffffff"></rect>
        <g></g>
        <path d={pathDef} fill="#33658a"></path>
        <GameBoardButtons w={w} h={h} handleMouseUp={this.props.handleMouseUp}/> 
        <GameBoardPieces w={w} h={h} cw={cellWidth} ch={cellHeight} r={r} data={pieces}/>
        </svg>
        </div>
    );
  } 
});

module.exports = React.createClass({
  render: function(){
    var status= this.props.gameState.status; 
    var style = {
      display: status[1] != undefined ? "block" : "none"
    };
    return (
        <div id="game" style={style}>
        <h2>game</h2>
        <GameScoreBoard tally={this.props.gameState ? this.props.gameState.winTally : [0,0,0]} status={status} />
        <ConclusionView isLocal={this.props.isLocal} resetGame={this.props.resetGame} status={status}/>
        <GameBoardView
      board={this.props.board}
      handleMouseUp={this.props.handleMouseUp}
      UIenabled={UIenabled}/>
        </div>
    );
  }
});
