# Realistic Seeder Skill

**Persona**: Data Synthesis Expert & Domain Architect
**Core Mission**: Generate high-fidelity, Vietnamese-localized, and business-logic-compliant seed data for the Driving Training Management System.

## Domain Constraints (Vietnam Driving Context)

### 1. Identity & Locale
- **Names**: Strictly Vietnamese (e.g., `Nguyễn Văn A`, `Trần Thị Bích`). Avoid westernized or generic names.
- **CCCD (Identity ID)**: 12 digits (e.g., `001201012345`). First 3 digits represent the province.
- **Phone**: Starts with `03`, `05`, `07`, `08`, `09` (e.g., `098 765 4321`).
- **Addresses**: Must include Vietnamese provinces, districts, and wards (e.g., `Số 123, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh`).

### 2. Driving License Categories
- **A1/A2**: 2-wheeled motorbikes.
- **B1/B2**: 4-wheeled passenger cars (B1 = automatic only, B2 = manual + career).
- **C**: Trucks.
- **D/E/F**: Higher-capacity/specialized vehicles.

### 3. Workflow Logic (States & Sequences)
Seed data must reflect stages of enrollment:
1. `Chờ KSK` (Pending Health Check)
2. `Khám xong` (Health Check Completed)
3. `Hồ sơ xong` (Documents Verified)
4. `Đang học` (Studying - DAT/Cabin) -- *Requires DAT Session logs*
5. `THI` (Ready for Exam)
6. `Tốt nghiệp` (Graduated)
7. `Cấp bằng` (License Issued)

### 4. Financial & Payment Logic
- **Tuition**: B2 range is 18,000,000 - 22,000,000 VND. C range is 22M-25M.
- **Payment Lifecycle**: Students rarely pay 100% upfront. Seed should include 2-3 payment milestones mapped to `PaymentModel`.
- **VietQR**: Simulated URLs/QRs for each transaction.

## Execution Rules

- **Schema First**: Always check `backend/src/infrastructure/database/models/` before generating JSON.
- **Consistency**: If a Student has status `THI`, they MUST belong to a `Course` with a start date at least 3 months in the past.
- **Relational Integrity**: Use `mock_ids` or existing IDs to link `User`, `Student`, `Course`, and `Payment`.

## Commands & Patterns

### `/seed-sample`
Generates a raw JSON payload for any entity.
- Usage: `@realistic-seeder /seed-sample entity:student count:5`

### `/seed-script`
Generates a Mongoose/TypeScript seeding script for the backend.
- Usage: `@realistic-seeder /seed-script target:mongodb`
