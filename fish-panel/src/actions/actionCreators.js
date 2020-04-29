export function getSettings() {
    console.log("HIT[1-settings]: action/actionCreator.js");
    return { type: 'GET_SETTINGS' };
}

export function updateSettings(data) {
    console.log("HIT[3-settings]: action/actionCreator.js");
    return { type: 'UPDATE_SETTINGS', payload: data };
}

export function getTemperatures() {
    return { type: 'GET_TEMPERATURES' };
}

export function updateTemperatures(data) {
    return { type: 'UPDATE_TEMPERATURES', payload: data };
}