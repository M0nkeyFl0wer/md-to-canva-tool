# 🚀 Production Deployment Guide

Complete guide for deploying Canva Markdown Converter to production for API submission.

## 🎯 Deployment Overview

This guide covers deploying the application to a production environment that meets Canva's API submission requirements.

## 🏗️ Platform Selection

### Recommended Platforms

#### Option 1: Vercel (Recommended)
- **Pros**: Excellent Next.js support, automatic HTTPS, global CDN
- **Cons**: Function execution limits
- **Best For**: React/Next.js applications

#### Option 2: Netlify
- **Pros**: Simple deployment, good static site support
- **Cons**: Limited serverless function duration
- **Best For**: Static sites with light API usage

#### Option 3: AWS (Advanced)
- **Pros**: Full control, scalable, enterprise-grade
- **Cons**: More complex setup, higher cost
- **Best For**: Large-scale applications

#### Option 4: Railway
- **Pros**: Simple deployment, good for full-stack apps
- **Cons**: Newer platform, fewer features
- **Best For**: Node.js applications

### ⚠️ Platforms to Avoid
- **Glitch**: Not suitable for production (free tier limitations)
- **Heroku Free**: Service discontinued
- **Local Development**: Cannot use localhost URLs

## 🔧 Vercel Deployment (Recommended)

### Step 1: Prepare Application

```bash
# 1. Create Next.js wrapper for our components
cd canva-md-converter
npm install next@latest react@latest react-dom@latest

# 2. Create Next.js pages structure
mkdir -p pages/api
mkdir -p pages/auth

# 3. Configure for production build
npm run build
```

### Step 2: Configure Environment Variables

```bash
# .env.production
CANVA_CLIENT_ID=your_client_id
CANVA_CLIENT_SECRET=your_client_secret
CANVA_REDIRECT_URI=https://your-domain.vercel.app/auth/callback
ENCRYPTION_KEY=your_32_char_encryption_key
DATABASE_URL=your_database_connection_string
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### Step 3: Create Vercel Configuration

```json
{
  "version": 2,
  "name": "canva-md-converter",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "CANVA_CLIENT_ID": "@canva_client_id",
    "CANVA_CLIENT_SECRET": "@canva_client_secret",
    "CANVA_REDIRECT_URI": "@canva_redirect_uri",
    "ENCRYPTION_KEY": "@encryption_key"
  }
}
```

### Step 4: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Configure environment variables
vercel env add CANVA_CLIENT_ID production
vercel env add CANVA_CLIENT_SECRET production
vercel env add CANVA_REDIRECT_URI production
vercel env add ENCRYPTION_KEY production
```

## 🐳 Docker Deployment (Alternative)

### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY canva-app/package*.json ./canva-app/
COPY mcp-server/package*.json ./mcp-server/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm ci --only=production

# Build stage
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose for Development

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - CANVA_CLIENT_ID=${CANVA_CLIENT_ID}
      - CANVA_CLIENT_SECRET=${CANVA_CLIENT_SECRET}
      - CANVA_REDIRECT_URI=${CANVA_REDIRECT_URI}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - database

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=canva_converter
      - POSTGRES_USER=app_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🗄️ Database Setup

### PostgreSQL (Recommended)

```sql
-- Create database schema
CREATE DATABASE canva_converter;

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  canva_user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tokens table
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  encrypted_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_expires_at ON tokens(expires_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Prisma Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  canvaUserId  String?   @map("canva_user_id")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  tokens       Token[]
  sessions     Session[]

  @@map("users")
}

model Token {
  id             String   @id @default(cuid())
  userId         String   @map("user_id")
  encryptedToken String   @map("encrypted_token")
  expiresAt      DateTime @map("expires_at")
  createdAt      DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("tokens")
}

model Session {
  id        String   @id
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

## 🔒 SSL/HTTPS Configuration

### Automatic HTTPS (Vercel/Netlify)
- SSL certificates automatically provisioned
- No additional configuration required
- HTTPS enforced by default

### Manual SSL Setup (VPS/Docker)

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Analytics

### Application Monitoring

```typescript
// monitoring.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'canva-md-converter' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({
      format: format.simple()
    })
  ]
});

// Performance monitoring
export const trackApiCall = (endpoint: string, duration: number) => {
  logger.info('API call completed', {
    endpoint,
    duration,
    timestamp: Date.now()
  });
};

// Error tracking
export const trackError = (error: Error, context: string) => {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: Date.now()
  });
};
```

### Health Check Endpoint

```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check database connection
    const dbHealth = await checkDatabase();

    // Check external API availability
    const canvaHealth = await checkCanvaAPI();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      checks: {
        database: dbHealth,
        canva_api: canvaHealth
      }
    };

    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] **Environment Variables**: All secrets configured
- [ ] **Database**: Production database provisioned
- [ ] **SSL Certificate**: HTTPS enabled
- [ ] **Domain**: Custom domain configured (optional)
- [ ] **Monitoring**: Error tracking enabled
- [ ] **Backup**: Database backup strategy

### Deployment
- [ ] **Code**: Latest code pushed to repository
- [ ] **Build**: Production build successful
- [ ] **Deploy**: Application deployed to platform
- [ ] **DNS**: Domain pointing to deployment
- [ ] **SSL**: HTTPS working correctly
- [ ] **Health Check**: /api/health endpoint responding

### Post-Deployment
- [ ] **Authentication**: OAuth flow working
- [ ] **API Calls**: Canva API integration functional
- [ ] **Database**: Connections working correctly
- [ ] **Performance**: Load time under 3 seconds
- [ ] **Monitoring**: Analytics and error tracking active
- [ ] **Security**: Security headers configured

### Testing
- [ ] **Functionality**: Core features working
- [ ] **Authentication**: Login/logout flows
- [ ] **API Integration**: Canva API calls successful
- [ ] **Error Handling**: Graceful error responses
- [ ] **Performance**: Load testing completed
- [ ] **Security**: Security audit passed

## 📋 Production URLs Configuration

### Required URLs for Canva Submission

```bash
# Production URLs (replace with your domain)
Production Domain: https://canva-md-converter.vercel.app
Authentication Redirect: https://canva-md-converter.vercel.app/auth/callback
Webhook URL: https://canva-md-converter.vercel.app/api/webhooks/canva
Return URL: https://canva-md-converter.vercel.app/success
Health Check: https://canva-md-converter.vercel.app/api/health
```

### Environment Variables Template

```bash
# Copy to .env.production
CANVA_CLIENT_ID=your_client_id_from_canva_developer_portal
CANVA_CLIENT_SECRET=your_client_secret_from_canva_developer_portal
CANVA_REDIRECT_URI=https://your-domain.com/auth/callback
CANVA_WEBHOOK_URL=https://your-domain.com/api/webhooks/canva
CANVA_RETURN_URL=https://your-domain.com/success

DATABASE_URL=postgresql://user:password@host:port/database
ENCRYPTION_KEY=your_32_character_encryption_key_here
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_key_here

NODE_ENV=production
```

---

**Deployment Status**: 🚧 Ready for production deployment configuration

**Next Steps**:
1. Choose deployment platform
2. Configure environment variables
3. Deploy application
4. Update Canva developer portal with production URLs
5. Submit for API approval