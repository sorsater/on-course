# Project
Project in the course TDDD27 at Linköping University.

Done by Ludvig Noring (ludno249) and Michael Sörsäter (micso554)

## Description
We have developed a system that help students when they are planing their semesters.
Information about programs and courses are scraped from Studiehandboken and stored in a database.
In our web application students can filter out courses that are relevant for them.
The following are parameters that are useful to filter courses with:

* Program
* Field
* Profile
* Semester
* Level
* In which schedule slot the course is taken (block)

The courses that match these criteria are shown.
By clicking on the courses they are shown in the schedule viewer to the right of the screen.

The chosen courses are stored in the cookies.

It is possible to log in with Facebook and save/load the chosen courses.

A screenshot from the finished application.

![screenshot](https://gitlab.ida.liu.se/ludno249/TDDD272017_project/raw/master/doc/screenshot.png)

The project is split up in Frontend and Backend. The relations between the different parts/classes are shown in the diagram.

![class_relations](https://gitlab.ida.liu.se/ludno249/TDDD272017_project/raw/master/doc/class_relations.png)

## Specification
We developed this system from the following specification.

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
