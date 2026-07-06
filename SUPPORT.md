# Support — الدعم الفني

> How to get help with Jobilo — كيفية الحصول على المساعدة

---

## Documentation Links | روابط التوثيق

Before seeking support, please check our comprehensive documentation:

| Category | Document | الرابط |
|----------|----------|--------|
| **Getting Started** | [README.md](README.md) | Quick start guide, setup instructions |
| **Project Overview** | [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) | What Jobilo is, target audience |
| **Vision & Mission** | [docs/VISION.md](docs/VISION.md) | 10-year vision, strategic goals |
| **Mission** | [docs/MISSION.md](docs/MISSION.md) | Detailed mission breakdown |
| **Roadmap** | [docs/ROADMAP.md](docs/ROADMAP.md) | Development phases and milestones |
| **Architecture** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, clean architecture |
| **Security** | [docs/SECURITY.md](docs/SECURITY.md) | Authentication, authorization, security policies |
| **System Design** | [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md) | Component interactions, data flow |
| **Deployment** | [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Deployment instructions |
| **Versioning** | [docs/VERSIONING.md](docs/VERSIONING.md) | Semantic versioning strategy |
| **Changelog** | [docs/CHANGELOG.md](docs/CHANGELOG.md) | Release history |
| **Contributing** | [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to the project |

---

## Issue Reporting | الإبلاغ عن المشكلات

### Bug Reports | تقارير الأخطاء

If you find a bug in Jobilo, please report it by [opening a GitHub Issue](https://github.com/jobilo/jobilo/issues/new?template=bug_report.md).

**Before reporting:**
1. Check if the bug has already been reported in [existing issues](https://github.com/jobilo/jobilo/issues)
2. Ensure you're running the latest version (`git pull origin main`)
3. Check our [FAQ](#faq) for common issues

**Bug report should include:**
- **Summary**: Clear, concise description of the bug
- **Steps to reproduce**: Numbered steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, browser, Node.js version, Docker version
- **Screenshots**: If applicable
- **Logs**: Relevant error messages or logs

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
- OS: [e.g. Windows 11, macOS Sequoia, Ubuntu 24.04]
- Browser: [e.g. Chrome 125, Firefox 128]
- Node.js Version: [e.g. 20.15]
- Docker Version: [e.g. 27.0]
- Jobilo Version: [e.g. 0.1.0]

**Additional context**
Add any other context about the problem here.
```

---

## Feature Requests | طلبات الميزات

We welcome feature suggestions! To submit a feature request:

1. **Search first**: Check [existing feature requests](https://github.com/jobilo/jobilo/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) and [discussions](https://github.com/jobilo/jobilo/discussions)
2. **Create a discussion**: Start a [GitHub Discussion](https://github.com/jobilo/jobilo/discussions/new) with the "Feature Request" category
3. **Or open an issue**: Use the [feature request template](https://github.com/jobilo/jobilo/issues/new?template=feature_request.md)

### Feature Request Template

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**How would this benefit the Jobilo community?**
Explain how this feature would help Arabic freelancers or clients.

**Additional context**
Add any other context or screenshots about the feature request here.
```

---

## Contact Information | معلومات الاتصال

### General Support

| Channel | القناة | Response Time | Use Case |
|---------|--------|---------------|----------|
| **GitHub Issues** | مشكلات جيتهاب | 24–48 hours | Bug reports, feature requests |
| **GitHub Discussions** | مناقشات جيتهاب | 24–72 hours | Questions, ideas, community support |
| **Email: support@jobilo.ai** | البريد الإلكتروني | 24–48 hours | Account issues, privacy requests |
| **Security: security@jobilo.ai** | البريد الإلكتروني الأمني | 4–24 hours | Security vulnerabilities (private) |
| **Developers: developers@jobilo.ai** | البريد الإلكتروني للمطورين | 24–72 hours | Technical questions, API support |

### Priority Response Times

| Priority Level | مستوى الأولوية | Response Time | Examples |
|----------------|---------------|---------------|----------|
| **🔴 Critical** | حرج | 4 hours | Security breach, service outage, data loss |
| **🟠 High** | عالي | 12 hours | Authentication issues, payment problems |
| **🟡 Medium** | متوسط | 24 hours | Feature not working, configuration issues |
| **🟢 Low** | منخفض | 48 hours | Documentation errors, minor UI bugs |

---

## FAQ | الأسئلة الشائعة

### General | عام

**Q: Is Jobilo free to use?**
A: Yes! During the MVP phase, Jobilo is completely free. There are no platform fees, and freelancers keep 100% of their earnings. In the future, we will introduce optional subscription plans (see [Roadmap](docs/ROADMAP.md)).

**س: هل Jobilo مجاني للاستخدام؟**
ج: نعم! خلال مرحلة MVP، Jobilo مجاني تمامًا. لا توجد رسوم منصة، والمستقلون يحتفظون بنسبة 100% من أرباحهم. في المستقبل، سنقدم خطط اشتراك اختيارية.

**Q: Who is Jobilo for?**
A: Jobilo is built for Arabic-speaking freelancers and clients, primarily in Egypt, Saudi Arabia, UAE, and the broader Middle East. The platform is Arabic-first with full RTL support.

**Q: What kind of projects can I find?**
A: Jobilo supports a wide range of freelance categories including web development, mobile development, design, writing and translation, marketing, data entry, video production, and more.

**Q: Is Jobilo open source?**
A: Yes! The core platform code is open source under the MIT License. You can find it on [GitHub](https://github.com/jobilo/jobilo).

### Technical | تقني

**Q: What tech stack does Jobilo use?**
A: Next.js 15 (frontend), NestJS (backend), PostgreSQL 16 (database), Prisma (ORM), TypeScript, Tailwind CSS, Docker, JWT, and WebSocket. See [Tech Stack](../README.md#tech-stack).

**Q: How do I set up the development environment?**
A: See our [Getting Started guide](../README.md#getting-started) for detailed setup instructions.

**Q: How do I report a security vulnerability?**
A: Please email `security@jobilo.ai` directly. Do not open a public issue for security vulnerabilities.

### Community | مجتمع

**Q: How can I contribute?**
A: Check our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute code, documentation, translations, and more.

**Q: How can I suggest a new feature?**
A: Open a [GitHub Discussion](https://github.com/jobilo/jobilo/discussions) with the "Feature Request" category, or use the [feature request template](https://github.com/jobilo/jobilo/issues/new?template=feature_request.md).

**Q: Is there a community chat?**
A: Community channels will be announced soon. Follow us on GitHub and check the README for updates.

---

## Status Page | صفحة الحالة

Check our system status and uptime at **[status.jobilo.ai](https://status.jobilo.ai)** (coming soon).

Current system status:
- **API**: ✅ Operational
- **Database**: ✅ Operational
- **WebSocket**: ✅ Operational
- **Storage**: ✅ Operational
- **Email Service**: ✅ Operational

---

## Links | روابط ذات صلة

- [README.md](README.md) — Main project readme
- [Contributing Guide](CONTRIBUTING.md) — How to contribute
- [Code of Conduct](CODE_OF_CONDUCT.md) — Community guidelines
