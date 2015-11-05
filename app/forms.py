from flask.ext.wtf import Form
from wtforms import TextField, BooleanField
from wtforms.validators import Required


class StickerForm(Form):
    folder = TextField('folder', validators=[Required()])
    title = TextField('title sticker', validators=[Required()])
    text = TextField('text', validators=[Required()])
    task = TextField('task', validators=[Required()])
    status = BooleanField('status', default=False)



