const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { mongoURI } = require('./config');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { saveMessage } = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
     res.send("Welcome");
})
app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('sendMessage', async (messageData) => {
        const savedMessage = await saveMessage(messageData);
        io.emit('message', savedMessage); 
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
