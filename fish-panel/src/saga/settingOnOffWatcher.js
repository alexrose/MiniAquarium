import { updateSettingOnOff } from '../actions/actionCreators'
import { takeLatest, call, put } from 'redux-saga/effects';
import { mqttHost, mqttPass, mqttUser, mqttTopic, SET_SETTING_ON_OFF} from "../constants";

function setSettingOnOffRequest(param) {
    let mqtt = require('mqtt');
    let options = {
        clientId: 'mqttJs_' + Math.random().toString(16).substr(2, 8),
        username: mqttUser,
        password: mqttPass
    };

    let client = mqtt.connect(mqttHost, options);
    client.publish(mqttTopic, param, { qos: 0, retain: false });

    return {'status' : 'success', 'message': `Request to update setting ${param} sent.`};
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga({param}) {
    try {
        let data = yield call(setSettingOnOffRequest, param);
        yield put(updateSettingOnOff(data));

    } catch (e) {
        console.log('[Critical]', e);
    }
}
/** Saga watcher triggered when dispatching action of type 'GET_SETTINGS */
export function* getSettingOnOffWatcher() {
    yield takeLatest(SET_SETTING_ON_OFF, loginEffectSaga);
}
