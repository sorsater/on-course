from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Courses(db.Model):
    code = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    level = db.Column(db.String(10))
    hp = db.Column(db.Integer)
    link = db.Column(db.String(500), unique=True)

    def __init__(self, code, name, level, hp, link):
        self.code = code
        self.name = name
        self.level = level
        self.hp = hp
        self.link = link

    def __repr__(self):
        return '<Course {}>'.format(self.code)
