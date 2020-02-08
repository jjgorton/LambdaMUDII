import React, { useEffect, useState, useRef } from 'react';
import NavBarLogout from '../Nav/NavBarLogout';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import axios from 'axios';

// import userContext from '';

import Graph from '../../utils/graph';
import Player from '../../utils/player';
import Auto from './Auto';

import Controls from './Controls';
import Display from './Display';

const graph = new Graph();
const player = new Player();

const Game = props => {
    const [curRoomId, setCurRoomId] = useState();
    const [prevRoom, setPrevRoom] = useState();
    // const [roomID, setRoomID] = useState();
    const [coolDown, setCoolDown] = useState(0);
    const [counter, setCounter] = useState(coolDown);
    const [flip, setFlip] = useState(false);
    const [travel, setTravel] = useState(false);
    const [direct, setDirect] = useState({});
    const [newRoom, setNewRoom] = useState({});
    const [first, setFirst] = useState(true);
    const [roomList, setRoomList] = useState({});

    let cd = 0;

    useEffect(() => {
        axios
            .get('http://localhost:5000/rooms')
            .then(res => {
                console.log(res.data);
                graph.rooms = res.data;
            })
            .catch(err => console.error(err));
    }, [first]);

    useEffect(() => {
        if (counter === 0) {
            axiosWithAuth()
                .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/')
                .then(res => {
                    console.log('RES.DATA(init):', res.data);
                    if (!graph.rooms[res.data.room_id]) {
                        graph.add_room(res.data);
                    }
                    // setNewRoom(res.data);
                    setCoolDown(res.data.cooldown);
                    player.coolDown = res.data.cooldown;
                    cd = res.data.cooldown;
                    setFlip(!flip);
                    setCurRoomId(res.data.room_id);
                    player.update_room(res.data.room_id);
                })
                .catch(err => {
                    console.log(err);
                });
            // });
        } else {
            // alert(`Cool Down has ${counter} more seconds to go`);
            console.error(`Cool Down has ${counter} more seconds to go`);
        }
    }, []);

    useEffect(() => {
        let time = coolDown + 1;
        const wait = setInterval(() => {
            if (time > 0) {
                time -= 1;
                setCounter(time);
            }
            if (time <= 0) {
                time = 0;
                setCounter(time);
                clearInterval(wait);
            }
        }, 1000);
    }, [flip]);

    async function MoveAPI(direct) {
        let data = {};
        await axiosWithAuth()
            .post(
                'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
                direct
            )
            .then(res => {
                console.log('RES.DATA(move):', res.data);
                if (res.data.errors.length > 0) {
                    alert(res.data.errors);
                } else {
                    // setPrevRoom(player.get_room_id());
                    // setNewRoom(res.data);
                    data = res.data;
                }
            })
            .catch(err => console.error(err.errors));
        return data;
    }

    //check if valid direction
    function validMove(direction) {
        console.log(
            `room: ${player.get_room_id()}\n
            exits: ${Object.keys(graph.rooms[player.get_room_id()].exits)}\n
            direction-key: ${direction}\n
            direction-value: ${
                graph.rooms[player.get_room_id()].exits[direction]
            }
        `
        );
        let doors = Object.keys(graph.rooms[player.get_room_id()].exits);
        if (!doors.includes(direction)) {
            alert(`Cannot move ${direction}!`);
            return false;
        } else {
            setDirect(direction);
            //Wise Explorer Bonus:
            const nextRoomId =
                graph.rooms[player.get_room_id()].exits[direction];
            const moveObj =
                nextRoomId >= 0
                    ? {
                          direction: direction,
                          next_room_id: `${nextRoomId}`
                      }
                    : { direction: direction };
            console.log('request obj:', moveObj);
            return moveObj;
        }
    }

    // useEffect(() => {
    //     if (newRoom.title) {
    //         console.log(newRoom);
    //         graph.add_room(newRoom);
    //         console.log('prev:', player.prev_room_id, 'cur:', newRoom.room_id);
    //         graph.add_connection(
    //             player.current_room_id,
    //             newRoom.room_id,
    //             direct
    //         );
    //         console.log('124', graph);
    //         setCoolDown(newRoom.cooldown);
    //         setFlip(!flip);
    //         console.log('COOLDOWN', newRoom.cooldown);
    //         setCurRoomId(newRoom.room_id);
    //         console.log('playerRoom', player.get_room_id());
    //         player.update_room(newRoom.room_id);
    //         console.log('after playerRoom', player.get_room_id());
    //     }
    // }, [newRoom]);

    const move = async direction => {
        //setup timer for cooldown
        if (counter === 0) {
            const directObj = validMove(direction);
            if (directObj) {
                const data = await MoveAPI(directObj);
                if (!graph.rooms[data.room_id]) {
                    graph.add_room(data);
                }
                graph.add_connection(
                    player.current_room_id,
                    data.room_id,
                    direction
                );
                setCoolDown(data.cooldown);
                player.coolDown = data.cooldown;
                cd = data.cooldown;
                setFlip(!flip);
                console.log('COOLDOWN', data.cooldown);
                setCurRoomId(data.room_id);
                console.log('playerRoom', player.get_room_id());
                player.update_room(data.room_id);
                console.log('after playerRoom', player.get_room_id());
                await axios
                    .post('http://localhost:5000/rooms', graph.rooms)
                    .then(res => console.log('saved'))
                    .catch(err => console.error(err));
                return data.cooldown;
            }
        } else {
            // alert(`Cool Down has ${counter} more seconds to go`);
            console.error(`Cool Down has ${counter} more seconds to go`);
        }
    };

    console.log(graph);

    const timer = seconds => {
        const start = Date.now();
        let time = start + seconds * 1000;
        let run = true;
        while (run) {
            // console.log(time - Date.now());
            if (time - Date.now() < 0) {
                run = false;
            }
        }
        return true;
    };

    const [running, setRunning] = useState(true);

    const automate = async () => {
        const traversal_path = [];
        const unexplored = [];
        unexplored.push(player.current_room_id);
        const visited = {};
        const path = [];
        let cd = coolDown;

        while (unexplored.length > 0 && running) {
            let room = unexplored[unexplored.length - 1];
            visited[room] = 'added';
            console.log(`\nvisited: ${Object.keys(visited).length} Rooms\n`);
            setRoomList(visited);
            let direction = graph.check_for_unexplored(player.get_room_id());
            console.log('direections', direction);
            console.log('Before move', player.get_room_id());
            if (direction) {
                console.log('IF passed!', cd);
                // await wait(coolDown);
                timer(cd);
                console.log('After wait()');
                cd = await move(direction[0]);
                traversal_path.push(direction[0]);
                path.push(direction[0]);
                console.log('AFTER move', player.get_room_id());
                visited[player.get_room_id()] = 'added';
            } else {
                console.log('ELSE:', direction, room, player.get_room_id());
                while (!graph.check_for_unexplored(player.get_room_id())) {
                    console.log('Else while');
                    if (path.length > 0) {
                        console.log('backtracking');
                        let backtrack = graph.reverse(path.pop());
                        // await wait(coolDown);
                        timer(cd);
                        cd = await move(backtrack);
                        traversal_path.push(backtrack);
                    } else {
                        console.log('BREAK');
                        break;
                    }
                }
            }
            if (!graph.check_for_unexplored(room)) {
                console.log('pop');
                unexplored.pop();
            }
            if (graph.check_for_unexplored(player.get_room_id())) {
                if (!unexplored.includes(player.get_room_id())) {
                    console.log('push');
                    unexplored.push(player.get_room_id());
                }
            }
        }
        console.log(`DONE!\n
                    visited: ${Object.keys(visited).length} Rooms\n
                    traversal path: ${traversal_path}
        `);

        return Object.keys(visited).length;
    };

    return (
        <>
            <NavBarLogout {...props} />
            <div className='display'>
                <Display
                    rooms={graph.rooms}
                    curRoomId={curRoomId}
                    player={player}
                />
            </div>
            <Controls
                move={move}
                coolDown={coolDown}
                rooms={graph.rooms}
                curRoomId={curRoomId}
                counter={counter}
                player={player}
            />

            {/* <Auto
                move={move}
                coolDown={cd}
                counter={counter}
                graph={graph}
                player={player}
                curRoomId={curRoomId}
            /> */}
            <div>
                <button onClick={() => automate()}>Automate</button>
                <button onClick={() => setRunning(false)}>Stop</button>
                <div>
                    Automated:{Object.keys(roomList).length} rooms visited.
                </div>
            </div>
        </>
    );
};

export default Game;
