window.onload = function() {

  this.socket = io();
  this.socket.on('confirm player', function(id) {
    console.log('According to the server, I am player #' + id);
  });

  $('#game').hide();
  $('#conclusion').hide();

  //var g = new Game();
  $('#vs-human-local').click(function() {
    console.log('vs-human-local');
  });

  $('#vs-human-network').click(function() {
    console.log('vs-human-network');
  });

  $('#vs-computer').click(function() {
    console.log('vs-computer');
  });
};
