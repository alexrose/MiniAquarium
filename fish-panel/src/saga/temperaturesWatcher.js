import axios from 'axios';
import { updateTemperatures } from '../actions/actionCreators'
import { takeLatest, call, put } from 'redux-saga/effects';
import {GET_TEMPERATURES} from "../constants";

/** Returns an axios call */
function getTemperaturesRequest(date) {
    let localSettings = JSON.parse(localStorage.getItem('settings'));
    let temperaturesUrl = localSettings.filter((item) => {
        return item.type === 'temperature'
    });

    return axios.request({
        method: 'get',
        url: `${temperaturesUrl['0'].value}/${date}`
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga(payload) {
    try {
        let { data } = yield call(getTemperaturesRequest, payload.data);
        yield put(updateTemperatures(data));

    } catch (e) {
        console.log('[Critical]', e);
    }
}
/** Saga watcher triggered when dispatching action of type 'GET_SETTINGS */
export function* getTemperaturesWatcher() {
    yield takeLatest(GET_TEMPERATURES, loginEffectSaga);
}