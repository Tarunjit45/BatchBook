#!/bin/bash

echo "🔧 BatchBook MongoDB Connection Fix"
echo "===================================="
echo ""

# Check Node.js version
echo "📌 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "Current Node.js version: $NODE_VERSION"
echo ""

# Offer solutions
echo "🔍 MongoDB Connection Issue Detected"
echo "Error: SSL/TLS incompatibility with MongoDB Atlas"
echo ""
echo "Choose a solution:"
echo ""
echo "1. Install local MongoDB (recommended for development)"
echo "2. Update MongoDB driver version"
echo "3. Add TLS workaround to connection string"
echo "4. Check MongoDB Atlas cluster status"
echo "5. Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    echo ""
    echo "📥 Installing MongoDB locally..."
    echo "Run this command in PowerShell as Administrator:"
    echo "winget install MongoDB.Server"
    echo ""
    echo "Then update your .env.local file:"
    echo "MONGODB_URI=mongodb://localhost:27017"
    echo "MONGODB_DB=BatchBook"
    ;;
  2)
    echo ""
    echo "📦 Downgrading MongoDB driver..."
    npm install mongodb@5.9.0
    echo ""
    echo "✅ MongoDB driver updated. Restart your dev server."
    ;;
  3)
    echo ""
    echo "⚙️  Adding TLS workaround..."
    # Update .env.local with TLS workaround
    MONGO_URI="mongodb+srv://tarunjitbiswas123:tarunjitbiswas1234@cluster0.jglf7om.mongodb.net/BatchBook?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true"
    
    # Update .env.local file
    if [ -f .env.local ]; then
      sed -i "s|MONGODB_URI=.*|MONGODB_URI=$MONGO_URI|" .env.local
      echo "✅ .env.local updated with TLS workaround"
      echo "⚠️  Note: This is for development only, not production!"
    else
      echo "❌ .env.local not found"
    fi
    ;;
  4)
    echo ""
    echo "🌐 Opening MongoDB Atlas..."
    echo "Please check:"
    echo "  1. Cluster is running"
    echo "  2. Network access allows your IP (0.0.0.0/0 for development)"
    echo "  3. Database user credentials are correct"
    echo ""
    echo "MongoDB Atlas URL: https://cloud.mongodb.com/"
    ;;
  5)
    echo ""
    echo "👋 Exiting..."
    exit 0
    ;;
  *)
    echo ""
    echo "❌ Invalid choice"
    ;;
esac

echo ""
echo "✅ Done! Restart your development server if needed."
echo "   npm run dev"
