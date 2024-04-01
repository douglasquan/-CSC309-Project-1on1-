#!/bin/bash

# Update and install necessary apt packages
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv libpq-dev python3-dev

# Install prerequisites for the Python Imaging Library (Pillow)
sudo apt-get install -y libjpeg-dev zlib1g-dev libpng-dev

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip to the latest version
pip install --upgrade pip
pip install -r requirements.txt

# Run Django migrations to prepare your database
python3 manage.py makemigrations
python3 manage.py migrate

# Run Django server
python3 manage.py runserver

