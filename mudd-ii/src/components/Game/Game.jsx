import React, { useEffect, useState } from 'react';
import NavBarLogout from '../Nav/NavBarLogout';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import axios from 'axios';
import Player from './Player';

// import userContext from '';

import Graph from '../../utils/graph';
// import { automate } from '../../utils/automate';

import Controls from './Controls';
import Display from './Display';

const graph = new Graph();

const Game = props => {
    const [curRoomId, setCurRoomId] = useState();
    const [coolDown, setCoolDown] = useState(0);
    const [counter, setCounter] = useState(coolDown);

    useEffect(() => {
        axios
            .get('http://localhost:5000/rooms')
            .then(res => {
                console.log(res.data);
                graph.rooms = res.data;
            })
            .catch(err => console.error(err));
    }, []);

    // useEffect(() => {
    //     let time = coolDown + 1;
    //     const wait = setInterval(() => {
    //         if (time > 0) {
    //             time -= 1;
    //             setCount(time);
    //         }
    //         if (time <= 0) {
    //             time = 0;
    //             setCount(time);
    //             clearInterval(wait);
    //         }
    //     }, 1000);
    // }, [coolDown]);

    const timer = seconds => {
        console.log('timer called!!!');
        const waitA = setInterval(() => {
            let time = seconds;
            if (time > 0) {
                time -= 1;
                setCounter(time);
                console.log('cd', time);
            }
            if (time <= 0) {
                setCounter(0);
                // return true;
                clearInterval(waitA);
            }
        }, 1000);
    };

    const wait = seconds => {
        let makeMS = seconds * 1000;
        return new Promise((res, rej) => setTimeout(res, makeMS));
    };

    const move = direction => {
        //check if valid direction
        if (!graph.rooms[curRoomId][direction]) {
            alert('Cannot move in that direction!');
        } else {
            //setup timer for cooldown
            // wait(coolDown).then(() => {
            if (counter === 0) {
                //Wise Explorer Bonus:
                const nextRoomId = graph.rooms[curRoomId][direction];
                const moveObj =
                    nextRoomId >= 0
                        ? {
                              direction: direction,
                              next_room_id: `${nextRoomId}`
                          }
                        : { direction: direction };
                console.log('request obj:', moveObj);
                axiosWithAuth()
                    .post(
                        'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
                        moveObj
                    )
                    .then(res => {
                        console.log('RES.DATA(move):', res.data);
                        if (res.data.errors.length > 0) {
                            alert(res.data.errors);
                        } else {
                            graph.add_room(res.data);
                            graph.add_connection(
                                curRoomId,
                                res.data.room_id,
                                direction
                            );
                            setCoolDown(res.data.cooldown);
                            console.log(res.data.cooldown);
                            // setStartTime(Date.now());
                            timer(res.data.coolDown);
                            setCurRoomId(res.data.room_id);

                            axios
                                .post(
                                    'http://localhost:5000/rooms',
                                    graph.rooms
                                )
                                .then(res => console.log('saved'))
                                .catch(err => console.error(err));
                        }
                    })
                    .catch(err => {
                        console.log(err.message);
                    });
                // });
            } else {
                alert(`Cool Down has ${counter} more seconds to go`);
                console.error(`Cool Down has ${counter} more seconds to go`);
            }
        }
    };

    useEffect(() => {
        // wait(coolDown).then(() => {
        if (counter === 0) {
            axiosWithAuth()
                .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/')
                .then(res => {
                    console.log('RES.DATA(init):', res.data);
                    graph.add_room(res.data);
                    setCoolDown(res.data.cooldown);
                    // setStartTime(Date.now());
                    // timer(res.data.coolDown);
                    setCurRoomId(res.data.room_id);
                })
                .catch(err => {
                    console.log(err);
                });
            // });
        } else {
            alert(`Cool Down has ${counter} more seconds to go`);
            console.error(`Cool Down has ${counter} more seconds to go`);
        }
    }, []);
    console.log(graph);
    // setInterval(() => console.log(coolDown), 2000);

    const automate = () => {
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

        return Object.keys(visited).length;
    };

    return (
        <>
            <NavBarLogout {...props} />
            {/* <h1>Game</h1> */}
            {/* <Player {...props} /> */}
            <div className='display'>
                <Display rooms={graph.rooms} curRoomId={curRoomId} />
            </div>
            <Controls
                move={move}
                coolDown={coolDown}
                rooms={graph.rooms}
                curRoomId={curRoomId}
            />
            <div>Automate:{automate()} rooms visited.</div>
            {/* <automate
                move={move}
                coolDown={coolDown}
                graph={graph}
                curRoomId={curRoomId}
            /> */}
        </>
    );
};

export default Game;
