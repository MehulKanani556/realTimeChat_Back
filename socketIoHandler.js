const { Server } = require('socket.io');

const socketIoHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected', socket.id);
      socket.emit('test', 'Good Morning ...');

      socket.on('message', (data) => {
        io.emit('msg', data);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket is already initialized');
  }
  res.end();
};

module.exports = socketIoHandler;