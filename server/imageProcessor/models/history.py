import datetime
from marshmallow import Schema, fields
from imageProcessor import db
from common import cred, constants

class SearchLog(db.Model):
    """
    Search History class/table
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image = db.Column(db.LargeBinary, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)

    owner = db.relationship("User", back_populates="prev_searches")

    def __repr__(self):
        return "<History {}>".format(str(searched))

class SearchLogSchema(Schema):
    image = fields.Raw()
    date_created = fields.DateTime()
