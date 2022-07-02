import * as types from '../types';

export function login(user){
    return {
        type: types.SET_LOGIN,
        payload: user
    }
}

export function logout(){
    return {
        type: types.SET_LOGOUT,
        payload: {}
    }
}