import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


SQLALCHEMY_DATABASE_URI = "postgresql://usertodo:123456@localhost/supertodo"
SQLALCHEMY_MIGRATE_REPO = os.path.join(BASE_DIR, 'db_repository')
SQLALCHEMY_TRACK_MODIFICATIONS = True


SECRET_KEY = 'you-will-never-guess'

try:
    import local_settings
except:
    pass