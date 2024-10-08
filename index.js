const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { mongoURI } = require('./config');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { saveMessage } = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',  // Allow all origins for Socket.io
    }
});

// Middleware
app.use(cors({
    origin: '*', // Replace with the frontend domain if needed
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle incoming message
    socket.on('sendMessage', async (messageData) => {
        try {
            const savedMessage = await saveMessage(messageData);
            io.emit('message', savedMessage); // Broadcast to all connected clients
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Server setup
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
