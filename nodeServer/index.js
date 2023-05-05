//
const CryptoJS = require('crypto-js');
const http = require('http');
const server = http.createServer();
const io = require("socket.io")(server);
//

// const io = require('socket.io')(8000);

const users = {};

io.on('connection', socket => {
  console.log("User connected");
  socket.on('new-user-joined', name1 => {
    console.log("new user", name1);
    users[socket.id] = name1;
    socket.broadcast.emit('user-joined', name1);
  });


  // socket.on('send', message => {
  //   console.log(message);
  //   socket.broadcast.emit("receive", { name1:users[socket.id], message:message});
  // });

  socket.on('send', (message) => {
    //console.log(message);
    const key = '0123456789abcdef'; // Replace with your own AES key
    const iv = '1234567890abcdef'; // Replace with your own initialization vector
    const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv }).toString();
    // console.log(encrypted);
    socket.broadcast.emit('receive', { name1: users[socket.id], message:encrypted});
  });
  // chatgpt
  
  socket.on('disconnect', message => {
    console.log("message encrypted");
    console.log("User disconnected:", users[socket.id]);
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log("Socket.IO server listening on port 8000");
});