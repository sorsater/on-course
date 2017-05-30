from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import os.path
db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    nickname = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=True)

    courses = db.relationship("Cart")

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

class Cart(db.Model):
    #id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    codes = db.Column(db.String(256))

    def __init__(self, name, user_id, codes):
        self.name = name
        self.user_id = user_id
        self.codes = codes

    def __repr__(self):
        return '<Cart %r %r %r>' % (self.name, self.user_id, self.codes)

# Kurser, ett entry per kurs, TANA09, TDDD27...
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20))
    name = db.Column(db.String(80), unique=True)
    level = db.Column(db.String(10))
    hp = db.Column(db.Integer)
    link = db.Column(db.String(500), unique=True)

    def __init__(self, id, code, name, level, hp, link):
        self.id = id
        self.code = code
        self.name = name
        self.level = level
        self.hp = hp
        self.link = link

    def __repr__(self):
        return '(Course {} {} {} {} {})'.format(self.id, self.code, self.name, self.level, self.hp)

# Utbildningsprogram, D, M, I...
class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    link = db.Column(db.String(500), unique=True)

    fields = db.relationship("Field")
    courses = db.relationship("Program_course", order_by='Program_course.code')

    def __init__(self, id, name, link):
        self.id = id
        self.name = name
        self.link = link

    def __repr__(self):
        return '(Program {} {} {})'.format(self.id, self.name, os.path.basename(self.link))


# Field
class Field(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    program_id = db.Column(db.Integer, db.ForeignKey('program.id'))

    profiles = db.relationship("Profile")

    def __init__(self, id, name, program_id):
        self.id = id
        self.name = name
        self.program_id = program_id

    def __repr__(self):
        return 'id:{};program_id:{};name:{}'.format(self.id, self.program_id, self.name)

# Profiles
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    #field_id = db.Column(db.Integer)
    field_id = db.Column(db.Integer, db.ForeignKey('field.id'))
    link = db.Column(db.String(500))

    courses = db.relationship("Course_profile")

    def __init__(self, id, name, field_id, link):
        self.id = id
        self.name = name
        self.field_id = field_id
        self.link = link

    def __repr__(self):
        return 'Profile {} {} {}'.format(self.id, self.field_id, self.name)


# Schema
class Schedule(db.Model):
    # Need primary key?
    id = db.Column(db.Integer, primary_key=True)

    code = db.Column(db.String(20))
    semester = db.Column(db.Integer)
    period = db.Column(db.Integer)
    block1 = db.Column(db.String(10))
    block2 = db.Column(db.String(10))

    def __init__(self, id, code, semester, period, block1, block2):
        self.id = id
        self.code = code
        self.semester = semester
        self.period = period
        self.block1 = block1
        self.block2 = block2

    def __repr__(self):
        return 'Schedule {1}, period: {2}{3}, blocks: {4}, {5}'.format(self.code, self.semester, self.period, self.block1, self.block2)


# Courses and which profile they belong to
class Course_profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    #code = db.Column(db.String(100))
    #profile_id = db.Column(db.Integer)
    code = db.Column(db.String(100), db.ForeignKey('course.code'))
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'))
    vof = db.Column(db.String(10))
    course = db.relationship("Course")

    def __init__(self, id, vof, profile_id, code):
        self.id = id
        self.vof = vof
        self.profile_id = profile_id
        self.code = code

    def __repr__(self):
        return '(Course_profile {}, profile: {}, code: {}, vof: {})'.format(self.id, self.profile_id, self.code, self.vof)

# Courses and which program they belong to
class Program_course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    #code = db.Column(db.String(100))
    code = db.Column(db.String(100), db.ForeignKey('course.code'))
    #program_id = db.Column(db.Integer)
    program_id = db.Column(db.Integer, db.ForeignKey('program.id'))


    course = db.relationship("Course")

    def __init__(self, id, program_id, code):
        self.id = id
        self.program_id = program_id
        self.code = code

    def __repr__(self):
        return 'ProgramCourse {} {} {}'.format(self.id, self.program_id, self.code)
