# CyboFish - Database manager
# www.alextrandafir.ro
# www.github.com/alexrose
#
#!/usr/bin/python3
import sqlite3
from cyboSettings import mqttDb

# DatabaseManager
class DatabaseManager():
	def __init__(self):
		self.connect = sqlite3.connect(mqttDb)
		self.connect.execute('pragma foreign_keys = on')
		self.connect.commit()
		self.cursor = self.connect.cursor()

	def add_del_update_db_record(self, sql_query, args=()):
		self.cursor.execute(sql_query, args)
		self.connect.commit()
		return

	def __del__(self):
		self.cursor.close()
		self.connect.close()
