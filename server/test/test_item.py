import unittest
import json
from test.base import BaseTest
from test.examples import test_item1, test_user1, test_user2

class TestItem(BaseTest):
    """
    Tests Item operations:
        PUT         /items/
        GET         /items/
        DELETE      /items/
    """
    def test_can_add_item(self):
        """Can add an item to a user"""
        user = self.create_user(test_user1)
        res = self.put(
            path=self.make_route("/items/"),
            data=json.dumps(test_item1),
            user=user)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 201)
        self.assertIn(test_item1['item']['title'], json.dumps(data))
        self.assertIn(test_item1['item']['product_url'], json.dumps(data))
        self.assertIsNone(data['item']['item_id'])

    def test_can_add_duplicate_item(self):
        """Adding a duplicate item should show only 1"""
        user = self.create_user(test_user1)
        self.add_item(test_item=test_item1, user=user)
        self.add_item(test_item=test_item1, user=user)
        res = self.get(
            path = self.make_route("/items/"),
            user = user)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn("items", data)
        self.assertEqual(len(data['items']), 1)

    def test_multiple_users_add_same_item(self):
        """Multiple users should be able to add the same item"""
        user1 = self.create_user(test_user1)
        user2 = self.create_user(test_user2)

        # Both users add the same item
        self.add_item(test_item=test_item1, user=user1)
        self.add_item(test_item=test_item1, user=user2)

        res = self.get(
            path = self.make_route("/items/"),
            user = user1)
        data1, status1 = self.get_data_status(res)
        self.assertEqual(status1, 200)
        self.assertIn("items", data1)
        self.assertEqual(len(data1['items']), 1)

        res = self.get(
            path = self.make_route("/items/"),
            user = user2)
        data2, status2 = self.get_data_status(res)
        self.assertEqual(status2, 200)
        self.assertIn("items", data2)
        self.assertEqual(len(data2['items']), 1)

        # Items from different users should not have the same item_id
        self.assertNotEqual(data1['items'][0]['item_id'],
                            data2['items'][0]['item_id'])

    def test_can_get_item(self):
        """Can get saved items per user"""
        user = self.create_user(test_user1)
        _,_= self.add_item(test_item=test_item1, user=user)
        res = self.get(
            path=self.make_route("/items/"),
            user=user)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn(test_item1['item']['title'], json.dumps(data))
        # Check item_ids are valid
        for item in data['items']:
            self.assertIsNotNone(item['item_id'])

    def test_can_delete_item(self):
        """Can delete a saved item"""
        user = self.create_user(test_user1)
        # Add Item
        _,_ = self.add_item(test_item=test_item1, user=user)
        res = self.get(
            path=self.make_route("/items/"),
            user=user)
        data, status = self.get_data_status(res)
        self.assertIn('items', data)
        self.assertNotEqual(len(data['items']), 0)
        item_id = data['items'][0]['item_id']

        # Delete Item
        res = self.delete(
            path=self.make_route("/items/"),
            data=json.dumps({"item_id": item_id}),
            user=user)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 202)

        # Verify user has no saved items
        res = self.get(
            path=self.make_route("/items/"),
            user=user)
        data, status = self.get_data_status(res)
        self.assertIn("items", data)
        self.assertEqual(len(data['items']), 0)

    def test_cannot_get_other_users_items(self):
        """Should not allow getting other users items"""
        # User1 adds item, user2 should not see it
        user1 = self.create_user(test_user1)
        user2 = self.create_user(test_user2)
        self.add_item(test_item=test_item1, user=user1)

        res = self.get(
            path=self.make_route("/items/"),
            user=user2)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn("items", data)
        self.assertEqual(len(data['items']), 0)

    def test_cannot_delete_other_users_items(self):
        """Should not allow deleting other users items"""
        # User2 tries to delete an item User1 owns
        user1 = self.create_user(test_user1)
        user2 = self.create_user(test_user2)
        self.add_item(test_item=test_item1, user=user1)
        self.add_item(test_item=test_item1, user=user2)

        res = self.get(
            path=self.make_route("/items/"),
            user=user1)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn("items", data)
        self.assertEqual(len(data['items']), 1)

        # item_id of user1's item
        item_id = data['items'][0]['item_id']

        # user2 tries to delete user1's item
        res = self.delete(
            path=self.make_route("/items/"),
            data=json.dumps({"item_id": item_id}),
            user=user2)
        data, status = self.get_data_status(res)
        self.assertNotEqual(status, 202)

        # Verify user1 still has the item
        res = self.get(
            path=self.make_route("/items/"),
            user=user1)
        data, status = self.get_data_status(res)
        self.assertEqual(status, 200)
        self.assertIn("items", data)
        self.assertEqual(len(data['items']), 1)
