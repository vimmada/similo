from flask import (session, redirect, url_for, request, abort, render_template,
                   send_from_directory, jsonify, make_response)
from flask.blueprints import Blueprint
from werkzeug.security import generate_password_hash, check_password_hash

from imageProcessor.models import User
from imageProcessor.model import db
from imageProcessor.auth import token_required
from common import util

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login/', methods=["POST"])
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


@auth_bp.route('/logout/', methods=["POST"])
@token_required
def logout(current_user):
    # TODO: Invalidate token somehow
    return make_response(jsonify({"message": "Logged out"}), 200)


@auth_bp.route('/users/', methods=["POST"])
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
        return jsonify({"error": "invalid format"}), 400

    # Check user doesn't already exist
    user = User.query.filter_by(username=request.json['username']).first()
    if user:
        return jsonify({"error": "user already exists"}), 400
    user = User.query.filter_by(email=request.json['email']).first()
    if user:
        return jsonify({"error": "user already exists"}), 400

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
