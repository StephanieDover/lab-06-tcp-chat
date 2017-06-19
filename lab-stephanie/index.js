'use strict';

const net = require('net');
const server = net.createServer();
let clientPool = [];

server.on('connection', (socket) => {
  console.log('connected to socket');
  socket.write('welcome to the chat room!');
  clientPool =[...clientPool, socket]; //similar to .push

  let handleDisconnect = () => {
    console.log(`${socket.nickname} left the chat`);
    clientPool = clientPool.filter(item => item !== socket);
  };
  let handleTroll = (msg, arg) => {
    for(let i =0; i <arg; i++) {
      socket.write(msg);
    }
  };
  socket.on('error', handleDisconnect);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    clientPool.forEach(socket => {
      socket.write(buffer.toString());
      if(data.startsWith('/nick')) {

        let nickname = socket.nickname = data.split('/nick')[1].trim() || socket.nickname; //shortcircuiting
        socket.nickname = socket.nickname.trim();
        socket.write(`you are now known as ${socket.nickname}`);
        return;
      }

      if(data.startsWith('/quit')) {
        handleDisconnect();
      }

      if(data.startsWith('/troll')) {
        handleTroll();
      }

      if(data.startsWith('/dm')) {
        let content = data.split('/dm') || '';
        return content;
      }

      clientPool.forEach((user) => {
        user.write(`${socket.nickname}: ${data}`);
      });
    });
  });
});

server.listen(3000, () => console.log('server up on port 3000'));
//sockets listen for data, errors, and close
