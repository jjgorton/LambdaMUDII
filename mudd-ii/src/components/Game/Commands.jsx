import React, { useState, useEffect } from 'react';
import {
    take_item,
    drop_item,
    getStatus,
    sellOffer,
    confirmSale,
    examine,
    wear,
    change_name,
    pray,
    lastProof,
    validProof,
    proofOfWork,
    submitProof
} from '../../utils/commandsAPI';
import { axiosWithAuth } from '../../utils/axiosWithAuth';

const Commands = ({ move, coolDown, timer, player, graph, counter }) => {
    const [item, setItem] = useState('');
    const [message, setMessage] = useState('');
    const [check, setCheck] = useState(false);
    const [status, setStatus] = useState({
        encumbrance: 0,
        strength: 0,
        speed: 0,
        gold: 0,
        bodywear: '',
        footwear: '',
        inventory: [],
        messages: ''
    });

    useEffect(() => {
        if (counter === 0) {
            axiosWithAuth()
                .post(
                    'https://lambda-treasure-hunt.herokuapp.com/api/adv/status/'
                )
                .then(res => {
                    console.log('STATUS', res.data);
                    setStatus({
                        encumbrance: res.data.encumbrance,
                        strength: res.data.strength,
                        speed: res.data.speed,
                        gold: res.data.gold,
                        bodywear: res.data.bodywear,
                        footwear: res.data.footwear,
                        inventory: res.data.inventory,
                        messages: res.data.messages
                    });
                })
                .catch(err => console.error(err));
        } else {
            // alert(`Cool Down has ${counter} more seconds to go`);
            console.error(`Cool Down has ${counter} more seconds to go`);
        }
    }, [check]);

    const handleChange = e => {
        setItem(e.target.value);
    };

    async function findItem(item) {
        const cur_room = player.get_room_id();
        console.log('MoveTo 44', cur_room);
        const directions = graph.search_items(cur_room, item);
        let cd = coolDown;

        while (directions.length > 0) {
            timer(cd);
            cd = await move(directions.shift());
            console.log('MoveTo 51 - cur_room', player.get_room_id());
        }
        console.log('Done finding');
    }

    async function gotTo(room_id) {
        const cur_room = player.get_room_id();
        console.log('MoveTo -line 58', cur_room);
        const directions = graph.bfs(cur_room, room_id);
        console.log('directions', directions);
        let cd = coolDown;

        while (directions.length > 0) {
            timer(cd);
            cd = await move(directions.shift());
            console.log('goTo -line 65 - cur_room', player.get_room_id());
        }
        console.log('Arrived -line 67');
    }

    const take = async thing => {
        const data = await take_item(thing);
        console.log('take - data', data);
        // setMessage(data.messages);
        // graph.rooms[data.room_id].items = data.items;
    };

    const drop = async thing => {
        const data = await drop_item(thing);
        setMessage(data.messages);
        graph.rooms[data.room_id].items = data.items;
    };

    const offer = async thing => {
        const data = await sellOffer(thing);
        setMessage(data.messages);
    };

    const confirm = async thing => {
        const data = await confirmSale(thing);
        setMessage(data.messages);
    };
    let test = '';
    const examineItem = async thing => {
        const data = await examine(thing);
        test = await data.description;
        console.log(data.description);
        setMessage(data.description);
    };

    const wearItem = async thing => {
        const data = await wear(thing);
        setMessage(data.messages);
    };

    const changeName = async thing => {
        const data = await change_name(thing);
        setMessage(data.messages);
    };

    const shrine = async thing => {
        const data = await pray(thing);
        setMessage(data.messages);
    };

    const mine = async () => {
        let run = true;
        let cd = coolDown;
        while (run) {
            timer(cd);
            let last = await lastProof();
            cd = last.cooldown;
            let newProof = proofOfWork(last.proof, last.difficulty);
            console.log('Found Proof!', newProof);
            timer(cd);
            let submit = await submitProof(newProof);
            cd = submit.cooldown;
        }
    };

    return (
        <div className='commands'>
            <div>
                <input name='item' value={item} onChange={handleChange} />
            </div>
            <div className='buttons'>
                <button onClick={() => findItem(item)}>Find</button>
                <button onClick={() => gotTo(1)}>Shop</button>
                <button onClick={() => gotTo(467)}>Pirate Ry's</button>
                <button onClick={() => gotTo(55)}>Wishing Well</button>
                <button onClick={() => take(item)}>Take</button>
                <button onClick={() => drop(item)}>Drop</button>
                <button onClick={() => offer(item)}>Sell Offer</button>
                <button onClick={() => confirm(item)}>Confirm Sale</button>
                <button onClick={() => examineItem(item)}>Examine</button>
                <button onClick={() => wearItem(item)}>Wear</button>
                <button onClick={() => changeName(item)}>Change Name</button>
                <button onClick={() => shrine(item)}>Pray</button>
                <button onClick={() => gotTo(493)}>Goto Mine</button>
                <button onClick={() => mine()}>Start Mining</button>
                <button onClick={() => setCheck(!check)}>Status</button>
            </div>
            <div className='message'>
                <p>{message}</p>
            </div>
            <div className='status'>
                <p>encumbrance: {status.encumbrance}</p>
                <p>strength: {status.strength}</p>
                <p>speed: {status.speed}</p>
                <p>gold: {status.gold}</p>
                <p>bodywear: {status.bodywear}</p>
                <p>footwear: {status.footwear}</p>
                <p>inventory:</p>
                <ul>
                    {status.inventory.map((thing, i) => {
                        return <li key={i}>{thing}</li>;
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Commands;
