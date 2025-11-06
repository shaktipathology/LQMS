# API Reference

Base URL: `http://localhost:4000`
Authentication: JWT bearer token (obtain via `POST /auth/login`). CSRF cookie (`XSRF-TOKEN`) required for mutating requests.

## Auth
- `POST /auth/login` – body `{ email, password, totp? }` → `{ token, user }`.
- `POST /auth/totp/setup` – requires JWT, body `{ password }` → `{ otpauth }` provisioning URI.
- `POST /auth/totp/verify` – requires JWT, body `{ token }` → `{ enabled: true }`.

## Document Control
- `GET /documents` – list documents with version history.
- `POST /documents` – create document `{ title, code, content }` (creates version 1).
- `POST /documents/:id/lifecycle` – update lifecycle `{ lifecycle, effectiveFrom }`.
- `POST /documents/:id/issue` – issue controlled copy `{ issuedTo }` (returns MinIO URL).
- `POST /documents/:id/obsolete` – mark document obsolete immediately.

## Register Builder & Entries
- `GET /registers` – list register definitions.
- `POST /registers` – create definition `{ code, name, stack, schema, workflow, retention, active }`.
- `GET /registers/:id/entries` – list entries for definition.
- `POST /registers/:id/entries` – create entry `{ data }` validated via JSON schema.
- `POST /entries/:id/submit` – transition entry to `submitted`.
- `POST /entries/:id/verify` – transition entry to `verified`.
- `POST /entries/:id/sign` – capture e-signature `{ meaning, pin }` (pin = password confirmation).

## Quality Control
- `GET /iqc/:registerId/chart?param=Hb&from=YYYY-MM-DD&to=YYYY-MM-DD` – returns Levey–Jennings series + Westgard violations.

## Equipment & Metrology
- `GET /equipment`
- `POST /equipment` – `{ name, identifier, commissionDate?, metadata? }`
- `GET /calibrations?equipmentId=UUID`
- `POST /calibrations` – `{ equipmentId, performedOn, nextDue, certificate, status }`

## Occurrence / CAPA
- `GET /occurrences`
- `POST /occurrences` – `{ title, description, rootCause }`
- `GET /capas`
- `POST /capas` – `{ occurrenceId, actionPlan, dueDate }`

## Audit & Management Review
- `GET /audits`
- `POST /audits` – `{ scope, plannedOn, checklist }`
- `GET /mrm`
- `POST /mrm` – `{ meetingDate, agenda, actions }`

## Retention & Records
- `GET /retention-policies`
- `POST /retention-policies` – `{ recordType, retentionMonths, legalHold, archivalTargets }`
- `GET /retention-events`
- `POST /records/archive` – `{ recordType, payload }`
- `POST /records/destroy` – `{ id }`

## Assessor Pack & Compliance
- `GET /assessor-pack?from=YYYY-MM-DD&to=YYYY-MM-DD&scope=CLAUSE` – returns documents, register entries, CAPA status, audits, evidence index.
- `GET /compliance-map?clause=CLAUSE` – clause-to-evidence mapping (omit `clause` for full map).

## Audit Trail
- All mutating endpoints emit hash-chained entries into `audit_log` table with actor, action, payload snapshot, IP, user agent, and hash references.
