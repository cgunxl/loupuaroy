#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Create deployment directory
    mkdir -p deployment
    
    # Copy dist files to deployment
    cp -r dist/* deployment/
    
    # Copy public files
    cp -r public/* deployment/
    
    echo "Deployment files ready in ./deployment/"
    echo "You can now upload the contents of ./deployment/ to your web server"
else
    echo "Build failed!"
    exit 1
fi