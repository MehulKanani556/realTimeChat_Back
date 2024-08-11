const { Server } = require("socket.io");
const User = require("./model/usermodel");

const connectChat = () => {
    const io = new Server({
        cors: {
            origin: "http://localhost:3000"
        }
    });

    const connectedUsers = new Map();

    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on('register', async (mobileNumber) => {
            const user = await User.findOne({ mobileNumber });
            if (user) {
                socket.mobileNumber = mobileNumber;
                connectedUsers.set(mobileNumber, socket.id);
                console.log("User registered with mobile number:", mobileNumber);
            } else {
                console.log("User not found in database:", mobileNumber);
            }
        });

        socket.on('message', async (data) => {
            const recipientSocketId = connectedUsers.get(data.to);
            console.log("object",data)
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('msg', {
                    id: socket.mobileNumber,
                    msg: data.msg
                });
            } else {
                console.log("Recipient not connected:", data.to);
            }
        });

        socket.on('disconnect', () => {
            if (socket.mobileNumber) {
                connectedUsers.delete(socket.mobileNumber);
            }
        });
    });

    io.listen(4000);
}

module.exports = connectChat;