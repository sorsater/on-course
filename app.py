from flask import Flask, render_template
from plate import db, Courses, Programs, Schedule, Fields, Profiles, Course_profiles

import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plate.db'
db.app = app
db.init_app(app)
db.create_all()

@app.route('/')
def index():
    kurser = Courses.query.order_by(Courses.code)
    return render_template('index.html', kurser=kurser)

if __name__ == '__main__':
    app.run(debug=True)
