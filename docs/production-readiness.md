# Production readiness register

This register separates what is implemented in the application from settings that must be owned in the deployment and Supabase dashboards.

| Area | Status | Owner and evidence |
| --- | --- | --- |
| Admin sign-in and sign-out | Implemented | Supabase password auth; protected admin routes and verified-profile guard. |
| Password reset | Implemented | `/admin/login` sends Supabase recovery email to `/admin/reset-password`. |
| Email verification | Enforced in app | Admin access requires `email_confirmed_at`. Confirm **Enable email confirmations** remains enabled in Supabase Auth. |
| Login rate limiting and bot protection | Dashboard action required | Configure Auth rate limits and CAPTCHA in Supabase Auth, then test failed logins and recovery requests. Do not implement client-side-only throttling as a security control. |
| RLS | Implemented, recurring review | All current public tables have RLS enabled. Run Supabase Security Advisors and role-path checks before every material release. |
| Secret keys | Implemented | Browser uses only the public anon/publishable key; service-role use is server-side. |
| Database backup and restore | Dashboard action required | Confirm plan retention and point-in-time recovery availability; name an owner and perform a documented restore drill quarterly. |
| Privacy policy | Implemented | `/privacy-policy`, linked in the public footer. Legal owner must approve wording and retention periods before launch. |
| Terms and conditions | Implemented | `/terms-and-conditions`, public and admin-managed policy workflow. |
| Analytics and exception signals | Implemented | Google Analytics is installed; anonymous exception events are emitted without account, booking, or stack-trace content. |
| Dedicated error-monitoring service | Deferred configuration | Add a production error-monitoring provider only after a project/DSN and data-retention policy are approved. |
| Customer delete-account / onboarding | Not applicable currently | The website has public enquiries, not customer accounts. Reassess when customer login is introduced. |

## Release gate

Before production release, test: verified/unverified staff sign-in, logout, reset email and reset completion, expired reset link, manager/owner/developer route permissions, 320px and desktop login layouts, reduced motion, privacy/terms links, and Supabase Auth rate limits.

Keep the Supabase Auth redirect allow-list restricted to the production URL, approved previews, and local development URLs. Configure a production SMTP provider before relying on recovery or invitation mail at volume.
