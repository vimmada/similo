"""ImageProcessor python package configuration."""

from setuptools import setup

setup(
    name='imageProcessor',
    version='0.1.0',
    packages=['imageProcessor'],
    include_package_data=True,
    install_requires=[
        'flask',
        'flask-restful',
        'arrow',
        'sh',
        'requests'
    ],
)
