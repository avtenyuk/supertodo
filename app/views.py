import timeit
import json

from flask import render_template, redirect, flash, jsonify, abort, make_response, request


from app import app, db
from forms import StickerForm
from models import Sticker, Folder, Task


def get_or_create(model, **kwargs):
    session = db.session
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        return instance


# Start API

@app.route('/api/v1.0/stickers', methods=['GET'])
def stickers_api():
    '''
    :return: all stickers from database
    '''
    start_timer = timeit.default_timer()
    stickers = Sticker.query.all()
    json_stickers = [x.as_json() for x in stickers]
    stop_timer = timeit.default_timer()
    timer = stop_timer - start_timer
    return jsonify({'status':200, 'time': timer, 'stickers': json_stickers})


@app.route('/api/v1.0/stickers/<int:sticker_id>', methods=['GET'])
def get_sticker(sticker_id):
    '''
    :param sticker_id:
    :return: one sticker as json
    '''
    sticker = Sticker.query.get(sticker_id)
    if not sticker:
        abort(404)
    return jsonify({'sticker': sticker.as_json()})


@app.route('/api/v1.0/stickers', methods=['POST'])
def create_sticker():
    if not request.json:
        abort(404)
    sticker = Sticker(**request.json)
    db.session.add(sticker)
    db.session.commit()

    return jsonify({'status': 201})


@app.errorhandler(404)
def not_found(error):
    '''
    :param error:
    :return: page with status 404
    '''
    return make_response(jsonify({'error': 'Not found', 'status':404}), 404)

# End API





@app.route('/')
def index():
    stickers = db.session.query(Sticker).filter_by(title='a1')
    return render_template('index.html', message=None, title='Home', stickers=stickers)


@app.route('/newsticker', methods= ['GET', 'POST'])
def new_ticker():
    stickers = db.session.query(Sticker).all()
    form = StickerForm()
    title_page = 'Add new sticker'
    if form.validate_on_submit():
        fd = get_or_create(Folder, name=form.folder.data)
        st = get_or_create(Sticker, title=form.title.data, memo=form.text.data, folder_id=fd.id)
        tk = Task(text=form.task.data, status=form.status.data, sticker_id=st.id)
        db.session.add(tk)
        db.session.commit()
        flash(' Success! ')
        return redirect('/newsticker')
    return render_template('newsticker.html', form=form, title = title_page, stickers=stickers)

# it will be off, because we are use api's 404 function
# @app.errorhandler(404)
# def not_found_error(error):
#     return render_template('404.html'), 404

@app.route('/newsticker/delete/<int:id>')
def delete_sticker(id):
    sticker = Sticker.query.get(id)
    if sticker == None:
        flash('Sticker not found')
        return redirect('/newsticker')
    db.session.delete(sticker)
    db.session.commit()
    flash('Sticker number {} has been deleted'.format(id))
    return redirect('/newsticker')
