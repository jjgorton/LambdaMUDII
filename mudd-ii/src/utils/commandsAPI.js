import { axiosWithAuth } from './axiosWithAuth';
import { sha256 } from 'js-sha256';

export async function take_item(item) {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/take/', {
            name: item
        })
        .then(res => {
            console.log('TAKE:', res.data);
            data = res.data;
        })
        .catch(err => console.error(err));
    return data;
}

export async function drop_item(item) {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/drop/', {
            name: item
        })
        .then(res => {
            console.log('TAKE:', res.data);
            data = res.data;
        })
        .catch(err => console.error(err));
    return data;
}

// export function getStatus() {
//     axiosWithAuth()
//         .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/status/')
//         .then(res => {
//             console.log('STATUS', res.data);
//             return {
//                 encumbrance: res.data.encumbrance,
//                 strength: res.data.strength,
//                 speed: res.data.speed,
//                 gold: res.data.gold,
//                 bodywear: res.data.bodywear,
//                 footwear: res.data.footwear,
//                 inventory: res.data.inventory,
//                 messages: res.data.messages
//             };
//         })
//         .catch(err => console.error(err));
// }

export async function sellOffer(item) {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/', {
            name: item
        })
        .then(res => {
            console.log('offer:', res.data);
            data = res.data.messages;
        })
        .catch(err => console.error(err));
    return data;
}

export async function confirmSale(item) {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/', {
            name: item,
            confirm: 'yes'
        })
        .then(res => {
            console.log('confirm:', res.data);
            data = res.data.messages;
        })
        .catch(err => console.error(err));
    return data;
}

export async function examine(item) {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/examine/', {
            name: item
        })
        .then(res => {
            console.log('examine:', res.data);
            data = res.data;
        })
        .catch(err => console.error(err));
    return data;
}

export async function wear(item) {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/wear/', {
            name: item
        })
        .then(res => {
            console.log('wear:', res.data);
            data = res.data.messages;
        })
        .catch(err => console.error(err));
    return data;
}

export async function change_name(name) {
    let data = {};
    await axiosWithAuth()
        .post(
            'https://lambda-treasure-hunt.herokuapp.com/api/adv/change_name/',
            { name: name, confirm: 'aye' }
        )
        .then(res => {
            console.log('Change Name:', res.data);
            data = res.data.messages;
        })
        .catch(err => console.error(err));
    return data;
}

export async function pray() {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/pray/')
        .then(res => {
            console.log('Change Name:', res.data);
            data = res.data.messages;
        })
        .catch(err => console.error(err));
    return data;
}

export async function lastProof() {
    let data = {};
    await axiosWithAuth()
        .get('https://lambda-treasure-hunt.herokuapp.com/api/bc/last_proof/')
        .then(res => {
            data = res.data;
            console.log('Last Proof', res.data);
        })
        .catch(err => console.error(err));

    return data;
}

export async function submitProof(newProof) {
    let data = {};
    await axiosWithAuth()
        .post('https://lambda-treasure-hunt.herokuapp.com/api/bc/mine/', {
            proof: newProof
        })
        .then(res => {
            data = res.data;
            console.log('New Proof submitted', res.data);
        })
        .catch(err => console.error(err));

    return data;
}

export function validProof(blockString, proof, difficulty) {
    const guess = `${blockString}${proof}`;
    const encoded = encodeURI(guess);
    const hash = sha256(encoded).hex();
    return hash.slice(0, difficulty) === '0'.repeat(difficulty);
}

export function proofOfWork(prevProof, diff) {
    const blockString = JSON.stringify(prevProof);
    let proof = 0;
    while (!validProof(blockString, proof, diff)) {
        proof++;
    }
    return proof;
}
