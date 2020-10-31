const PORT = 8000;
const INDEX = '/index.html';

const express = require('express');
const socketIO = require('socket.io');

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);

let waiting = [];
let mapping = {};
const match = () => {
    if (waiting.length < 2) {
        return;
    }
    let o1 = waiting.pop();
    let o2 = waiting.pop();
    mapping[o1.id] = o2;
    mapping[o2.id] = o1;
    o1.socket.emit('message', {
        text: o2.username + " is in the room!",
        member: {
            self: false,
        }
    })
    o2.socket.emit('track', o1.track);
    o2.socket.emit('message', {
        text: o1.username + " is in the room!",
        member: {
            self: false,
        }
    })
}

io.on('connection', (socket) => {
    socket.on('username', msg => {
        const {username, track} = msg;
        socket.username = username;
        waiting.push({
            id: socket.id, 
            username: username, 
            track: track, 
            socket: socket
        });
        match(socket);
        console.log(socket.username + " connects");
    })
    socket.on('message', (message) => {
        if (mapping[socket.id] !== undefined) {
            let other = mapping[socket.id];
            socket.to(other.id).emit('message', message);
        }
    })
    socket.on('disconnect', () => {
        console.log(socket.username + ' disconnects');
        let other = mapping[socket.id];
        if (other === undefined) {
            waiting = waiting.filter(item => item.id !== socket.id);
        } else {
            socket.to(other.id).emit('message', {text: socket.username + " left", member: {self: false}});
            delete mapping[socket.id];
            delete mapping[other.id];
            waiting.push(other);
        }
        match();
    });
});
