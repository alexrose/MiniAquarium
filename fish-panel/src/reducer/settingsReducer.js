const settingsReducer = (state = { allSettings: [] }, action) => {
    switch (action.type) {
        case "UPDATE_SETTINGS":
            console.log("HIT[4]: reducer/settingsReducer.js", action.payload);

            return Object.assign({}, state, {
                allSettings: [...action.payload]
            })
        default:
            return state;
    }
};

export default settingsReducer;