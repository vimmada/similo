import flask
from werkzeug.wsgi import DispatcherMiddleware

# app is a single object used by all the code modules in this package
app = flask.Flask(__name__)  # pylint: disable=invalid-name

# Define a basic app to combine with our app, so that we can isolate our app
# with prefix "/secretkey" when deploying among other student solutions
# on the server
# Disabling check since flask makes use of "env" parameter when deployed
# pylint: disable=unused-argument
def empty_app(env, resp):
    """Exists for the purpose of deploying to 485 class servers."""
    resp('200 OK', [('Content-Type', 'text/plain')])
    return [b"Enforcing Prefix"]

# Read settings from config module (insta485/config.py)
app.config.from_object('imageProcessor.config')

# Tell our app about views and model.  This is dangerously close to a
# circular import, which is naughty, but Flask was designed that way.
# (Reference http://flask.pocoo.org/docs/0.12/patterns/packages/)  We're
# going to tell pylint and pycodestyle to ignore this coding style violation.
import imageProcessor.views  # noqa: E402  pylint: disable=wrong-import-position
