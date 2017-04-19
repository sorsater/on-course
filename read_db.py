from plate import db, Courses, Programs, Schedule, Fields, Profiles, Course_profiles
from sqlalchemy import *
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///plate.db', echo=False)

Session = sessionmaker(bind=engine)
session = Session()

print(session.query(Courses).count())

programs = [program[0] for program in session.query(Programs.name)]

print(programs)

	TFBI17


#
# if False:
#     for row in c.execute('SELECT * FROM Courses ORDER BY code'):
#         print(row)
#     print()
#     for row in c.execute('SELECT * FROM Programs ORDER BY ID'):
#         print(row)
#     print()
#     for row in c.execute('SELECT * FROM Schedule ORDER BY ID'):
#         print(row)
#     print()
#     for row in c.execute('SELECT * FROM Fields ORDER BY ID'):
#         print(row)
#     print()
#     for row in c.execute('SELECT * FROM Profiles ORDER BY ID'):
#         print(row)
#     print()
#     for row in c.execute('SELECT * FROM Course_profiles ORDER BY ID'):
#         print(row)
#
# # testa ai och ml
# for row in c.execute('select * from programs where name == "Datateknik"'):
#     print(row)
# print()
#
# for row in c.execute('select * from fields where programid == 8'):
#     print(row)
# print()
#
# for row in c.execute('select count(*) from profiles'):
#     print(row)
#
# #for row in c.execute('select count()* from course_profiles where code == "TDDD41"'):
# #    print(row)
#
# for name in c.query(profiles):
#     print(name)
#
# conn.close()
