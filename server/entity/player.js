class Player{

    constructor(id,uid){
        this.id = id;
        this.uid = uid;
        this.name = '';
        this.objects = [];
        this.activeroom = '';
    }
}

module.exports = Player;