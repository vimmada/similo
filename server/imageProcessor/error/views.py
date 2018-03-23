from flask import Blueprint, request
from flask import current_app as app
from imageProcessor.common.util import Response

error_bp = Blueprint("error_bp", __name__)

@error_bp.app_errorhandler(404)
def not_found(error):
    app.logging.error("Path not found: {}".format(request.path))
    return Response.error("Path not found", error)

@error_bp.app_errorhandler(500)
def internal_server_error(error):
    app.logging.error("[SERVER ERROR] {}".format(error))
    return Response.error("Internal server error", error)
