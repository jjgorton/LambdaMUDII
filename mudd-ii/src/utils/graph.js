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

    add_all_unexplored() {
        const unexplored = [];
        for (let room in this.rooms) {
            for (let door in this.rooms[room].exits) {
                if (this.rooms[room].exits[door] === -1) {
                    unexplored.push(room);
                    break;
                }
            }
        }
        return unexplored;
    }

    bfs(start_id, target_id) {
        const q = [];
        q.push([start_id]);
        const visited = {};

        // console.log('BFS called');
        while (q.length > 0) {
            let path = q.shift();
            // console.log('while', path);
            let room = path[path.length - 1];

            if (!visited[room]) {
                // console.log('if', room);
                if (room === target_id) {
                    //Do the Thing!
                    console.log('done');
                    return this.path_to_directions(path);
                }
                visited[room] = path;

                for (let door in this.rooms[room].exits) {
                    const new_path = [...path];
                    // console.log(
                    //     'included',
                    //     !new_path.includes([this.rooms[room].exits[door]]),
                    //     this.rooms[room].exits[door]
                    // );
                    if (!new_path.includes([this.rooms[room].exits[door]])) {
                        new_path.push(this.rooms[room].exits[door]);
                    }
                    q.push(new_path);
                }
            }
        }
    }

    path_to_directions(path_arr) {
        const directions = [];

        for (let i = 0; i < path_arr.length - 1; i++) {
            let room = path_arr[i];
            let next = path_arr[i + 1];
            let doors = this.rooms[room].exits;
            for (let door in doors) {
                if (doors[door] === next) {
                    directions.push(door);
                }
            }
        }
        console.log('graph 115 directionsArr', directions);
        return directions;
    }

    search_items(cur_room, item) {
        const q = [];
        q.push([cur_room]);
        const visited = {};

        while (q.length > 0) {
            let path = q.shift();
            let room = path[path.length - 1];

            if (!visited[room]) {
                if (this.rooms[room].items.includes(item)) {
                    //Do the Thing!
                    return this.path_to_directions(path);
                }
                visited[room] = path;

                for (let door in this.rooms[room].exits) {
                    const new_path = [...path];
                    new_path.push(this.rooms[room].exits[door]);
                    q.push(new_path);
                }
            }
        }
    }
}

export default Graph;
