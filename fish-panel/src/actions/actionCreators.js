export function getUsers() {
    console.log("HIT[1]: action/actionCreator.js");
    return { type: 'GET_USER' };
}

export function updateUsers(data) {
    console.log("HIT[3]: action/actionCreator.js");
    return { type: 'UPDATE_USERS', payload: data };
}

export function getSettings() {
    console.log("HIT[1-settings]: action/actionCreator.js");
    return { type: 'GET_SETTINGS' };
}

export function updateSettings(data) {
    console.log("HIT[3-settings]: action/actionCreator.js");
    return { type: 'UPDATE_SETTINGS', payload: data };
}