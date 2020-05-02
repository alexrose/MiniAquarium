import axios from 'axios';
import {getTemperatures, updateSettings} from './../actions/actionCreators';
import { takeLatest, call, put } from 'redux-saga/effects';
import * as Constants from '../constants'
import {GET_SETTINGS} from "../constants";

/** Returns an axios call */
function getSettingsRequest() {
    return axios.request({
        method: 'get',
        url: Constants.backendUrl
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

        // Get temperatures
        yield put(getTemperatures(getToday()));
    } catch (e) {
        console.log('[Critical]', e);
    }
}
/** Saga watcher triggered when dispatching action of type 'GET_SETTINGS */
export function* getSettingsWatcher() {
    yield takeLatest(GET_SETTINGS, loginEffectSaga);
}