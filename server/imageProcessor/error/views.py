from flask import Blueprint, request
from flask import current_app as app
from imageProcessor.common.util import Response

error_bp = Blueprint("error_bp", __name__)

@error_bp.app_errorhandler(404)
def not_found(error):
    app.logger.error("Path not found: {}".format(request.path))
    return Response.error("Path not found", error)

@error_bp.app_errorhandler(500)
def internal_server_error(error):
    app.logger.error("Internal server error {}".format(error))
    return Response.error("Internal server error", error)

@error_bp.app_errorhandler(Exception)
def uncaught_exception(e):
    app.logger.error("Uncaught exception: {}".format(e))
    return Response.error("Internal server error", 500)
