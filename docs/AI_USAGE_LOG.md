# AI usage log — VolunteerConnect

This document records actual AI use and independent verification for Unit 12.

| Date | Tool | Assistance | Verification / qualification |
|---|---|---|---|
| November 20–21, 2026 | ChatGPT | Helped plan and scaffold Node.js/Express frontend and backend, PostgreSQL schema, Docker setup, API tests, and documentation. | Developer confirmed the Docker app worked locally and event registration succeeded; all nine local tests passed. |
| November 20–21, 2026 | ChatGPT | Assisted with creating a GitHub Actions CI workflow and professional feature branch / pull request process. | GitHub Actions reported success and MVP PR #1 was merged. |
| November 22, 2026 | ChatGPT | Assisted with the Cloud Run command and documenting the deployment outcome and limitations. | Developer's CLI output confirmed successful deployment. The deployed site then displayed a server error, which remains unresolved. |
| November 22, 2026 | ChatGPT | Updated MVP README, deployment record, and AI-use documentation on a documentation branch. | Review the documentation PR before merging. |

## Reflection

ChatGPT helped accelerate application scaffolding, testing setup, CI workflow configuration, and documentation. This generated work was verified rather than accepted on faith: the developer ran the Docker app and tests, validated registration locally, and checked CI results. The Cloud Run deployment was created successfully, but the website still has an unresolved runtime error and is not presented as fully functional online.

GitHub Copilot is **not** listed as used because its actual usage was not confirmed. Add an accurate entry only if you used it.
