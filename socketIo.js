const { Server } = require("socket.io");



const connectChat = () => {

    const io = new Server({
        cors: {
            origin: "http://localhost:3000"
        }
    });



    io.on("connection", (socket) => {

        console.log("User connected",socket.id);




        socket.broadcast.emit("test","Good Morning ...");

        socket.on('message',(data)=>{
            io.to(data.id).emit('msg',data);
        })

    });

    
    io.listen(4000);
}
module.exports = connectChat;
