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

## Actual attempt log
- Date/time:
- Project ID:
- Deployment command:
- Result: Success / Failed
- Cloud Run URL (only if real):
- Exact error, if failed:
- Screenshot or Cloud console evidence:
- Next step:
