const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: '*' } // allow requests from anywhere
});

app.use(express.static('public')); // 'public' folder contains your HTML/JS/CSS

const users = {};

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('sendLocation', data => {
        users[socket.id] = data;
        io.emit('receiveLocations', users); // send all users to everyone
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('receiveLocations', users);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
