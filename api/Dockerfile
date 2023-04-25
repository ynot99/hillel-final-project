# Use the official Python base image
FROM python:3.11

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY Pipfile Pipfile.lock ./

# Install pipenv
RUN pip install -U pipenv

# Install the Python dependencies
RUN pipenv install --system --deploy

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the application will run on
EXPOSE 8000

COPY docker-entrypoint.sh /home/docker/entrypoint.sh

ENTRYPOINT ["/home/docker/entrypoint.sh"]
