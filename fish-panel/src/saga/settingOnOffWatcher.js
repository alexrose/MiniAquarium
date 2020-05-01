import axios from 'axios';
import { updateSettingsStatus } from '../actions/actionCreators'
import { takeLatest, call, put } from 'redux-saga/effects';
import {GET_SETTING_ON_OFF} from "../constants";

/** Returns an axios call */
function getSettingOnOffRequest(url) {
    return axios.request({
        method: 'get',
        url: url
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga({url}) {
    try {
        let { data } = yield call(getSettingOnOffRequest, url);
        yield put(updateSettingsStatus(data));

    } catch (e) {
        console.log('[Critical]', e);
    }
}
/** Saga watcher triggered when dispatching action of type 'GET_SETTINGS */
export function* getSettingOnOffWatcher() {
    yield takeLatest(GET_SETTING_ON_OFF, loginEffectSaga);
}


