import React from 'react';

export const automate = ({ move, coolDown, graph, curRoomId }) => {
    const wait = seconds => {
        let makeMS = seconds * 1000;
        return new Promise((res, rej) => setTimeout(res, makeMS));
    };

    const traversal_path = [];
    const unexplored = [];
    unexplored.push(curRoomId);
    const visited = {};
    const path = [];

    while (unexplored.length > 0) {
        let room = unexplored[unexplored.length - 1];
        visited[room] = 'added';

        let direction = graph.check_for_unexplored(room);
        if (direction && room === curRoomId) {
            wait(coolDown).then(() => {
                move(direction[0]);
                traversal_path.push(direction[0]);
                path.push(direction[0]);

                visited[curRoomId] = 'added';
            });
        } else {
            while (!graph.check_for_unexplored(curRoomId)) {
                if (path.length > 0) {
                    let backtrack = graph.reverse(path.pop());
                    wait(coolDown).then(() => {
                        move(backtrack);
                        traversal_path.push(backtrack);
                    });
                } else {
                    break;
                }
            }
        }
        if (!graph.check_for_unexplored(room)) {
            if (!unexplored.includes(curRoomId)) {
                unexplored.push(curRoomId);
            }
        }
    }

    return <div>{Object.keys(visited).length}</div>;
};
