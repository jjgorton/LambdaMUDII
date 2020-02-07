import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        axios
            .get('http://localhost:5000/rooms')
            .then(res => {
                console.log(res.data);
                graph.rooms = res.data;
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (counter === 0) {
            axiosWithAuth()
                .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/')
                .then(res => {
                    console.log('RES.DATA(init):', res.data);
                    graph.add_room(res.data);
                    // setNewRoom(res.data);
                    setCoolDown(res.data.cooldown);
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

    function MoveAPI(direct) {
        axiosWithAuth()
            .post(
                'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
                direct
            )
            .then(res => {
                console.log('RES.DATA(move):', res.data);
                if (res.data.errors.length > 0) {
                    alert(res.data.errors);
                } else {
                    setPrevRoom(player.get_room_id());
                    setNewRoom(res.data);
                }
            })
            .catch(err => console.error(err));
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

    useEffect(() => {
        if (newRoom.title) {
            console.log(newRoom);
            graph.add_room(newRoom);
            console.log('prev:', player.prev_room_id, 'cur:', newRoom.room_id);
            graph.add_connection(
                player.current_room_id,
                newRoom.room_id,
                direct
            );
            console.log('124', graph);
            setCoolDown(newRoom.cooldown);
            setFlip(!flip);
            console.log('COOLDOWN', newRoom.cooldown);
            setCurRoomId(newRoom.room_id);
            console.log('playerRoom', player.get_room_id());
            player.update_room(newRoom.room_id);
            console.log('after playerRoom', player.get_room_id());
        }
    }, [newRoom]);

    const move = direction => {
        //setup timer for cooldown
        if (counter === 0) {
            const directObj = validMove(direction);
            if (directObj) MoveAPI(directObj);
            // graph.add_room(newRoom);
            // graph.add_connection(
            //     player.current_room_id,
            //     newRoom.room_id,
            //     direction
            // );
            // console.log('124', graph);
            // setCoolDown(newRoom.cooldown);
            // setFlip(!flip);
            // console.log('COOLDOWN', newRoom.cooldown);
            // setCurRoomId(newRoom.room_id);
            // console.log('playerRoom', player.get_room_id());
            // player.update_room(newRoom.room_id);
            // console.log('after playerRoom', player.get_room_id());
            axios
                .post('http://localhost:5000/rooms', graph.rooms)
                .then(res => console.log('saved'))
                .catch(err => console.error(err));
        } else {
            // alert(`Cool Down has ${counter} more seconds to go`);
            console.error(`Cool Down has ${counter} more seconds to go`);
        }
    };

    console.log(graph);

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

            <Auto
                move={move}
                coolDown={coolDown}
                counter={counter}
                graph={graph}
                player={player}
                curRoomId={curRoomId}
            />
        </>
    );
};

export default Game;
