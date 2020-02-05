import React from 'react';
import wizard from '../../assets/sorlosheet.png';
import stone from '../../assets/stonetile.jpg';

const Room = ({ room, player }) => {
    return (
        <div className='gridsquare'>
            {/* <div className={player ? 'player' : 'room'}>
                <img src={wizard} />
            </div> */}

            <div className='top'>
                <div className={room.n ? 'north-door' : 'north-wall'}></div>
            </div>

            <div className='middle'>
                <div className={room.w ? 'west-door' : 'west-wall'}></div>
                <div className={player ? 'room player' : 'room'}></div>
                <div className={room.e ? 'east-door' : 'east-wall'}></div>
            </div>

            <div className='bottom'>
                <div className={room.s + 2 ? 'south-door' : 'south-wall'}></div>
            </div>
            {/* <img src={stone} /> */}
        </div>
    );
};

export default Room;
