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
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,450));
            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,120));
            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,300));

            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,100));
            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,100));
            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,100));
            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,100));
            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,100));
            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,100));

            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,180));

            position = Util.findFreePosition(getRoomById(room));
            player.objects.push(new PlayerObject(Util.generateUID(),position.x,position.y,250));
            
            player.activeroom = room;
            getRoomById(room).players.push(player);
            socket.emit('join_success',player);
            socket.emit('loadplayers',getRoomById(room).players);
            socket.broadcast.to(room).emit('newplayer', player);
        }
    });

    socket.on('updatePosition', (room,player) => {
        let playerM = getPlayerRoom(room,socket.id);
        if(playerM && player){
            let objectsP = player.objects;
            for(let obj of objectsP){
                let objM = playerM.objects.find(objI =>objI.id === obj.id);
                if(objM){
                    objM.x = obj.x;
                    objM.y = obj.y;
                }
            }
            socket.broadcast.to(room).emit('updatepositionplayer',playerM);
        }
    });

    socket.on('disconnect',()=>{
        try{
            let player = getPlayerById(socket.id);
            let indexPlayerMain = getIndexPlayerById(socket.id);
            console.log('Disconnect',socket.id);
            let playerRoom = getPlayerRoom(player.activeroom,socket.id);
            if(playerRoom){
                let indexPlayer = getRoomById(player.activeroom).players.findIndex(play => play.id === socket.id);
                let playersRoom = getRoomById(player.activeroom).players;
                if(indexPlayer !== -1 && playersRoom){
                    playersRoom.splice(indexPlayer);
                    players.splice(indexPlayerMain);
                    socket.broadcast.to(player.activeroom).emit('disconnectplayer', socket.id);
                }
            }
        }catch(e){
            console.log(e);
        }
    })

});

function addPlayer(socket){
    players.push(new Player(socket.id,Util.generateUID,''))
}
function getPlayerById(id){
    return players.find(player =>player.id === id);
}

function getIndexPlayerById(id){
    return players.findIndex(player =>player.id === id);
}

function getRoomById(id){
    let roomById = rooms.find(room =>room.id === id);
    return roomById;
}

function getPlayerRoom(room, id){
    let roomObj = getRoomById(room);
    if(roomObj && roomObj.players){
        return roomObj.players.find(obj=>obj.id === id);
    }
}

function getIndexPlayerRoom(room, id){
    return getRoomById(room).players.findIndex(obj=>obj.id === id);
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
