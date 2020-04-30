import { all } from 'redux-saga/effects';
import { getSettingsWatcher } from "./settingsWatcher";
import { getTemperaturesWatcher } from "./temperaturesWatcher";
import { getSettingOnOffWatcher } from "./settingOnOffWatcher";

/** Import watchers */
export default function* rootSaga() {
    yield all([
        getSettingsWatcher(),
        getTemperaturesWatcher(),
        getSettingOnOffWatcher()
    ]);
}