
from flask import render_template, redirect, flash, jsonify, make_response, request, url_for, g, session, escape
from flask_restful import Resource, abort
from flask.ext.login import LoginManager, current_user, login_required, login_user, logout_user, \
                            fresh_login_required, AnonymousUserMixin

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


@app.route("/")
@login_required
def index():
    return render_template("index.html")



@app.route("/secret")
@login_required
def secret():
    session.clear()
    return 'ok'


@app.route("/login", methods=["GET", "POST"])
def login():
    if 'user_id' in session:
        print 'redirect'
        return redirect(url_for('index'))
    form = LoginForm()
    if request.method == "POST" and "username" in request.form and form.validate_on_submit():
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(nickname=username, password=password).first()
        if not user:
            flash("User does not exist or your password is bad. Try again")
            return redirect('/login')
        user.active = True
        db.session.commit()
        remember = request.form.get("remember", "no") == "yes"
        if login_user(user, remember=remember):
            flash("Logged in!")
            return redirect(url_for("secret"))
        else:
            flash("Sorry, but you could not log in.")
    return render_template("login.html", form = form)


@app.route("/logout")
@login_required
def logout():
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
    return make_response(jsonify({'error': 'Not found', 'status':404}), 404)

# end global functions

# Start Sticker Api

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


def sticker_not_exist(sticker_id):
    sticker = Sticker.query.filter_by(id=sticker_id).first()
    if sticker:
        return sticker
    else:
        return abort(404, message='This scticker does not exist', status=404)


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
        db.session.query(Sticker).filter(Sticker.id==sticker.id).update(request.json)
        db.session.commit()
        print 'args - ', request.json
        return {'sticker': sticker.as_json()}, 201


api.add_resource(OneStickerApi, '/api/sticker/<sticker_id>')

# End Sticker Api

# Start Task Api

class TaskApi(Resource):
    def get(self):
        return {'tasks': [t.as_json() for t in Task.query.all()]}

    def post(self):
        new_task = Task(**request.json)
        db.session.add(new_task)
        db.session.commit()
        return {'task': new_task.as_json()}, 201

api.add_resource(TaskApi, '/api/task')


def task_not_exist(task_id):
    task = Task.query.filter_by(id=task_id).first()
    if task:
        return task
    else:
        return abort(404, message='This task does not exist', status=404)


class OneTaskApi(Resource):
    def get(self, task_id):
        task = task_not_exist(task_id)
        return {'task': task.as_json()}

    def put(self, task_id):
        task = task_not_exist(task_id)
        db.session.query(Task).filter(Task.id == task.id).update(request.json)
        db.session.commit()
        return {'task': task.as_json()}, 201

    def delete(self, task_id):
        task = task_not_exist(task_id)
        db.session.query(Task).filter_by(id=task.id).delete()
        db.session.commit()
        return '', 204

api.add_resource(OneTaskApi, '/api/task/<task_id>')

# End Task Api


# Start Folder Api

class FolderApi(Resource):
    def get(self):
        return {'folders': [f.as_json() for f in Folder.query.all()]}

    def post(self):
        new_folder = Folder(**request.json)
        db.session.add(new_folder)
        db.session.commit()
        return {'folder': new_folder.as_json()}, 201

api.add_resource(FolderApi, '/api/folder')

def folder_not_exist(folder_id):
    folder = Folder.query.filter_by(id=folder_id).first()
    if folder:
        return folder
    else:
        return abort(404, message='This folder does not exist', status=404)

class OneFolderApi(Resource):
    def get(self, folder_id):
        folder = folder_not_exist(folder_id)
        return {'folder': folder.as_json()}

    def put(self, folder_id):
        folder = folder_not_exist(folder_id)
        db.session.query(Folder).filter(Folder.id == folder.id).update(request.json)
        db.session.commit()
        return {'folder': folder.as_json()}, 201

    def delete(self, folder_id):
        folder = folder_not_exist(folder_id)
        db.session.query(Folder).filter_by(id=folder.id).delete()
        db.session.commit()
        return '', 204

api.add_resource(OneFolderApi, '/api/folder/<folder_id>')

# End Folder Api