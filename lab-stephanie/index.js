'use strict';

const net = require('net');
const server = net.createServer();
const clientPool = [];

server.on('connection', (socket) => {
  console.log('connected to socket');
  socket.write('welcome to the chat room!');
  clientPool =[...clientPool, socket]; //similar to .push

  let handleDisconnect = () => {
    console.log(`${socket.nickname} left the chat`);
    clientPool = clientPool.filter(item => item !== socket);
  }

  socket.on('error', handleDisconnect)
  socket.on('close', handleDisconnect)

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    clientPool.forEach(socket => {
      socket.write(buffer.toString());
      if(data.startsWith('/nickname')) {

        let nickname = socket.nickname = data.split('/nickname')[1].trim() || socket.nickname; //shortcircuiting
        socket.nickname = socket.nickname.trim();
        socket.write(`you are now known as ${socket.nickname}`);
        return;
      };
      
      //if they type in "/dm Stephanie how are you?"''
      if(data.startsWith('/dm')) {
        let content = data.split('/dm') || '';
        //returns "Stephanie how are you"
      }

      clientPool.forEach((user) => {
        user.write(`${socket.nickname}: ${data}`)
      })
    });
  });
});

server.listen(3000, () => console.log('server up on port 3000'));
//sockets listen for data, errors, and close
