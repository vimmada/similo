import unittest
import json
from test.base import BaseTest
from test.examples import test_user1

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
        self.assertIn("Success", data)

    def test_can_create_user(self):
        """Can create user"""
        res = self.post(
            path=self.make_route("/users/"),
            data=json.dumps(test_user1))
        data, status = self.get_data_status(res)
        self.assertIn("token", data)
        self.assertEqual(status, 201)

    def test_can_login_user(self):
        """User can login"""
        user = self.create_user(test_user1)
        res = self.post(
            path=self.make_route("/login/"),
            data=json.dumps({
                "username": user.username,
                "password": user.password
                }))
        data, status = self.get_data_status(res)
        self.assertIn("token", data)
        self.assertEqual(status, 200)

    def test_cannot_create_duplicate_user(self):
        """Should not be able to duplicate usernames or emails"""
        user1 = self.create_user(test_user1)

        res = self.post(
            path=self.make_route("/users/"),
            data=json.dumps(test_user1))
        data, status = self.get_data_status(res)
        self.assertNotEqual(status, 201)
        self.assertNotIn("token", data)
