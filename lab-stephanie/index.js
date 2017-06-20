'use strict';

const net = require('net');
const server = net.createServer();
let clients = [];

function Client(socket) {
  this.socket = socket;
  this.name = socket.nickname || Math.floor(Math.random() +1);
}

server.on('connection', (socket) => {
  let user = new Client(socket);
  console.log('connected to socket');
  socket.write('welcome to the chat room!');
  clients =[...clients, socket]; //similar to .push

  let handleDisconnect = () => {
    console.log(`${socket.nickname} left the chat`);
    clients = clients.filter(item => item !== socket);
  };
  let handleTroll = (msg, arg) => {
    let i =0;
    for(i =0; i <arg; i++) {
      clients.forEach(socket => socket.write(`${msg}\n`));
    }
  };
  let handleDm = (user, msg) => {
    for(let i =0; i < clients.length; i++) {
      clients.forEach(user => (user.nickname === this.name) ? socket.write(msg): console.log('user not found'));
    }
  };
  socket.on('error', handleDisconnect);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    clients.forEach(socket => {
      socket.write(buffer.toString());
      if(data.startsWith('/nick')) {

        let nickname = socket.nickname = data.split('/nick')[1].trim() || socket.nickname; //shortcircuiting
        socket.nickname = socket.nickname.trim();
        socket.write(`you are now known as ${socket.nickname}`);
        console.log(user);
        return nickname;
      }

      if(data.startsWith('/quit')) {
        handleDisconnect();
      }

      if(data.startsWith('/troll')) {
        handleTroll(data.split('/troll')[1].trim(), data.split('')[1].trim());
      }

      if(data.startsWith('/dm')) {
        handleDm(data.split('')[1].trim(), data.split(''));
      }

      clients.forEach((user) => {
        user.write(`${socket.nickname}: ${data}`);
      });
    });
  });
});

server.listen(3000, () => console.log('server up on port 3000'));
