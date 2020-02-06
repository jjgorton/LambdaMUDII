import React, { useState, useEffect } from 'react';

const Auto = ({ move, coolDown, graph, curRoomId, player }) => {
    // const [roomID, setRoomID] = useState();
    let roomID = curRoomId;

    useEffect(() => {
        // setRoomID(curRoomId);
        console.log('roomID', roomID);
        console.log('inside EFECT', curRoomId);
    }, [curRoomId]);

    const wait = seconds => {
        let makeMS = seconds * 1000;
        return new Promise((res, rej) => setTimeout(res, makeMS));
    };

    const automate = async () => {
        const traversal_path = [];
        const unexplored = [];
        unexplored.push(player.current_room_id);
        const visited = {};
        const path = [];

        while (unexplored.length > 0) {
            let room = unexplored[unexplored.length - 1];
            visited[room] = 'added';
            console.log(visited);

            let direction = graph.check_for_unexplored(room);
            console.log('direections', direction);
            console.log('Before move', player.get_room_id());
            if (direction && room === player.get_room_id()) {
                console.log('IF passed!', coolDown);
                await wait(coolDown);
                console.log('After wait()');
                await move(direction[0]);
                traversal_path.push(direction[0]);
                path.push(direction[0]);
                console.log('AFTER move', player.get_room_id());
                visited[player.get_room_id()] = 'added';
            } else {
                console.log('ELSE:', direction, room, player.get_room_id());
                while (!graph.check_for_unexplored(player.get_room_id())) {
                    if (path.length > 0) {
                        let backtrack = graph.reverse(path.pop());
                        await wait(coolDown);
                        await move(backtrack);
                        traversal_path.push(backtrack);
                    } else {
                        console.log('BREAK');
                        break;
                    }
                }
            }
            if (!graph.check_for_unexplored(room)) {
                unexplored.pop();
            }
            if (graph.check_for_unexplored(player.get_room_id())) {
                if (!unexplored.includes(player.get_room_id())) {
                    unexplored.push(player.get_room_id());
                }
            }
        }

        return Object.keys(visited).length;
    };

    return (
        <div>
            <button onClick={() => automate()}>Automate</button>
            <div>Automated: rooms visited.</div>
        </div>
    );
};
export default Auto;
