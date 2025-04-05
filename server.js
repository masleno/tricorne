const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let waitingUsers = [];

io.on('connection', (socket) => {
    waitingUsers.push(socket);

    if (waitingUsers.length >= 3) {
        const group = waitingUsers.splice(0, 3);
        group.forEach(s => s.emit('chat-ready', 3));
        group.forEach(s => s.join('chat-room'));
    } else if (waitingUsers.length === 2) {
        waitingUsers.forEach(s => s.emit('chat-ready', 2));
        waitingUsers.forEach(s => s.join('chat-room'));
    }

    socket.on('message', (msg) => {
        io.to('chat-room').emit('message', msg);
    });

    socket.on('disconnect', () => {
        waitingUsers = waitingUsers.filter(s => s !== socket);
    });
});

server.listen(3000, () => console.log('Сервер запущен на порту 3000'));
