const { Server } = require("socket.io");
const User = require("./model/usermodel");
const Message = require("./model/messageModel");

const connectChat = () => {
    const io = new Server({
        cors: {
            origin: "http://localhost:3000"
        }
    });

    const connectedUsers = new Map();

    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on('authenticate', async (userData) => {
            console.log('Authenticating user with mobile:', userData.mobileNumber);
            try {
                const user = await User.findOne({ mobileNumber: userData.mobileNumber });
                if (user) {
                    socket.mobileNumber = userData.mobileNumber;
                    connectedUsers.set(userData.mobileNumber, socket.id);
                    console.log("User authenticated:", userData.mobileNumber);
                    console.log("Connected users map:", Array.from(connectedUsers.entries()));
                    socket.emit('authenticated', { success: true });
                } else {
                    console.log("User not found in database:", userData.mobileNumber);
                    socket.emit('authenticated', { success: false, error: 'User not found' });
                }
                
            } catch (error) {
                console.error("Authentication error:", error);
                socket.emit('authenticated', { success: false, error: 'Authentication failed' });
            }
        });

        socket.on('sendMessage', async (data) => {
            console.log('Attempting to send message:', data);
            
            if (!data.to || !data.msg) {
                console.log('Invalid message data');
                return socket.emit('messageSent', { success: false, error: 'Invalid message data' });
            }
        
            console.log("Current connected users:", Array.from(connectedUsers.entries())); // Log all connected users

            const recipientSocketId = connectedUsers.get(data.to);
            console.log('Recipient socket ID:', recipientSocketId); // Check if this is undefined
        
            if (!recipientSocketId) {
                console.log("Recipient not connected:", data.to);
                return socket.emit('messageSent', { success: false, error: 'Recipient not connected' });
            }
        
            // Save message to the database
            const message = new Message({
                from: socket.mobileNumber,
                to: data.to,
                msg: data.msg
            });

            await message.save()
                .then(() => {
                    console.log('Message saved to database:', message);
                    io.to(recipientSocketId).emit('msg', {
                        from: socket.mobileNumber,
                        to: data.to,
                        msg: data.msg
                    });
                    socket.emit('messageSent', { data: data });
                })
                .catch(err => {
                    console.error('Error saving message:', err);
                    socket.emit('messageSent', { success: false, error: 'Error saving message' });
                });
        });
        
        

        // socket.on('disconnect', () => {
        //     if (socket.mobileNumber) {
        //         connectedUsers.delete(socket.mobileNumber);
        //         console.log("User disconnected:", socket.mobileNumber);
        //     }
        // });
    });

    io.listen(4000);
}

module.exports = connectChat;