#!/bin/bash

# Install dependencies
npm install

# Run migrations
npx sequelize db:migrate

# Start application
npm run dev
