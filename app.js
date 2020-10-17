const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
    io.emit('chat message', "hello");
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log(msg);
    });
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});