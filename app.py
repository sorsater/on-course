#!/usr/bin/env python3

import flask
from flask import Flask, redirect, render_template, url_for
import flask_login

from plate import *
from oauth import OAuthSignIn

import random

from secrets import facebook_secret

app = Flask(__name__)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

app.config['OAUTH_CREDENTIALS'] = {
    'facebook': {
        'id': '1489686947739416',
        'secret': facebook_secret
    },
}

app.secret_key = 'potatis'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plate.db'
db.app = app
db.init_app(app)
db.create_all()


@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not flask_login.current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()

@app.route('/callback/<provider>')
def oauth_callback(provider):
    if not flask_login.current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email = oauth.callback()
    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('index'))
    user = User.query.filter_by(social_id=social_id).first()
    if not user:
        user = User(social_id=social_id, nickname=username, email=email)
        db.session.add(user)
        db.session.commit()
    flask_login.login_user(user, True)
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('index'))

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route('/kakburk')
def hello():
    cart = flask.request.cookies.get('cart')
    if not cart:
        return 'slut på 🍪'
    return cart

@app.route('/user_cart', methods=['POST'])
def store_user_cart():
    data = flask.request.get_json()
    cart = Cart(data['name'], data['user_id'], data['cart'])
    db.session.add(cart)
    db.session.commit()
    return 'OK', 200


@app.route('/_get_fields', methods=['GET'])
def get_fields():
    selected_program = flask.request.args.get('program')
    program = Program.query.filter(Program.name == selected_program).one()

    fields = []
    for field in program.fields:
        fields.append({
            'id': field.id,
            'name': field.name,
            'program_id': field.program_id,
        })

    return flask.json.jsonify(fields)

@app.route('/_get_profiles', methods=['GET'])
def get_profiles():
    selected_program = flask.request.args.get('program')
    program = Program.query.filter(Program.name == selected_program).one()

    profiles = []
    for field in program.fields:
        for profile in field.profiles:
            profiles.append({
                'id': profile.id,
                'name': profile.name,
                'fieldID': profile.field_id,
                'link': profile.link,
            })

    return flask.json.jsonify(profiles)

@app.route('/_get_schedule')
def get_schedule():
    schedule = Schedule.query.order_by(Schedule.id)

    schedules = []
    for s in schedule:
        schedules.append({
            'id': s.id,
            'code': s.code,
            'semester': s.semester,
            'period': s.period,
            'block1': s.block1,
            'block2': s.block2,
        })

    return flask.json.jsonify(schedules)

@app.route('/_get_courses', methods=['GET'])
def get_courses():
    selected_program = flask.request.args.get('program')
    program = Program.query.filter(Program.name == selected_program).one()

    courses = []
    for pc in program.courses:
        if pc.course:
            courses.append({
                'code': pc.course.code,
                'name': pc.course.name,
                'level': pc.course.level,
                'hp': pc.course.hp,
                'link': pc.course.link,
            })


    return flask.json.jsonify(courses)

@app.route('/_get_profile_courses', methods=['GET'])
def get_profileCourses():
    selected_program = flask.request.args.get('program')
    program = Program.query.filter(Program.name == selected_program).one()

    profileCourses = []
    for field in program.fields:
        for profile in field.profiles:
            for pr_c in profile.courses:
                profileCourses.append({
                    'id': pr_c.id,
                    'code': pr_c.code,
                    'profileID': pr_c.profile_id,
                    'vof': pr_c.vof,
                })

    return flask.json.jsonify(profileCourses)

@app.route('/')
def index(selected_program='Datateknik'):
    program = Program.query.filter(Program.name == selected_program).one()
    schedule = Schedule.query.order_by(Schedule.id)
    return render_template('index.html', program=program, schedule=schedule)

@app.errorhandler(404)
def page_not_found(e):
    return 'potatis', 404



if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
