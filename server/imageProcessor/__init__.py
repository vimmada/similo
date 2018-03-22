import os
import sys
import flask
from werkzeug.wsgi import DispatcherMiddleware
from imageProcessor.model import db
from imageProcessor.config import app_config
from imageProcessor.views import index_bp
from imageProcessor.auth import auth_bp

def create_app(config_name):
    app = flask.Flask(__name__)
    app.config.from_object(app_config[config_name])
    app.register_blueprint(index_bp)
    app.register_blueprint(auth_bp)

    # Make directory for db when using sqlite3 in dev or testing
    if app.config.get("TESTING") or app.config.get("DEV"):
        db_dir = os.path.dirname(app.config.get("DATABASE_FILENAME"))
        if not os.path.exists(db_dir):
            try:
                os.mkdir(db_dir)
            except FileExistsError as e:
                pass

    db.init_app(app)

    # Only create tables if file does not exist already
    if app.config.get("DEV"):
        with app.app_context():
            db_file = app.config.get("DATABASE_FILENAME")
            try:
                if not os.path.isfile(db_file):
                    db.create_all()
            except Exception as e:
                print(e)
                sys.exit(1)
    return app
