const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let waitingUsers = [];
let userCounter = 0; // Для присвоения номера участника

io.on('connection', (socket) => {
    userCounter++;
    socket.userId = userCounter; // Присваиваем уникальный номер участника
    waitingUsers.push(socket);

    if (waitingUsers.length >= 3) {
        const group = waitingUsers.splice(0, 3);
        group.forEach((s, index) => {
            s.groupIndex = index + 1; // Присваиваем индекс в группе (1, 2 или 3)
            s.emit('chat-ready', { users: 3, userIndex: s.groupIndex });
            s.join('chat-room');
        });
    } else if (waitingUsers.length === 2) {
        waitingUsers.forEach((s, index) => {
            s.groupIndex = index + 1;
            s.emit('chat-ready', { users: 2, userIndex: s.groupIndex });
            s.join('chat-room');
        });
    }

    socket.on('message', (msg) => {
        io.to('chat-room').emit('message', { text: msg, sender: socket.groupIndex });
    });

    socket.on('disconnect', () => {
        waitingUsers = waitingUsers.filter(s => s !== socket);
        userCounter--;
    });
});

server.listen(3000, '127.0.0.1', () => console.log('Сервер запущен на порту 3000'));
