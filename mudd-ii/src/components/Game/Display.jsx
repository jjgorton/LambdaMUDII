import React from 'react';
import Room from './Room';

const Display = ({ rooms, curRoomId }) => {
    const roomMap = (rooms, width) => {
        let grid = [];
        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                row.push(null);
            }
            grid.push(row);
        }

        for (let i in rooms) {
            let loc = rooms[i].coordinates
                .split('(')[1]
                .split(')')[0]
                .split(',');
            const x = parseInt(loc[0]);
            const y = parseInt(loc[1]);
            // console.log('x:', x, 'y:', y);

            grid[y][x] = rooms[i];
        }
        return grid.reverse().flat();
    };

    // console.log('roomMap', roomMap(rooms, 100));
    // console.log('****', rooms);
    return (
        <div className='gameboard'>
            {roomMap(rooms, 100).map((room, i) => {
                if (room !== null) {
                    if (room.room_id == curRoomId) {
                        return <Room room={room} player={true} />;
                    }
                    return <Room room={room} />;
                } else {
                    return (
                        <div key={i} className='blank'>
                            {i}
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default Display;
