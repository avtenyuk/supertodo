
from flask import render_template, redirect, flash, jsonify, make_response, request, url_for, g, session, escape
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


@app.route("/")
@login_required
def index():
    return render_template("index.html", user=current_user.nickname.upper(), token=session['csrf_token'])


@app.route('/test', methods=['GET', 'POST'])
def test():
    print request.json
    return render_template('')

@app.route("/login", methods=["GET", "POST"])
def login():
    if 'user_id' in session:
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
        remember = request.form.get("remember", "no") == "yes"
        if login_user(user, remember=remember):
            flash("Logged in!")
            print 'start', user.current_token
            print session['csrf_token']
            user.current_token = session['csrf_token']
            db.session.commit()
            print 'finish', user.current_token
            return redirect(url_for("index"))
        else:
            flash("Sorry, but you could not log in.")
    return render_template("login.html", form = form)

@app.route("/logout")
@login_required
def logout():
    current_user.current_token = ''
    db.session.commit()
    session.clear()
    logout_user()
    flash("Logged out.")
    return redirect(url_for("login"))


@app.errorhandler(404)
def not_found(error):
    '''
    :param error:
    :return: page with status 404
    '''
    return make_response(jsonify({'error': 'Not found', 'status':404}), 404)

# end global functions

def check_token(token):
    try:
        user = User.query.filter_by(current_token=token).first()
        if not user:
            return abort(400, message='Token does not correct', status=400)
        else:
            return user
    except KeyError:
        return abort(400, message='You must have a token', status=400)

# Start Sticker Api
def get_user_folders(user):
    user_folders_id = [x.id for x in user.folders]
    return user_folders_id



# DONE!
class StickerApi(Resource):

    def get(self):
        user = check_token(request.json['token'])
        trash_status = False
        try:
            if request.json['trash']:
                trash_status = True
        except KeyError:
            pass
        stickers = [x.as_json() for x in db.session.query(Sticker).filter(Sticker.trash == trash_status) \
                                                            .join(Folder).filter(Folder.user_id == user.id)]
        return {'stickers': stickers}, 200


    def post(self):
        user = check_token(request.json['token'])
        del request.json['token']
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

# DONE!
class OneStickerApi(Resource):


    def get(self, sticker_id):
        user = check_token(request.json['token'])
        sticker = check_sticker_owner(sticker_id, user)
        return {'sticker': sticker.as_json()}

    def delete(self, sticker_id):
        user = check_token(request.json['token'])
        sticker = check_sticker_owner(sticker_id, user)
        if sticker.folder_id not in get_user_folders(user):
            return abort(403, message='Access is denied', status=403)
        else:
            sticker.trash = True
            db.session.commit()
            return '', 204


    def put(self, sticker_id):
        user = check_token(request.json['token'])
        sticker = check_sticker_owner(sticker_id, user)
        del request.json['token']
        db.session.query(Sticker).filter(Sticker.id==sticker.id).update(request.json)
        db.session.commit()
        return {'sticker': sticker.as_json()}, 201


api.add_resource(OneStickerApi, '/api/sticker/<sticker_id>')

# End Sticker Api


# Start Task Api

# DONE!
class TaskApi(Resource):


    def get(self):
        user = check_token(request.json['token'])
        try:
            sticker = sticker_exist(request.json['sticker_id'])
        except KeyError:
            return abort(403, message='You need a sticker_id', status=403)
        if sticker.folder_id not in get_user_folders(user):
            return abort(403, message='Access is denied', status=403)
        task_list = []
        for task in sticker.tasks:
            task_list.append({'text': task.text, 'status': task.status, 'id': task.id, 'sticker_id': task.sticker_id,
                             'trash': sticker.trash})
        return {'tasks': task_list}


    def post(self):
        user = check_token(request.json['token'])
        try:
            sticker = sticker_exist(request.json['sticker_id'])
        except AttributeError:
            return abort(403, message='Access is denied', status=403)
        if not sticker:
            return abort(403, message='Access is denied', status=403)
        if sticker.folder_id not in get_user_folders(user):
            return abort(403, message='Access is denied', status=403)
        else:
            del request.json['token']
            request.json['status'] = False
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


def check_owner_task(task_id, user):
        task = task_not_exist(task_id)
        task_owner = db.session.query(User).filter \
                    (~User.folders.any(Folder.stickers.any(Sticker.tasks.any(Task.id == user.id)))).first()
        task_owner = task_owner
        if task_owner.id == user.id:
            return task
        else:
            return abort(403, message='Access is denied', status=403)


class OneTaskApi(Resource):

    def get(self, task_id):
        user = check_token(request.json['token'])
        task = check_owner_task(task_id, user)
        return {'task': task.as_json()}


    def put(self, task_id):
        user = check_token(request.json['token'])
        task = check_owner_task(task_id, user)
        del request.json['token']
        db.session.query(Task).filter(Task.id == task.id).update(request.json)
        db.session.commit()
        return {'task': task.as_json()}, 201


    def delete(self, task_id):
        user = check_token(request.json['token'])
        task = check_owner_task(task_id, user)
        task.trash = True
        db.session.commit()
        return '', 204

api.add_resource(OneTaskApi, '/api/task/<task_id>')

# End Task Api


# Start Folder Api

class FolderApi(Resource):

    @login_required
    def get(self):
        return {'folders': [f.as_json() for f in Folder.query.all()]}

    @login_required
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

    @login_required
    def get(self, folder_id):
        folder = folder_not_exist(folder_id)
        return {'folder': folder.as_json()}

    @login_required
    def put(self, folder_id):
        folder = folder_not_exist(folder_id)
        db.session.query(Folder).filter(Folder.id == folder.id).update(request.json)
        db.session.commit()
        return {'folder': folder.as_json()}, 201

    @login_required
    def delete(self, folder_id):
        folder = folder_not_exist(folder_id)
        db.session.query(Folder).filter_by(id=folder.id).delete()
        db.session.commit()
        return '', 204

api.add_resource(OneFolderApi, '/api/folder/<folder_id>')

# End Folder Api