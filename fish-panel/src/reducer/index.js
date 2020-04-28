import { combineReducers } from "redux";
import userReducer from './userReducer';
import settingsReducer from "./settingsReducer";

const rootReducer = combineReducers({
    userData: userReducer,
    settingsData: settingsReducer
})

export default rootReducer