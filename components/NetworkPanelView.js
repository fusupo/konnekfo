"use strict";

var React = require('react');
var Colors = require('../game/Colors.js');

module.exports = React.createClass({
  render: function(){
    var style = {};
    if(!this.props.sessionId){
      style.display = "none";
    }
    var indicatorStyle={
      display: "inline-block",
      borderRadius: "50%",
      width: "10px",
      height: "10px",
      marginRight: "5px",
      backgroundColor: this.props.opponentConnected ? "#00ff00" : "#ff0000"
    };
    var copyBtnStyle={
      display: this.props.networkPlayerId === 1 && !this.props.opponentConnected ? "inline-block" : "none",
      marginLeft: "0.5em",
      fontSize:"0.75em"
    };
    var playerStyle={
      color: this.props.networkPlayerId === 1 ? Colors.p1Color : Colors.p2Color
    };
    var connectedStr = this.props.opponentConnected ? "opponent connected" : "opponent not connected";
    return(
      <div style={style} className="panel ">
        <div>
          <span style={playerStyle}>You Are Player #{this.props.networkPlayerId}</span> on game: 
          <span id="session-id"><strong>{this.props.sessionId}</strong></span>
          <span>
            <span style={copyBtnStyle} className="ui-button" id="copy-button" data-clipboard-target="#session-id" title="Click to copy me.">[Copy to Clipboard]</span>
          </span>
        </div>
        <div id="indicator" style={indicatorStyle}></div>
        <span id="text">{connectedStr}</span>
      </div>
    );
  }
});
