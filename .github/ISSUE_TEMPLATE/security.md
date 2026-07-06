---
name: Security vulnerability
about: Report a security vulnerability confidentially
title: "[SECURITY] "
labels: security
assignees: ""
---

> **⚠️ IMPORTANT**: If this is a critical vulnerability (RCE, SQLi, auth bypass, data leak), please **do not** file a public issue. Instead, email **security@jobilo.io** with full details so we can triage confidentially.

## Vulnerability Description

A clear description of the security issue.

## Affected Components

- **Service:** (api, frontend, auth-service, etc.)
- **Version:** (commit hash, tag, or release)
- **File/Endpoint:** (specific path or route)
- **Dependency:** (name and version if applicable)

## Reproduction Steps

Step-by-step instructions to reproduce the vulnerability.

1. Send `POST /api/v1/auth/login` with payload `{...}`
2. Observe response header `X-Debug-Token: ...`
3. The token leaks session data in production.

## Potential Impact

What an attacker could achieve by exploiting this vulnerability.

- [ ] Remote code execution
- [ ] Privilege escalation
- [ ] Data exfiltration / leakage
- [ ] Denial of service
- [ ] Cross-site scripting (XSS)
- [ ] SQL / NoSQL injection
- [ ] Authentication bypass

## Suggested Fix (if known)

Provide code or configuration changes that mitigate the issue.

```diff
- app.set('env', process.env.NODE_ENV);
+ app.set('env', 'production');
```

## Disclosure Preference

- [ ] I am fine with public disclosure after a fix is released
- [ ] I prefer coordinated disclosure (embargo period of ___ days)
- [ ] I wish to remain anonymous
