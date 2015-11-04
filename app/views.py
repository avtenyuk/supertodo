from flask import render_template, redirect, flash

from app import app, db
from forms import StickerForm
from models import Sticker, Folder, Task


@app.route('/')
def index():
    stickers = db.session.query(Sticker).filter_by(title='a1')
    return render_template('index.html', message=None, title='Home', stickers=stickers)


@app.route('/newsticker', methods= ['GET', 'POST'])
def news_ticker():
    # stickers = Sticker.query.all()
    stickers = db.session.query(Sticker).all()
    print dir(stickers[-1])
    print stickers[-1].folder
    form = StickerForm()
    title_page = 'Add new sticker'
    if form.validate_on_submit():
        fd = Folder(name=form.folder.data)
        st = Sticker(title=form.title.data, memo=form.text.data)
        tk = Task(text=form.task.data, status=form.status.data)
        db.session.add(st)
        db.session.commit()
        flash(' Success! ')
        return redirect('/newsticker')
    return render_template('newsticker.html', form=form, title = title_page, stickers=stickers)
