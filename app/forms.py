from flask.ext.wtf import Form
from wtforms import StringField, BooleanField, PasswordField, validators
from wtforms.validators import DataRequired, Email

from app.models import User


class LoginForm(Form):
    username = StringField('Username', [validators.Length(min=3, max=25)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('remember_me', default = False)


class RegisterForm(Form):
    email = StringField('Email Address', [validators.Length(min=6, max=35), Email()])
    password = PasswordField('New Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords must match'),
        validators.Length(min=6, max=35),
    ])
    confirm = PasswordField('Repeat Password')

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False
        new_username = self.email.data.split('@')[0]
        username = User.query.filter_by(nickname=new_username).first()
        if username:
            self.email.errors.append('This email is already taken ')
            return False
        return True
