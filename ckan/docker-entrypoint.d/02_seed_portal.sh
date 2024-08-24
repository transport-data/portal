#!/bin/bash

LOGFILE="/var/log/seed_script.log"

# Wait for CKAN endpoints to be ready
{
    echo "Checking CKAN availability..."

    wait_for_endpoint() {
        local url=$1
        echo "Waiting for $url to be ready..."
        while ! curl --output /dev/null --silent --head --fail "$url"; do
            echo "Still waiting for $url"
            sleep 5
        done
        echo "$url is ready!"
    }

    echo "Starting to check endpoints..."

    wait_for_endpoint "http://0.0.0.0:5000/api/3/action/status_show"
    wait_for_endpoint "http://datapusher:8800"

    echo "All endpoints are ready!"

    echo "Waiting for the database to be ready..."
    while true; do
        pg_isready -h ckan-vs-db -p 5432 -U ckandbuser -d ckandb
        if [ $? -eq 0 ]; then
            echo "Database is ready!"
            break
        else
            echo "Still waiting for the database"
            sleep 5
        fi
    done

    # Generate a token
    echo "Generating token..."
    token=$(ckan -c ckan.ini user token add ckan_admin seed | awk '/API Token created:/ {getline; print $1}' | tr -d '\n' | tr -d '\r')
    echo "Token generated: $token"

    admin_name="ckan_admin"

    # Seed the portal
    echo "Seeding the portal..."
    ckan -c ckan.ini vs seed <<EOF
$admin_name
$token
EOF

    echo "Portal seeded successfully!"

} >>"$LOGFILE" 2>&1 &

echo "Seeding started, logging to $LOGFILE"
