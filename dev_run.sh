#!/bin/bash

# This script sets up and runs the environment for both the backend and frontend.

# Install frontend dependencies
cd frontend
npm install

# Set the version env 
export VERSION="DEV"

# Build frontend and get its PID
npm run build:dev &
pid1=$!
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Run backend and get its PID
uvicorn main:app --reload &
pid2=$!

# Define a function to kill both processes
kill_processes() {
    kill $pid1 $pid2
}

# Catch SIGINT and SIGTERM signals and kill processes
trap kill_processes SIGINT SIGTERM

# Wait for both processes to finish
wait $pid1 $pid2