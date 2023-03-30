ARG PYTHON_VERSION=3.11-slim-buster

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /code

WORKDIR /code

COPY pyproject.toml poetry.lock /code/

RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

RUN set -ex && \
    pip install --upgrade pip && \
    pip install poetry && \
    poetry install --no-root

COPY . /code/

RUN poetry run python manage.py collectstatic --noinput

EXPOSE 8000 5555 5556 5557

CMD poetry run gunicorn --bind :8000 --workers 2 core.wsgi:application && poetry run celery -A core worker -l info && poetry run celery -A core beat -l info && poetry run celery -A core flower

