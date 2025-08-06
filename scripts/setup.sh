#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "   iManage Uploader - Quick Setup"
echo "========================================"
echo

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
echo "[1/5] Checking Node.js installation..."
if command -v node &> /dev/null; then
    print_success "Node.js is installed"
    node --version
else
    print_error "Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    echo "Choose the LTS version and make sure it's added to PATH"
    exit 1
fi
echo

# Check if npm is available
echo "[2/5] Checking npm..."
if command -v npm &> /dev/null; then
    print_success "npm is available"
    npm --version
else
    print_error "npm is not available!"
    echo "Please reinstall Node.js"
    exit 1
fi
echo

# Install dependencies
echo "[3/5] Installing application dependencies..."
echo "This may take a few minutes..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies!"
    echo "Please check your internet connection and try again"
    exit 1
fi
echo

# Check if .env file exists
echo "[4/5] Setting up configuration..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp ".env.example" ".env"
        print_success "Created .env configuration file"
        print_warning "IMPORTANT: Please edit .env file and update your database password!"
        echo "   Look for DATABASE_URL and replace 'password' with your PostgreSQL password"
    else
        print_error ".env.example file not found!"
        echo "Please make sure you're in the correct directory"
        exit 1
    fi
else
    print_success "Configuration file already exists"
fi
echo

# Setup database tables
echo "[5/5] Setting up database tables..."
echo "Make sure PostgreSQL is running and you've created the 'imanage_uploader' database"
echo "Press Enter to continue with database setup, or Ctrl+C to skip..."
read -r

if npm run db:push; then
    print_success "Database tables created successfully"
else
    print_error "Database setup failed!"
    echo "Please check:"
    echo "  1. PostgreSQL is running"
    echo "  2. Database 'imanage_uploader' exists"
    echo "  3. Password in .env file is correct"
    echo
    echo "You can run 'npm run db:push' manually later"
fi
echo

echo "========================================"
echo "          Setup Complete!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Make sure your .env file has the correct database password"
echo "2. Run: npm run dev"
echo "3. Open browser to: http://localhost:5000"
echo "4. Login with demo credentials:"
echo "   Server: https://demo.imanage.com"
echo "   Username: demo"
echo "   Password: demo"
echo
echo "Press Enter to exit..."
read -r
