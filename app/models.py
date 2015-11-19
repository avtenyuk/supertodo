import datetime


from sqlalchemy.exc import SQLAlchemyError
from flask.ext.login import UserMixin

from app import db


def session_commit():
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        print str(e)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(120))
    active = db.Column(db.Boolean, default=False)
    folders = db.relationship('Folder', backref='user')
    current_token = db.Column(db.String(100), index=True, unique=True, nullable=True)

    def __str__(self):
        return self.nickname


class Folder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), index=True)
    stickers = db.relationship('Sticker', backref='folder')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    trash = db.Column(db.Boolean, default=False)

    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name

    def as_json(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Sticker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), index=True)
    memo = db.Column(db.Text)
    created = db.Column(db.DateTime)
    folder_id = db.Column(db.Integer, db.ForeignKey('folder.id'))
    tasks = db.relationship('Task', backref='task')
    trash = db.Column(db.Boolean, default=False)

    def __init__(self, title, memo, folder_id):
        self.title = title
        self.memo = memo
        self.created = datetime.datetime.now()
        self.folder_id = folder_id

    def __str__(self):
        return self.title

    def as_json(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        data['created'] = self.created.isoformat()
        return data


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, index=True)
    status = db.Column(db.Boolean, default=False)
    sticker_id = db.Column(db.Integer, db.ForeignKey('sticker.id'))
    trash = db.Column(db.Boolean, default=False)

    def __init__(self, text, sticker_id, status):
        self.text = text
        self.sticker_id = sticker_id
        self.status = status

    def __str__(self):
        return self.text

    def as_json(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
