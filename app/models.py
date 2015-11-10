import json
import datetime

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func

from app import db


def session_commit():
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        print str(e)


class Folder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), index=True)
    stickers = db.relationship('Sticker', backref='folder')

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

    def __init__(self, title, memo, folder_id):
        self.title = title
        self.memo = memo
        # self.created = func.now()
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

    def __init__(self, text, sticker_id, status):
        self.text = text
        self.sticker_id = sticker_id
        self.status = status

    def __str__(self):
        return self.text

    def as_json(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}