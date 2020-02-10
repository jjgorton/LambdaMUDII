import React, { useEffect, useState } from 'react';

// Object.keys(rooms[curRoomId].exits).map((key, i) => {
//     return (
//         <div key={i}>
//             key
//             rooms[curRoomId].exits.key
//     );
// }

const Controls = ({
    move,
    coolDown,
    rooms,
    curRoomId,
    counter,
    player,
    message
}) => {
    // rooms[curRoomId] && console.log('CURROOM EXITS:', rooms[curRoomId].exits);

    return (
        <div className='side'>
            <div className='control-panel'>
                <div className='directions'>
                    <div className='up'>
                        <button
                            className='control-button'
                            onClick={() => move('n')}
                        >
                            N
                        </button>
                    </div>
                    <button
                        className='control-button'
                        onClick={() => move('w')}
                    >
                        W
                    </button>
                    <div className='spacer'>{counter}sec.</div>
                    <button
                        className='control-button'
                        onClick={() => move('e')}
                    >
                        E
                    </button>
                    <div className='down'>
                        <button
                            className='control-button'
                            onClick={() => move('s')}
                        >
                            S
                        </button>
                    </div>
                </div>
            </div>
            <div className='info'>
                <p>Room ID: {curRoomId}</p>
                {rooms[curRoomId] && <p>Title: {rooms[curRoomId].title}</p>}
                {rooms[curRoomId] && (
                    <p>Description: {rooms[curRoomId].description}</p>
                )}
                {rooms[curRoomId] &&
                    Object.keys(rooms[curRoomId].exits).map((door, i) => {
                        return (
                            <div key={i}>
                                <p>
                                    {door}: {rooms[curRoomId].exits[door]}
                                </p>
                            </div>
                        );
                    })}
                {rooms[curRoomId] &&
                    rooms[curRoomId].items.map((item, i) => {
                        return (
                            <ul key={i}>
                                <li>{item}</li>
                            </ul>
                        );
                    })}
            </div>
            <div className='message'>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Controls;
