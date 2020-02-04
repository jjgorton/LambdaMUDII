import React from 'react';
import Room from './Room';

const Display = ({ rooms, playerRoom }) => {

    const roomMap = (rooms, width) => {
        let grid = [];
        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                row.push(null);
            }
            grid.push(row);
        }

        rooms.forEach(room => {
            // let roomType = null;
            // if (room.s_to !== null && room.e_to !== null) roomType = room;
            // if (room.s_to !== null && room.e_to === null) roomType = room;
            // if (room.s_to === null && room.e_to !== null) roomType = room;

            try {
                grid[room.y][room.x] = room
            } catch {
                grid[room.pos_y][room.pos_x] = room;
            }
        });
        return grid.flat();
    };

    console.log('roomMap', roomMap(rooms, 20));
    console.log('****', rooms);
    return (
        <div className='gameboard'>
            {roomMap(rooms, 20).map(room => {
                // if (room.s_to !== null) {
                //     return (
                //         <>
                //             <div className='room'></div>
                //             <div className='south-door'></div>
                //         </>
                //     );
                // }
                // return <div className='room'></div>;

                if (room !== null) {
                    if (room.id == playerRoom) {
                        return <Room room={room} player={true} />
                    }
                    return <Room room={room} />;
                } else {
                    return <div className="blank"></div>
                }
            })}
        </div>
    );
};

export default Display;
