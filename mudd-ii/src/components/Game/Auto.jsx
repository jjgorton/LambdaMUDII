import React, { useState, useEffect } from 'react';

const Auto = ({ move, graph, curRoomId, player, counter }) => {
    const timer = seconds => {
        const start = Date.now();
        let time = start + seconds * 1000;
        let run = true;
        while (run) {
            console.log(time - Date.now());
            if (time - Date.now() < 0) {
                run = false;
            }
        }
        return true;
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
                console.log('IF passed!', counter);
                // await wait(coolDown);
                timer(counter);
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
                        // await wait(coolDown);
                        timer(counter);
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
            <div>Automated:{counter} rooms visited.</div>
        </div>
    );
};
export default Auto;
