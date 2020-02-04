import React, { useEffect, useState } from 'react';
import NavBarLogout from '../Nav/NavBarLogout';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
// import axios from 'axios';
import Player from './Player';

// import userContext from '';

import Controls from './Controls';
import Display from './Display';

const Game = props => {
    const [rooms, setRooms] = useState([]);
    const [player, setPlayer] = useState({ room_id: 289 });
    const [playerRoom, setPlayerRoom] = useState(1);

    const movePlayer = direction => {
        axiosWithAuth()
            .post('https://team-miracle-deploy.herokuapp.com/api/adv/move', {
                direction
            })
            .then(res => {
                console.log('response', res.data);
                console.log('player position on state', playerRoom);
                console.log('update player position here');
                // setPlayer({
                //     ...player,
                //     room_id: res.data.room_id
                // });
                setPlayerRoom(res.data.room_id);
            })
            .catch(err => {
                console.log(err);
                // const current = rooms.find(room => {
                //     return room.id == player.room_id;
                // });
                // let newRoom;
                // switch (direction) {
                //     case 'n':
                //         newRoom = current.n_to;
                //         break;
                //     case 's':
                //         newRoom = current.s_to;
                //         break;
                //     case 'e':
                //         newRoom = current.e_to;
                //         break;
                //     case 'w':
                //         newRoom = current.w_to;
                //         break;
                //     default:
                //         console.log('NON-CARDINAL DIRECTION');
                // }
                // if (newRoom) {
                //     setPlayer({
                //         ...player,
                //         player_room_id: newRoom
                //     });
                // }
            });
    };

    // useEffect(() => {
    //     axiosWithAuth()
    //         .get('https://team-miracle-deploy.herokuapp.com/api/adv/rooms')
    //         .then(res => {
    //             setRooms(res.data.rooms);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }, []);

    useEffect(() => {
        console.log('second use effect');
        axiosWithAuth()
            .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/')
            .then(res => {
                // console.log('successful response');
                // setPlayer(res.data);
                // setPlayerRoom(res.data.room_id);
                console.log('HERE is response from INIT:', res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [playerRoom]);

    const sortedRooms = rooms.sort((a, b) => {
        return a.pos_x - b.pos_x;
    });

    console.log('sorted rooms:', sortedRooms);

    return (
        <>
            <NavBarLogout {...props} />
            {/* <h1>Game</h1> */}
            {/* <Player {...props} /> */}
            <div className='display'>
                <Display rooms={rooms} playerRoom={playerRoom} />
                <Controls move={movePlayer} />
            </div>
        </>
    );
};

// const Game = props => {
//     useEffect(() => {
//         effect;
//         return () => {
//             cleanup;
//         };
//     }, [input]);

//     return (
//         <>
//             <h2>Game</h2>
//             <Controls />
//             <Display />
//         </>
//     );
// };

export default Game;

// GET ROOMS

// move = {
//     direction: "n"
// }

// res = {
//     name,
//     title,
//     description,
//     otherplayers,
//     errmessg
// }
