import unittest
import json
import base64
from test.base import BaseTest

class TestHistory(BaseTest):
    """
    Tests History operations:
        GET         /history/
    """
    def test_can_get_history(self):
        """Can get search history of user"""
        image = b'hello world'
        image_64 = base64.b64encode(image).decode('ascii')

        self.create_user()
        res = self.post(
            path=self.make_route("/search/"),
            data=json.dumps({"image": image_64}))

        res = self.get(
            path=self.make_route("/history/"))
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertEqual(data['image'], image_64)
