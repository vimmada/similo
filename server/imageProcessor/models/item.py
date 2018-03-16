from marshmallow import Schema, fields

class Item:
    """
    Represents a buyable item
    """
    def __init__(self, 
            title = "Item name", 
            image_url = "google.com", 
            product_url = "google.com", 
            price = 0.00):
        self.title = title
        self.image_url = image_url
        self.product_url = product_url
        self.price = price
        self.itemID = None

class ItemSchema(Schema):
    title = fields.String()
    price = fields.Number()
    image_url = fields.String()
    product_url = fields.String()
