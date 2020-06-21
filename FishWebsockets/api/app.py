# CyboFish - API
# www.alextrandafir.ro
# www.github.com/alexrose
#
#!/usr/bin/python3
import sqlite3

from settings import timezone, mqttDb
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

#Get temperatures route
@app.route("/", methods=['GET']) 
def home(): 
    return "Bye stranger!"


@app.route("/temperatures/", defaults={'date': 'none'}, methods=['GET'])
@app.route("/temperatures/<date>", methods=['GET'])
def temperatures(date):
    today = datetime.now(timezone)

    if (date == "none"):
        current = today
        tomorrow = today
        yesterday = today - timedelta(days=1)
    else:
        current = datetime.strptime(date, '%Y-%m-%d')
        yesterday = current - timedelta(days=1)

        if (current.strftime('%Y-%m-%d') == today.strftime('%Y-%m-%d')):
            tomorrow = today
        else:
            tomorrow = current + timedelta(days=1)

    sqlQuery = "SELECT * FROM `temperatures` WHERE date >= ? AND date <= ? AND value > 0 ORDER BY `date` ASC"

    connect = sqlite3.connect(mqttDb)
    cursor = connect.cursor()

    cursor.execute(sqlQuery, (current.strftime('%Y-%m-%d')+' 07:00:00', current.strftime('%Y-%m-%d')+' 23:59:59'))
    rowsDay = cursor.fetchall()

    cursor.execute(sqlQuery, (current.strftime('%Y-%m-%d')+' 00:00:00', current.strftime('%Y-%m-%d')+' 06:59:59'))
    rowsNight = cursor.fetchall()

    cursor.close()
    connect.close()

    dayData = []
    nightData = []

    for row in rowsDay:
        dayData.append({
            "id": row[0],
            "time": datetime.strptime(row[2], '%Y-%m-%d %H:%M:%S').strftime('%H:%M'),
            "temperature": row[1]
        })

    for row in rowsNight:
        nightData.append({
            "id": row[0],
            "time": datetime.strptime(row[2], '%Y-%m-%d %H:%M:%S').strftime('%H:%M'),
            "temperature": row[1]
        })

    output = {
        "dates": {
            "next": tomorrow.strftime('%Y-%m-%d'),
            "prev": yesterday.strftime('%Y-%m-%d'),
            "current": current.strftime('%Y-%m-%d'),
        },
        "day": dayData,
        "night": nightData
    }

    return jsonify(output)

# running the server
#app.run(debug = True) # to allow for debugging and auto-reload

