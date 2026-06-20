Steps to run the Code:

Django API
1) create python virtual environemnt in project directory, then activate.
2) run 'pip install -r requirements.txt' to install all dependency
3) run 'python manage.py runserver' to start django api server
4) server will be running on localhost port 8000

UI
1) go to ge_ui folder
2) run 'npm install' to install all dependency packages
3) run 'npm start' to start node server for ui
4) UI server will be started on localhost port 3000

Celery worker
Commands to start celery_worker and celery_beat
>celery -A app worker -l info -P solo
>celery -A app beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler