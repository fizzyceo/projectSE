#!/bin/bash

# Accept a variable as an argument
tag=$1

# Build the Docker image
docker build -t wildfire .

# Tag the image with the variable
docker tag wildfire:latest khalidghanamy/wildfire:test-$tag

# Push the image to the Docker Hub repository
docker push khalidghanamy/wildfire:test-$tag

echo 'khalidghanamy/wildfire:test-'$tag
