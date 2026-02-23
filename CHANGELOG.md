# Changelog — DesarrolloPersonal.uno

All notable changes are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Mirror server architecture (DEV/PROD environments)
- `ecosystem.config.js` with separate DEV and PROD app entries
- Nginx configuration templates for both environments
- Deployment scripts: `deploy-dev.sh`, `deploy-prod.sh`, `backup.sh`, `rollback.sh`
- Architecture documentation in `docs/mirror-server-architecture.md`
- Updated `.env.example` to reflect actual tech stack (NextAuth, Wompi, Groq, Resend, PostgreSQL)

---

## [1.0.0] - 2026-02-22

### Added
- Initial platform launch
- Next.js 15 App Router with React 19
- PostgreSQL database with Prisma ORM
- NextAuth.js authentication (email/password + OAuth)
- Course system with video lessons and progress tracking
- Gamification: points, levels, streaks, achievements, badges
- Forum with categories, posts, replies, and reactions
- PDF certificate generation on course completion
- AI assistant powered by Groq API (Llama 3.3 70B)
- Wompi payment integration (Colombia)
- Email notifications via Resend
- Admin dashboard (users, courses, forum, payments, achievements)
- PM2 process management
- Nginx reverse proxy with SSL (Certbot)

---

<!--
How to add entries:
- Added: new features
- Changed: changes to existing features
- Fixed: bug fixes
- Removed: removed features
- Security: security improvements
-->
