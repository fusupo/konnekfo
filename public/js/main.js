"use strict";

window.onload = function() {

  this.game = 'game';
  this.socket = io();
  this.socket.on('confirm player', function(id) {
    console.log('According to the server, I am player #' + id);
  });

  $('#game').hide();
  $('#conclusion').hide();

  var $vsHumanLocal = $('#vs-human-local');
  $vsHumanLocal.click(function() {
    $('#game').show();
    $('#menu').hide();
    window.game = new LocalGame(new Player(1), new Player(2));
  });

  $('#vs-human-network').click(function() {
    console.log('vs-human-network');
  });

  $('#vs-computer').click(function() {
    $('#game').show();
    $('#menu').hide();
    window.game = new LocalGame(new Player(1), new CPUPlayerClI(2));
  });

};
