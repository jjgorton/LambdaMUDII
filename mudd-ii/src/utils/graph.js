class Graph {
    constructor() {
        this.rooms = {};
    }

    add_room(room_id, exits) {
        this.rooms[room_id] = {};
        exits.forEach(direction => {
            this.rooms[room_id][direction] = -1;
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
        this.rooms[prev_room][direction] = cur_room;
        this.rooms[cur_room][this.reverse(direction)] = prev_room;
    }

    check_for_unexplored(room_id) {
        unexplored = [];
        for (let door in this.rooms[room_id]) {
            if (this.rooms[room_id][door] > 0) {
                unexplored.push(door);
            }
        }
        return unexplored.length > 0 ? unexplored : false;
    }
}
