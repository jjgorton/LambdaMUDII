import axios from 'axios';

export const axiosWithAuth = () => {
    // const token = 'Token ' + localStorage.getItem('token');
    const token = 'Token 1c195b27c58c36db25d1edf9e08da6bb257a4c92';

    return axios.create({
        headers: {
            Authorization: token
        }
    });
};
