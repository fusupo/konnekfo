"use strict";

var Backbone = require('backbone');
var _ = require('underscore');
var colors = require('../Colors.js');

module.exports = Backbone.View.extend((function() {
  return {
    initialize: function() {
      console.log("new menu view");
      this.render();
    },
    render: function() {
      this.renderMain();
    },
    events: {
      "click #vs-human-local": function() {
        console.log("click nukkah!");
        this.renderReturn();
      },
      "click #vs-human-network": function() {
        this.renderConnect();
      },
      "click #vs-computer": function() {
        console.log("cpmputer");
        this.renderReturn();
      },
      "click #network-new": function(){
        console.log("network new");
        this.renderReturn();
      },
      "click #network-connect": function(){
        console.log("network connect");
        this.renderReturn();
      },
      "click #back-to-main": function(){
        this.renderMain();
      }
    },
    renderMain: function() {
      console.log(this);
      var template = _.template($("#main_menu_template").html());
      this.$el.html(template);
    },
    renderConnect: function() {
      console.log(this);
      var template = _.template($("#connect_menu_template").html());
      this.$el.html(template);
    },
    renderReturn: function(){
      this.$el.html("<div id='back-to-main'>Back To Main</div>");
    }
  };
})());
