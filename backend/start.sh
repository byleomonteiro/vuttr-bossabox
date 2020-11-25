#!/bin/bash

# Install dependencies
npm install

# Build project
npm run build

# Run migrations
npx sequelize db:migrate

# Start application
npm run start
