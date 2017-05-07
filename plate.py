from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    nickname = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return '<User %s %s %s %s>' % (self.id, self.social_id, self.nickname, self.email)

# Kurser, ett entry per kurs, TANA09, TDDD27...
class Courses(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20))
    name = db.Column(db.String(80), unique=True)
    level = db.Column(db.String(10))
    hp = db.Column(db.Integer)
    link = db.Column(db.String(500), unique=True)

    def __init__(self, ID, code, name, level, hp, link):
        self.ID = ID
        self.code = code
        self.name = name
        self.level = level
        self.hp = hp
        self.link = link

    def __repr__(self):
        return 'Course {0} name: {1} level: {2} hp: {3}'.format(self.code, self.name, self.level, self.hp)

# Utbildningsprogram, D, M, I...
class Programs(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    link = db.Column(db.String(500), unique=True)

    def __init__(self, ID, name, link):
        self.ID = ID
        self.name = name
        self.link = link

    def __repr__(self):
        return 'Program {0} with name {1}'.format(self.ID, self.name)

# Schema
class Schedule(db.Model):
    # Need primary key?
    ID = db.Column(db.Integer, primary_key=True)

    code = db.Column(db.String(20))
    semester = db.Column(db.Integer)
    period = db.Column(db.Integer)
    block1 = db.Column(db.String(10))
    block2 = db.Column(db.String(10))

    def __init__(self, ID, code, semester, period, block1, block2):
        self.ID = ID
        self.code = code
        self.semester = semester
        self.period = period
        self.block1 = block1
        self.block2 = block2

    def __repr__(self):
        return 'Schedule {1}, period: {2}{3}, blocks: {4}, {5}'.format(self.code, self.semester, self.period, self.block1, self.block2)

# Field
class Fields(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    programID = db.Column(db.Integer)

    def __init__(self, ID, name, programID):
        self.ID = ID
        self.name = name
        self.programID = programID

    def __repr__(self):
        return 'Fields {0}, programID: {1}, name: {2}'.format(self.ID, self.programID, self.name)

# Profiles
class Profiles(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    fieldID = db.Column(db.Integer)
    link = db.Column(db.String(500))

    def __init__(self, ID, name, fieldID, link):
        self.ID = ID
        self.name = name
        self.fieldID = fieldID
        self.link = link

    def __repr__(self):
        return 'Profile, field: {0}, name: {1}'.format(self.fieldID, self.name)

# Courses and which profile they belong to
class Course_profiles(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(100))
    profileID = db.Column(db.Integer)
    vof = db.Column(db.String(10))

    def __init__(self, ID, code, profileID, vof):
        self.ID = ID
        self.code = code
        self.profileID = profileID
        self.vof = vof

    def __repr__(self):
        return '<Course_profiles {}>'.format(self.ID)

# Courses and which program they belong to
class Program_courses(db.Model):
    ID = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(100))
    programID = db.Column(db.Integer)

    def __init__(self, ID, code, programID):
        self.ID = ID
        self.code = code
        self.programID = programID

    def __repr__(self):
        return 'Program_course: {0} program: {1}'.format(self.code, self.programID)
