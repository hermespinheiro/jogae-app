---

description: "Task list for application-owned user authentication"

---

# Tasks: Autenticação Própria de Usuários

**Input**: Design documents from `specs/001-user-authentication/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/authentication.md`, `quickstart.md`

**Tests**: Included for authentication, persistence, security, accessibility, portability and UI behavior.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when files and prerequisites do not overlap.
- **[Story]**: User story label for story-specific tasks.
- Every task includes an exact repository path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the Next.js/TypeScript structure, dependencies and mobile-first UI foundation.

- [ ] T001 Create database, authentication, UI component and test directory structure in `src/`, `supabase/`, and `tests/`.
- [ ] T002 [P] Configure TypeScript, scripts, linting, formatting and test runner in `tsconfig.json`, `package.json`, and `eslint.config.*`.
- [ ] T003 [P] Add PostgreSQL, password-hashing, validation, email-adapter and test dependencies in `package.json`.
- [ ] T004 [P] Configure server-only environment validation for database, session, email and bootstrap secrets in `src/lib/config/env.ts` and `.env.example`.
- [X] T005 [P] Create Material Design tokens for color, typography, spacing, elevation, radius and breakpoints in `src/components/ui/tokens.ts` and `src/app/globals.css`.
- [X] T006 [P] Create accessible responsive primitives for Button, Input, FormField, Alert and LoadingState in `src/components/ui/`.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement persistence, security, session and authorization foundations before user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Create users, password_credentials, sessions, one_time_tokens, invitations, email_change_requests and audit_log migrations in `supabase/migrations/003_application_authentication.sql`.
- [X] T008 [P] Add indexes, uniqueness constraints, state checks, token expiry constraints and rollback documentation in `supabase/migrations/003_application_authentication.sql`.
- [X] T009 [P] Add fail-closed RLS policies for users, invitations, email_change_requests and audit_log using `app.user_id`, `app.role` and `app.session_id` transaction context in `supabase/migrations/004_application_authentication_rls.sql`.
- [ ] T010 [P] Implement database connection, transaction-scoped session-context setup and repositories for users, credentials, sessions and tokens in `src/server/infrastructure/database/`.
- [X] T011 [P] Implement mandatory Argon2id password hashing, documented bcrypt fallback with rehash-on-login, and opaque token generation/hash verification in `src/server/infrastructure/security/secret-hasher.ts` and `src/server/infrastructure/security/token-service.ts`.
- [X] T012 [P] Implement SMTP/email provider interface and templates without secrets in `src/server/infrastructure/email/`.
- [X] T013 Implement normalized email, username, password, token, code and rate-limit validation in `src/server/domain/authentication/validation.ts`.
- [X] T014 Implement immutable audit repository with secret redaction and event validation in `src/server/infrastructure/audit/audit-log-repository.ts`.
- [X] T015 Implement application-owned session cookie creation, lookup, expiry and revocation in `src/server/auth/session.ts` and `src/middleware.ts`.
- [X] T016 [P] Implement role, active-status and forced-password-change authorization helpers in `src/server/auth/authorization.ts`.
- [ ] T017 [P] Add foundational tests for normalization, password hashing, token non-recoverability, session revocation, authorization, missing-context denial and RLS by role/status in `tests/unit/authentication-foundation.test.ts` and `tests/security/authentication-rls.test.ts`.

**Checkpoint**: Persistence, security, sessions, authorization and UI primitives are ready.

## Phase 3: User Story 1 - Entrar com email ou username (Priority: P1) 🎯 MVP

**Goal**: Allow an invited active user to authenticate by email or username, manage sessions,
recover a password and change email through application-owned flows.

**Independent Test**: Create an active user with a password, log in with email and username in
separate sessions, verify protected access, logout revocation, generic failures, recovery and email change.

### Tests for User Story 1

- [ ] T018 [P] [US1] Add contract tests for login, logout, recovery, password confirmation, email-change and change-password endpoints in `tests/contract/authentication.contract.test.ts`.
- [ ] T019 [P] [US1] Add integration tests for email/username login, generic failures, disabled users, session revocation and rate limiting in `tests/integration/authentication-login.test.ts`.
- [ ] T020 [P] [US1] Add security tests proving passwords, session tokens, reset tokens and email codes are absent from responses, logs and database plaintext fields in `tests/security/authentication-secrets.test.ts`.

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement username-to-user lookup without enumeration in `src/server/infrastructure/database/user-repository.ts`.
- [ ] T022 [US1] Implement login use case with password verification, active checks, rate limiting, session creation and audit events in `src/server/application/authentication/login.ts`.
- [ ] T023 [US1] Implement logout use case with session revocation and audit event in `src/server/application/authentication/logout.ts`.
- [X] T024 [US1] Implement login and logout handlers with secure cookies and generic errors in `src/app/api/auth/login/route.ts` and `src/app/api/auth/logout/route.ts`.
- [ ] T025 [US1] Implement protected-route enforcement and forced-password-change redirect in `src/app/(protected)/layout.tsx` and `src/middleware.ts`.
- [ ] T026 [US1] Implement password recovery request, token confirmation, single-use invalidation and prior-session revocation in `src/server/application/authentication/password-recovery.ts` and `src/app/api/auth/password-recovery/`.
- [ ] T027 [US1] Implement authenticated email-change request and confirmation with uniqueness, expiry, one-time code and audit event in `src/server/application/authentication/email-change.ts` and `src/app/api/auth/email-change/`.
- [ ] T028 [US1] Implement login, forgot-password, reset-password and email-change screens with responsive Material Design states in `src/app/(auth)/login/page.tsx`, `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/reset-password/page.tsx`, and `src/app/(protected)/account/email/page.tsx`.
- [ ] T029 [US1] Add keyboard, viewport, contrast and touch-target accessibility tests for authentication forms in `tests/accessibility/authentication-ui.test.ts`.

**Checkpoint**: US1 is independently functional and testable without external identity authentication.

## Phase 4: User Story 2 - Disponibilizar usuário master inicial (Priority: P1)

**Goal**: Provision exactly one secure master user, require first-login password change and enable administration.

**Independent Test**: Bootstrap an empty database, log in as master, complete forced password change,
verify administration, rerun bootstrap and confirm no duplicate or credential replacement.

### Tests for User Story 2

- [ ] T030 [P] [US2] Add integration tests for first bootstrap, idempotent rerun, missing/invalid secrets and duplicate prevention in `tests/integration/master-bootstrap.test.ts`.
- [ ] T031 [P] [US2] Add security tests proving master secrets are never committed, logged, returned or stored in plaintext and that administration is gated before password change in `tests/security/master-bootstrap-secrets.test.ts`.

### Implementation for User Story 2

- [ ] T032 [US2] Implement server-only master configuration parsing and strength validation in `src/server/infrastructure/authentication/master-config.ts`.
- [ ] T033 [US2] Implement transactional, idempotent master bootstrap using user, credential and audit repositories in `src/server/application/authentication/master-bootstrap.ts`.
- [X] T034 [US2] Add an internal bootstrap command and deployment procedure that cannot be invoked by the browser in `src/server/auth/master-bootstrap-entrypoint.ts`, `scripts/auth-bootstrap.ts`, and `docs/authentication-bootstrap.md`.
- [ ] T035 [US2] Implement forced password-change completion, hash replacement, session rotation and flag clearing in `src/server/application/authentication/forced-password-change.ts` and `src/app/api/auth/change-password/route.ts`.
- [ ] T036 [US2] Add responsive password-change UI with Material Design validation and mobile states in `src/app/(protected)/account/password/page.tsx`.
- [ ] T037 [US2] Implement administrator user/invitation operations with authorization, audit events and RLS checks in `src/server/application/authentication/user-administration.ts`, `src/app/api/admin/users/`, and `src/app/(protected)/admin/users/page.tsx`.
- [ ] T038 [US2] Add responsive admin user-management components and empty/error/loading states in `src/components/admin/` and `src/app/(protected)/admin/users/page.tsx`.

**Checkpoint**: US2 provisions a secure master and exposes administration only after required password change.

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate portability, responsive UX, documentation and complete operational readiness.

- [ ] T039 [P] Add end-to-end scenarios from the quickstart for desktop and mobile viewports in `tests/e2e/authentication.quickstart.test.ts`.
- [ ] T040 [P] Add migration reproducibility, rollback and export/import identity checks without active tokens in `tests/integration/authentication-migrations.test.ts`.
- [ ] T041 [P] Add security regression tests for cookie attributes, CSRF protection, rate limiting and token rotation in `tests/security/authentication-hardening.test.ts`.
- [ ] T042 [P] Document environment variables, password policy, email templates, rate limits, recovery behavior, migration and security guarantees in `docs/authentication.md`.
- [ ] T043 [P] Document Material Design tokens, responsive breakpoints, accessibility rules and component usage in `docs/ui-guidelines.md`.
- [ ] T044 Run typecheck, lint, unit, contract, integration, security, accessibility and end-to-end checks and record results in `specs/001-user-authentication/quickstart.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: depends on Setup and blocks both user stories.
- **User Story 1 (Phase 3)**: depends on Foundational and is the recommended MVP.
- **User Story 2 (Phase 4)**: depends on Foundational and the session/authorization interfaces from US1.
- **Polish (Phase 5)**: depends on both stories being integrated.

### User Story Dependencies

- **US1**: depends on T007-T017; independently validates authentication and account security.
- **US2**: depends on T007-T017 and session/authorization contracts; T035-T038 use the US1 session boundary.

### Parallel Opportunities

- T002-T006 can run in parallel after T001.
- T008-T012 and T016-T017 can run in parallel after T007 where files do not overlap.
- T018-T020 can run in parallel before US1 implementation.
- T021, T028 and T029 can proceed in parallel after foundational interfaces exist.
- T030-T031 can run in parallel before US2 implementation.
- T039-T043 can run in parallel after both stories are integrated.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 login, logout, recovery, email change and responsive UI.
3. Run US1 contract, integration, security, accessibility and quickstart checks.
4. Validate the protected session boundary before adding master administration.

### Incremental Delivery

1. Deliver US1 as the usable authentication slice.
2. Add US2 bootstrap, forced password change and user administration.
3. Complete portability, responsive UX and security hardening.

## Notes

- Every task follows `- [ ] T### [P?] [US#?] description` and contains at least one repository path.
- Tests are required because authentication, persistence and security are constitutional quality gates.
- No task may reintroduce Supabase Auth or put credentials/tokens in plaintext.
