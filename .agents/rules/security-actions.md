---
trigger: always_on
---

# Security Skill Rules

## Objective

Implement MAXIMUM possible security without exceptions.
Security is NEVER optional or relaxed.

## Core Principles

1. Deny by default
2. Validate everything
3. Least privilege access
4. Defense in depth

## Input Security

- Validate ALL inputs (frontend + backend)
- Use strict schemas (Zod / Joi / Yup)
- Sanitize user input
- Reject malformed requests immediately

## Authentication

- Use secure auth (JWT with refresh tokens or session-based)
- Passwords MUST be hashed (bcrypt with salt)
- Enforce strong password policies

## Authorization

- Role-based or permission-based access
- Never trust client-side roles
- Verify on backend ALWAYS

## API Security

- Rate limiting (prevent abuse)
- Request size limits
- API authentication required for all sensitive routes

## Common Attack Prevention

- SQL Injection → parameterized queries / ORM
- XSS → sanitize output + escape HTML
- CSRF → CSRF tokens or same-site cookies
- CORS → strict origin control

## Data Protection

- No sensitive data in logs
- Use HTTPS ONLY
- Encrypt sensitive data at rest (if applicable)

## Environment Security

- Use `.env` for secrets
- NEVER expose keys in code
- Rotate secrets periodically

## Dependency Security

- Regularly audit dependencies
- Avoid outdated/vulnerable packages

## Logging & Monitoring

- Log suspicious activity
- Track failed login attempts
- Alert on anomalies

## Strict Rules

- No shortcuts
- No disabled security checks
- If unsure → choose MORE secure option