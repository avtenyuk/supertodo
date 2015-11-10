import re


from flask import render_template, redirect, flash, jsonify, make_response, request
from flask_restful import Resource, abort, reqparse

from app import app, db, api
from forms import StickerForm
from models import Sticker, Folder, Task

# Start API
@app.errorhandler(404)
def not_found(error):
    '''
    :param error:
    :return: page with status 404
    '''
    return make_response(jsonify({'error': 'Not found', 'status':404}), 404)


def sticker_not_exist(sticker_id):
    sticker = Sticker.query.filter_by(id=sticker_id).first()
    if sticker:
        return sticker
    else:
        return abort(404, message='This scticker does not exist', status=404)


class StickerApi(Resource):
    def get(self):
        stickers = [x.as_json() for x in Sticker.query.all()]
        return {'stickers': stickers}, 200

    def post(self):
        new_sticker = Sticker(**request.json)
        db.session.add(new_sticker)
        db.session.commit()
        return {'sticker': new_sticker.as_json()}, 201

api.add_resource(StickerApi, '/api/sticker')


class OneStickerApi(Resource):

    def get(self, sticker_id):
        sticker = sticker_not_exist(sticker_id)
        return {'sticker': sticker.as_json()}

    def delete(self, sticker_id):
        sticker = sticker_not_exist(sticker_id)
        db.session.query(Sticker).filter_by(id=sticker.id).delete()
        db.session.commit()
        return '', 204

    def put(self, sticker_id):
        sticker = sticker_not_exist(sticker_id)
        updated_sticker = db.session.query(Sticker).filter(Sticker.id==sticker.id).update(request.json)
        db.session.commit()
        print 'args - ', request.json
        return {'sticker': sticker.as_json()}, 201


api.add_resource(OneStickerApi, '/api/sticker/<sticker_id>')

#

# End API



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
