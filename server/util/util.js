class Util{


    static generateUID(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static findFreePosition(room, radius) {
        const maxAttempts = 100; 
        let attempts = 0;
        while (attempts < maxAttempts) {
            const x = Math.random() * room.cols;
            const y = Math.random() * room.rows;
            if (Util.isPositionFree(x, y, radius, room)) {
                return { x, y }; 
            }
            attempts++;
        }
        return null;
    }

    static isPositionFree(x, y, radius, room) {
        for (const player of room.players) {
            for (const obj of player.objects) {
                const distance = Math.sqrt(Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2));
                if (distance < obj.mass) {
                    return false; 
                }
            }
        }
        return true;
    }

}

module.exports = Util;