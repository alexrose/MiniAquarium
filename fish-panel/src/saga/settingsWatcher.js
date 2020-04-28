import axios from 'axios';
import { updateSettings } from "./../actions/actionCreators";
import { takeLatest, call, put } from 'redux-saga/effects';
import * as Constants from '../constants'

/** Returns an axios call */
function getSettingsRequest() {
    return axios.request({
        method: 'get',
        url: Constants.backendUrl
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga() {
    try {
        let data = {};

        if(!localStorage.getItem('settings')) {
            let { data } = yield call(getSettingsRequest);

            if(data.message) {
                throw data.message;
            } else {
                yield put(updateSettings(data));
                localStorage.setItem('settings', JSON.stringify(data));
            }
        } else {
            data = JSON.parse(localStorage.getItem('settings'));
            yield put(updateSettings(data));
        }
        console.log("HIT[2]: saga/settingsWatcher", data);
    } catch (e) {
        console.log("[Critical]", e);
    }
}
/** Saga watcher triggered when dispatching action of type 'GET_SETTINGS */
export function* getSettingsWatcher() {
    yield takeLatest('GET_SETTINGS', loginEffectSaga);
}