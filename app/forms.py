from flask.ext.wtf import Form
from wtforms import TextField, BooleanField, PasswordField
from wtforms.validators import Required


class StickerForm(Form):
    folder = TextField('folder', validators=[Required()])
    title = TextField('title sticker', validators=[Required()])
    text = TextField('text', validators=[Required()])
    task = TextField('task', validators=[Required()])
    status = BooleanField('status', default=False)



class LoginForm(Form):
    username = TextField('openid', validators = [Required()])
    password = PasswordField('password', validators=[Required()])
    remember_me = BooleanField('remember_me', default = False)


