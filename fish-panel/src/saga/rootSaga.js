import { all } from 'redux-saga/effects';
import { getTemperaturesWatcher } from './temperaturesWatcher';
import { getSettingOnOffWatcher } from './settingOnOffWatcher';

/** Import watchers */
export default function* rootSaga() {
    yield all([
        getTemperaturesWatcher(),
        getSettingOnOffWatcher()
    ]);
}