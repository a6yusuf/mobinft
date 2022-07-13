import * as types from '../types.js';

const initialState = {
    project: {
        collection: 0,
        totalNFT: 0
    }
}

export default function ProjectReducer(state=initialState, {type, payload}) {
    switch (type) {
        case types.SET_PROJECT:
            return {
                 ...payload
            };
        default:
            return state;
    }
}