#!/bin/bash
echo "Disabling service file"

sudo systemctl stop dict.service
sudo systemctl disable dict.service
sudo systemctl daemon-reload
sudo rm /etc/systemd/system/dict.service
echo "Service disabled"
