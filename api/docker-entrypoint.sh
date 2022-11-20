#!/bin/sh

# wait for db to load
sleep 5
python3 manage.py migrate

exec python3 manage.py runserver 0.0.0.0:8000
