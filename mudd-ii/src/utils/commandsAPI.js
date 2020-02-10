import { axiosWithAuth } from './axiosWithAuth';

export function take_item(item) {
    axiosWithAuth().post(
        'https://lambda-treasure-hunt.herokuapp.com/api/adv/take/',
        { name: item }
    );
}

export function drop_item(item) {
    axiosWithAuth().post(
        'https://lambda-treasure-hunt.herokuapp.com/api/adv/drop/',
        { name: item }
    );
}
