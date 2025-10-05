# Railway Deployment Guide

**Research Space Backend API**  
**Version:** 1.0.0  
**Last Updated:** October 5, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Railway Deployment Methods](#railway-deployment-methods)
   - [Method 1: Deploy from GitHub (Recommended)](#method-1-deploy-from-github-recommended)
   - [Method 2: Deploy using Railway CLI](#method-2-deploy-using-railway-cli)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Database Setup](#database-setup)
7. [Build and Start Commands](#build-and-start-commands)
8. [Post-Deployment](#post-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring and Logs](#monitoring-and-logs)

---

## Overview

Railway is a modern deployment platform that simplifies hosting Node.js applications with automatic scaling, environment variable management, and PostgreSQL database provisioning. This guide covers deploying the Research Space Backend API to Railway with Prisma ORM and PostgreSQL.

### Why Railway?

- ✅ **Automatic Node.js Detection**: Railway auto-detects your Node.js app via Nixpacks
- ✅ **Built-in PostgreSQL**: Provision managed PostgreSQL databases in seconds
- ✅ **Zero Configuration**: Works out of the box with minimal setup
- ✅ **Environment Variables**: Secure secret management with reference variables
- ✅ **Private Networking**: Fast, secure service-to-service communication
- ✅ **Automatic Deployments**: Push to GitHub → Automatic deployment
- ✅ **Free Tier**: Generous free tier for development and small projects

---

## Prerequisites

Before deploying to Railway, ensure you have:

### Required

- [x] Railway account ([Sign up](https://railway.com/login))
- [x] GitHub account (for GitHub deployment method)
- [x] Git repository with backend code pushed to GitHub
- [x] Node.js 18+ (for local testing)
- [x] Valid `.env.example` file in repository

### Optional

- [ ] Railway CLI installed ([Installation guide](https://docs.railway.com/guides/cli#installing-the-cli))
- [ ] Docker installed (if using Dockerfile deployment)

---

## Pre-Deployment Checklist

### 1. Code Preparation

Ensure your backend codebase has:

```bash
✅ package.json with proper scripts:
   - "build": "tsc"
   - "start": "node dist/server.js"
   - "dev": "tsx watch src/server.ts"

✅ Prisma schema configured for PostgreSQL:
   - datasource db { provider = "postgresql" }
   
✅ Environment variable handling:
   - All secrets read from process.env
   - No hardcoded credentials
   
✅ .gitignore includes:
   - node_modules/
   - dist/
   - .env
   - *.db (SQLite files)
```

### 2. Database Migration Strategy

```bash
✅ Migrations ready in prisma/migrations/
✅ Seed script prepared (optional)
✅ Migration command: npx prisma migrate deploy
```

### 3. Security Review

```bash
✅ ENCRYPTION_KEY not committed to Git
✅ API_KEY not committed to Git
✅ ADMIN_PASSWORD not committed to Git
✅ .env file ignored by Git
✅ Helmet.js security headers configured
✅ CORS properly configured
✅ Rate limiting enabled
```

---

## Railway Deployment Methods

## Method 1: Deploy from GitHub (Recommended)

This method enables automatic deployments whenever you push to GitHub.

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.com/new)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your repository: `PRATS-gits/research-vite-app`
6. Railway will detect the backend automatically

### Step 2: Configure Root Directory

Since the backend is in a subdirectory:

1. In Railway dashboard, click on your service
2. Go to **Settings** tab
3. Find **"Root Directory"** setting
4. Set value to: `backend`
5. Click **"Update"**

### Step 3: Add PostgreSQL Database

1. In Railway project canvas, click **"+ Create"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will provision a managed PostgreSQL instance
5. Wait for deployment to complete (~30 seconds)

### Step 4: Configure Environment Variables

1. Click on your backend service (not the database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add each variable from the table below:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | References PostgreSQL private URL |
| `ENCRYPTION_KEY` | `${{secret(32, "chars")}}` | Auto-generated 32-char secret |
| `API_KEY` | `${{secret(48, "chars")}}` | Auto-generated 48-char secret |
| `ADMIN_PASSWORD` | `${{secret(32, "chars")}}` | Auto-generated admin password |
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `3001` | Backend port (Railway auto-assigns public port) |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | Your frontend URL |
| `LOG_LEVEL` | `info` | Logging level |

**Important Notes:**

- `${{Postgres.DATABASE_URL}}` - This references your PostgreSQL service's private connection string
- `${{secret(32, "chars")}}` - Railway's secret generator creates cryptographically secure random strings
- Replace `Postgres` with your actual PostgreSQL service name if different
- Use **DATABASE_URL** (private) not **DATABASE_PUBLIC_URL** for better performance and security

### Step 5: Configure Build Settings

Railway auto-detects Node.js, but you can customize:

1. Go to **Settings** tab
2. Scroll to **"Build"** section
3. Verify:
   - **Build Command**: `npm run build` (auto-detected)
   - **Start Command**: `npm start` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 6: Add Prisma Migration Command

To run database migrations before each deployment:

1. In **Settings** tab, find **"Deploy"** section
2. Look for **"Custom Start Command"** or use Railway's build lifecycle
3. Create a `railway.json` file in your backend root:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build && npx prisma generate && npx prisma migrate deploy"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Alternative: Use package.json scripts**

Add to your `package.json`:

```json
{
  "scripts": {
    "build": "npx prisma generate && tsc",
    "start": "npx prisma migrate deploy && node dist/server.js",
    "dev": "tsx watch src/server.ts"
  }
}
```

### Step 7: Deploy

1. Click **"Deploy"** button in Railway dashboard
2. Watch the build logs in real-time
3. Deployment typically takes 2-5 minutes
4. Railway will show **"Success"** when complete

### Step 8: Generate Public Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will assign a public URL like: `research-space-backend-production.up.railway.app`
5. Save this URL for frontend configuration

### Step 9: Verify Deployment

Test your endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/health

# API root
curl https://your-app.up.railway.app/

# Storage status (requires storage configuration)
curl https://your-app.up.railway.app/api/storage/status
```

Expected response:

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-05T12:00:00.000Z",
    "uptime": 123.45
  }
}
```

---

## Method 2: Deploy using Railway CLI

For developers who prefer command-line deployment:

### Step 1: Install Railway CLI

**macOS/Linux:**

```bash
curl -fsSL https://railway.com/install.sh | sh
```

**Windows (PowerShell):**

```powershell
iwr https://railway.com/install.ps1 | iex
```

**npm (Cross-platform):**

```bash
npm install -g @railway/cli
```

### Step 2: Authenticate

```bash
railway login
```

This opens a browser for Railway authentication.

### Step 3: Initialize Project

Navigate to backend directory:

```bash
cd /path/to/research-vite-app/backend
railway init
```

Follow prompts:
- **Project name**: `research-space-backend`
- **Environment**: `production` (or create new)

### Step 4: Add PostgreSQL Database

```bash
railway add -d postgres
```

Railway will provision a PostgreSQL database and add it to your project.

### Step 5: Link Service

```bash
railway link
```

Select your project from the list.

### Step 6: Set Environment Variables

```bash
# Set individual variables
railway variables set ENCRYPTION_KEY=$(openssl rand -base64 32 | cut -c1-32)
railway variables set API_KEY=$(openssl rand -base64 48)
railway variables set ADMIN_PASSWORD=$(openssl rand -base64 32)
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app

# Reference PostgreSQL database
railway variables set DATABASE_URL='${{Postgres.DATABASE_URL}}'
```

### Step 7: Deploy

```bash
railway up
```

This command:
1. Compresses your code
2. Uploads to Railway
3. Triggers build process
4. Shows real-time logs

### Step 8: Generate Domain

```bash
railway domain
```

Railway generates a public URL for your service.

### Step 9: Open in Browser

```bash
railway open
```

Opens your Railway project dashboard.

---

## Environment Variables Configuration

### Required Variables

| Variable | Purpose | Example | Source |
|----------|---------|---------|--------|
| `DATABASE_URL` | PostgreSQL connection string | `${{Postgres.DATABASE_URL}}` | Railway (auto) |
| `ENCRYPTION_KEY` | AES-256-GCM encryption key | `${{secret(32, "chars")}}` | Railway secret() |
| `API_KEY` | API authentication key | `${{secret(48, "chars")}}` | Railway secret() |
| `ADMIN_PASSWORD` | Admin override password | `${{secret(32, "chars")}}` | Railway secret() |
| `NODE_ENV` | Environment mode | `production` | Manual |
| `PORT` | Server port | `3001` | Manual |
| `CORS_ORIGIN` | Allowed frontend origin | `https://app.com` | Manual |

### Optional Variables

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `LOG_LEVEL` | Winston logging level | `info` | `debug`, `warn`, `error` |

### Railway Secret Syntax

Railway provides a `secret()` function for generating secure random values:

```bash
# Generate 32 character secret
${{secret(32, "chars")}}

# Generate 48 character secret
${{secret(48, "chars")}}

# Generate 16 byte hex secret
${{secret(16, "hex")}}
```

### Referencing Service Variables

Railway allows cross-service variable references:

```bash
# Reference PostgreSQL database URL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Reference another service
API_URL=${{backend-service.RAILWAY_PUBLIC_DOMAIN}}
```

**Service Name Convention:**
- Default name: `Postgres`, `Redis`, etc.
- Custom name: Use the service name you set in Railway dashboard

---

## Database Setup

### PostgreSQL Service Configuration

Railway automatically configures PostgreSQL with:

- **Version**: PostgreSQL 15+
- **Storage**: 1GB free tier (upgradeable)
- **Backups**: Automatic daily backups
- **Networking**: Private network enabled
- **Connection Pooling**: PgBouncer available

### Database Connection

Railway provides multiple connection URLs:

1. **DATABASE_URL** (Private) - **Recommended**
   - Format: `postgresql://user:pass@private.railway.internal:5432/db`
   - **Faster**: No egress fees, direct network connection
   - **Secure**: Not exposed to internet
   - **Use for**: Backend services within Railway

2. **DATABASE_PUBLIC_URL** (Public)
   - Format: `postgresql://user:pass@public.proxy.railway.app:5432/db`
   - **External Access**: Accessible from anywhere
   - **Slower**: Network latency + egress fees
   - **Use for**: Local development, external tools

### Prisma Configuration

Your `schema.prisma` should use:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Running Migrations

**During Deployment (Automatic):**

Add to build command in `railway.json`:

```json
{
  "build": {
    "buildCommand": "npm install && npm run build && npx prisma migrate deploy"
  }
}
```

**Manual Migration (CLI):**

```bash
# Deploy pending migrations
railway run npx prisma migrate deploy

# View migration status
railway run npx prisma migrate status

# Access Prisma Studio
railway run npx prisma studio
```

### Database Seeding

Add seed script to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "npx prisma db seed"
  }
}
```

Run seed:

```bash
railway run npm run db:seed
```

### Connection Pooling

For production, enable connection pooling:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL") // For migrations
}
```

Add variables:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}?pgbouncer=true&connection_limit=10
DIRECT_DATABASE_URL=${{Postgres.DATABASE_URL}}
```

---

## Build and Start Commands

### Default Configuration

Railway auto-detects Node.js and uses:

```json
{
  "build": "npm install && npm run build",
  "start": "npm start"
}
```

### Custom Configuration with railway.json

Create `backend/railway.json`:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npx prisma generate && npm run build && npx prisma migrate deploy",
    "watchPatterns": [
      "src/**/*.ts",
      "prisma/**/*.prisma"
    ]
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "node dist/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "sleepApplication": false,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

### Build Command Breakdown

```bash
npm ci                       # Clean install (faster, reproducible)
npx prisma generate          # Generate Prisma Client
npm run build                # Compile TypeScript → dist/
npx prisma migrate deploy    # Apply pending migrations
```

### Start Command Options

**Option 1: Simple Start**

```bash
node dist/server.js
```

**Option 2: Start with Migration Check**

```json
{
  "scripts": {
    "start": "npx prisma migrate deploy && node dist/server.js"
  }
}
```

**Option 3: Start with Health Check**

Create `backend/scripts/start.sh`:

```bash
#!/bin/bash
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
node dist/server.js
```

Make executable:

```bash
chmod +x scripts/start.sh
```

Update `railway.json`:

```json
{
  "deploy": {
    "startCommand": "./scripts/start.sh"
  }
}
```

---

## Post-Deployment

### 1. Configure Storage Provider

Your backend requires S3-compatible storage configuration:

```bash
# Using Railway CLI
railway run curl -X POST https://your-app.up.railway.app/api/storage/configure \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws-s3",
    "credentials": {
      "accessKeyId": "YOUR_AWS_KEY",
      "secretAccessKey": "YOUR_AWS_SECRET",
      "region": "us-east-1",
      "bucket": "research-space-bucket"
    }
  }'
```

Supported providers:
- `aws-s3` - Amazon S3
- `cloudflare-r2` - Cloudflare R2
- `minio` - MinIO (self-hosted)

### 2. Test API Endpoints

```bash
# Health check
curl https://your-app.up.railway.app/health

# Storage status
curl https://your-app.up.railway.app/api/storage/status

# List files (requires auth)
curl https://your-app.up.railway.app/api/files/list \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 3. Update Frontend Configuration

Update your frontend environment variables:

```env
# .env.production
VITE_API_BASE_URL=https://your-app.up.railway.app
```

Redeploy frontend to apply changes.

### 4. Enable Custom Domain (Optional)

1. In Railway dashboard, go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Enter your domain: `api.yourapp.com`
4. Add DNS records (Railway provides instructions):
   ```
   Type: CNAME
   Name: api
   Value: your-app.up.railway.app
   ```
5. Wait for DNS propagation (5-30 minutes)

### 5. Set Up Monitoring

Railway provides built-in monitoring:

- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Alerts**: Set up notifications (Pro plan)

Access via Railway dashboard → Your Service → **Metrics** tab

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failure: "Prisma Client not generated"

**Error:**
```
Error: @prisma/client did not initialize yet. Please run "prisma generate"
```

**Solution:**

Add `npx prisma generate` to build command:

```json
{
  "build": {
    "buildCommand": "npm install && npx prisma generate && npm run build"
  }
}
```

#### 2. Database Connection Error

**Error:**
```
Error: P1001: Can't reach database server at `postgres.railway.internal`
```

**Solution:**

1. Verify `DATABASE_URL` variable is set correctly
2. Ensure it references Railway's Postgres service:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
3. Check PostgreSQL service is running (green status)
4. Use **DATABASE_URL** (private) not **DATABASE_PUBLIC_URL**

#### 3. Port Binding Error

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

Railway automatically assigns a port. Update your `server.ts`:

```typescript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Railway will inject `PORT` environment variable automatically.

#### 4. CORS Error in Frontend

**Error:**
```
Access to fetch at 'https://backend.railway.app/api/files' from origin 
'https://frontend.vercel.app' has been blocked by CORS policy
```

**Solution:**

1. Set `CORS_ORIGIN` environment variable in Railway:
   ```
   CORS_ORIGIN=https://frontend.vercel.app
   ```
2. For multiple origins, update `backend/src/server.ts`:
   ```typescript
   app.use(cors({
     origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
     credentials: true
   }));
   ```
3. Set comma-separated origins:
   ```
   CORS_ORIGIN=https://app1.com,https://app2.com
   ```

#### 5. Environment Variables Not Loading

**Error:**
```
Error: ENCRYPTION_KEY is not defined
```

**Solution:**

1. Verify variables are set in Railway dashboard → **Variables** tab
2. Redeploy after adding variables (click **Deploy**)
3. Check variable names match exactly (case-sensitive)
4. Use Railway CLI to verify:
   ```bash
   railway variables
   ```

#### 6. Migration Fails During Deployment

**Error:**
```
Error: Migration `20251004161543_init` failed to apply
```

**Solution:**

1. Check migration files are in `prisma/migrations/`
2. Ensure `prisma/migrations` is not in `.gitignore`
3. Reset database (development only):
   ```bash
   railway run npx prisma migrate reset
   ```
4. For production, apply migrations manually:
   ```bash
   railway run npx prisma migrate deploy --schema=./prisma/schema.prisma
   ```

#### 7. Deployment Timeout

**Error:**
```
Error: Deployment timed out after 10 minutes
```

**Solution:**

1. Check build logs for errors
2. Optimize build process (use `npm ci` instead of `npm install`)
3. Reduce build size (check `node_modules` size)
4. Increase timeout in `railway.json`:
   ```json
   {
     "deploy": {
       "healthcheckTimeout": 600
     }
   }
   ```

---

## Monitoring and Logs

### Viewing Logs

**Railway Dashboard:**

1. Go to your service
2. Click **"View Logs"** or **"Deployments"** tab
3. Select deployment to view logs

**Railway CLI:**

```bash
# Stream live logs
railway logs

# View logs with filters
railway logs --filter="ERROR"

# View last 100 lines
railway logs -n 100
```

### Log Levels

Your backend uses Winston logging:

```typescript
// backend/src/config/logger.ts
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

Set `LOG_LEVEL` environment variable:
- `error` - Only errors
- `warn` - Warnings + errors
- `info` - Info + warnings + errors (default)
- `debug` - All logs including debug info

### Metrics and Monitoring

Railway provides real-time metrics:

1. **CPU Usage**: Track CPU utilization
2. **Memory Usage**: Monitor memory consumption
3. **Network I/O**: Inbound/outbound traffic
4. **Request Count**: HTTP request rate
5. **Response Time**: Average response latency

Access via: Railway Dashboard → Service → **Metrics** tab

### Health Checks

Railway can monitor your app's health:

**Configure in railway.json:**

```json
{
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

**Health endpoint response:**

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-05T12:00:00.000Z",
    "uptime": 3600
  }
}
```

Railway pings this endpoint and restarts if it fails.

### Alerts and Notifications

Set up alerts for:
- Deployment failures
- High CPU/Memory usage
- Service downtime
- Error rate spikes

Configure via: Railway Dashboard → Project Settings → **Notifications**

---

## Additional Resources

### Railway Documentation

- [Railway Docs](https://docs.railway.com/)
- [Express Deployment Guide](https://docs.railway.com/guides/express)
- [PostgreSQL Guide](https://docs.railway.com/guides/postgresql)
- [Environment Variables](https://docs.railway.com/guides/variables)
- [Private Networking](https://docs.railway.com/guides/private-networking)

### Prisma Resources

- [Prisma Deployment Guide](https://www.prisma.io/docs/orm/prisma-client/deployment/traditional)
- [Prisma with Railway](https://render.com/docs/deploy-prisma-orm)
- [Prisma Connection Management](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections)

### Backend Documentation

- [API Documentation](../misc/API_REFERENCE.md)
- [Development Guide](../misc/DEVELOPMENT.md)
- [Security Best Practices](../misc/SECURITY.md)

---

## Support

### Railway Support

- **Community**: [Railway Discord](https://discord.gg/railway)
- **Documentation**: [docs.railway.com](https://docs.railway.com/)
- **Status**: [status.railway.com](https://status.railway.com/)

### Project Support

- **Issues**: [GitHub Issues](https://github.com/PRATS-gits/research-vite-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PRATS-gits/research-vite-app/discussions)

---

**Last Updated**: October 5, 2025  
**Guide Version**: 1.0.0  
**Railway Platform**: Railway V2
