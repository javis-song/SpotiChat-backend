const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

let queue = [];
let connections = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
    socket.on('username', (msg) => {
        connections++;
        socket.username = msg;
        queue.push(msg);
        console.log(msg + "connects");
    })

    socket.emit('chat message', "xxx is in connectino with you!");
    socket.on('chat message', (msg) => {
        console.log(msg);
    });

    socket.on('disconnect', () => {
        console.log(socket.username + "disconnect");
    })
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});