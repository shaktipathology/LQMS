# Laboratory Quality Management Suite (LabQMS)

AIIMS Bhopal – Department of Pathology & Lab Medicine Quality Procedures & Registers platform. This monorepo provides a secure, compliant laboratory quality management application aligned with ISO 15189:2022 clauses 8.3/8.4 and NABL medical testing requirements.

## Highlights
- Document control lifecycle with controlled copy PDF generation, QR validation, and training acknowledgements.
- JSON Schema register builder with maker-checker workflow, configurable retention, and e-signatures.
- Hematology stack pre-loaded with IQC, EQA, CAPA, audit, complaints, training, and equipment registers.
- Westgard rule engine + Levey–Jennings charts for hematology IQC monitoring.
- Equipment & metrology tracking with calibration scheduling and certificates stored in MinIO.
- Nonconformity / CAPA lifecycle with root cause templates and effectiveness review.
- Internal audit & management review planning, linking findings to CAPA actions.
- Records retention policies, legal hold flags, archival, and destruction approvals with hash-chained audit trail.
- Assessor Pack exporter assembling documents, register extracts, CAPA status, and clause-wise evidence index.
- Security defaults: Argon2 hashing, JWT + TOTP 2FA, CSRF protection, CORS controls, TLS-ready container config.

## Repository Structure
- `apps/api` – NestJS REST API, TypeORM persistence, PDF/Playwright services, BullMQ-ready jobs.
- `apps/web` – Next.js (React + Tailwind) UI with TanStack Query/Table and Recharts visualisations.
- `packages/schema` – JSON schema/workflow/retention definitions for all hematology registers.
- `packages/ui` – Shared React components, layout shell, table utilities.
- `packages/compliance` – Westgard rule engine, clause evidence utilities, assessor pack helpers.
- `infra` – Docker Compose stack, SQL migrations, container build definitions.
- `docs` – Architecture, API reference, compliance mapping, and runbooks.

## Getting Started
1. Run the Docker infrastructure (`docker compose up -d` from `infra`).
2. Install dependencies (`npm install`).
3. Run API and web (`npm run dev -w apps/api`, `npm run dev -w apps/web`).
4. Seed database (`npm run seed -w apps/api`).
5. Log in with `admin@aiimsbhopal.edu / Labqms@123` and explore the hematology stack.

For detailed subsystem documentation, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API_REFERENCE.md](./API_REFERENCE.md)
- [COMPLIANCE_MAP.md](./COMPLIANCE_MAP.md)
