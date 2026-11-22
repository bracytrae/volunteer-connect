# Cloud Run manual deployment attempt guide and record

Prerequisites: Google Cloud SDK (`gcloud`), signed-in account, selected project, permissions, billing, and required APIs. `Dockerfile` exists in the project root.

From the extracted `volunteerconnect-mvp` directory:

```bash
gcloud auth login
gcloud config set project YOUR_GOOGLE_CLOUD_PROJECT_ID
gcloud run deploy volunteerconnect --source . --region us-central1 --allow-unauthenticated
```

Google may prompt to enable APIs, configure builds, or select a region. Record what happens. A successful deployment prints a Cloud Run service URL. If it fails before creating a service, **do not invent a URL**; save the exact error and deployment-attempt evidence and check your professor's submission instructions.

**Important limitation:** `compose.yaml` provides a local PostgreSQL container only. Cloud Run deploys the app service, not this local database. Without a reachable hosted PostgreSQL instance and configuration, the homepage and `/api/health` can load while feature endpoints that query PostgreSQL fail. This is why the course may allow a broken deployment at MVP stage. Never commit database credentials to GitHub.

## Actual attempt log — November 22, 2026
- Project ID: `recipe-sharing-app-cloud`
- Command: `gcloud run deploy volunteerconnect --source . --project recipe-sharing-app-cloud --region us-central1 --allow-unauthenticated`
- Result: **Successful deployment**, revision `volunteerconnect-00001-wvl`; Google Cloud reported 100% of traffic served.
- URL: https://volunteerconnect-935566074245.us-central1.run.app
- User's follow-up: The deployed site displays a **server error**. The exact request and server logs were not inspected, so the specific runtime failure is unconfirmed.
- Likely cause: No remotely reachable PostgreSQL database was configured. Docker Compose's local database does not accompany Cloud Run.
- Evidence: CLI output saved by the developer, including deployment success and URL.
- Later work: Inspect Cloud Run logs and configure a hosted database; production data functions remain incomplete.
