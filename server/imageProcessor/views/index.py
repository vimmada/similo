"""ImageProcessor index (main) view."""
from flask import (session, redirect, url_for, request, abort, render_template,
                   send_from_directory, jsonify, make_response)
from flask.blueprints import Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import datetime
import json
import bottlenose
import pdb
import base64
from bs4 import BeautifulSoup

from imageProcessor.model import db
from imageProcessor.models import Item, ItemSchema, SavedItem, User, SearchLog, SearchLogSchema
from imageProcessor.auth import token_required
from common import cred, constants, util 

api = Blueprint('views', __name__, url_prefix="/api")

@api.route('/')
def hello_world():
    return make_response(jsonify({"message" : "hello world"}))


@api.route('/items/', methods=["GET"])
@token_required
def get_saved_items(current_user):
    """
    Returns a list of items that the user has saved
    """
    saved_items = current_user.saved_items
    schema = ItemSchema(many=True)
    context = {}
    context["items"] = schema.dump(saved_items).data
    return make_response(jsonify(**context), 200)


@api.route('/items/', methods=["POST"])
@token_required
def add_saved_item(current_user):
    """
    Add an item to the user's saved items list and sends item back with
    newly generated itemID.

    Product url is the unique identifier

    Item to add should have the following data:
    "item": {   title
                description
                image_url
                product_url
                price
            }
    """
    if not request.json or 'item' not in request.json:
        abort(400)
    
    context = {}
    schema = ItemSchema()
    item = schema.loads(request.json['item']).data
    # Look to see if user has already saved this item
    found_item = None
    for saved in current_user.saved_items:
        if saved.product_url == item.product_url:
            found_item = saved
            break

    if found_item:
        # Deep copy the updated, new item into the database
        found_item.title = item.title
        found_item.description = item.description
        found_item.price = item.price
        found_item.image_url = item.image_url
        context["item"] = schema.dump(found_item).data
    else:
        save_item = SavedItem(**(schema.dump(item)))
        context["item"] = schema.dump(save_item).data
        db.session.add(save_item)
    db.session.commit()

    return make_response(jsonify(**context), 201)


@api.route('/items/', methods=["DELETE"])
@token_required
def delete_saved_item(current_user):
    """
    Delete an item from the user's saved items list

    Request json should have: {
        'item_id': int
    }
    """
    if not request.json or 'item_id' not in request.json:
        abort(400)

    item_id = request.json['item_id']
    for saved in current_user.saved_items:
        if saved.item_id == item_id:
            db.session.delete(saved)
            db.session.commit()
            return make_response("Success", 201)
    
    return make_response("Item can't be deleted - item not found", 404)


@api.route('/export_saved/', methods=["POST"])
@token_required
def export_saved(current_user):
    """
    Request json should have: {
        'email': email
    }
    """
    context = {}
    return make_response(jsonify(**context), 201)


@api.route('/history/', methods=["GET"])
@token_required
def get_history(current_user):
    context = {}
    search_history = current_user.prev_searches
    schema = SearchLogSchema(many=True)
    context["history"] = schema.dump(search_history).data
    return make_response(jsonify(**context), 200)


@api.route('/search/', methods=["POST"])
@token_required
def search(current_user):
    """
    - Gets keywords associated with the image
    - Uses amazon's search engine to get the item details
    - Add image to history of searches
    - Purge user search history of > KEEP_HISTORY most recent items
    - Returns json of items(item_name, description, price, and link)
    """
    context = {}
    if not request.json or not "image" in request.json:
        abort(400)

    image = base64.b64decode(request.json['image'])
    # 1. Add it to history of searches
    search = SearchLog(image=image,
                       date_created=datetime.datetime.now(),
                       user_id=current_user.user_id)
    db.session.add(search)
    db.session.commit()
    
    # 2. Gets keywords associated with the image

    # I get the image in the format of base64 encoding
    # image is hardcoded for now but in the future will come from the client(request.json['image'])

    data = {
        "requests":[
            {
            "image":{
                "content": constants.image
            },
            "features":[
                {
                "type":"LABEL_DETECTION",
                "maxResults":10 # change this number to get more labels
                },
                {
                "type":"LOGO_DETECTION",
                "maxResults": 5
                },
                {
                "type": "WEB_DETECTION"
                },
                {
                "type": "IMAGE_PROPERTIES"
                }
            ]
            }
        ]
    }
    data = json.dumps(data)
    results = requests.post(url=('https://vision.googleapis.com/v1/images:annotate?key=' + cred.Google.API_KEY), data=data)
    results = results.json()
    labels = results['responses'][0]['labelAnnotations']

    # TODO: Filter keywords for clothing items only
    # keywords = [label.get("description") for label in labels]
    keywords = ["blue", "jeans"]

    # 3. Uses amazon's search engine to get the item details
    amazon = bottlenose.Amazon(
            cred.Amazon.ACCESS_KEY,
            cred.Amazon.SECRET_KEY,
            cred.Amazon.ASSOCIATE_ID,
            Parser=lambda text: BeautifulSoup(text, 'xml'))
    res = amazon.ItemSearch(
            Keywords= " ".join(keywords),
            ResponseGroup="Images,ItemAttributes",
            SearchIndex="Fashion")

    MAX_ITEMS = 10
    items = []
    # Parse response XML
    for (item, i) in zip(res.find_all("Item"), range(0, MAX_ITEMS)):
        title = ""
        image_url = ""
        product_url = ""
        price = 0

        if item.find("Title"):
            title = item.find("Title").text
        if item.find("LargeImage"):
            image_url = item.find("LargeImage").URL.text
        if item.find("DetailPageURL"):
            product_url = item.find("DetailPageURL").text
        if item.find("Amount"):
            price = int(item.find("Amount").text)
        items.append(Item(title, image_url, product_url, price))

    # Returns json of items(title, image_url, product_url, price)
    schema = ItemSchema(many=True)
    items_dict = schema.dump(items)
    context["items"] = items_dict.data
    return make_response(jsonify(**context), 201)

@api.route('/login', methods=["POST"])
def login():
    """
    Logs a user in, and returns a json web token for future authenticated requests
    """
    username = request.get_json(silent=True).get("username")
    email = request.get_json(silent=True).get("email")
    password = request.get_json(silent=True).get("password")
    if not (username or email) or not password:
        abort(400) # TODO: Handle Error - invalid request

    user = None
    if username:
        user = User.query.filter_by(username=username).first()
    elif email:
        user = User.query.filter_by(email=email).first()
    if not user:
        # TODO: Handle Error - invalid username/password 
        abort(400)

    if not check_password_hash(user.password_hash, password):
        # TODO: Handle Error - invalid username/password
        abort(400)

    # Return json web token
    token = user.get_token()
    context = {}
    context['username'] = user.username
    context['token'] = token.decode('UTF-8')
    return make_response(jsonify(**context), 200)


@api.route('/logout', methods=["POST"])
@token_required
def logout(current_user):
    # TODO: Invalidate token somehow
    return make_response("Logged out", 200)


@api.route('/users', methods=["POST"])
def create_user():
    """
    Creates a user and returns a jwt for future authenticated requests
    """
    # TODO: Verify fields
    if not request.json \
        or not 'username' in request.json \
        or not 'email' in request.json \
        or not 'password' in request.json \
        or not 'firstname' in request.json \
        or not 'lastname' in request.json:
        abort(400)

    # Check user doesn't already exist
    user = User.query.filter_by(username=request.json['username']).first()
    if user:
        abort(400)
    user = User.query.filter_by(email=request.json['email']).first()
    if user:
        abort(400)

    # Insert user into db
    password_hash = generate_password_hash(request.json['password'])
    public_id = util.get_uuid()

    user = User(
        public_id=public_id,
        username=request.json['username'],
        email=request.json['email'],
        password_hash=password_hash,
        firstname=request.json['firstname'],
        lastname=request.json['lastname'])
    db.session.add(user)
    db.session.commit()
    
    # Return json web token
    token = user.get_token()
    context = {}
    context['username'] = request.json['username']
    context['token'] = token.decode('UTF-8')
    return make_response(jsonify(**context), 201)
