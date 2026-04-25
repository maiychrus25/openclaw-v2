# Backend Security Practices

Standard security implementations for Node.js backend systems.

## 1. Authentication & Authorization

### JWT (JSON Web Tokens) Best Practices
- **Never store sensitive data** in the JWT payload (it is only base64 encoded, not encrypted).
- Keep expiration times short (e.g., 15 minutes for Access Tokens).
- Use **Refresh Tokens** stored securely (HttpOnly cookie or highly restricted database table) to obtain new access tokens.
- Always explicitly define and verify the signing algorithm (`algorithms: ['HS256']`) to prevent "None algorithm" token exploits.

### Cookies
If using cookies for auth, enforce these flags:
- `HttpOnly`: Prevents JavaScript (XSS) from reading the cookie.
- `Secure`: Ensures the cookie is only sent over HTTPS.
- `SameSite=Strict` or `Lax`: Protects against Cross-Site Request Forgery (CSRF).

## 2. Input Validation & Data Sanitization

**Never trust client input.**
- Validate all incoming data at the boundary (Controller/Route layer).
- Use a robust schema validation library like **Zod** or **Joi**.
- Strip unknown properties before processing.

### Preventing NoSQL Injection
Unlike SQL, NoSQL injections happen by passing JSON objects instead of strings (e.g., `{ "password": { "$gt": "" } }`).
- Cast strings explicitly or enforce object schemas.
- Use `express-mongo-sanitize` to strip prohibited prefixes (`$` and `.`) from user input.

## 3. Defense against DoS & Brute Force

### Rate Limiting
Always implement rate limiting to protect endpoints, especially authentication routes.
```javascript
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: 'Too many login attempts, please try again later'
});
```

### Payload Size Limits
Prevent memory exhaustion attacks by strictly limiting the incoming JSON payload size.
```javascript
app.use(express.json({ limit: '10kb' }));
```

## 4. HTTP Security Headers

Use the **Helmet** package to automatically secure HTTP headers:
- `Content-Security-Policy`: Protects against XSS.
- `Strict-Transport-Security`: Enforces HTTPS routing.
- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
- `X-Frame-Options: DENY`: Prevents Clickjacking.

## 5. Error Handling Security
- Never leak stack traces, database schema details, or internal module paths in API responses.
- In production, catch unhandled promise rejections and uncaught exceptions, log them, and exit the process gracefully (let your process manager like PM2 or Kubernetes restart it).

## 6. Dependency Security
- Run `npm audit` in CI/CD pipelines.
- Keep dependencies updated using tools like Dependabot or Renovate.
- Freeze dependency versions in `package-lock.json` to prevent malicious supply-chain updates.
