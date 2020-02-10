class Player {
    constructor() {
        this.current_room_id = null;
        this.prev_room_id = null;
        this.coolDown = 0;
    }

    update_room(room_id) {
        this.prev_room_id = this.current_room_id;
        this.current_room_id = room_id;
        console.log(
            'UPDATED PLAYERS ROOM',
            this.current_room_id,
            this.prev_room_id
        );
    }

    get_room_id() {
        return this.current_room_id;
    }
}

export default Player;
