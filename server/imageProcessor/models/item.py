from marshmallow import Schema, fields
from imageProcessor.model import db

class SavedItem(db.Model):
    """
    SavedItem class - db Table for saved items
    """
    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(256))
    description = db.Column(db.String(2000))
    price = db.Column(db.Numeric(precision=18, scale=4))
    product_url = db.Column(db.String(2083))
    image_url = db.Column(db.String(2083))
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)

    owner = db.relationship("User", back_populates="saved_items")

    def __repr__(self):
        return "<SavedItem {}>".format(self.title)

class Item:
    """
    Model for item (search result)
    """
    def __init__(self,
                 title="Item name",
                 description="description",
                 image_url="google.com",
                 product_url="google.com",
                 price=0.00):

        self.title = title
        self.description = description
        self.image_url = image_url
        self.product_url = product_url
        self.price = price

class ItemSchema(Schema):
    """
    Marshmallow schema for serializing/deserializing Items/SavedItems
    """
    # item_id used by SavedItems only
    item_id = fields.Integer()
    title = fields.String()
    description = fields.String()
    price = fields.Number()
    image_url = fields.String()
    product_url = fields.String()
    description = fields.String()
