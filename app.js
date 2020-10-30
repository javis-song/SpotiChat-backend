const PORT = 3000;
const INDEX = '/index.html';

const express = require('express');
const socketIO = require('socket.io');

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);
// const app = require('express')();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
// const path = require('path');

io.on('connection', (socket) => {
    console.log('connect');
    socket.on('message', (message) => {
        console.log(message);
        socket.emit('message', message);
    })
    socket.on('disconnect', () => {
        console.log('disconnect');
    });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
// let queue = [];
// let number = 0;
// let pair = new Map();

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

// const match = () => {
//     if (queue.length < 2) return false;
//     let socket1 = queue.pop();
//     let socket2 = queue.pop();
//     pair.set(socket1.username, socket2);
//     pair.set(socket2.username, socket1);
//     // register socket listening
//     socket1.on('chat message', (msg) => {
//         console.log(msg);
//         if (!pair.has(socket1.username)) return;
//         socket2.emit("chat message", {
//             username: socket1.username,
//             msg: msg.msg,
//         });
//     });
//     socket2.on('chat message', (msg) => {
//         console.log(msg);
//         if (!pair.has(socket2.username)) return;
//         socket1.emit("chat message", {
//             username: socket2.username,
//             msg: msg.msg,
//         });
//     });
//     socket1.emit('chat message', {
//         username: socket2.username,
//         msg: socket2.username + " is in the room",
//     });
//     socket2.emit('chat message', {
//         username: socket1.username,
//         msg: socket1.username + " is in the room",
//     });
//     // disconnect handler
//     socket1.on('disconnect', () => {
//         console.log(socket1.username + " has disconnected");
//         if (!pair.has(socket1.username)) return;
//         pair.delete(socket1.username);
//         pair.delete(socket2.username);
//     })
//     socket2.on('disconnect', () => {
//         console.log(socket2.username + " has disconnected");
//         if (!pair.has(socket2.username)) return;
//         pair.delete(socket1.username);
//         pair.delete(socket2.username);
//     })
//     return true;
// }

// io.on('connection', (socket) => {
//     socket.on('username', (username) => {
//         number++;
//         socket.username = username;
//         queue.push(socket);
//         console.log(username + "connects");
//         socket.emit('chat message', {
//             username: "admin",
//             msg: "Welcome to the chat room!"
//         });
//         match();
//         console.log(queue.length);
//     })
// });

// http.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
// });