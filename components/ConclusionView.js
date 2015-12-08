"use strict";

var React = require('react');

module.exports = React.createClass({
  render: function(){
    console.log('render ConclusionView');
    var tablePaddingStyle={
      padding: "0px 10px 0px 10px"
    };
    var resetNetworkStyle={
      borderCollapse: "collapse"
    };
    var resetLocalStyle={
    };
    if(this.props.isLocal!=undefined){
      if(this.props.isLocal){
        resetLocalStyle.display="block";
        resetNetworkStyle.display="none";
      }else{
        resetLocalStyle.display="none";
        resetNetworkStyle.display="block";
      }
    }else{
      resetLocalStyle.display="none";
      resetNetworkStyle.display="none";
    }
    var visibilityStyle = {
      visibility: "hidden"
    };
    switch(this.props.status[1]){
    case "!":
    case "x":
      visibilityStyle.visibility = "visible";
      break;
    case "p":
    default:
      visibilityStyle.visibility = "hidden";
      break;
    }
    return (
        <div id="conclusion" style={visibilityStyle} className="unselectable">
        <div id="reset-local" style={resetLocalStyle} onMouseUp={this.props.resetGame}>[reset]</div>
        <table id="reset-network" style={resetNetworkStyle}>
        <thead>
        <tr>
        <th style={tablePaddingStyle}>you</th>
        <th style={tablePaddingStyle}>them</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td style={tablePaddingStyle}>
        <input id="check-reset-you" type="checkbox"></input>
        </td>
        <td style={tablePaddingStyle}>
        <input id="check-reset-them" type="checkbox" disabled="true"></input>
        </td>
        </tr>
        </tbody>
        </table>
        </div>
    );
  }
});
