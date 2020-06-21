# CyboFish - Settings
# www.alextrandafir.ro
# www.github.com/alexrose
#
#!/usr/bin/python3

import pytz

# MQTT settings
mqttBroker = "localhost"
mqttPort = 1883
mqttUser = "user"
mqttPass = "pass"
mqttTopic = "topic"

# Db settings
mqttDb =  "/path/to/websockets/cybofish.db"

# Time settings
timezone = pytz.timezone("Europe/Bucharest")