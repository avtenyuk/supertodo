from flask import render_template, redirect, flash

from app import app
from forms import StickerForm


@app.route('/')
def index():
    return render_template('index.html', message=None, title='Home')


@app.route('/newsticker', methods= ['GET', 'POST'])
def news_ticker():
    form = StickerForm()
    title_page = 'Add new sticker'
    if form.validate_on_submit():
        flash('{} {} {}'.format(form.title.data, form.text.data,
                                form.important.data))
        return redirect('/')
    return render_template('newsticker.html', form=form, title = title_page)
