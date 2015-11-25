
from flask import render_template, redirect, flash, jsonify, make_response, request, url_for, session
from flask_restful import Resource, abort
from flask.ext.login import LoginManager, current_user, login_required, login_user, logout_user, AnonymousUserMixin
from app import app, db, api
from forms import LoginForm
from models import Sticker, Folder, Task, User


class Anonymous(AnonymousUserMixin):
    name = u"Anonymous"

login_manager = LoginManager()
login_manager.anonymous_user = Anonymous
login_manager.login_view = "login"
login_manager.login_message = u"Please log in to access this page."
login_manager.refresh_view = "reauth"
login_manager.setup_app(app)


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route("/todo")
@login_required
def todo():
    return render_template("todo.html")


@app.route("/", methods=["GET", "POST"])
def index():
    if 'user_id' in session:
        return redirect(url_for('todo'))
    form = LoginForm()
    if request.method == "POST" and "username" in request.form and form.validate_on_submit():
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(nickname=username, password=password).first()
        if not user:
            flash("User does not exist or your password is bad. Try again")
            return redirect(url_for('index'))
        user.active = True
        remember = request.form.get("remember", "no") == "yes"
        if login_user(user, remember=remember):
            flash("Logged in!")
            print 'start', user.current_token
            print session['csrf_token']
            user.current_token = session['csrf_token']
            db.session.commit()
            print 'finish', user.current_token
            # return redirect(url_for('todo'))
            return redirect('/todo#!/')
        else:
            flash("Sorry, but you could not log in.")
    return render_template("index.html", form = form)

@app.route("/logout")
@login_required
def logout():
    current_user.current_token = ''
    db.session.commit()
    session.clear()
    logout_user()
    flash("Logged out.")
    return redirect(url_for("index"))


@app.errorhandler(404)
def not_found(error):
    '''
    :param error:
    :return: page with status 404
    '''
    return render_template('404.html')


def get_user_folders(user):
    user_folders_id = [x.id for x in user.folders]
    return user_folders_id


def get_user_from_id(user_id):
    user = User.query.get(user_id)
    return user


class StickerApi(Resource):

    @login_required
    def get(self):
        user = get_user_from_id(session['user_id'])
        trash_status = False
        try:
            if 'trash' in request.json:
                trash_status = True
        except (KeyError, TypeError):
            pass
        stickers = [x.as_json() for x in db.session.query(Sticker).filter(Sticker.trash == trash_status) \
                                                            .join(Folder).filter(Folder.user_id == user.id)]
        return {'stickers': stickers}, 200

    @login_required
    def post(self):
        user = get_user_from_id(session['user_id'])
        if int(request.json['folder_id']) not in get_user_folders(user):
            return abort(403, message='Access is denied', status=403)
        new_sticker = Sticker(**request.json)
        db.session.add(new_sticker)
        db.session.commit()
        return {'sticker': new_sticker.as_json(), 'user_id': user.id}, 201

api.add_resource(StickerApi, '/api/sticker')


def sticker_exist(sticker_id):
    try:
        sticker = Sticker.query.filter_by(id=sticker_id).first()
    except KeyError:
        return abort(403, message='You need a sticker_id', status=403)
    if sticker:
        return sticker
    else:
        return abort(404, message='This scticker does not exist', status=404)


def check_sticker_owner(sticker_id, user):
    sticker = sticker_exist(sticker_id)
    if sticker.folder_id not in get_user_folders(user):
        return abort(403, message='Access is denied', status=403)
    else:
        return sticker


class OneStickerApi(Resource):

    @login_required
    def get(self, sticker_id):
        user = get_user_from_id(session['user_id'])
        sticker = check_sticker_owner(sticker_id, user)
        return {'sticker': sticker.as_json()}

    @login_required
    def delete(self, sticker_id):
        user = get_user_from_id(session['user_id'])
        sticker = check_sticker_owner(sticker_id, user)
        if sticker.folder_id not in get_user_folders(user):
            return abort(403, message='Access is denied', status=403)
        else:
            sticker.trash = True
            db.session.commit()
            return '', 204

    @login_required
    def put(self, sticker_id):
        user = get_user_from_id(session['user_id'])
        sticker = check_sticker_owner(sticker_id, user)
        db.session.query(Sticker).filter(Sticker.id==sticker.id).update(request.json)
        db.session.commit()
        return {'sticker': sticker.as_json()}, 201


api.add_resource(OneStickerApi, '/api/sticker/<sticker_id>')


class TaskApi(Resource):

    @login_required
    def get(self):
        user = get_user_from_id(session['user_id'])
        try:
            sticker = sticker_exist(request.args['sticker_id'])
        except (KeyError, TypeError):
            return abort(403, message='You need a sticker_id', status=403)
        if sticker.folder_id not in get_user_folders(user):
            return abort(403, message='Access is denied', status=403)
        task_list = []
        for task in sticker.tasks:
            task_list.append({'text': task.text, 'status': task.status, 'id': task.id, 'sticker_id': task.sticker_id,
                             'trash': sticker.trash})
        return {'tasks': task_list}

    @login_required
    def post(self):
        user = get_user_from_id(session['user_id'])
        try:
            sticker = sticker_exist(request.json['sticker_id'])
        except AttributeError:
            return abort(403, message='Access is denied', status=403)
        if not sticker:
            return abort(403, message='Access is denied', status=403)
        if sticker.folder_id not in get_user_folders(user):
            return abort(403, message='Access is denied', status=403)
        else:
            request.json['status'] = False
            new_task = Task(**request.json)
            db.session.add(new_task)
            db.session.commit()
        return {'task': new_task.as_json()}, 201


api.add_resource(TaskApi, '/api/task')


def task_exist(task_id):
    task = Task.query.filter_by(id=task_id).first()
    if task:
        return task
    else:
        return abort(404, message='This task does not exist', status=404)


class OneTaskApi(Resource):

    @login_required
    def get(self, task_id):
        task = task_exist(task_id)
        return {'task': task.as_json()}

    @login_required
    def put(self, task_id):
        task = task_exist(task_id)
        db.session.query(Task).filter(Task.id == task.id).update(request.json)
        db.session.commit()
        return {'task': task.as_json()}, 201

    @login_required
    def delete(self, task_id):
        task = task_exist(task_id)
        task.trash = True
        db.session.commit()
        return '', 204

api.add_resource(OneTaskApi, '/api/task/<task_id>')


class FolderApi(Resource):

    @login_required
    def get(self):
        user = get_user_from_id(session['user_id'])
        return {'folders': [f.as_json() for f in Folder.query.filter_by(user_id=user.id)]}

    @login_required
    def post(self):
        user = get_user_from_id(session['user_id'])
        name = request.json['name']
        new_folder = Folder(name=name)
        new_folder.user_id = user.id
        db.session.add(new_folder)
        db.session.commit()
        return {'folder': new_folder.as_json()}, 201

api.add_resource(FolderApi, '/api/folder')

def folder_exist(folder_id, user_id):
    folder = Folder.query.filter_by(id=folder_id, user_id=user_id).first()
    if folder:
        return folder
    else:
        return abort(404, message='This folder does not exist', status=404)

class OneFolderApi(Resource):

    @login_required
    def get(self, folder_id):
        user = get_user_from_id(session['user_id'])
        folder = folder_exist(folder_id, user.id)
        return {'folder': folder.as_json()}

    @login_required
    def put(self, folder_id):
        user = get_user_from_id(session['user_id'])
        folder = folder_exist(folder_id, user.id)
        db.session.query(Folder).filter(Folder.id == folder.id).update(request.json)
        db.session.commit()
        return {'folder': folder.as_json()}, 201

    @login_required
    def delete(self, folder_id):
        user = get_user_from_id(session['user_id'])
        folder = folder_exist(folder_id, user.id)
        folder.trash = True
        db.session.commit()
        return '', 204

api.add_resource(OneFolderApi, '/api/folder/<folder_id>')
