// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

mongoose.connect('mongodb+srv://shailendra:A7zXvreB77AAlVZL@phaserdb.bfjixkc.mongodb.net/data?retryWrites=true&w=majority&appName=phaserdb')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error(err));
