import {combineReducers} from "redux";
import settingsReducer from "./settingsReducer";
import temperaturesReducer from "./temperaturesReducer";

const rootReducer = combineReducers({
    settingsData: settingsReducer,
    temperaturesData: temperaturesReducer
})

export default rootReducer