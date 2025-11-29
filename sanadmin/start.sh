#!/bin/bash
set -e
echo "🚀 Starting Sanadmin Backend..."

if [ ! -d "build" ]; then
  echo "❌ Error: 'build' directory missing. Build command failed or didn't run."
  exit 1
fi

node build/index.js
