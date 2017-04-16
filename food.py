import sqlite3
from scrape.scraper import scrape_courses, scrape_programs

print("Scraping content")
courses, schedule = scrape_courses()
programs, fields, profiles, course_profile = scrape_programs()

print("Inserting to db")
conn = sqlite3.connect('plate.db')
c = conn.cursor()

try:
    c.executemany('INSERT INTO Courses VALUES (?,?,?,?,?)', courses)
    conn.commit()
    print("Success: insert values to: 'Courses'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Courses'")

try:
    c.executemany('INSERT INTO Programs VALUES (?,?,?)', programs)
    conn.commit()
    print("Success: insert values to: 'Programs'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Programs'")

try:
    c.executemany('INSERT INTO Schedule VALUES (?,?,?,?,?)', schedule)
    conn.commit()
    print("Success: insert values to: 'Schedule'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Schedule'")

try:
    c.executemany('INSERT INTO Fields VALUES (?,?,?)', fields)
    conn.commit()
    print("Success: insert values to: 'Fields'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Fields'")

try:
    c.executemany('INSERT INTO Profiles VALUES (?,?,?,?)', profiles)
    conn.commit()
    print("Success: insert values to: 'Profiles'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Profiles'")

try:
    c.executemany('INSERT INTO Course_profiles VALUES (?,?,?,?)', course_profile)
    conn.commit()
    print("Success: insert values to: 'CourseProfiles'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'CourseProfiles'")

conn.close()
