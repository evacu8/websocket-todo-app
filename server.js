const express = require('express');
const cors = require('cors');
const app = express();
const { Server } = require('socket.io');

let tasks = [
  { id: '1', name: 'Do the dishes' },
  { id: '2', name: 'Fix the tap' },
  { id: '3', name: 'Buy a bike' },
];

const server = app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected with ID:', socket.id);
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    socket.broadcast.emit('removeTask', taskId);
  });
});
