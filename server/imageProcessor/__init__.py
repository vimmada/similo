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

# Define a basic app to combine with our app, so that we can isolate our app
# with prefix "/secretkey" when deploying among other student solutions
# on the server
# Disabling check since flask makes use of "env" parameter when deployed
# pylint: disable=unused-argument
def empty_app(env, resp):
    """Exists for the purpose of deploying to 485 class servers."""
    resp('200 OK', [('Content-Type', 'text/plain')])
    return [b"Enforcing Prefix"]
