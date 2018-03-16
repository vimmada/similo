"""ImageProcessor index (main) view."""
import flask
from flask import (session, redirect, url_for, request, abort, render_template,
                   send_from_directory)
import requests
import json
import bottlenose
import pdb
from bs4 import BeautifulSoup

from imageProcessor import app
from imageProcessor.model import query_db
from imageProcessor.models.item import Item, ItemSchema
from common import constants
from common import cred


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/saved_items/', methods=["GET"])
def get_saved_item():
    context = {}
    context["hello"] = "cody"
    return flask.make_response(flask.jsonify(**context), 200)


@app.route('/saved_items/add/', methods=["POST"])
def add_saved_item():
    context = {}
    return flask.make_response(flask.jsonify(**context), 201)


@app.route('/saved_items/delete/', methods=["POST"])
def delete_saved_item():
    context = {}
    return flask.make_response(flask.jsonify(**context), 201)


@app.route('/export_saved/', methods=["POST"])
def export_saved():
    context = {}
    return flask.make_response(flask.jsonify(**context), 201)


@app.route('/history/', methods=["GET"])
def get_history():
    context = {}
    return flask.make_response(flask.jsonify(**context), 200)


@app.route('/item/', methods=["GET"])
def return_product_details():
    context = {}
    return flask.make_response(flask.jsonify(**context), 200)

# 1. Add it to history of searches
# 2. Gets keywords associated with the image
# 3. Uses amazon's search engine to get the item details
# 4. Returns json of items(item_name, description, price, and link)
@app.route('/search/', methods=["POST"])
def search(): 
    context = {}
    if not request.json or not "image" in request.json:
        abort(400)

    # 1. Add it to history of searches
    userids_with_email = query_db(
        '''SELECT userid FROM Users WHERE email = ?''', (request.json['email'],))
    userid = userids_with_email[0] 

    # TODO: Uncomment this section below and fix why the schema cannot handle request.json['image']
    # query_db(
    #     '''
    #     INSERT INTO history_items (image, userid) VALUES (?, ?)
    #     ''', (request.json['image'], userid))

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
    results = requests.post(url='https://vision.googleapis.com/v1/images:annotate?key=' + cred.Google.API_KEY, data = data)
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

    # 4 returns json of items(title, image_url, product_url, price)
    schema = ItemSchema(many=True)
    items_dict = schema.dump(items)
    context["items"] = items_dict.data
    return flask.make_response(flask.jsonify(**context), 201)
    

@app.route('/user/add/', methods=["POST"])
def create_user():
    context = {}

    # Check if the submitted post request has both the 'email' and 'password' field
    if not request.json or not 'email' in request.json or not 'password' in request.json: 
        abort(400)
    
    # Check if the user already exists and if so respond accordingly
    user = query_db(
        '''
        SELECT * FROM users
        WHERE users.email = ?
        ''', (request.json['email'],)
    )
    if user:
        abort(400)
    else:
        query_db(
        '''
        INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)
        ''', (request.json['fullname'], request.json['email'], request.json['password']))

    context['fullname'] = request.json['fullname']
    context['email'] = request.json['email']

    return flask.make_response(flask.jsonify(**context), 201)



