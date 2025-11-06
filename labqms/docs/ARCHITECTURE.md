# Architecture Overview

## High-Level Components
- **API (NestJS)** – Modular services for auth, documents, registers, QC, equipment, occurrences/CAPA, audits, management review, retention, assessor pack, and immutable audit logging.
- **Web (Next.js)** – Secure SPA with React Query, Tailwind UI, and Recharts for Levey–Jennings IQC visualisations.
- **Shared Packages**
  - `@labqms/schema`: JSON schemas, workflows, and retention rules powering the no-code register builder.
  - `@labqms/ui`: Shared React UI primitives, layout shell, table, timeline.
  - `@labqms/compliance`: Clause evidence utilities, Westgard engine, and assessor pack aggregation helpers.
- **Infrastructure** – Docker Compose with PostgreSQL, Redis, MinIO, API, and Web containers; SQL migrations define persistence schema.

## Data Flow
1. **Authentication** – Argon2 hashed credentials + JWT; TOTP enrolment supported via Speakeasy. CSRF tokens issued via cookie for all state-changing requests.
2. **Document Control** – Documents and versions stored in Postgres. Lifecycle transitions update version metadata and trigger audit log entries. Controlled copies rendered via Playwright to A4 PDFs with QR-coded canonical URLs, uploaded to MinIO.
3. **Registers** – Definitions stored as JSONB. Entries validated with AJV against stored schema; workflow transitions enforce maker-checker and e-sign capture (Argon2 PIN check). Retention metadata drives archival/destruction jobs (BullMQ hooks ready).
4. **Quality Control** – IQC entries pulled to build Levey–Jennings series, evaluated via Westgard rule engine, exposed by `/iqc/:registerId/chart` and visualised with Recharts.
5. **Equipment & Metrology** – Equipment master with calibration logs, certificate payloads stored as JSON (attachments persisted in MinIO via future enhancement).
6. **Occurrence / CAPA** – Root cause templates captured as JSON; CAPA records reference occurrences and maintain due/closure dates with audit trail.
7. **Audit & MRM** – Internal audit plans, checklists, findings, and management review actions linked to CAPA registers for traceability.
8. **Retention** – Policy matrix defines retention months, legal holds, archival targets. Archive/destroy endpoints record chain-of-custody events with destruction certificates.
9. **Assessor Pack** – Aggregates documents, register entries, CAPA status, and clause evidence into a clause-wise index; ready for PDF/ZIP orchestration.
10. **Audit Trail** – All write operations invoke `AuditLogService` to hash-chain entries (SHA-256) ensuring tamper-evident logs.

## Security Controls
- Argon2 password hashing, JWT expiry (1h), configurable secrets.
- 2FA TOTP enrolment and verification endpoints.
- Helmet hardening, CORS allow-list, CSRF cookies, cookie-parser.
- Field-level encryption hooks ready via metadata columns (extendable).
- MinIO bucket per environment with server-side encryption (configurable), TLS termination handled at reverse proxy layer.

## Job & Retention Strategy
BullMQ + Redis reserved for:
- Scheduled retention reviews per register definition (cron scaffolding in `ScheduleModule` ready).
- Periodic archival job uploading register exports + controlled copy snapshots to MinIO.
- Destruction approval workflow (manual now, queue-ready for automation).

## Future Enhancements
- Row-Level Security policies per register type.
- Fine-grained permission service with caching.
- Digital signature provider integration (USB token / Aadhaar).
- Automated PDF bundling for Assessor Pack.
- Playwright-driven regression tests for UI workflows.
