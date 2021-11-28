FROM alpine:3.14.2

WORKDIR /opt/blog

ENV PYTHONUNBUFFERED 1
# For pipenv
ENV LANG "en_US.UTF-8"

RUN apk update && apk add py3-pip python3-dev postgresql-dev zlib-dev jpeg-dev musl-dev gcc
RUN pip3 install pipenv

RUN apk add libjpeg
COPY ./Pipfile ./
COPY ./Pipfile.lock ./
RUN pipenv install --dev

COPY ./ ./

EXPOSE 8000

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
