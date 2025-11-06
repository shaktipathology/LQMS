# Compliance Mapping

This system maps ISO 15189:2022 and NABL medical testing requirements into actionable evidence. The table below references default registers and documents created by the Hematology stack seed data.

| Clause / Requirement | Evidence Source | Implementation Notes |
| --- | --- | --- |
| ISO 15189:2022 - 8.3 Document Control | Documents module, controlled copies, training acknowledgements | Version lifecycle enforced; controlled copies rendered via Playwright PDF with QR validation; acknowledgements tracked per version. |
| ISO 15189:2022 - 8.4 Control of Records | Retention policies, archival events, audit log | JSON retention matrix stored per register, legal hold flags, archive/destroy endpoints require approval and hash-chained logging. |
| ISO 15189:2022 - 7.3 (QC) | HEM-IQC-D-01 register, IQC module | Levey–Jennings chart, Westgard rule detection (1_2s, 1_3s, 2_2s, R_4s, 4_1s, 10_x). |
| NABL – Equipment & Metrology | Equipment module, calibration register | Calibration status, certificate attachments, out-of-service tracking. |
| NABL – Occurrence / CAPA | Occurrence + CAPA modules, NC-CAPA register | Root cause templates (5-Why, Ishikawa), effectiveness review fields, CAPA linkage. |
| Internal Audit & MRM | Audit module, MRM minutes, AUDIT-INT register | Audit checklists, findings with CAPA references, management review agenda/actions. |
| Training & Competency | TRAIN-COMP register | Training completion, competency records tied to document updates. |
| Complaints & Feedback | COMPLAINTS register | Intake/resolution fields, retention controlled via retention module. |
| Referral Testing | REF-LAB register | Tracks referral labs, turnaround, and justification. |
| Turnaround Monitoring | TAT-DAILY register | Daily TAT analytics, supports assessor pack exports. |

Use the `/compliance-map` endpoint or the Admin → Assessor Pack UI to generate clause-wise evidence indices and export print-ready packs.
