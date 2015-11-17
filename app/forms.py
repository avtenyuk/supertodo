from flask.ext.wtf import Form
from wtforms import TextField, BooleanField, PasswordField
from wtforms.validators import Required


class LoginForm(Form):
    username = TextField('openid', validators = [Required()])
    password = PasswordField('password', validators=[Required()])
    remember_me = BooleanField('remember_me', default = False)


