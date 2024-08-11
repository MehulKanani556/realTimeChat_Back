const { Server } = require("socket.io");

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
          credentials: true
        }
      });

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      socket.broadcast.emit("test", "Good Morning ...");

      socket.on('message', (data) => {
        io.to(data.id).emit('msg', data);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

module.exports = ioHandler