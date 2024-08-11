const { Server } = require("socket.io");

const connectChat = () => {

    const io = new Server({
        cors: {
            origin: "http://localhost:3000"
        }
    });
    io.on("connection", (socket) => {

        console.log("User connected", socket.id);

        socket.on('register', (mobileNumber) => {
            socket.mobileNumber = mobileNumber;
            console.log("User registered with mobile number:", mobileNumber);
        });
    
        socket.broadcast.emit("test", "Good Morning ...");

        socket.on('message', (data) => {
            io.to(data.to).emit('msg', {
                from: socket.mobileNumber,
                message: data.message
            });
        })

    });


    io.listen(4000);
}
module.exports = connectChat;
