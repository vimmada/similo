import unittest
import json
from imageProcessor import create_app, db

class BaseTest(unittest.TestCase):
    """
    Base class for all test cases
    Instance variables:
    - app = Flask application
    - client = Client of flask application
    """
    url_prefix = "/api"
    test_user = {
        "username" : "anonymous",
        "email" : "john@anon.com",
        "password" : "unbreakable",
        "firstname" : "John",
        "lastname" : "Smith"
    }

    def setUp(self):
        self.app = create_app(config_name="testing")
        self.app.testing = True
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def login(self):
        """
        Executes user login
        """
        pass

    def create_user(self):
        """
        Creates a user and saves the token
        """
        res = self.client.post(
                path=self.make_route("/users/"),
                data=json.dumps(self.test_user),
                content_type="application/json"
                )
        data, status = self.get_data_status(res)
        self.assertIn("token", data)
        self.token = data.get('token')

    def make_route(self, route):
        """
        Construct a route path with url_prefix
        """
        return "".join([self.url_prefix, route])

    def get_data_status(self, res):
        """
        Returns a tuple (data, status)
        data = dict of response data
        status = http status code
        """
        return json.loads(res.get_data(as_text=True)), res.status_code

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
