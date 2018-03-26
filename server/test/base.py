import unittest
import json
from imageProcessor import create_app, db
from werkzeug.datastructures import Headers

class User:
    """Test Users"""
    def __init__(self, username, email, password, firstname, lastname, token=None):
        self.username = username
        self.email = email
        self.password = password
        self.firstname = firstname
        self.lastname = lastname
        self.token = token


class BaseTest(unittest.TestCase):
    """
    Base class for all test cases
    Instance variables:
    - app = Flask application
    - client = Client of flask application
    """
    url_prefix = ""

    def setUp(self):
        """Executed by unittest before every test"""
        self.app = create_app(config_name="testing")
        self.app.testing = True
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        """Executed by unittest after every test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def create_user(self, user_dict):
        """Creates a user from a dictionary, saves the token, returns user object"""
        res = self.post(
            path=self.make_route("/users/"),
            data=json.dumps(user_dict))
        data, status = self.get_data_status(res)
        self.assertIn("token", data)
        user = User(**user_dict, token=data['token'])
        return user

    def add_item(self, test_item, user):
        """Helper for adding test_item to the test_user (must be created beforehand)"""
        res = self.put(
            path=self.make_route("/items/"),
            data=json.dumps(test_item),
            user=user)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 201)
        return data, status

    def make_route(self, route):
        """Construct a route path with url_prefix"""
        return "".join([self.url_prefix, route])

    def get_data_status(self, res):
        """
        Returns a tuple (data, status)
            data = dict of response data
            status = http status code
        """
        return json.loads(res.get_data(as_text=True)), res.status_code

    def _request_common(self, user=None):
        """
        Common across all requests:
            - 'application/json' header
            -  Authorization header
        """
        context = {"content_type" : "application/json"}
        if user:
            headers = Headers()
            headers.add("Authorization", " ".join(["Bearer", user.token]))
            context["headers"] = headers
        return context

    def get(self, user=None, *args, **kwargs):
        """Wrapper class for sending GET requests"""
        context = self._request_common(user)
        res = self.client.get(*args, **kwargs, **context)
        return res

    def post(self, user=None, *args, **kwargs):
        """Wrapper class for sending POST requests"""
        context = self._request_common(user)
        res = self.client.post(*args, **kwargs, **context)
        return res

    def put(self, user=None, *args, **kwargs):
        """Wrapper class for sending PUT requests"""
        context = self._request_common(user)
        res = self.client.put(*args, **kwargs, **context)
        return res

    def delete(self, user=None, *args, **kwargs):
        """Wrapper class for sending DELETE requests"""
        context = self._request_common(user)
        res = self.client.delete(*args, **kwargs, **context)
        return res
