import sqlite3
from scrape.scraper import scrape_content
import pickle
import sys
#sys.setrecursionlimit(10000)
print("Scraping plates")
#courses, schedule = scrape_courses()
#programs, fields, profiles, course_profile = scrape_programs()


#courses, schedule, program_courses, programs, fields, profiles, course_profile = scrape_content()
#data = scrape_content()
#with open('pickled_food.pkl', 'wb') as f:
#    pickle.dump(data, f, pickle.HIGHEST_PROTOCOL)
#sys.exit(0)

with open('pickled_food.pkl', 'rb') as f:
    data = pickle.load(f)

courses, schedule, program_courses, programs, fields, profiles, course_profile = data
print("Inserting to db")
conn = sqlite3.connect('plate.db')
c = conn.cursor()

try:
    c.executemany('INSERT OR IGNORE INTO Course VALUES (?,?,?,?,?,?)', courses)
    conn.commit()
    print("Success: insert values to: 'Courses'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Courses'")

try:
    c.executemany('INSERT INTO Program VALUES (?,?,?)', programs)
    conn.commit()
    print("Success: insert values to: 'Programs'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Programs'")

try:
    c.executemany('INSERT INTO Schedule VALUES (?,?,?,?,?,?)', schedule)
    conn.commit()
    print("Success: insert values to: 'Schedule'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Schedule'")

try:
    c.executemany('INSERT INTO Field VALUES (?,?,?)', fields)
    conn.commit()
    print("Success: insert values to: 'Fields'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Fields'")

try:
    c.executemany('INSERT INTO Profile VALUES (?,?,?,?)', profiles)
    conn.commit()
    print("Success: insert values to: 'Profiles'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'Profiles'")

try:
    c.executemany('INSERT INTO Course_profile VALUES (?,?,?,?)', course_profile)
    conn.commit()
    print("Success: insert values to: 'CourseProfiles'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'CourseProfiles'")

try:
    c.executemany('INSERT INTO Program_course VALUES (?,?,?)', program_courses)
    conn.commit()
    print("Success: insert values to: 'ProgramCourse'")
except Exception as e:
    print(e)
    print("Failure: insert values to: 'ProgramCourses'")


conn.close()
