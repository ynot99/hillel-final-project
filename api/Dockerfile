FROM alpine:3.14.2

WORKDIR /opt/blog

ENV PYTHONUNBUFFERED 1

RUN apk update && apk add py3-pip python3-dev postgresql-dev zlib-dev jpeg-dev musl-dev gcc

RUN apk add libjpeg
COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt

COPY ./ ./

EXPOSE 8000

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
