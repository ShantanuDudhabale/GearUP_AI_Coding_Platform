# EDI-4th-sem

This repository contains a full-stack project with both backend (Node/Express) and frontend (Next.js) components.

## Setup

1. **Backend**
   - Create a `.env` file in `backend/` based on `backend/.env.example`.
   - Install dependencies: `cd backend && npm install`
   - Start server: `npm run start` or `npm run dev`.

2. **Frontend**
   - Create `.env.local` from `frontend/.env.local.example`.
   - Install dependencies: `cd frontend && npm install`
   - Run dev server: `npm run dev`.

## GitHub Preparation

- `node_modules/` directories are **ignored** via `.gitignore`; do not commit them.
- All environment files (`*.env`, `.env.local`, etc.) are ignored; use the provided example files instead.
- Secrets and API keys should never appear in source; store them in environment files or CI variables.
- To clean up any accidentally committed env or modules:
  ```bash
  git rm -r --cached node_modules
  git rm --cached *.env
  git commit -m "Remove ignored files"
  ```

## Contribution

Follow the steps above to set up locally. When pushing to GitHub, your commits should not include any sensitive configuration or dependency folders.

---

This README is here to make the repository easy to submit and review.
