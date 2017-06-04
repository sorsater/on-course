## Specification
The following specification was stated at the beginning of the project.
The idea is described together with a mockup and the technologies used.

### Functional specification
When choosing courses for the semesters there is hard to find courses that both match your interest and master program. Studiehandboken looks ugly and is hard to navigate. There is no way to see if courses fit with each in the schedule.

The purpose of our project is to create a smarter, more thought through, better looking Studiehandboken regarding course planning.
The main function is to filter courses from multiple master programs, search after keywords in courses and show the schedule for the selected courses.

The course data will be downloaded and parsed from Studiehandboken either fully- or semi automatic and stored in the database.

Users can login to save and load their study plans.
If possible, we would like to use LiU as login authentication, otherwise Google+ and/or Facebook.

A mockup of the project is shown below.
![sketch](https://gitlab.ida.liu.se/ludno249/TDDD272017_project/raw/master/doc/skiss.png)

### Technological specification
#### Client framework
* React - We chose React because of its popularity amongst developers. None of us have worked with it before.

#### Server framework
* Flask - We chose Flask because we have experience from python. Flask is popular and we think it would suffice as backend.
* SQLAlchemy - It have a good intergration with Flask and seems more interesting than the standard SQL frameworks.
