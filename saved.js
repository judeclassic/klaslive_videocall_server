const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);

const socket = require('socket.io');

const io = socket(server, {
    cors :{
        //origin: 'https://klaslive.herokuapp.com',
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.get('/test', (req, res)=>{
    res.json("working");
});

// app.get('/connect/:id', (req, res) => {
//     console.log(req.params);
//     res.json(req.params);
// })

io.on('connect', (socket) => {

    console.log('we rule');

    socket.emit("me", socket.id);

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('callEnded');
    });

    socket.on('enterClass', (data)=>{
        io.to(data.userToCall).emit("enterClass", {signal: data.signal, from: data.from, name: data.name});
    });

    socket.on("answerCall", (data)=>{
        io.to(data.to).emit("callAccepted", data.signal)
    });

    socket.on("leaveCall", (data)=>{
        io.to(data.to).emit("leaveCall", data.signal)
    });
});



const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
    console.log('server running on port '+PORT);
})

