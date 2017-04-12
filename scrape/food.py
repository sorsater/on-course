import sqlite3
from scraper import scrape_plate

courses, schedule = scrape_plate()

conn = sqlite3.connect('plate.db')
c = conn.cursor()

print(courses)
c.executemany('INSERT INTO Courses VALUES (?,?,?,?,?)', courses)
conn.commit()

for row in c.execute('SELECT * FROM Courses'):
    print(row)
    
conn.close()
