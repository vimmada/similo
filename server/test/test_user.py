import unittest
import json
from test.base import BaseTest

class TestUser(BaseTest):
    """
    Test user operations:
        POST /login/        - Login existing user
        POST /users/        - Create account
    """
    def test_can_get_hello_world(self):
        """Hello world route works"""
        res = self.client.get(self.make_route("/"))
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn("message", data)

    def test_can_create_user(self):
        """Can create user"""
        res = self.client.post(
                path=self.make_route("/users/"),
                data=json.dumps(self.test_user),
                content_type="application/json"
                )
        data, status = self.get_data_status(res)
        self.assertIn("token", data)
        self.assertEqual(status, 201)
