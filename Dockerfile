# Used slim to try and keep the image size down (as it's running on a Raspberry Pi)
FROM python:slim

#Set an ENV var in the final Docker image with the current version number
ARG VERSION
ENV VERSION=$VERSION

# Install build dependencies
RUN apt-get update && apt-get install -y gcc make

# Add the static (frontend) and backend (API) folders to the container
ADD static /static
ADD backend /backend

# The API will be running from the backend folder
WORKDIR /backend

# db_data.json will be stored in the dict-data folder
VOLUME /backend/dict-data

# Install the requirements
RUN pip install -r requirements.txt

# Expose port 8000 for the application
EXPOSE 8000

# Run the command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]