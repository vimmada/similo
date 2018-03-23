import jwt
from functools import wraps
from flask import request, jsonify, make_response, current_app
from imageProcessor.models import User
from imageProcessor.common import Response, cred

def token_required(f):
    @wraps(f)
    def auth(*args, **kwargs):
        if not 'Authorization' in request.headers:
            current_app.logger.info("Token missing")
            return Response.error("Token is missing.", 403)
        token = request.headers['Authorization']
        token = str.replace(str(token), 'Bearer ', '')
        try:
            payload = jwt.decode(token, cred.APP_SECRET_KEY)
            user = None
            if current_app.config['DEV']:
                username = payload.get("username")
                user = User.query.filter_by(username=username).first()
            else:
                public_id = payload.get("public_id")
                user = User.query.filter_by(public_id=public_id).first()
        except Exception as e:
            current_app.logger.info(e)
            current_app.logger.info("Failed to authenticate token: {}".format(payload))

        if not user:
            current_app.logger.info("Failed to authenticate token: {}".format(payload))
            return Response.error("User not found", 403)

        return f(user, *args, **kwargs)
    return auth
