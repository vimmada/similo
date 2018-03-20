"""
Utility functions
"""
import uuid

def get_uuid():
    """
    Returns a uuid4 (random UUID) specified by RFC 4122 as a
    32-character hexadecimal string
    """
    return uuid.uuid4().hex
