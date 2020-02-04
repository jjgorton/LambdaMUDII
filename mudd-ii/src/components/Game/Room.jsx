import React from 'react';
import wizard from '../../assets/sorlosheet.png';
import stone from '../../assets/stonetile.jpg';

const Room = ({ room, player }) => {
    return (
        <div className='gridsquare'>
            <div className={player ? 'player' : 'room'}>
                <img src={wizard} />
            </div>
            {/* {room.e_to ? <div className='east-door'></div> : null}
            {room.s_to ? <div className='south-door'></div> : null} */}
            <img src={stone} />
        </div>
    );
};

export default Room;
