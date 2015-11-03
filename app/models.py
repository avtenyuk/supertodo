import datetime

from sqlalchemy.exc import SQLAlchemyError

from app import db


def session_commit():
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        print str(e)


class Sticker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), index=True)
    memo = db.Column(db.Text)
    created = db.Column(db.DateTime, default=datetime.datetime.now())

    def __init__(self, title, memo):
        self.title = title
        self.memo = memo

    def __str__(self):
        return self.title

    @staticmethod
    def add(post):
        db.session.add(post)
        return session_commit()

    @staticmethod
    def delete(post):
        db.session.delete(post)
        return session_commit()
