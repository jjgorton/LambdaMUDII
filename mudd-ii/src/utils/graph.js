class Graph {
    constructor() {
        this.rooms = {};
    }

    // {
    //     room_id,
    //     exits,
    //     title,
    //     description,
    //     coordinates,
    //     elevation,
    //     terrain,
    //     items
    // }
    add_room(room) {
        this.rooms[room.room_id] = {
            room_id: room.room_id,
            title: room.title,
            description: room.description,
            coordinates: room.coordinates,
            elevation: room.elevation,
            terrain: room.terrain,
            items: room.items,
            exits: {}
        };
        room.exits.forEach(direction => {
            this.rooms[room.room_id].exits[direction] = -1;
        });
    }

    reverse(direction) {
        if (direction === 'n') {
            return 's';
        }
        if (direction === 's') {
            return 'n';
        }
        if (direction === 'e') {
            return 'w';
        }
        if (direction === 'w') {
            return 'e';
        } else {
            console.log('not a valid direction');
        }
    }

    add_connection(prev_room, cur_room, direction) {
        this.rooms[prev_room].exits[direction] = cur_room;
        this.rooms[cur_room].exits[this.reverse(direction)] = prev_room;
    }

    check_for_unexplored(room_id) {
        const unexplored = [];
        for (let door in this.rooms[room_id].exits) {
            if (this.rooms[room_id].exits[door] < 0) {
                unexplored.push(door);
            }
        }
        return unexplored.length > 0 ? unexplored : false;
    }
}

export default Graph;
