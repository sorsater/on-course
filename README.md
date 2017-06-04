# Project
Project in the course TDDD27 at Linköping University.

Done by Ludvig Noring (ludno249) and Michael Sörsäter (micso554)

[Youtube Screencast](https://www.youtube.com/watch?v=pPCqwqpn3tI)

The specification that was created at the beginning of the project can be found in the file:  
 `Specification.md`

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

## Technologies and frameworks
| Technology        | Usage           |
| ------------- |-------------|
|`React`| Frontend|
|`Bootstrap`| Frontend|
|`Flask`| Server|
|`SQLAlchemy`| Database|
|`Python3`| Scrape content from Studiehandboken|
|`Jinja2`| template engine|

## Testing
To ensure stability and quality in the application we have worked with testing.

We have used *Unit Testing* to test each component when they are completed.
When the component works properly it is integrated with the rest of the code by using *Integration Testing*.

In the last stages of the project we used *Usability Testing* and let our friends try out our application. After their feedback we reworked the design remarkably which improved the quality. Changes we did after the feedback was to use more colors to encourage clicking, show the number of courses that match the search criteria and move around the select boxes to that they didn't take up so much space.