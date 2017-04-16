import sqlite3

conn = sqlite3.connect('../plate.db')
c = conn.cursor()

if False:
    for row in c.execute('SELECT * FROM Courses ORDER BY code'):
        print(row)
    print()
    for row in c.execute('SELECT * FROM Programs ORDER BY ID'):
        print(row)
    print()
    for row in c.execute('SELECT * FROM Schedule ORDER BY ID'):
        print(row)
    print()
    for row in c.execute('SELECT * FROM Fields ORDER BY ID'):
        print(row)
    print()
    for row in c.execute('SELECT * FROM Profiles ORDER BY ID'):
        print(row)
    print()
    for row in c.execute('SELECT * FROM Course_profiles ORDER BY ID'):
        print(row)

# testa ai och ml
for row in c.execute('select * from programs where name == "Datateknik"'):
    print(row)
print()

for row in c.execute('select * from fields where programid == 8'):
    print(row)
print()

for row in c.execute('select * from profiles where fieldID = 49'):
    print(row)

for row in c.execute('select * from course_profiles where profileid == 128'):
    print(row)

conn.close()
