import { toast } from "react-toastify";

/** Settings */
export function getSettings() {
    return { type: 'GET_SETTINGS' };
}

export function updateSettings(data) {
    return { type: 'UPDATE_SETTINGS', payload: data };
}

/** Temperature */
export function getTemperatures() {
    return { type: 'GET_TEMPERATURES' };
}

export function updateTemperatures(data) {
    return { type: 'UPDATE_TEMPERATURES', payload: data };
}

/** Settings */
export function getSettingOnOff(url) {
    return { type: 'GET_SETTING_ON_OFF', url };
}

export function updateSettingsStatus(data) {
    if (data.status === "success") {
        toast.success(data.message);
    } else {
        toast.warn(data.message);
    }

    return { type: 'UPDATE_SETTINGS_STATUS', payload: data };
}

