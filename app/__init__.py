from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.triangle import Triangle

app = Flask(__name__)
app.config.from_object('config')
Triangle(app)

db = SQLAlchemy(app)


from app import views
