#!env/bin/python

from app import db
from app.models import Sticker


def main():
    for x in xrange(10):
        st = Sticker(title='py generator', memo='py memo text', folder_id=1)
        db.session.add(st)
        db.session.commit()


def delete_all():
    st = db.session.query(Sticker).all()
    db.session.delete(st)
    db.session.commit()


if __name__ == '__main__':
    delete_all()
#    main()