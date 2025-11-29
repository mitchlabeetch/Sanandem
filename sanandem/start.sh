#!/bin/sh
set -e
echo "🚀 Starting Sanandem Frontend..."
echo "Current directory: $(pwd)"
ls -F

if [ ! -d "build" ]; then
  echo "❌ Error: 'build' directory missing. Build command failed or didn't run."
  exit 1
fi

HOST=0.0.0.0 node build/index.js

