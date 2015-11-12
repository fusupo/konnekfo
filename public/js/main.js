"use strict";

window.onload = function() {

  this.game = 'game';
  this.socket = io();
  this.socket.on('confirm player', function(id) {
    console.log('According to the server, I am player #' + id);
  });

  $('#connect').hide();
  $('#game').hide();
  $('#conclusion').hide();

  var $vsHumanLocal = $('#vs-human-local');
  $vsHumanLocal.click(function() {
    $('#game').show();
    $('#menu').hide();
    window.game = new LocalGame(new Player(1), new Player(2));
  });

  $('#vs-human-network').click(function() {
    $('#connect').show();
    $('#menu').hide();
    window.game = new NetworkGame();
  });

  $('#vs-computer').click(function() {
    $('#game').show();
    $('#menu').hide();
    window.game = new LocalGame(new Player(1), new CPUPlayerClI(2));
  });

  $('#network-new').click(function() {
    $('#game').show();
    $('#connect').hide();
    window.game.new(function() {
      console.log('new game created!');
    });
  });

  $('#network-connect').click(function() {
    $('#game').show();
    $('#connect').hide();
    window.game.connect('some connection id', function() {
      console.log('connected');
    });
  });

};
