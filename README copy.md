# VolunteerConnect MVP

A responsive college volunteer-opportunity web application, built for an Agile software-development course.

**MVP features:** Browse/search volunteer opportunities, register once per event, view registrations, log service hours, and track hours in a student dashboard. A single predefined **Demo Student** is used, so this is **not a production-ready multi-user app**.

## Quick start (recommended: Docker Desktop)

Prerequisites: Docker Desktop running on your computer. Open the project folder in VS Code's terminal.

```bash
docker compose up --build
```

Open **http://localhost:3000** in your browser. Docker initializes PostgreSQL, creates four tables, and inserts four example opportunities automatically on the **first** run.

To stop, press **Ctrl+C** in the terminal. To restart later: `docker compose up`.

### Important: database reset

For a fresh demo database (this **deletes local registrations and service-hour logs**):

```bash
docker compose down -v
docker compose up --build
```

Changing `db/init.sql` does not automatically update an already-created database volume; reset only if you're comfortable losing your demo data.

## Try the MVP in your browser

1. View four example volunteer opportunities.
2. Search for `Food` or `Park` in the search field.
3. Click **Register for event** on an opportunity.
4. Notice the button changes to **Registered**, and the **My registrations** panel updates.
5. Choose that event under **Log volunteer hours**, enter `2.5`, and click **Save hours**.
6. Verify the total service hours and recent activity display `2.5`.
7. Refresh the page: your registration and hour log should still be there (persisted in PostgreSQL).

## Project structure

```
volunteerconnect-mvp/
├── public/                  # HTML, CSS, and browser-side JavaScript
├── src/                     # Express API and PostgreSQL connection
│   ├── app.js
│   ├── db.js
│   └── server.js
├── db/init.sql              # Schema and example seed data
├── __tests__/api.test.js    # Jest + Supertest API tests
├── .github/workflows/ci.yml
├── compose.yaml             # Web + PostgreSQL containers
├── Dockerfile
└── package.json
```

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Application status |
| GET | `/api/opportunities` | List all opportunities; includes `registered` boolean |
| POST | `/api/registrations` | Register demo student, JSON `{ "opportunityId": 1 }` |
| GET | `/api/dashboard` | Demo student, registrations, logs, total hours |
| POST | `/api/hours` | Log hours, JSON `{ "opportunityId": 1, "hours": 2.5 }` |

## Run automated tests

Run in your Mac terminal from the root of the repository (Node.js 20+ required):

```bash
npm install
npm test
```

Tests use a mocked database so the Jest/Supertest suite does not require a running PostgreSQL instance. After the first successful `npm install`, commit the generated `package-lock.json` for reproducible installs; you can then switch the workflow and Dockerfile to `npm ci`. GitHub Actions runs the tests and checks the Docker build after a push or pull request. The workflow intentionally does not enable npm caching until a committed lockfile is present. **A green workflow verifies the mocked API tests and Docker build, not a live database integration test or Cloud Run deployment.**

## Optional: Node.js directly (without running Node in Docker)

Start only the database with `docker compose up -d db`, then:

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000. The `DATABASE_URL` in `.env.example` points to the PostgreSQL container exposed on localhost:5432.

## Cloud Run deployment plan (follow after local MVP works)

Google Cloud Run can run the web service from this Dockerfile, but **it cannot reach the local `db` Compose hostname**. Use a managed PostgreSQL service (for example, Cloud SQL for PostgreSQL), configure a secure `DATABASE_URL` or Cloud SQL connection, and apply `db/init.sql` to that database first. Also protect credentials with Secret Manager. Cloud Run deployment is **not preconfigured or claimed to be complete** in this starter.

The course's AI-tool requirement can be documented in the proposal and reflection; AI-powered recommendations are a future feature, not a prerequisite for demonstrating this MVP.

## Deliberate MVP limitations

- One hard-coded demonstration student (`id = 1`), with no login or permissions.
- Example opportunities are seeded; there is no admin event editor.
- Students can log hours for any registered event; hour logs are **not verified or approved**, and the form does not enforce event completion dates.
- No attendance checking, cancellation, reminders, or recommendation engine.
- Service hours should not be used as official records without verification and authentication.

## Suggested demonstration script

“VolunteerConnect helps college students discover local volunteer events and track participation. Our app shows opportunities stored in PostgreSQL. When a student registers, a registration record is created. The dashboard then shows the event, and the student can log service hours. I can refresh the page to show the data is persistent. We use Express for our API, PostgreSQL for storage, Docker for the local environment, and GitHub Actions for automated testing.”

## Unit 12 coursework / development process

**What is already scaffolded:** source files, Docker configuration, a GitHub Actions workflow, API tests, and README. **What must be demonstrated:** local execution, passing tests, meaningful commits and feature-branch pull requests, a manual Cloud Run attempt, and real Jira/Confluence updates.

- [Unit 12 submission checklist](docs/UNIT12_SUBMISSION_CHECKLIST.md)
- [AI tool usage log](docs/AI_USAGE_LOG.md)
- [Sprint 1 progress / Confluence template](docs/SPRINT1_PROGRESS.md)
- [Cloud Run deployment attempt guide](docs/CLOUD_RUN_ATTEMPT.md)

**Git workflow:** Create a repo and commit a baseline, then implement *new, real changes* in feature branches and merge each via PR. Do not treat the code included in the starter archive as evidence that PRs or tests already happened.

**Course submission:** GitHub repo URL, deployed Cloud Run URL if created, public-viewable Jira project URL, public-viewable Confluence space URL. Verify visibility while logged out. Check Jira plan limitations before promising public access.
