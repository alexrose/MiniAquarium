import axios from 'axios';
import { updateTemperatures } from "../actions/actionCreators"
import { takeLatest, call, put } from 'redux-saga/effects';

/** Returns an axios call */
function getTemperaturesRequest() {

    let localSettings = JSON.parse(localStorage.getItem('settings'));
    let temperaturesUrl = localSettings.filter((item) => {
        return item.type === 'temperature'
    });

    return axios.request({
        method: 'get',
        url: temperaturesUrl['0'].value
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga() {
    try {
        let { data } = yield call(getTemperaturesRequest);
        yield put(updateTemperatures(data));

    } catch (e) {
        console.log("[Critical]", e);
    }
}
/** Saga watcher triggered when dispatching action of type 'GET_SETTINGS */
export function* getTemperaturesWatcher() {
    yield takeLatest('GET_TEMPERATURES', loginEffectSaga);
}