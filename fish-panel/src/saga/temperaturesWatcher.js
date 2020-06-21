import axios from 'axios';
import { updateTemperatures } from '../actions/actionCreators'
import { takeLatest, call, put } from 'redux-saga/effects';
import {GET_TEMPERATURES, temperaturesUrl} from "../constants";

/** Returns an axios call */
function getTemperaturesRequest(date) {
    if (date === undefined) {
        date = getToday();

    }

    return axios.request({
        method: 'get',
        url: `${temperaturesUrl}/${date}`
    });
}

function getToday() {
    let d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    month = (month.length < 2) ? `0${month}` : month;
    day = (day.length < 2) ? `0${day}` : day;

    return [year, month, day].join('-');
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