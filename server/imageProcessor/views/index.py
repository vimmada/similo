"""ImageProcessor index (main) view."""
from flask import request, Blueprint
from flask import current_app as app
import requests
import datetime
import json
import re
import base64
from bs4 import BeautifulSoup
import bottlenose

from imageProcessor.model import db
from imageProcessor.models import Item, ItemSchema, SavedItem, User, SearchLog, SearchLogSchema
from imageProcessor.auth import token_required
from imageProcessor.recommendation import Recommender
from imageProcessor.common import cred, constants, Response

index_bp = Blueprint('index_bp', __name__)

def get_words():
    words = set()
    with open('imageProcessor/views/clothing_words.txt', 'r') as infile:
        for word in infile:
            word = word.lower()
            words.add(word.strip())
    return words

def get_companies():
    companies = set()
    with open('imageProcessor/views/companies.txt', 'r') as infile:
        for word in infile:
            word = word.lower()
            companies.add(word.strip())
    return companies

@index_bp.route('/')
def hello_world():
    return Response.success("hello world", 200)


@index_bp.route('/items/', methods=["GET"])
@token_required
def get_saved_items(current_user):
    """
    Returns a list of items that the user has saved
    """
    saved_items = current_user.saved_items
    schema = ItemSchema(many=True)
    context = {}
    context["items"] = schema.dump(saved_items).data
    return Response.success(context, 200)


@index_bp.route('/items/', methods=["PUT"])
@token_required
def add_saved_item(current_user):
    """
    Add an item to the user's saved items list and sends item back with
    newly generated item_id.

    Product url is the unique identifier
    """
    # TODO: Better validation
    if not request.json \
        or 'item' not in request.json \
        or 'title' not in request.json['item'] \
        or 'description' not in request.json['item'] \
        or 'image_url' not in request.json['item'] \
        or 'product_url' not in request.json['item'] \
        or 'price' not in request.json['item']:
        return Response.error("Missing fields", 400)

    context = {}
    schema = ItemSchema()
    item = Item(**schema.load(request.json['item']).data)
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
        save_item = SavedItem(**(schema.dump(item).data))
        context["item"] = schema.dump(save_item).data
        current_user.saved_items.append(save_item)
        db.session.add(current_user)
    db.session.commit()

    return Response.success(context, 201)


@index_bp.route('/items/', methods=["DELETE"])
@token_required
def delete_saved_item(current_user):
    """
    Delete an item from the user's saved items list

    Request json should have: {
        'item_id': int
    }
    """
    if not request.json or 'item_id' not in request.json:
        return Response.error("Missing fields", 400)

    item_id = request.json['item_id']
    for saved in current_user.saved_items:
        if saved.item_id == item_id:
            db.session.delete(saved)
            db.session.commit()
            return Response.success("item deleted", 202)
    return Response.error("Item not found", 404)


@index_bp.route('/export_saved/', methods=["POST"])
@token_required
def export_saved(current_user):
    """
    Sends an email to user with their saved items
    """
    context = {}
    return Response.error("Not implemented", 501)


@index_bp.route('/history/', methods=["GET"])
@token_required
def get_history(current_user):
    context = {}
    search_history = current_user.prev_searches
    schema = SearchLogSchema(many=True)
    context["history"] = schema.dump(search_history).data
    return Response.error(context, 200)


CLOTHING_WORDS = get_words()
COMPANIES = get_companies()
def construct_search_terms(search_terms, annotations, count=float('inf')):
    for i, term in enumerate(annotations):
        if i > count: break
        if 'description' in term:
            description = term['description'].split(' ')
            for word in description:
                word = word.lower()
                if word in CLOTHING_WORDS and word not in search_terms:
                    search_terms.append(word)
            if (term['description']).lower() in COMPANIES:
                search_terms.insert(0, term['description'].lower())


@index_bp.route('/search/', methods=["POST"])
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
        return Response.error("Missing fields", 400)

    image = request.json['image']
    # 1. Add it to history of searches
    search = SearchLog(image=base64.b64decode(image),
                       date_created=datetime.datetime.now(),
                       user_id=current_user.user_id)
    db.session.add(search)
    db.session.commit()

    # 2. Gets keywords associated with the image
    data = {
        "requests":[
            {
            "image":{
                "content": image
            },
            "features":[
                {
                "type":"LABEL_DETECTION",
                "maxResults":8 # change this number to get more labels
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
                },
                {
                "type": "TEXT_DETECTION"
                }
            ]
            }
        ]
    }
    data = json.dumps(data)
    results = requests.post(url=('https://vision.googleapis.com/v1/images:annotate?key=' + cred.Google.API_KEY), data=data)
    results = results.json()
    google_response = results['responses'][0]
    if 'error' in google_response:
        app.logger.error("Google Cloud Error {}".format(google_response['error']))
        return Response.error(google_response['error'], 400)

    labels = google_response['labelAnnotations']
    web_entities = google_response['webDetection']['webEntities']
    search_terms = []

    construct_search_terms(search_terms, annotations=labels)
    construct_search_terms(search_terms, annotations=web_entities, count=7)

    if 'logoAnnotations' in google_response:
        logo = google_response['logoAnnotations'][0]['description']
        search_terms.insert(0, logo)

    keywords = search_terms
    MAX_NUMBER_KEYWORDS = 5
    keywords = keywords[:MAX_NUMBER_KEYWORDS]
        
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
        items.append(Item(title=title,
                          image_url=image_url,
                          product_url=product_url,
                          price=price))

    # Returns json of items(title, image_url, product_url, price)
    schema = ItemSchema(many=True)
    items_dict = schema.dump(items)
    context["items"] = items_dict.data
    return Response.success(context, 201)
