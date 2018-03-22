import unittest
import json
from imageProcessor import create_app, db
from werkzeug.datastructures import Headers

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

    test_item = {
        "item": {
            "title": "Adidas x Kanye Yeezys",
            "description": "From Kanye and Adidas collaboration, the original Yeezy Boost Sneaker",
            "image_url": "https://www.flightclub.com/media/catalog/product/cache/1/image/1600x1140/9df78eab33525d08d6e5fb8d27136e95/2/0/201122_01.jpg",
            "product_url": "https://www.flightclub.com/adidas-yeezy-boost-350-pirblk-pirblk-pirblk-201122",
            "price": 150000
        }
    }

    test_search = {
        "image": "8787asd9872"
    }

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

    def create_user(self):
        """Creates a user and saves the token"""
        res = self.post(
            path=self.make_route("/users/"),
            data=json.dumps(self.test_user))
        data, status = self.get_data_status(res)
        self.assertIn("token", data)
        self.token = data.get('token')

    def add_item(self):
        """Helper for adding test_item to the test_user (must be created beforehand)"""
        res = self.put(
            path=self.make_route("/items/"),
            data=json.dumps(self.test_item))
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

    def _request_common(self):
        """
        Common across all requests:
            - 'application/json' header
            -  Authorization header
        """
        context = {"content_type" : "application/json"}
        if hasattr(self, 'token'):
            headers = Headers()
            headers.add("Authorization", " ".join(["Bearer", self.token]))
            context["headers"] = headers
        return context

    def get(self, *args, **kwargs):
        """Wrapper class for sending GET requests"""
        context = self._request_common()
        res = self.client.get(*args, **kwargs, **context)
        return res

    def post(self, *args, **kwargs):
        """Wrapper class for sending POST requests"""
        context = self._request_common()
        res = self.client.post(*args, **kwargs, **context)
        return res

    def put(self, *args, **kwargs):
        """Wrapper class for sending PUT requests"""
        context = self._request_common()
        res = self.client.put(*args, **kwargs, **context)
        return res

    def delete(self, *args, **kwargs):
        """Wrapper class for sending DELETE requests"""
        context = self._request_common()
        res = self.client.delete(*args, **kwargs, **context)
        return res
