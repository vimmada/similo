import datetime
import jwt
from imageProcessor import db
from common import cred, constants

class User(db.Model):
    """
    User class
    """
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(50), nullable=False, unique=True, index=True)
    username = db.Column(db.String(40), nullable=False, unique=True, index=True)
    email = db.Column(db.String(254), nullable=False, unique=True)
    password_hash = db.Column(db.String(80), nullable=False)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)

    saved_items = db.relationship("SavedItem", back_populates="owner")
    prev_searches = db.relationship("SearchLog", back_populates="owner")

    def __repr__(self):
        return "<User {}>".format(self.email)

    def get_token(self):
        """
        Returns a JSON web token for the current user that
        expires in constants.TOKEN_EXP_HRS
        """
        token = jwt.encode(
            {'public_id' : self.public_id,
             'exp' : datetime.datetime.utcnow() + datetime.timedelta(hours=constants.TOKEN_EXP_HRS)
            },
            key=cred.APP_SECRET_KEY)
        return token
