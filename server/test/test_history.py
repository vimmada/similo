import unittest
import json
import base64
from test.base import BaseTest
from test.examples import test_user1, test_user2

class TestHistory(BaseTest):
    """
    Tests History operations:
        GET         /history/
    """
    @unittest.skip("STUB")
    def test_can_get_history(self):
        """Can get search history of user"""
        image = b'hello world'
        image_64 = base64.b64encode(image).decode('ascii')

        user = self.create_user(test_user1)
        res = self.post(
            path=self.make_route("/search/"),
            data=json.dumps({"image": image_64}),
            user=user)

        res = self.get(
            path=self.make_route("/history/"))
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertEqual(data['image'], image_64)
