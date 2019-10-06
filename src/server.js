var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let numberOfUsers;
io.on('connection', function(socket){
  console.log('a user connected ',socket.id, '  ' ,Object.keys(io.sockets.sockets).length);
  //numberOfUsers = Object.keys(io.sockets.sockets).length;
  //socket.join('the room');
  //console.log(io.sockets.sockets)

  socket.on('new-room', (room) => {
    socket.join(room.name);
    io.emit('new-room', room);
  });
  socket.on('join-room', (room) => {
    socket.join(room.name);
    io.emit('room-update', room);
    io.to(room.name).emit('joined-room',room);
  });
  socket.on('new-board', (board, room, player) => {
    console.log(room, board, ' tudeludeluu');
    io.to(room.name).emit('new-board',board, player);
  });
  socket.on('winner', (winner, room) => {
    console.log(room, winner, ' Charlie Sheen');
    io.to(room.name).emit('winner',winner);
  });
  socket.on('rematch', ( room) => {
    console.log(room );
    io.to(room.name).emit('rematch');
  });




});

http.listen(3000, function(){
  console.log('listening on *:3000');


});
