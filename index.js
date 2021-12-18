const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const socket = require('socket.io');

const io = socket(server, {
    cors :{
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

// require('dotenv').config({path: './config/.env'});

console.log(path.join(__dirname, 'reactapp', 'build', 'index.html'));

app.use('/index', express.static(path.join(__dirname, 'reactapp', 'build', 'index.html')));

io.on('connect', (socket) => {

    console.log('we rule');

    socket.emit("me", socket.id);

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', (data)=>{
        io.to(data.userToCall).emit("callUser", {signal: data.signal, from: data.from, name: data.name});
    });

    socket.on("answerCall", (data)=>{
        io.to(data.to).emit("callAccepted", data.signal)
    });

    socket.on("leaveCall", (data)=>{
        io.to(data.to).emit("leaveCall", data.signal)
    });
});



const PORT = 5000 || process.env.PORT

server.listen(PORT, ()=>{
    console.log('server running on port '+PORT);
})

