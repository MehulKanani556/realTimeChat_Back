const Message = require("../model/messageModel");

// Fetch messages for a specific user
exports.getUserMessages = async (req, res) => {
    try {
        const { mobileNumber } = req.params;
        const messages = await Message.find({
            $or: [
                { from: mobileNumber },
                { to: mobileNumber }
            ]
        }).sort({ timestamp: 1 }); // Sort messages by timestamp

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
};
