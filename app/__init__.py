import os

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.triangle import Triangle
from flask_restful import Api


templates_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=templates_path, static_folder='static')
app.config.from_object('config')
db = SQLAlchemy(app)
api = Api(app)

Triangle(app)

from app import views

