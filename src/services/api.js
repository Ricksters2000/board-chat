import { DEFAULT_IMAGE } from "./constants";

const apiUrl = 'http://localhost:8000';

export const fetchApi = (path, method='get', headers={'Content-Type': 'application/json'}, body={}) => {
    console.log('fetching path:', path, 'with body:', body)

    const fetch = window.fetch.bind(window);
    const req = {method, headers};
    if(method !== 'get') req['body'] = JSON.stringify(body);

    return fetch(apiUrl + path, req)
        .then(resp => {
            return resp.json();
        }).catch(err => Promise.reject(err));
}

export const fetchUser = (id) => {
    return fetchApi(`/profile/${id}`, 'get', {'Content-Type': 'application/json'})
        .then(user => {
            const {name, email, image, color, wins} = user;
            return {username: name, email, image: image || DEFAULT_IMAGE, color, wins};
        }).catch(err => Promise.reject(err))
}