"use strict";

var React = require('react');
var Colors = require('../game/Colors.js');
var GameScoreBoard = require('./GameScoreView.js');
var ConclusionView = require('./ConclusionView.js');

var GameBoardButtons = React.createClass({
  handleMouseEnter:function(e){
    e.currentTarget.style.opacity = 0.48;
  },
  handleMouseLeave:function(e){
    e.currentTarget.style.opacity = 0;
  },
  render:function(){
    console.log('render GameBoardButtons');
    var hitStyle = {
      opacity: 0
    };
    return(<g className="ui-button">
           {[0,1,2,3,4,5,6].map(function(i) {
             return <rect
             key={i}
             data-key={i}
             onMouseEnter={this.handleMouseEnter}
             onMouseLeave={this.handleMouseLeave}
             onClick={this.props.handleMouseUp.bind(null, i)}
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
  circles: [],
  getInitialState: function(){
    return {circles:[]};
  },
  componentDidUpdate: function(){
    $(".someCrap").on('animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oAnimationEnd', this.props.animationComplete);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if(R.equals(nextProps.data, [['00'],['00'],['00'],['00'],['00'],['00'],['00']])) {
      console.log(this.circles);
      for(var i = 0; i < this.circles.length; i++){
        var c = this.circles[i];
        c.animate({
          cy: 400
        },750, mina.easeout);
      }}else if(nextProps.prevMove.playerId){
        var cbk = this.props.animationComplete;//function(){};
        var gameboardSVG = document.getElementById('public-chair');
        var s = Snap(gameboardSVG);
        var cellWidth = this.props.cw;
        var cellHeight = this.props.ch;
        var c = s.circle((cellWidth/ 2) + (nextProps.prevMove.colIdx * cellWidth), 0, 0.40 * cellWidth);
        c.attr({
          fill: nextProps.prevMove.playerId === 1 ? Colors.p1Color : Colors.p2Color,
          opacity: 1
        });
        // this.circles.add(c);
        var circles = this.circles;
        circles.push(c);
        // this.setState({
        //   circles: circles
        // });
        s.add(c);
        c.animate({
          cy: (cellHeight / 2 + cellHeight/*topMargin*/) + (nextProps.prevMove.rowIdx * cellHeight)
        }, 500, mina.bounce, cbk);
        console.log(gameboardSVG);
      }  
    return false;
  },
  render:function(){
    console.log('IDEAS THAT MATTER');
    return(<g id="public-chair"></g>);
  }
});

var GameBoardView = React.createClass({
  render: function(){
    console.log('render GameBoardView', this.props.board);
    var bgColor = Colors.bgColor;
    var boardColor = Colors.boardColor;
    var p1Color = Colors.p1Color;
    var p2Color = Colors.p2Color;
    var w = 280;
    var h = 240;
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
    var viewBox = "0 0 " + w + " " + h;
    return (
        <svg width="100%" height="100%" viewBox={viewBox}>
          <rect x="0" y="0" width={w} height={h} fill="#ffffff"></rect>
          <GameBoardPieces
             w={w}
             h={h}
             cw={cellWidth}
             ch={cellHeight}
             r={r}
             data={pieces}
             prevMove={this.props.prevMove}
             animationComplete={this.props.gamepieceAnimationComplete}
             />
          <g id="circlesGroup"></g>
          <path d={pathDef} fill="#33658a"></path>
          <GameBoardButtons w={w} h={h} handleMouseUp={this.props.handleMouseUp}/> 
        </svg>
    );
  } 
});

module.exports = React.createClass({
  render: function(){
    var style = {
      display: this.props.gameState.statusCode != undefined ? "block" : "none"
    };
    return (
      <div className="panel" style={style}>
        <h2 className="unselectable">game</h2>
        <GameScoreBoard
           tally={this.props.gameState.winTally}
           statusCode={this.props.gameState.statusCode}
           statusValue={this.props.gameState.statusValue}
           statusMessage={this.props.gameState.statusMessage} />
        <ConclusionView
           isLocal={this.props.isLocal}
           resetGame={this.props.resetGame}
           statusCode={this.props.gameState.statusCode}
           statusValue={this.props.gameState.statusValue}
           statusMessage={this.props.gameState.statusMessage}
           />
        <GameBoardView
           prevMove={this.props.gameState.prevMove}
           board={this.props.board}
           handleMouseUp={this.props.handleMouseUp}
           gamepieceAnimationComplete={this.props.gamepieceAnimationComplete}
           />
      </div>
    );
  }
});
