const temperaturesReducer = (state = { temperatures: [] }, action) => {
    switch (action.type) {
        case "UPDATE_TEMPERATURES":
            return Object.assign({}, state, {
                temperatures: action.payload
            })
        default:
            return state;
    }
};

export default temperaturesReducer;