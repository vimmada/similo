import jwt
from functools import wraps
from flask import request, jsonify, make_response
from imageProcessor.models import User

import common

def token_required(f):
    @wraps(f)
    def auth(*args, **kwargs):
        if not 'Authorization' in request.headers:
            return jsonify({"message" : "Token is missing."}), 401
        token = request.headers['Authorization']
        token = str.replace(str(token), 'Bearer ', '')
        try:
            payload = jwt.decode(token, common.APP_SECRET_KEY)
            public_id = payload.get("public_id")
            user = User.query.filter_by(public_id=public_id).first()
        except Exception as e:
            print(e)
            return jsonify({"message" : "User not found"}), 401

        if not user:
            return jsonify({"message" : "User not found"}), 401

        return f(user, *args, **kwargs)
    return auth
