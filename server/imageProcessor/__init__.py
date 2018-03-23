import os
import sys
import logging
from logging.handlers import RotatingFileHandler
import flask
from flask import request
from werkzeug.wsgi import DispatcherMiddleware
from imageProcessor.model import db
from imageProcessor.config import app_config
from imageProcessor.views import index_bp
from imageProcessor.auth import auth_bp

def _make_dir(path):
    if not os.path.exists(path):
        try:
            os.mkdir(path)
        except FileExistsError:
            pass

def _register_blueprints(app):
    app.register_blueprint(index_bp)
    app.register_blueprint(auth_bp)

def _setup_db(app):
    """Initialize db (sqlite3) directory and create tables if necessary"""
    # Make directory for db when using sqlite3 in dev or testing
    if app.config.get("TESTING") or app.config.get("DEV"):
        db_dir = os.path.dirname(app.config.get("DATABASE_FILENAME"))
        _make_dir(db_dir)
    db.init_app(app)
    # Only create tables if file does not exist already
    if app.config.get("DEV"):
        with app.app_context():
            db_file = app.config.get("DATABASE_FILENAME")
            try:
                if not os.path.isfile(db_file):
                    db.create_all()
                    app.logger.info("Existing database not found. Creating new database")
            except Exception as e:
                app.logger.error("Error creating new database: {}".format(e))
                sys.exit(1)

def _config_app(config_name, app):
    """Import configs from config file"""
    app.config.from_object(app_config[config_name])

class ContextualFilter(logging.Filter):
    """Adds request context to logs"""
    def filter(self, record):
        record.method = request.method
        record.path = request.path
        return True

def _set_logging(app):
    """Set logging configuration"""
    log_path = app.config.get("LOGGER_LOCATION")
    _make_dir(os.path.dirname(log_path))

    if app.config.get("PRODUCTION"):
        handler = RotatingFileHandler(
            filename=log_path,
            maxBytes=4096,
            backupCount=3)
    else:
        handler = logging.FileHandler(filename=log_path)

    handler.setLevel(app.config.get("LOGGER_LEVEL"))
    formatter = logging.Formatter(app.config.get("LOGGER_FORMAT"))
    handler.setFormatter(formatter)
    handler.addFilter(ContextualFilter())
    app.logger.addHandler(handler)

def create_app(config_name):
    """Create the flask app"""
    app = flask.Flask(__name__)
    _config_app(config_name, app)
    _set_logging(app)
    _register_blueprints(app)
    _setup_db(app)
    return app
