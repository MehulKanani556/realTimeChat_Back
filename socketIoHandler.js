const { Server } = require("socket.io");

const socketIoHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = require('socket.io')(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
};

module.exports = socketIoHandler;