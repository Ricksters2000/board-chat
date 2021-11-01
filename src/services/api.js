import { DEFAULT_IMAGE } from "./constants";
import axios from 'axios';

const apiUrl = process.env.REACT_APP_REST_API;

axios.defaults.baseURL = apiUrl;

// export const fetchApi = (path, method='get', headers={'Content-Type': 'application/json'}, body={}) => {
//     console.log('fetching path:', path, 'with body:', body)

//     const fetch = window.fetch.bind(window);
//     const req = {method, headers};
//     if(method !== 'get') req['body'] = JSON.stringify(body);

//     return fetch(apiUrl + path, req)
//         .then(resp => {
//             return resp.json();
//         }).catch(err => Promise.reject(err));
// }

export const fetchApi = (url, method, data={}) => {
    console.log('fetching:', method, url, data);
    return new Promise((resolve, reject) => {
        return axios.request({method, url, data})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err) => {
                // console.log(err.response.data.error)
                return reject(err.response.data.toString());
            })
    });
}

export const fetchUser = (id) => {
    return fetchApi(`/profile/${id}`, 'get')
        .then(user => {
            const {name, email, image, color, wins} = user;
            return {username: name, email, image: image || DEFAULT_IMAGE, color, wins};
        }).catch(err => Promise.reject(err))
}

export const incrementUserWin = (id) => {
    return fetchApi(`/profile/win/${id}`, 'put')
        .then(wins => {
            return wins;
        }).catch(err => Promise.reject(err))
}