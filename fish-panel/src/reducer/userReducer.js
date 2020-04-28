const userReducer = (state = { allUser: [] }, action) => {
    switch (action.type) {
        case "UPDATE_USERS":
            console.log("HIT[4]: reducer/userReducer.js", action.payload);

            return Object.assign({}, state, {
                allUser: [...action.payload]
            })
        default:
            return state;
    }
};

export default userReducer;