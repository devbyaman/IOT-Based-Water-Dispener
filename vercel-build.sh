#!/bin/bash
set -e

echo "Starting Vercel build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install and build client
echo "Installing and building client..."
cd client
npm install
npx vite build
cd ..

echo "Build process completed successfully!" 