class Graph {
    constructor() {
        this.rooms = {};
    }

    add_room({
        room_id,
        exits,
        title,
        description,
        coordinates,
        elevation,
        terrain,
        items
    }) {
        this.rooms[room_id] = {
            room_id: room_id,
            title: title,
            description: description,
            coordinates: coordinates,
            elevation: elevation,
            terrain: terrain,
            items: items,
            exits: {}
        };
        exits.forEach(direction => {
            if (!this.rooms[room_id].exits[direction]) {
                this.rooms[room_id].exits[direction] = -1;
            }
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
