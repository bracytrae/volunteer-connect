# VolunteerConnect — Unit 12 MVP

VolunteerConnect is a web application that helps college students discover volunteer opportunities, register for events, and track service hours.

## Current status (November 22, 2026)

**Implemented:** volunteer opportunity listings, event registration for one demo student, service-hour logging, and a dashboard showing registrations and total hours.

**Verified locally:** Docker Compose ran the web application at `http://localhost:3000`; registration worked in the browser; all nine Jest/Supertest tests passed. The GitHub Actions CI workflow also completed successfully on the MVP feature branch.

**Git workflow:** work was committed on `feature/mvp-core` and merged through [Pull Request #1](https://github.com/bracytrae/volunteer-connect/pull/1) into `main`.

**Google Cloud Run:** deployment is a separate submission requirement. See [Cloud Run attempt guide](docs/CLOUD_RUN_ATTEMPT.md). Do not interpret local Docker success as successful cloud deployment.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js / Express |
| Database | PostgreSQL |
| Containerization | Docker / Docker Compose |
| Automated testing | Jest / Supertest |
| CI | GitHub Actions |
| Planned cloud host | Google Cloud Run |
| AI development support | ChatGPT; see [usage record](docs/AI_USAGE_LOG.md) |

## Run locally

Requires Docker Desktop. From the project root:

```bash
docker compose up --build
```

Open http://localhost:3000. Docker Compose starts both the web app and local PostgreSQL service. Stop with `docker compose down`.

To run the automated API tests, install Node.js 20 or later and execute:

```bash
npm ci
npm test
```

### Quick functional test

1. Browse opportunities.
2. Register for an event.
3. Check that it appears under registrations.
4. Log 2.5 service hours for the event.
5. Confirm the dashboard total persists after refresh.

The nine automated tests use a mocked database, so they are not a substitute for the browser/database test.

## Git and CI evidence

- [Repository](https://github.com/bracytrae/volunteer-connect)
- [Merged MVP feature pull request](https://github.com/bracytrae/volunteer-connect/pull/1)
- [GitHub Actions runs](https://github.com/bracytrae/volunteer-connect/actions)
- [CI workflow](.github/workflows/ci.yml)
- [Sprint 1 progress record](docs/SPRINT1_PROGRESS.md)
- [AI usage log](docs/AI_USAGE_LOG.md)

## Constraints and next steps

This is an educational MVP, not a production-ready website. It uses a predefined demo student rather than sign-in/authentication, seeded opportunities rather than an admin interface, and self-reported service hours. Advanced filters, registration cancellation, and AI-powered recommendations are planned for later work.

Cloud Run does not automatically deploy the local PostgreSQL container defined in `compose.yaml`. A cloud-hosted database and secure configuration would be required for data-dependent routes to work remotely. Never commit actual credentials to the repository.

## Agile project documentation

- [Jira VC Sprint board](https://bracytrae.atlassian.net/jira/software/projects/VC/boards/2/backlog)
- Confluence: add the verified publicly viewable space URL to your final course submission.
- Sprint 1 (Unit 12): deliver and test core functionality; demonstrate feature-branch PR, Docker, CI, and cloud deployment attempt.
- Sprint 2 (Unit 14): additional features and improvements.
