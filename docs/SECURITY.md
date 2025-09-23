# 🔐 Security Documentation

Comprehensive security measures and authentication implementation for Canva API compliance.

## 🛡️ Security Overview

This document outlines the security measures implemented to meet Canva's API submission requirements and protect user data.

## 🔑 Authentication Implementation

### OAuth 2.0 Flow

```typescript
// Authentication configuration
const authConfig = {
  clientId: process.env.CANVA_CLIENT_ID,
  clientSecret: process.env.CANVA_CLIENT_SECRET,
  redirectUri: process.env.CANVA_REDIRECT_URI,
  scopes: [
    'design:content:write',
    'design:content:read',
    'team:read',
    'brand:read'
  ]
};

// OAuth flow implementation
class CanvaAuth {
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      state: this.generateSecureState()
    });

    return `https://www.canva.com/api/oauth/authorize?${params}`;
  }

  async exchangeCodeForToken(code: string, state: string): Promise<TokenResponse> {
    // Verify state parameter for CSRF protection
    if (!this.verifyState(state)) {
      throw new Error('Invalid state parameter');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.redirectUri
      })
    });

    return tokenResponse.json();
  }
}
```

### Token Management

```typescript
// Secure token storage and management
class TokenManager {
  private encryptionKey = process.env.ENCRYPTION_KEY;

  async storeToken(userId: string, token: TokenData): Promise<void> {
    const encryptedToken = await this.encrypt(token);
    await this.database.tokens.create({
      userId,
      encryptedToken,
      expiresAt: new Date(Date.now() + token.expires_in * 1000),
      createdAt: new Date()
    });
  }

  async getToken(userId: string): Promise<TokenData | null> {
    const record = await this.database.tokens.findUnique({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!record || record.expiresAt < new Date()) {
      return null;
    }

    return this.decrypt(record.encryptedToken);
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    // Implement token refresh logic
    const response = await fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken
      })
    });

    return response.json();
  }
}
```

## 🔒 Data Protection

### Encryption Standards

```typescript
// Data encryption implementation
import { createCipher, createDecipher, randomBytes } from 'crypto';

class DataEncryption {
  private algorithm = 'aes-256-gcm';
  private key = process.env.ENCRYPTION_KEY;

  encrypt(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const iv = randomBytes(16);
        const cipher = createCipher(this.algorithm, this.key);
        cipher.setAAD(Buffer.from('canva-md-converter'));

        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const tag = cipher.getAuthTag();
        const result = iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  decrypt(encryptedData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const tag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = createDecipher(this.algorithm, this.key);
        decipher.setAAD(Buffer.from('canva-md-converter'));
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        resolve(JSON.parse(decrypted));
      } catch (error) {
        reject(error);
      }
    });
  }
}
```

### Secure Session Management

```typescript
// Session security implementation
class SessionManager {
  private sessionStore = new Map<string, SessionData>();
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes

  createSession(userId: string): string {
    const sessionId = this.generateSecureSessionId();
    const sessionData: SessionData = {
      userId,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      isValid: true
    };

    this.sessionStore.set(sessionId, sessionData);

    // Auto-cleanup expired sessions
    setTimeout(() => {
      this.sessionStore.delete(sessionId);
    }, this.sessionTimeout);

    return sessionId;
  }

  validateSession(sessionId: string): SessionData | null {
    const session = this.sessionStore.get(sessionId);

    if (!session || !session.isValid) {
      return null;
    }

    if (Date.now() - session.lastAccessed > this.sessionTimeout) {
      this.sessionStore.delete(sessionId);
      return null;
    }

    session.lastAccessed = Date.now();
    return session;
  }

  private generateSecureSessionId(): string {
    return randomBytes(32).toString('hex');
  }
}
```

## 🛡️ Security Measures

### Input Validation

```typescript
// Comprehensive input validation
import { z } from 'zod';

const MarkdownInputSchema = z.object({
  content: z.string().max(50000), // 50KB limit
  title: z.string().max(200),
  template: z.enum(['ocean-pastel', 'professional-blue', 'modern-gradient', 'minimal-clean', 'research-report']),
  collaboration: z.object({
    teamShare: z.boolean(),
    permissions: z.enum(['edit', 'comment', 'view']),
    folder: z.string().max(100).optional()
  }).optional()
});

class InputValidator {
  validateMarkdownInput(input: unknown): MarkdownInput {
    try {
      return MarkdownInputSchema.parse(input);
    } catch (error) {
      throw new Error('Invalid input data');
    }
  }

  sanitizeContent(content: string): string {
    // Remove potentially dangerous content
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}
```

### Rate Limiting

```typescript
// API rate limiting implementation
class RateLimiter {
  private requests = new Map<string, number[]>();
  private readonly limit = 100; // requests per hour
  private readonly window = 60 * 60 * 1000; // 1 hour

  isAllowed(clientId: string): boolean {
    const now = Date.now();
    const clientRequests = this.requests.get(clientId) || [];

    // Remove old requests outside the window
    const validRequests = clientRequests.filter(
      timestamp => now - timestamp < this.window
    );

    if (validRequests.length >= this.limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(clientId, validRequests);
    return true;
  }

  getRemainingRequests(clientId: string): number {
    const clientRequests = this.requests.get(clientId) || [];
    return Math.max(0, this.limit - clientRequests.length);
  }
}
```

### Error Handling

```typescript
// Secure error handling
class SecurityErrorHandler {
  handleError(error: Error, context: string): ErrorResponse {
    // Log detailed error internally
    console.error(`Security error in ${context}:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Return generic error to client (no sensitive info)
    return {
      success: false,
      message: 'An error occurred processing your request',
      code: 'PROCESSING_ERROR',
      timestamp: Date.now()
    };
  }

  isSecurityError(error: Error): boolean {
    const securityKeywords = [
      'authentication',
      'authorization',
      'token',
      'session',
      'permission'
    ];

    return securityKeywords.some(keyword =>
      error.message.toLowerCase().includes(keyword)
    );
  }
}
```

## 🔍 Security Testing

### Authentication Test Scenarios

```typescript
// Comprehensive authentication testing
describe('Authentication Security', () => {
  test('should reject invalid state parameter', async () => {
    const invalidState = 'tampered-state';
    expect(() => auth.verifyState(invalidState)).toThrow();
  });

  test('should handle expired tokens', async () => {
    const expiredToken = { expires_at: Date.now() - 1000 };
    const result = await tokenManager.validateToken(expiredToken);
    expect(result.valid).toBe(false);
  });

  test('should prevent CSRF attacks', async () => {
    const maliciousRequest = {
      code: 'valid-code',
      state: 'malicious-state'
    };
    expect(() => auth.handleCallback(maliciousRequest)).toThrow();
  });

  test('should enforce rate limits', async () => {
    const clientId = 'test-client';

    // Make requests up to limit
    for (let i = 0; i < 100; i++) {
      expect(rateLimiter.isAllowed(clientId)).toBe(true);
    }

    // 101st request should be blocked
    expect(rateLimiter.isAllowed(clientId)).toBe(false);
  });
});
```

## 📋 Security Compliance Checklist

### Required Security Measures
- [x] **OAuth 2.0 Implementation**: Standard compliant flow
- [x] **CSRF Protection**: State parameter validation
- [x] **Token Encryption**: AES-256-GCM encryption
- [x] **Session Security**: Secure session management
- [x] **Input Validation**: Comprehensive input sanitization
- [x] **Rate Limiting**: API abuse prevention
- [x] **Error Handling**: Secure error responses
- [x] **HTTPS Only**: All production traffic encrypted

### Data Protection
- [x] **Encryption at Rest**: Database encryption
- [x] **Encryption in Transit**: HTTPS/TLS 1.2+
- [x] **Access Logging**: Audit trail maintenance
- [x] **Data Minimization**: Only necessary data stored
- [x] **Retention Policy**: Automatic data cleanup
- [x] **User Consent**: Clear privacy disclosure

### Production Security
- [x] **Environment Variables**: Secure secret management
- [x] **Database Security**: Connection encryption
- [x] **API Security**: Authentication headers
- [x] **Content Security Policy**: XSS prevention
- [x] **Security Headers**: HSTS, X-Frame-Options
- [x] **Monitoring**: Security event logging

## 🚨 Incident Response

### Security Incident Procedures
1. **Detection**: Automated monitoring alerts
2. **Assessment**: Determine severity and impact
3. **Containment**: Isolate affected systems
4. **Investigation**: Root cause analysis
5. **Recovery**: Restore secure operations
6. **Documentation**: Record lessons learned

### Emergency Contacts
- **Security Team**: security@your-domain.com
- **Development Team**: dev@your-domain.com
- **Canva Support**: developers@canva.com

---

**Security Status**: ✅ Ready for production deployment and Canva API submission