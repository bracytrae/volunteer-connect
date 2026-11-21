# Unit 12 MVP submission checklist

**Important:** Only check items after performing them. These documents are templates, not evidence of completed work.

## Core app
- [ ] Run `docker compose up --build` successfully.
- [ ] Visit `http://localhost:3000` and perform an end-to-end demo: view events > register > log hours > refresh dashboard.
- [ ] Run `npm install` and `npm test` successfully; retain test output or screenshots.
- [ ] Record any remaining known defects.

## GitHub / workflows
- [ ] Publish source code to a GitHub repo.
- [ ] Commit `package-lock.json` after installing dependencies.
- [ ] Make at least one **real code or documentation change** on a feature branch, with a meaningful commit message.
- [ ] Push feature branch; open a PR targeting `main`; review CI; merge PR.
- [ ] Check GitHub Actions result; fix any failures.
- [ ] If available, configure branch protection requiring PRs; record any plan restrictions.
- [ ] Include repo URL in submission.

## Docker / cloud
- [ ] Run web and PostgreSQL with Docker Compose.
- [ ] Attempt **manual** Google Cloud Run deployment from project root.
- [ ] Record Cloud service URL **if generated**, otherwise actual error and attempt evidence.
- [ ] Document limitation: without a remote PostgreSQL database, static UI and `/api/health` may load on Cloud Run, but live feature API calls will fail.

## Jira and Confluence
- [ ] Update Sprint 1 issues with actual To Do / In Progress / Done statuses.
- [ ] Log actual time spent against issues; do not invent hours.
- [ ] Update Confluence with progress, architecture, blockers, decisions, and evidence.
- [ ] Verify view permissions of **both** project/space URLs in an incognito browser.
- [ ] Check if Jira plan supports public view (Atlassian currently notes Free Jira sites cannot open projects publicly).
- [ ] Include Jira URL and Confluence URL in submission.

## README / AI use
- [ ] Update README with actual status, setup, tests, limitations, and working links.
- [ ] Record actual AI-tool prompts, tasks, suggestions, corrections, and verification in `docs/AI_USAGE_LOG.md`.
- [ ] Include four submitted links in your course submission.
