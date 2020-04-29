import { all } from 'redux-saga/effects';
import { getSettingsWatcher } from "./settingsWatcher";
import { getTemperaturesWatcher } from "./temperaturesWatcher";

/** Import watchers */
export default function* rootSaga() {
    yield all([
        getSettingsWatcher(),
        getTemperaturesWatcher()
    ]);
}