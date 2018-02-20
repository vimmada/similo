"""Insta485 index (main) view."""
from imageProcessor import app
import flask
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


@app.route('/search/', methods=["POST"])
def search(): 
    context = {}
    return flask.make_response(flask.jsonify(**context), 201)
    

@app.route('/user/add/', methods=["POST"])
def create_user():
    context = {}
    return flask.make_response(flask.jsonify(**context), 201)



