"use strict";

var React = require('react');

module.exports = React.createClass({
  handleMouseUp: function(){
  },
  render: function(){
    var style = {};
    if(!this.props.sessionId){
      style.display = "none";
    }
    var indicatorStyle={
      display: "inline-block",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      backgroundColor: this.props.opponentConnected ? "#00ff00" : "#ff0000"
    };
    var copyBtnStyle={
      display: this.props.networkPlayerId === 1 && !this.props.opponentConnected ? "block" : "none" 
    };
    var connectedStr = this.props.opponentConnected ? "opponent connected" : "opponent not connected";
    return(
        <div style={style}>
        <div>You Are Player #{this.props.networkPlayerId}</div>
        <div id="session-id">{this.props.sessionId}</div>
        <button style={copyBtnStyle} id="copy-button" data-clipboard-target="#session-id" title="Click to copy me." onMouseUp={this.handleMouseUp}>Copy to Clipboard</button>
        <br /><div id="indicator" style={indicatorStyle}></div>
        <span id="text">{connectedStr}</span>
        </div>
    );
  }
});
