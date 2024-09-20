const Chat = require('../models/Chat');

exports.saveMessage = async (messageData) => {
    const { username, message } = messageData;
    const newChat = new Chat({ username, message });
    return await newChat.save(); 
};

exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find().sort({ timestamp: 1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error });
    }
};
