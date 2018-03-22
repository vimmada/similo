import unittest
import json
from test.base import BaseTest

class TestItem(BaseTest):
    """
    Tests Item operations:
        PUT         /items/
        GET         /items/
        DELETE      /items/
    """
    def test_can_add_item(self):
        """Can add an item to a user"""
        self.create_user()
        res = self.put(
            path=self.make_route("/items/"),
            data=json.dumps(self.test_item))
        data, status = self.get_data_status(res)
        self.assertEqual(status, 201)
        self.assertIn(self.test_item['item']['title'], json.dumps(data))
        self.assertIn(self.test_item['item']['product_url'], json.dumps(data))
        self.assertIsNone(data['item']['item_id'])

    def test_can_add_duplicate_item(self):
        """Adding a duplicate item should show only 1"""
        self.create_user()
        self.add_item()
        self.add_item()
        res = self.get(
            path = self.make_route("/items/"))
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn("items", data)
        self.assertEqual(len(data['items']), 1)

    @unittest.skip("STUB")
    def test_multiple_users_add_same_item(self):
        """Multiple users should be able to add the same item"""
        pass

    def test_can_get_item(self):
        """Can get saved items per user"""
        self.create_user()
        _,_= self.add_item()
        res = self.get(
            path=self.make_route("/items/"))
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn(self.test_item['item']['title'], json.dumps(data))
        # Check item_ids are valid
        for item in data['items']:
            self.assertIsNotNone(item['item_id'])

    def test_can_delete_item(self):
        """Can delete a saved item"""
        self.create_user()
        # Add Item
        _,_ = self.add_item()
        res = self.get(
            path=self.make_route("/items/"))
        data, status = self.get_data_status(res)
        self.assertIn('items', data)
        self.assertNotEqual(len(data['items']), 0)
        item_id = data['items'][0]['item_id']

        # Delete Item
        res = self.delete(
            path=self.make_route("/items/"),
            data=json.dumps({"item_id": item_id}))
        data, status = self.get_data_status(res)
        self.assertEqual(status, 202)

        # Verify user has no saved items
        res = self.get(
            path=self.make_route("/items/"))
        data, status = self.get_data_status(res)
        self.assertIn("items", data)
        self.assertEqual(len(data['items']), 0)

    @unittest.skip("STUB")
    def test_cannot_get_other_users_items(self):
        """Should not allow getting other users items"""
        pass

    @unittest.skip("STUB")
    def test_cannot_delete_other_users_items(self):
        """Should not allow deleting other users items"""
        pass
