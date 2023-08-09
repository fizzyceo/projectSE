#!/bin/bash

# Accept a variable as an argument
tag=$1

sed -i "s/wildfire:production-[0-9]*/wildfire:production-$1/" docker-compose.yml 

docker-compose up