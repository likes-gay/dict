#!/bin/bash

# This script sets up the environment for running the dev server.

# Install frontend dependencies
cd frontend
npm install

# Build frontend
npm run build
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Run backend
uvicorn main:app --reload