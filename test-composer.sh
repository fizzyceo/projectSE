#!/bin/bash

# Accept a variable as an argument
tag=$1

sed -i "s/wildfire:test-[0-9]*/wildfire:test-$1/" docker-compose.yml 

docker-compose up
