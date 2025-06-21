const express = require('express');
const http = require('http'); // Required for socket.io
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app); // create HTTP server
const io = socketIO(server, {
  cors: {
    origin: "*", // allow all for now
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

mongoose.connect('mongodb+srv://shailendra:A7zXvreB77AAlVZL@phaserdb.bfjixkc.mongodb.net/?retryWrites=true&w=majority&appName=phaserdb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// ✅ Store online users
const onlineUsers = new Map();

// ✅ Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    socket.username = username;
    onlineUsers.set(username, socket.id);
    console.log(`${username} joined`);
  });

  socket.on('send_message', async ({ recipient, content }) => {
    const sender = socket.username;
    const Message = require('./models/Message');

    const newMessage = new Message({ sender, recipient, content });
    await newMessage.save();

    const recipientSocketId = onlineUsers.get(recipient);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_message', {
        sender,
        content
      });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.username);
    console.log(`${socket.username} disconnected`);
  });
});

server.listen(3000, () => console.log('Server running on port 3000'));
