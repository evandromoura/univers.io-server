class Room{

    constructor(id,name,maxPlayers,baseSpeed,cols,rows){
        this.id = id;
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.baseSpeed = baseSpeed;
        this.players = [];
        this.cols = cols;
        this.rows = rows;
    }
}

module.exports = Room;