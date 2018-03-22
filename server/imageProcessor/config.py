import os

# Root of this application, useful if it doesn't occupy an entire domain

class Config:
    """
    Parent configruation class
    """
    DEBUG = False
    DEV = False
    # Database file is var/insta485.sqlite3
    DATABASE_FILENAME = os.path.join(
        os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
        'var', 'db.sqlite3'
    )
    SQLALCHEMY_DATABASE_URI = "".join(["sqlite:///", DATABASE_FILENAME])
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    APPLICATION_ROOT = '/'

class DevelopmentConfig(Config):
    """
    Configurations for development
    """
    DEBUG = True
    DEV = True

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    TESTING = True

    DATABASE_FILENAME = os.path.join(
        os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
        'var', 'test_db.sqlite3'
    )
    SQLALCHEMY_DATABASE_URI = "".join(["sqlite:///", DATABASE_FILENAME])

app_config = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "testing": TestingConfig
        }
