import axios from 'axios';
import { updateUsers } from "./../actions/actionCreators";
import { takeLatest, call, put } from 'redux-saga/effects';
/** function that returns an axios call */
function getUserRequest() {
    return axios.request({
        method: 'get',
        url: 'https://api.jsonbin.io/b/5ea16a891299b9374234b321'
    });
}
/** saga worker that is responsible for the side effects */
function* loginEffectSaga() {
    try {
        let data = {};

        if(!localStorage.getItem('users')) {
            let { data } = yield call(getUserRequest);
            yield put(updateUsers(data));
            localStorage.setItem('users', JSON.stringify(data));
        } else {
            let data = JSON.parse(localStorage.getItem('users'));
            yield put(updateUsers(data));
        }
        console.log("HIT[2]: saga/userWatcher", data);
    } catch (e) {
        console.log("HIT[2]-error: saga/userWatcher", e);
    }
}
/**
 * saga watcher that is triggered when dispatching action of type
 * 'GET_USER'
 */
export function* getUserWatcher() {
    yield takeLatest('GET_USER', loginEffectSaga);
}