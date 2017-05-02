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

@app.route('/')
def index():
    courses = Courses.query.order_by(Courses.code)
    profiles = Profiles.query.filter(Profiles.fieldID == 8)
    return render_template('index.html', courses=courses, profiles=profiles)

@app.route('/test')
def hello():
    return render_template('hello.html')

if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
