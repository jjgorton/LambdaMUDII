import React from 'react';
import wizard from '../../assets/sorlosheet.png';
import stone from '../../assets/stonetile.jpg';

const Room = ({ room, player }) => {
    if (room.exits) {
        return (
            <div className='gridsquare'>
                <div className='top'>
                    <div
                        className={
                            room.exits.n + 2 ? 'north-door' : 'north-wall'
                        }
                    ></div>
                </div>

                <div className='middle'>
                    <div
                        className={room.exits.w + 2 ? 'west-door' : 'west-wall'}
                    ></div>
                    <div className={player ? 'room player' : 'room'}>
                        {room.room_id}
                    </div>
                    <div
                        className={room.exits.e + 2 ? 'east-door' : 'east-wall'}
                    ></div>
                </div>

                <div className='bottom'>
                    <div
                        className={
                            room.exits.s + 2 ? 'south-door' : 'south-wall'
                        }
                    ></div>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
};

export default Room;
