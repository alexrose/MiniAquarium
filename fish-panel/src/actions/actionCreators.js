import {toast} from 'react-toastify';
import {
    SET_SETTING_ON_OFF,
    GET_TEMPERATURES,
    UPDATE_SETTING_ON_OFF,
    UPDATE_TEMPERATURES
} from "../constants";

/** Temperature */
export function getTemperatures(data) {
    return {type: GET_TEMPERATURES, data};
}

export function updateTemperatures(data) {
    return {type: UPDATE_TEMPERATURES, payload: data};
}

/** Settings */
export function setSettingOnOff(url) {
    return {type: SET_SETTING_ON_OFF, url};
}

export function updateSettingOnOff(data) {
    if (data.status === 'success') {
        toast.success(data.message);
    } else {
        toast.warn(data.message);
    }

    return {type: UPDATE_SETTING_ON_OFF, payload: data};
}

