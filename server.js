// COMP 3133 
// Lab Test 1
// Author: Andrew Stewart
// Student ID: 101418564

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const User = require('./models/User');
const GroupMessage = require('./models/GroupMessage');

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const users = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join room', (data) => {
    if (!data || !data.username || !data.room) {
      console.error('Invalid data received for join room event:', data);
      return;
    }
    const { username, room } = data;
    socket.join(room);
    if (!users[room]) {
      users[room] = [];
    }
    users[room].push(username);
    console.log(`User ${username} joined room: ${room}`);
    io.to(room).emit('update users', users[room]);
  });

  socket.on('leave room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    if (users[room]) {
      users[room] = users[room].filter(user => user !== username);
    }
    console.log(`User ${username} left room: ${room}`);
    io.to(room).emit('update users', users[room]);
  });

  socket.on('chat message', async ({ username, room, message }) => {
    const newMessage = new GroupMessage({ from_user: username, room, message });
    await newMessage.save();
    io.to(room).emit('chat message', { username, message });
  });

  socket.on('typing', ({ username, room }) => {
    socket.to(room).emit('typing', username);
  });

  socket.on('stop typing', ({ username, room }) => {
    socket.to(room).emit('stop typing', username);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Remove user from all rooms
    Object.keys(users).forEach(room => {
      users[room] = users[room].filter(user => user !== socket.username);
      io.to(room).emit('update users', users[room]);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));