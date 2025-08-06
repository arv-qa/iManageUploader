#!/bin/bash

# Deployment script for iManage Uploader
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Color codes for output
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

# Check if environment is valid
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_error "Valid environments: development, staging, production"
    exit 1
fi

# Check if required files exist
if [ ! -f "$PROJECT_DIR/.env.$ENVIRONMENT" ]; then
    print_error "Environment file .env.$ENVIRONMENT not found"
    exit 1
fi

if [ ! -f "$PROJECT_DIR/config/$ENVIRONMENT.json" ]; then
    print_error "Configuration file config/$ENVIRONMENT.json not found"
    exit 1
fi

# Load environment variables
print_status "Loading environment variables for $ENVIRONMENT"
set -a
source "$PROJECT_DIR/.env.$ENVIRONMENT"
set +a

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running"
    exit 1
fi

# Check if required environment variables are set
required_vars=("DATABASE_URL" "SESSION_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_success "Pre-deployment checks passed"

# Build the application
print_status "Building application..."
cd "$PROJECT_DIR"

if [ "$ENVIRONMENT" = "development" ]; then
    docker-compose -f docker-compose.dev.yml build
else
    docker-compose build
fi

print_success "Application built successfully"

# Database migration
print_status "Running database migrations..."
if [ "$ENVIRONMENT" = "development" ]; then
    npm run db:push
else
    # In production, use a more careful migration approach
    docker-compose run --rm app npm run db:push
fi

print_success "Database migrations completed"

# Deploy the application
print_status "Deploying application..."

if [ "$ENVIRONMENT" = "development" ]; then
    docker-compose -f docker-compose.dev.yml up -d
elif [ "$ENVIRONMENT" = "staging" ]; then
    docker-compose up -d
elif [ "$ENVIRONMENT" = "production" ]; then
    # Production deployment with zero downtime
    docker-compose up -d --no-deps app
    
    # Wait for health check
    print_status "Waiting for application to be healthy..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Application failed to start within 60 seconds"
        exit 1
    fi
    
    # Start nginx if in production
    docker-compose --profile production up -d nginx
fi

print_success "Application deployed successfully"

# Post-deployment checks
print_status "Running post-deployment checks..."

# Health check
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Health check passed"
else
    print_error "Health check failed"
    exit 1
fi

# Check if database is accessible
if [ "$ENVIRONMENT" = "development" ]; then
    if docker-compose -f docker-compose.dev.yml exec -T postgres-dev pg_isready > /dev/null 2>&1; then
        print_success "Database is accessible"
    else
        print_warning "Database health check failed"
    fi
else
    if docker-compose exec -T postgres pg_isready > /dev/null 2>&1; then
        print_success "Database is accessible"
    else
        print_warning "Database health check failed"
    fi
fi

print_success "Deployment completed successfully for $ENVIRONMENT environment"

# Show running containers
print_status "Running containers:"
if [ "$ENVIRONMENT" = "development" ]; then
    docker-compose -f docker-compose.dev.yml ps
else
    docker-compose ps
fi

# Show application URL
if [ "$ENVIRONMENT" = "development" ]; then
    echo ""
    print_success "Application is available at: http://localhost:5001"
    print_success "PgAdmin is available at: http://localhost:5050"
    print_success "Redis Commander is available at: http://localhost:8081"
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo ""
    print_success "Application is available at: http://localhost:5000"
elif [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    print_success "Application is available at: https://your-domain.com"
fi

echo ""
print_status "Deployment logs can be found in the container logs"
print_status "Use 'docker-compose logs -f' to follow the logs"
