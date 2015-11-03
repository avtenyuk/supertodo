from flask.ext.wtf import Form
from wtforms import TextField, BooleanField
from wtforms.validators import Required

class StickerForm(Form):
    title = TextField('title sticker', validators=[Required()])
    text = TextField('text', validators=[Required()])
    important = BooleanField('important', default=False)




