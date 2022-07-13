import * as types from '../types.js';

const initialState = {
    auth: {
        loggedIn: false,
        user: {}
    }
}

export default function AuthReducer(state=initialState, {type, payload}) {
    switch (type) {
        case types.SET_LOGIN:
            return {
                // ...state,
                loggedIn: true,
                user: payload
            };
        case types.SET_LOGOUT:
            return {
                // ...state,
                loggedIn: false,
                user: {}
            }
        default:
            return state;
    }
}