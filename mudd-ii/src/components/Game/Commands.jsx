import React, { useState } from 'react';
import { take_item, drop_item } from '../../utils/commandsAPI';

const Commands = ({ move, coolDown, timer, player, graph }) => {
    const [item, setItem] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setItem(e.target.value);
    };

    async function findItem(item) {
        const cur_room = player.get_room_id();
        console.log('MoveTo 12', cur_room);
        const directions = graph.search_items(cur_room, item);
        let cd = coolDown;

        while (directions.length > 0) {
            timer(cd);
            cd = await move(directions.shift());
            console.log('MoveTo 19 - cur_room', player.get_room_id());
        }
        console.log('Done finding');
    }

    return (
        <div className='commands'>
            <div>
                <input name='item' value={item} onChange={handleChange} />
            </div>
            <div className='buttons'>
                <button onClick={() => findItem(item)}>Find</button>
                <button onClick={() => take_item(item)}>Take</button>
                <button onClick={() => drop_item(item)}>Drop</button>
            </div>
            <div className='message'>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Commands;
