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
      var template=_.template($("#conclusion_panel_template").html());
      this.$el.html(template);
    },
    events: {
      "click #reset-local": function() {
        console.log("reset game");
        this.trigger("click:reset");
      }
    },
  };
})());
