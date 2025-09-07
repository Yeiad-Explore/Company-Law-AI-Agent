#!/bin/bash

# Veridic AI - Complete Setup Script
# This script sets up both the Python backend and Next.js frontend

set -e  # Exit on any error

echo "🚀 Setting up Veridic AI - Complete System"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to find Python command
find_python() {
    local python_cmd=""
    
    # Try different Python commands in order of preference
    for cmd in python3 python py python3.11 python3.10 python3.9; do
        if command_exists "$cmd"; then
            # Test if the command actually works
            if "$cmd" --version >/dev/null 2>&1; then
                python_cmd="$cmd"
                break
            fi
        fi
    done
    
    echo "$python_cmd"
}

# Function to check Python version
check_python_version() {
    local python_cmd="$1"
    local version=$("$python_cmd" --version 2>&1 | cut -d' ' -f2)
    local major=$(echo "$version" | cut -d'.' -f1)
    local minor=$(echo "$version" | cut -d'.' -f2)
    
    if [ "$major" -eq 3 ] && [ "$minor" -ge 8 ]; then
        return 0
    else
        return 1
    fi
}

# Check if we're on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    print_status "Detected Windows environment"
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# Find Python
print_status "Looking for Python..."
PYTHON_CMD=$(find_python)

if [ -z "$PYTHON_CMD" ]; then
    print_error "Python not found! Please install Python 3.8+ and try again."
    print_error "Download from: https://www.python.org/downloads/"
    print_error "Make sure to check 'Add Python to PATH' during installation."
    exit 1
fi

print_success "Found Python: $PYTHON_CMD"

# Check Python version
if ! check_python_version "$PYTHON_CMD"; then
    print_error "Python 3.8+ is required. Found: $($PYTHON_CMD --version)"
    exit 1
fi

print_success "Python version check passed: $($PYTHON_CMD --version)"

# Check if Node.js is installed
print_status "Checking for Node.js..."
if ! command_exists node; then
    print_error "Node.js not found! Please install Node.js 18+ and try again."
    print_error "Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Found Node.js: $NODE_VERSION"

# Check if npm is installed
if ! command_exists npm; then
    print_error "npm not found! Please install npm and try again."
    exit 1
fi

print_success "Found npm: $(npm --version)"

# Create virtual environment
print_status "Creating Python virtual environment..."
if [ -d "venv" ]; then
    print_warning "Virtual environment already exists. Removing old one..."
    rm -rf venv
fi

"$PYTHON_CMD" -m venv venv

# Activate virtual environment
if [ "$IS_WINDOWS" = true ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

print_success "Virtual environment created and activated"

# Install Python dependencies
print_status "Installing Python dependencies..."
"$PYTHON_CMD" -m pip install --upgrade pip
"$PYTHON_CMD" -m pip install -r requirements.txt

print_success "Python dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cp env.example .env
    print_warning "Please edit .env file with your actual API keys before running the application"
else
    print_warning ".env file already exists. Skipping creation."
fi

# Set up frontend
print_status "Setting up Next.js frontend..."

# Check if frontend files exist in current directory
if [ ! -f "package.json" ]; then
    print_error "Frontend files not found! Please run this script from the project root."
    exit 1
fi

# Frontend is in the current directory, not a subdirectory

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

print_success "Node.js dependencies installed"

# Build frontend
print_status "Building frontend..."
npm run build

print_success "Frontend built successfully"

cd ..

# Security check
print_status "Running security checks..."

# Check for hardcoded API keys
if grep -r "sk-" . --exclude-dir=venv --exclude-dir=node_modules --exclude-dir=.git --exclude="*.pyc" >/dev/null 2>&1; then
    print_warning "Potential hardcoded API keys found. Please review your code."
else
    print_success "No hardcoded API keys found"
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        print_success ".env is properly ignored in .gitignore"
    else
        print_warning ".env is not in .gitignore. Adding it..."
        echo ".env" >> .gitignore
    fi
else
    print_warning ".gitignore not found. Creating one..."
    cat > .gitignore << EOF
# Environment variables
.env
.env.local
.env.production

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Node.js
node_modules/
.next/
out/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF
fi

print_success "Security checks completed"

# Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Veridic AI Backend..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
python main.py
EOF
chmod +x start-backend.sh

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Veridic AI Frontend..."
npm run dev
EOF
chmod +x start-frontend.sh

# Combined startup script
cat > start-veridic-ai.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Veridic AI Complete System..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo ""

# Start backend in background
echo "Starting backend..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Start frontend
echo "Starting frontend..."
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait
EOF
chmod +x start-veridic-ai.sh

print_success "Startup scripts created"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "To run the application:"
echo "1. Backend: ./start-backend.sh"
echo "2. Frontend: ./start-frontend.sh"
echo "3. Both: ./start-veridic-ai.sh"
echo ""
echo "Access points:"
echo "- Backend API: http://localhost:8000"
echo "- Frontend: http://localhost:3000"
echo "- API Docs: http://localhost:8000/docs"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Edit .env file with your actual API keys"
echo "2. Never commit .env file to Git"
echo ""
print_success "Veridic AI is ready to use! 🚀"