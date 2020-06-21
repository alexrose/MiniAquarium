# CyboFish - Websockets
# www.alextrandafir.ro
# www.github.com/alexrose
#
#!/usr/bin/python3

import paho.mqtt.client as mqtt
import cyboDbInit

from cyboSettings import mqttBroker, mqttPort, mqttUser, mqttPass, mqttTopic, timezone
from cyboDbManager import DatabaseManager
from datetime import datetime

# Save temperature to db
def dataHandler(value):
    now = datetime.now(timezone)
    dbObj = DatabaseManager()
    dbObj.add_del_update_db_record("insert into temperatures (value, date) values (?,?)",[value, now.strftime("%Y-%m-%d %H:%M:%S")])
    del dbObj
    del now

def onConnect(client, obj, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe(mqttTopic)

def onMessage(client, userdata, msg):
    dataHandler(str(msg.payload.decode("utf-8")))

def on_log(mqttc, obj, level, string):
    print(string)

cyboDbInit.create()

client = mqtt.Client()
client.on_connect = onConnect
client.on_message = onMessage
#client.on_log = on_log

client.username_pw_set(mqttUser, mqttPass)
client.connect(mqttBroker, mqttPort, 60)

client.loop_forever()