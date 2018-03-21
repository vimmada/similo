import flask
from werkzeug.wsgi import DispatcherMiddleware
from imageProcessor.model import db
from imageProcessor.config import app_config
from imageProcessor.views import api

def create_app(config_name):
    app = flask.Flask(__name__)
    app.config.from_object(app_config[config_name])
    app.register_blueprint(api)
    db.init_app(app)

    with app.app_context():
        db.create_all()
    return app
