import React, { useEffect, useState } from 'react';

// Object.keys(rooms[curRoomId].exits).map((key, i) => {
//     return (
//         <div key={i}>
//             key
//             rooms[curRoomId].exits.key
//     );
// }

const Controls = ({ move, coolDown, rooms, curRoomId, counter, player }) => {
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
                {/* pickup */}
                <button className='control-button'>P</button>
                {/* drop */}
                <button className='control-button'>D</button>
                {/* use */}
                <button className='control-button'>U</button>
            </div>
            <div className='info'>
                <p>Room ID: {curRoomId}</p>
                {rooms[curRoomId] && <p>Title: {rooms[curRoomId].title}</p>}
                {rooms[curRoomId] && (
                    <p>Description: {rooms[curRoomId].description}</p>
                )}
                {rooms[curRoomId] &&
                    Object.keys(rooms[curRoomId].exits).map((key, i) => {
                        return (
                            <div key={i}>
                                <p>{key}:</p>
                                <p>{rooms[curRoomId].exits.key}</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Controls;
