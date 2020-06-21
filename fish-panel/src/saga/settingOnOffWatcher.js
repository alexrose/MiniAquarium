import { updateSettingOnOff } from '../actions/actionCreators'
import { takeLatest, call, put } from 'redux-saga/effects';
import {mqttPort, mqttUrl, mqttPass, mqttUser, mqttTopic, SET_SETTING_ON_OFF} from "../constants";


/** Returns an axios call */
function setSettingOnOffRequest(url) {

    let mqtt = require('mqtt');
    let client;
    let options = {
        host: mqttUrl,
        port: mqttPort,
        username: mqttUser,
        password: mqttPass,
        protocol: 'wss',
        properties: {
            requestResponseInformation: true
        }
    };
    client = mqtt.connect(options);

    client.publish(mqttTopic, 'Hello mqtt');
    client.end();
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga({url}) {
    try {
        let { data } = yield call(setSettingOnOffRequest, url);
        yield put(updateSettingOnOff(data));

    } catch (e) {
        console.log('[Critical]', e);
    }
}
/** Saga watcher triggered when dispatching action of type 'GET_SETTINGS */
export function* getSettingOnOffWatcher() {
    yield takeLatest(SET_SETTING_ON_OFF, loginEffectSaga);
}


