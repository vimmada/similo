"""
Utility functions
"""
import uuid
from flask import make_response, jsonify
from flask import current_app as app

class Response:
    """
    Response wrapper class
    rv is of form:
        (string, status_code)
        (dict, status_code)
        (string)
        (dict)
    """
    @staticmethod
    def _make_response(rv, status, key):
        data = rv
        if isinstance(rv, (tuple, list)):
            data = rv[0]
            status = rv[1]
        if isinstance(data, str):
            data = {key: data}
        return make_response(jsonify(data), status)

    @staticmethod
    def success(*args):
        return Response._make_response(args, status=200, key="Success")

    @staticmethod
    def error(*args):
        return Response._make_response(args, status=400, key="Error")


def get_uuid():
    """
    Returns a uuid4 (random UUID) specified by RFC 4122 as a
    32-character hexadecimal string
    """
    return uuid.uuid4().hex
