import {UPDATE_SETTING_ON_OFF} from "../constants";

const settingsReducer = (state = { allSettings: [] }, action) => {
    switch (action.type) {
        case UPDATE_SETTING_ON_OFF:
            return Object.assign({}, state, {
                settingStatus: action.payload
            })
        default:
            return state;
    }
};

export default settingsReducer;