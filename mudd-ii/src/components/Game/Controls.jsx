import React, { useEffect, useState } from 'react';

const Controls = ({ move, coolDown, rooms, curRoomId, counter }) => {
    // const [count, setCount] = useState();

    // useEffect(() => {
    //     console.log('useEffect fired!');
    //     let time = coolDown;
    //     const waitB = setInterval(() => {
    //         if (time > 0) {
    //             time -= 1;
    //             setCount(time);
    //         }
    //         if (time <= 0) {
    //             time = 0;
    //             setCount(time);
    //             clearInterval(waitB);
    //         }
    //     }, 1000);
    // }, [coolDown]);

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
                {rooms[curRoomId] && <p>Title: {rooms[curRoomId].title}</p>}
            </div>
        </div>
    );
};

export default Controls;
