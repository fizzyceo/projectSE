#!/bin/bash

# Accept a variable as an argument
tag=$1

# Build the Docker image
docker build -t wildfire-production-v1 .

# Tag the image with the variable
docker tag wildfire-production-v1:latest khalidghanamy/wildfire:production-$tag

# Push the image to the Docker Hub repository
docker push khalidghanamy/wildfire:production-$tag

echo 'khalidghanamy/wildfire:production-'$tag