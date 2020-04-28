import { all } from 'redux-saga/effects';
import { getUserWatcher } from './userWatcher';
import { getSettingsWatcher } from "./settingsWatcher";

/** Import watchers */
export default function* rootSaga() {
    yield all([
        getUserWatcher(),
        getSettingsWatcher()
    ]);
}