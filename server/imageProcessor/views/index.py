"""ImageProcessor index (main) view."""
from imageProcessor import app
import flask
from imageProcessor.model import query_db
from flask import (session, redirect, url_for, request, abort, render_template,
                   send_from_directory)

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
    
    # 1. Add it history of searches
    userids_with_email = query_db(
        '''
        SELECT userid FROM Users WHERE email = ?''', (request.json('email'),))
    userid = userids_with_email[0] 
    query_db(
        '''
        INSERT INTO history_items (image, userid) VALUES (?, ?)
        ''', (request.json['image'], userid))

    # 2. Gets keywords associated with the image


    # 3. Uses amazon's search engine to get the item details


    # 4 returns json of items(item_name, description, price, and link)
    items = []
    context["items"] = items
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



