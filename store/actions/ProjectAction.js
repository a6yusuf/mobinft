import * as types from '../types';

export function projects(project){
    return {
        type: types.SET_PROJECT,
        payload: project
    }
}
