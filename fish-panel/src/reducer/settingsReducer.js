const settingsReducer = (state = { allSettings: [] }, action) => {
    switch (action.type) {
        case "UPDATE_SETTINGS":
            return Object.assign({}, state, {
                allSettings: [...action.payload]
            })
        case "UPDATE_SETTINGS_STATUS":
            return Object.assign({}, state, {
                settingStatus: action.payload
            })
        default:
            return state;
    }
};

export default settingsReducer;