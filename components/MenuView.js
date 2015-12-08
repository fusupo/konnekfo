"use strict";

var React = require('react');

module.exports=React.createClass({
  getInitialState: function(){
    return {menuState: "main"};   
  },
  handleVsHumanLocalClick: function(e){
    var s = "return";
    this.setState({menuState: s});
    this.props.handleChange("vsHumanLocal");
  },
  handleVsHumanNetworkClick: function(e){
    var s = "network";
    this.setState({menuState: s});
    this.props.handleChange("vsHumanNetwork");
  },
  handleVsCPULocalClick: function(e){
    var s = "return";
    this.setState({menuState: s});
    this.props.handleChange("vsCPULocal");
  },
  handleNewNetworkGameClick: function(e){
    var s = "return";
    this.setState({menuState: s});
    this.props.handleChange("newNetwork");
  },
  handleConnectNetworkGameClick: function(e){
    var s = "return";
    this.setState({menuState: s});
    this.props.handleChange("connectNetwork");
  },
  handleBackToMainClick: function(e){
    var s = "main";
    this.setState({menuState: s});
    this.props.handleChange("returnHome");
  },
  render: function() {
    console.log('render menu view');
    var r;
    if(this.state.menuState === "main"){
      r = (
          <div className="unselectable">
          <h2>menu **</h2>
          <ul>
          <li>
          <span onClick={this.handleVsHumanLocalClick}>versus human local</span>
          </li>
          <li>
          <span onClick={this.handleVsHumanNetworkClick}>versus human network</span>
          </li>
          <li>
          <span onClick={this.handleVsCPULocalClick}>versus computer</span>
          </li>
          </ul>
          </div>
      );
    }else if(this.state.menuState === "network"){
      r = (
          <div className="unselectable">
          <h2>connect**</h2>
          <span onClick={this.handleBackToMainClick}>return</span>
          <ul>
          <li>
          <span onClick={this.handleNewNetworkGameClick}>start new game as player 1</span>
          </li>
          <li>
          <span onClick={this.handleConnectNetworkGameClick}>connect to a game </span>
          </li>
          </ul>
          </div>
      );
    }else if(this.state.menuState === "return"){
      r = (
          <div className="unselectable">
          <span onClick={this.handleBackToMainClick}>return</span>
          </div>
      );
    }
    return r;
    
  }
});
