import os

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.triangle import Triangle


CURRENT_FOLDER = os.path.abspath(os.path.dirname(__file__))
templates_path = os.path.join(CURRENT_FOLDER, 'templates')

app = Flask(__name__, template_folder=templates_path, static_folder='static')
app.config.from_object('config')
Triangle(app)

db = SQLAlchemy(app)


from app import views
