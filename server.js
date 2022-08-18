const express = require('express');
const path = require('path');
const socket = require('socket.io');

const tasks = [];

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (removedTodoId) => {
    const removedTodo = todos.findIndex((todo) => todo.id === removedTodoId);
    tasks.splice(tasks.indexOf(removedTodo), 1);
    socket.broadcast.emit('removeTask', removedTodoId);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
