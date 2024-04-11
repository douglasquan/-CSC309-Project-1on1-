#!/bin/bash

# Create a virtual environment if it doesn't already exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "Virtual environment created."
else
  echo "Virtual environment already exists."
fi

# Activate the virtual environment
# For Windows, use `venv\Scripts\activate` instead
source venv/bin/activate

# Upgrade pip to the latest version
pip install --upgrade pip
pip install -r requirements.txt

# Run Django migrations to prepare your database
python3 manage.py makemigrations
python3 manage.py migrate

# Run Django server
python3 manage.py runserver

