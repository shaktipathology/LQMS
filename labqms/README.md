# LabQMS Monorepo

Comprehensive laboratory quality management platform for AIIMS Bhopal, Department of Pathology & Lab Medicine. Built with NestJS + Next.js, PostgreSQL, Redis, and MinIO; aligned with ISO 15189:2022 and NABL medical testing accreditation requirements.

## Contents
- [docs/README.md](docs/README.md) – system overview
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) – detailed architecture
- [docs/API_REFERENCE.md](docs/API_REFERENCE.md) – REST endpoints
- [docs/COMPLIANCE_MAP.md](docs/COMPLIANCE_MAP.md) – clause mapping

## Quick Start
```bash
cd infra
docker compose up -d
cd ..
npm install
npm run seed -w apps/api
npm run dev -w apps/api
npm run dev -w apps/web
```

Access the web app at http://localhost:3000 (login: `admin@aiimsbhopal.edu` / `Labqms@123`). API runs at http://localhost:4000.
