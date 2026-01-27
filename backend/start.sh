#!/bin/sh
# Railway startup script - runs migrations then starts server

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
node dist/app.js
