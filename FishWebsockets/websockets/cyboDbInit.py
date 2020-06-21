# CyboFish - Database init
# www.alextrandafir.ro
# www.github.com/alexrose
#
#!/usr/bin/python3
import sqlite3
import os.path
from cyboSettings import mqttDb

tableSchema="""
drop table if exists temperatures;
create table temperatures (
  id integer primary key autoincrement,
  value text,
  date text  
);
"""

def create():
    if (os.path.isfile(mqttDb) == False):

        connect = sqlite3.connect(mqttDb)
        cursor = connect.cursor()

        sqlite3.complete_statement(tableSchema)
        cursor.executescript(tableSchema)

        cursor.close()
        connect.close()
