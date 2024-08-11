const { Server } = require("socket.io");

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");
    const io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      socket.broadcast.emit("test", "Good Morning ...");

      socket.on('message', (data) => {
        io.emit('msg', data);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

module.exports = ioHandler