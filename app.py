from flask import Flask, render_template
from plate import db, Courses

import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plate.db'
db.app = app
db.init_app(app)
db.create_all()

@app.route('/')
def index():
    #kod = str(random.randint(100000,999999))
    #kurs = Courses(kod, 'potatis' + kod[:4], 'A', '6*', 'http://www.potatis.nu/' + kod[3:])
    #db.session.add(kurs)
    #db.session.commit()
    kurser = Courses.query.all()
    return render_template('index.html', kurser=kurser)

if __name__ == '__main__':
    app.run(debug=True)
