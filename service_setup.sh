#!/bin/bash
echo "Editing service file"

# Get the username of the user who ran the script
username=$(whoami)

sed -i "s/^User=.*/User=$username/" ./dict.service
sed -i "s|^WorkingDirectory=.*|WorkingDirectory=/home/$username/dict/backend|" ./dict.service
sed -i "s|^ExecStart=.*|ExecStart=/home/$username/.local/bin/uvicorn main:app --port 3000|" ./dict.service


# Copy the service file to the systemd directory
sudo cp ./dict.service /etc/systemd/system/dict.service
echo "Copied service file to /etc/systemd/system/dict.service"

sudo systemctl daemon-reload
sudo systemctl enable dict.service
sudo systemctl start dict.service
sudo systemctl status dict.service
echo "Service started"