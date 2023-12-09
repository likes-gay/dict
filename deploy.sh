#!/bin/sh
# This script moves the db_data folder out of the way, pulls from the deployment branch on github, and then moves the db_data folder back into place.
# This is useful for updating the code on the deployment server without overwriting the database.
# This script should be run from the root of the project directory.

echo "Shutting down Fast API server..."
sudo systemctl stop dict

echo "----------------------------------------"
echo "Moving db_data folder out of the way..."

cd backend
mv db_data.json ../../
cd ..
echo "----------------------------------------"
echo "Pulling from github..."

git pull https://github.com/Zoobdude/dict deploy

echo "----------------------------------------"
echo "Moving db_data folder back into place..."

cd backend
mv ../../db_data.json .

echo "Done!"