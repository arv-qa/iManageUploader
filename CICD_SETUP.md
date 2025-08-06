# CI/CD Setup Guide

This document describes the comprehensive CI/CD pipeline setup for the iManage Uploader project.

## Overview

The CI/CD pipeline includes:
- **Continuous Integration**: Automated testing, code quality checks, and security scanning
- **Continuous Deployment**: Automated deployment to staging and production environments
- **Docker**: Containerized application with multi-stage builds
- **Environment Management**: Separate configurations for development, staging, and production

## Pipeline Structure

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop`
- Release publications

**Jobs:**
1. **Code Quality & Security**
   - TypeScript type checking
   - Security audit
   - Dependency checks

2. **Build & Test**
   - PostgreSQL service for testing
   - Database migrations
   - Application build
   - Artifact upload

3. **Docker Build**
   - Multi-platform Docker images (amd64, arm64)
   - Push to GitHub Container Registry
   - Caching for faster builds

4. **Deploy to Staging** (develop branch only)
   - Automated staging deployment

5. **Deploy to Production** (releases only)
   - Production deployment with approval

### 2. Pull Request Checks (`.github/workflows/pr-checks.yml`)

**Features:**
- Commit message validation (conventional commits)
- Security file detection
- Bundle size analysis
- Documentation checks
- Automated PR summary comments

### 3. Dependency Updates (`.github/workflows/dependency-update.yml`)

**Features:**
- Weekly dependency scans
- Automated security vulnerability detection
- Auto-update for patch/minor versions
- Issue creation for outdated dependencies

## Docker Configuration

### Production Dockerfile
- Multi-stage build for optimization
- Non-root user for security
- Health checks
- Minimal Alpine Linux base

### Development Dockerfile
- Hot reload support
- Development tools included
- Volume mounting for code changes

### Docker Compose
- **Production**: App + PostgreSQL + Redis + Nginx
- **Development**: Extended with PgAdmin and Redis Commander
- Health checks and dependency management

## Environment Configuration

### Development
- Local PostgreSQL and Redis
- Debug logging
- Hot reload enabled
- Development tools accessible

### Staging
- Production-like environment
- SSL enabled
- Moderate security settings
- Extended logging

### Production
- Full security hardening
- SSL/TLS encryption
- Rate limiting
- Minimal logging
- Health monitoring

## Deployment

### Automated Deployment Script (`scripts/deploy.sh`)

```bash
# Deploy to development
./scripts/deploy.sh development

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

**Features:**
- Environment validation
- Pre-deployment checks
- Database migrations
- Health checks
- Post-deployment verification

### Manual Deployment

#### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access services
# App: http://localhost:5001
# PgAdmin: http://localhost:5050
# Redis Commander: http://localhost:8081
```

#### Production
```bash
# Build and start production environment
docker-compose up -d

# Start with nginx (full production setup)
docker-compose --profile production up -d
```

## Security Features

### Container Security
- Non-root user execution
- Minimal base images
- Security scanning in CI
- Secrets management

### Application Security
- Rate limiting
- CORS configuration
- Security headers (Helmet.js)
- SSL/TLS encryption
- Input validation

### Infrastructure Security
- Environment variable isolation
- Database connection encryption
- Redis authentication
- Nginx security configuration

## Monitoring and Health Checks

### Health Check Endpoint
```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "database": "connected",
  "memory": {
    "used": 45,
    "total": 128
  }
}
```

### Container Health Checks
- Application health endpoint monitoring
- Database connectivity checks
- Redis availability checks
- Automatic container restart on failure

## Branch Protection Rules

Recommended GitHub branch protection settings:

### Main Branch
- Require pull request reviews (2 reviewers)
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to administrators only
- Require linear history

### Develop Branch
- Require pull request reviews (1 reviewer)
- Require status checks to pass
- Allow force pushes for administrators

## Environment Variables

### Required for All Environments
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `NODE_ENV`: Environment name

### Production Additional
- `IMANAGE_SERVER_URL`: iManage server URL
- `IMANAGE_CLIENT_ID`: iManage OAuth client ID
- `IMANAGE_CLIENT_SECRET`: iManage OAuth client secret
- `REDIS_URL`: Redis connection string

### Optional
- `SENTRY_DSN`: Error tracking
- `LOG_LEVEL`: Logging verbosity
- `MAX_FILE_SIZE`: Upload size limit

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript compilation errors
   - Verify all dependencies are installed
   - Review Docker build logs

2. **Deployment Issues**
   - Verify environment variables are set
   - Check database connectivity
   - Review container health checks

3. **Performance Issues**
   - Monitor container resource usage
   - Check database query performance
   - Review application logs

### Debugging Commands

```bash
# View container logs
docker-compose logs -f app

# Check container health
docker-compose ps

# Access container shell
docker-compose exec app sh

# Database connection test
docker-compose exec postgres psql -U postgres -d imanage_uploader

# Redis connection test
docker-compose exec redis redis-cli ping
```

## Best Practices

### Development
- Use feature branches for all changes
- Write descriptive commit messages
- Test locally before pushing
- Keep dependencies up to date

### Deployment
- Always deploy to staging first
- Run smoke tests after deployment
- Monitor application health
- Have rollback plan ready

### Security
- Regularly update dependencies
- Scan for vulnerabilities
- Use strong secrets
- Monitor security alerts

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/arv-qa/iManageUploader.git
   cd iManageUploader
   ```

2. **Switch to CI/CD branch**
   ```bash
   git checkout feature/cicd-setup
   ```

3. **Set up development environment**
   ```bash
   cp .env.development .env
   ./scripts/deploy.sh development
   ```

4. **Verify setup**
   - Visit http://localhost:5001
   - Check health endpoint: http://localhost:5001/api/health

## Support

For issues with the CI/CD setup:
1. Check the GitHub Actions logs
2. Review container logs
3. Verify environment configuration
4. Create an issue with detailed error information
