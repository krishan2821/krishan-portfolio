#!/bin/bash
# run-portfolio.sh — Shortcut script to run the Khatarnak Portfolio frontend dev server cleanly.

echo "============================================="
echo "   🚀 Starting Khatarnak Portfolio Server   "
echo "============================================="

# 1. Navigate to the frontend directory
cd "$(dirname "$0")/frontend" || exit 1

# 2. Check and stop any process running on port 3000 or 3001 to avoid port conflicts
echo "🔍 Checking for zombie processes on ports 3000/3001..."
PORT_3000_PID=$(lsof -t -i:3000 2>/dev/null)
PORT_3001_PID=$(lsof -t -i:3001 2>/dev/null)

if [ -n "$PORT_3000_PID" ]; then
  echo "⚠️ Port 3000 is occupied by PID $PORT_3000_PID. Terminating..."
  kill -9 "$PORT_3000_PID" 2>/dev/null
fi

if [ -n "$PORT_3001_PID" ]; then
  echo "⚠️ Port 3001 is occupied by PID $PORT_3001_PID. Terminating..."
  kill -9 "$PORT_3001_PID" 2>/dev/null
fi

# 3. Clean the Next.js webpack cache to prevent hydration/chunk mismatch errors
echo "🧹 Clearing Next.js cache (.next folder)..."
rm -rf .next

# 4. Start the Next.js development server binding to 0.0.0.0 for local network access
echo "⚡ Starting Next.js Dev Server on 0.0.0.0..."
npm run dev -- -H 0.0.0.0
