import os
import logging

# Root of this application, useful if it doesn't occupy an entire domain

class Config:
    """
    Parent configruation class
    """
    # General
    DEBUG = False
    DEV = False
    APPLICATION_ROOT = '/'

    # Database
    DATABASE_FILENAME = os.path.join(
        os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
        'var', 'db.sqlite3'
    )
    SQLALCHEMY_DATABASE_URI = "".join(["sqlite:///", DATABASE_FILENAME])
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Logging
    LOGGER_LEVEL = logging.DEBUG
    LOGGER_LOCATION = os.path.join(
        os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
        'log', 'server.log'
    )
    LOGGER_FORMAT = "%(asctime)s [%(levelname)s] - %(method)s %(path)s : %(message)s"

class DevelopmentConfig(Config):
    """
    Configurations for development
    """
    DEBUG = True
    DEV = True

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    PROD = True
    LOGGER_LEVEL = logging.INFO

class TestingConfig(Config):
    TESTING = True

    # Testing database
    DATABASE_FILENAME = os.path.join(
        os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
        'var', 'test_db.sqlite3'
    )
    SQLALCHEMY_DATABASE_URI = "".join(["sqlite:///", DATABASE_FILENAME])

    LOGGER_LEVEL = logging.INFO

app_config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig
}
