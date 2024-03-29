const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const Room = require('./entity/room.js');
const Player = require('./entity/player.js');
const PlayerObject = require('./entity/playerobject.js');
const Util = require('./util/util.js');


var players = [];
var rooms = [];


io.on('connection', socket => {
    addPlayer(socket);
    
    socket.on('login', (login) => {
        getPlayerById(socket.id).name = login;
        socket.emit('login_success', getPlayerById(socket.id));
    });

    socket.on('join', (room) => {
        socket.join(room);
        let player = getPlayerById(socket.id);
        let position = Util.findFreePosition(getRoomById(room));
        if(position){
            player.objects.push(new PlayerObject(position.x,position.y,200));

            player.objects.push(new PlayerObject(position.x + 200,position.y + 300,200));
            getRoomById(room).players.push(player);
            socket.emit('join_success',player);
            socket.broadcast.to(room).emit('newplayer', player);
        }
    });

});

function addPlayer(socket){
    players.push(new Player(socket.id,Util.generateUID,''))
}
function getPlayerById(id){
    return players.find(player =>player.id === id);
}

function getRoomById(id){
    return rooms.find(room =>room.id === id);
}

function initRooms(){
    rooms.push(new Room('MILKWAY','Milk Way',30,6000,5000,5000));
    rooms.push(new Room('ROOM_2','ROOM 2',30,6000,5000,5000));
    rooms.push(new Room('ROOM_3','ROOM 3',30,6000,5000,5000));
    rooms.push(new Room('ROOM_4','ROOM 4',30,6000,5000,5000));
}
initRooms();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
