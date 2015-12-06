"use strict";

var Colors = require('../game/Colors.js');

var React = require('react');

//var GameScoreBoard
module.exports = React.createClass({
  render: function(){
    var tablePaddingStyle={
      padding: "0px 10px 0px 10px"
    };
    var resetNetworkStyle={
      borderCollapse: "collapse"
    };
    var gameStatusStr = this.props.status[0];
    var gameStatusStyle;
    switch(this.props.status[1]){
    case "p":
      gameStatusStyle = {
        color: this.props.status[2] === 1 ? Colors.p1Color : Colors.p2Color 
      };
      break;
    case "!":
      gameStatusStyle = {
        color: this.props.status[2] === 1 ? Colors.p1Color : Colors.p2Color 
      };
      break;
    case "x":
      break;
    }
    return (
        <div>
        <div id="gameStatus" style={gameStatusStyle}>{gameStatusStr}</div>
        <table id="game-win-tally" style={resetNetworkStyle}>
        <thead>
        <tr>
        <th style={tablePaddingStyle}>p1</th>
        <th style={tablePaddingStyle}>p2</th>
        <th style={tablePaddingStyle}>draws</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td style={tablePaddingStyle}>
        <div id="p1">{this.props.tally[1]}</div>
        </td>
        <td style={tablePaddingStyle}>
        <div id="p2">{this.props.tally[2]}</div>
        </td>
        <td style={tablePaddingStyle}>
        <div id="draws">{this.props.tally[0]}</div>
        </td>
        </tr>
        </tbody>
        </table>
        </div>
    );
  }
});
