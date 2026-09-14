# Project roadmap

This file is the persistent source of truth for ticket order, dependencies, scope, and release readiness. The mandatory workflow is defined in root `AGENTS.md` and `docs/DEPLOYMENT.md`; it must not be replaced by abbreviated ticket notes.

GitHub Project [WOS Event Reminders Roadmap](https://github.com/orgs/Tor-Production/projects/4) is the operational source of truth for current status and prioritization. This document preserves durable sequencing, architecture, and release evidence. Each roadmap issue contains implementation scope, non-goals, acceptance criteria, dependency links, effort, a recommended Codex configuration, and verification.

## Current orchestration state

- R07 is implemented and [PR #7](https://github.com/Tor-Production/wos-event-reminders/pull/7) merged as 803b858c28a666aef8e14d3aa42d0e84816fa32e.
- R07 is Done. The administrator explicitly approved manual preview testing on 2026-09-14 and confirmed the tested behavior works.
- R07 required no D1 migration. Production deployed Worker version `ce2eec36-8390-497d-b11c-6f22b2ed0b91` with the production database binding and 100% traffic.
- Production smoke testing returned HTTP 200 with the Reminder Preview UI and HTTP 401 for unauthenticated session, preview, and test-send routes. No production login, data mutation, reminder send, or Discord message was performed.
- The local `main` branch is clean and synchronized to merge commit `803b858c28a666aef8e14d3aa42d0e84816fa32e`.
- R02 is Ready. The immediate feature sequence is R02 → R03 → R05 → R01 → R04.

## Roadmap register

| ID | Work item | Priority | Effort | Status | Blocked by | Milestone | Purpose |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| R01 | [Timezone support](https://github.com/Tor-Production/wos-event-reminders/issues/8) | P0 | 6 | Backlog | — | M1 | Use IANA timezones while preserving UTC internally. |
| R02 | [Localization framework](https://github.com/Tor-Production/wos-event-reminders/issues/9) | P0 | 5 | Ready | — | M1 | Establish six initial locale catalogs and English fallback. |
| R03 | [Language selector and browser detection](https://github.com/Tor-Production/wos-event-reminders/issues/10) | P0 | 3 | Blocked | R02 | M1 | Select, detect, and persist dashboard language. |
| R04 | [Localized dates, times and statuses](https://github.com/Tor-Production/wos-event-reminders/issues/11) | P0 | 4 | Blocked | R01, R02 | M1 | Format schedule information with locale-aware APIs. |
| R05 | [Localized reminder messages](https://github.com/Tor-Production/wos-event-reminders/issues/12) | P0 | 5 | Blocked | R02 | M1 | Localize canonical reminders independently from dashboard locale. |
| R06 | [Multiple reminder offsets per event](https://github.com/Tor-Production/wos-event-reminders/issues/13) | P0 | 8 | Backlog | — | M2 | Deliver multiple idempotent offsets for one occurrence. |
| R07 | [Reminder Preview + Per-Event Send Test](https://github.com/Tor-Production/wos-event-reminders/pull/7) | P0 | 4 | Done | — | M1 | Preview and test current form values through one canonical renderer. |
| R08 | [Pause / Resume](https://github.com/Tor-Production/wos-event-reminders/issues/14) | P0 | 4 | Backlog | — | M1 | Pause reminders without archiving them. |
| R09 | [Skip next occurrence](https://github.com/Tor-Production/wos-event-reminders/issues/15) | P0 | 7 | Backlog | — | M2 | Skip one occurrence without changing recurrence. |
| R10 | [Duplicate event](https://github.com/Tor-Production/wos-event-reminders/issues/16) | P1 | 2 | Backlog | — | M1 | Clone editable configuration without system state. |
| R11 | [Whiteout Survival presets](https://github.com/Tor-Production/wos-event-reminders/issues/17) | P1 | 4 | Backlog | R02 recommended | M1 | Add editable game presets outside scheduler logic. |
| R12 | [Show next occurrences](https://github.com/Tor-Production/wos-event-reminders/issues/18) | P1 | 5 | Blocked | R01 | M2 | Preview approximately three canonical occurrences. |
| R13 | [Delivery diagnostics](https://github.com/Tor-Production/wos-event-reminders/issues/19) | P1 | 6 | Backlog | — | M2 | Record safe, provider-neutral delivery diagnostics. |
| R14 | [Security hardening](https://github.com/Tor-Production/wos-event-reminders/issues/20) | P1 | 8 | Backlog | — | M2 | Harden authentication, sessions, secrets, and destructive actions. |
| R15 | [Alliance / workspace settings](https://github.com/Tor-Production/wos-event-reminders/issues/21) | P1 | 6 | Backlog | R01, R02 recommended | M5 | Move alliance assumptions into configuration. |
| R16 | [Notification destinations & routing](https://github.com/Tor-Production/wos-event-reminders/issues/22) | P1 | 8 | Blocked | R24 | M3 | Route reminders to reusable provider destinations. |
| R17 | [Export / Import](https://github.com/Tor-Production/wos-event-reminders/issues/23) | P1 | 5 | Backlog | R15 recommended | M5 | Port versioned configuration without secrets. |
| R18 | [ICS calendar feed](https://github.com/Tor-Production/wos-event-reminders/issues/24) | P1 | 6 | Blocked | R01 | M5 | Publish canonical occurrences as an ICS feed. |
| R19 | [Mobile UX / PWA](https://github.com/Tor-Production/wos-event-reminders/issues/25) | P1 | 5 | Backlog | — | M1 | Support real mobile officer workflows. |
| R20 | [Automated CI](https://github.com/Tor-Production/wos-event-reminders/issues/26) | P1 | 5 | Backlog | — | M2 | Run safe, deterministic pull-request checks. |
| R21 | [Multi-workspace architecture](https://github.com/Tor-Production/wos-event-reminders/issues/27) | P2 | 10 | Blocked | R15 | M6 | Introduce tenant data isolation and migration. |
| R22 | [Discord OAuth login](https://github.com/Tor-Production/wos-event-reminders/issues/28) | P2 | 8 | Blocked | R21 | M6 | Add individual Discord identity. |
| R23 | [Roles & permissions](https://github.com/Tor-Production/wos-event-reminders/issues/29) | P2 | 8 | Blocked | R21, R22 | M6 | Enforce workspace authorization. |
| R24 | [Notification Provider Abstraction](https://github.com/Tor-Production/wos-event-reminders/issues/30) | P1 | 8 | Backlog | — | M3 | Put Discord behind a capability-aware provider boundary. |
| R25 | [Game-pack abstraction](https://github.com/Tor-Production/wos-event-reminders/issues/31) | P2 | 8 | Backlog | R11, R15 recommended | M6 | Isolate game-specific presets and metadata. |
| R26 | [Public/shareable schedule](https://github.com/Tor-Production/wos-event-reminders/issues/32) | P2 | 6 | Blocked | R01 | M5 | Expose a safe, revocable read-only schedule. |
| R27 | [Audit log](https://github.com/Tor-Production/wos-event-reminders/issues/33) | P2 | 6 | Blocked | R21, R22 | M6 | Attribute sensitive administrative actions without secrets. |
| R28 | [Service dashboard](https://github.com/Tor-Production/wos-event-reminders/issues/34) | P2 | 6 | Blocked | R13 | M5 | Summarize provider-aware delivery health. |
| R29 | [Optional HyperFrames rich reminders](https://github.com/Tor-Production/wos-event-reminders/issues/35) | Later | 8 | Backlog | — | M7 | Add optional pre-rendered rich reminder media; R05 and R16 remain recommended prerequisites. |
| R31 | [Telegram Provider](https://github.com/Tor-Production/wos-event-reminders/issues/36) | P1 | 5 | Blocked | R24 | M3 | Prove provider reuse with the Telegram Bot API. |
| R32 | [WhatsApp Provider](https://github.com/Tor-Production/wos-event-reminders/issues/37) | P1 | 8 | Blocked | R24 | M3 | Add policy-compliant WhatsApp Business delivery. |
| R33 | [Web Push Notifications](https://github.com/Tor-Production/wos-event-reminders/issues/38) | P1 | 7 | Backlog | R19, R16 recommended | M3 | Deliver opt-in browser/device notifications. |
| R34 | [Email Provider](https://github.com/Tor-Production/wos-event-reminders/issues/39) | P1 | 5 | Blocked | R24 | M3 | Add transactional email as a universal fallback. |
| R35 | [LINE Provider](https://github.com/Tor-Production/wos-event-reminders/issues/40) | P2 | 6 | Blocked | R24 | M4 | Support communities that coordinate through LINE. |
| R36 | [Facebook Messenger Provider](https://github.com/Tor-Production/wos-event-reminders/issues/41) | P2 | 7 | Blocked | R24 | M4 | Determine feasibility before any compliant implementation. |
| R37 | [WeChat / Weixin Provider](https://github.com/Tor-Production/wos-event-reminders/issues/42) | Later | 8 | Blocked | R24 | M4 | Run a regional feasibility spike before implementation. |
| R38 | [Viber Provider](https://github.com/Tor-Production/wos-event-reminders/issues/43) | Later | 7 | Blocked | R24 | M4 | Verify onboarding and costs before implementation. |

R30 is intentionally retired. Its identifier is reserved, and no GitHub issue exists for it.

## Dependency map

Solid arrows are hard blockers. Dashed arrows are recommended prerequisites or ordering guidance.

~~~mermaid
flowchart TD
  R07[R07 canonical reminder preview] -. release sequence .-> R02[R02 localization framework]
  R07 --> R29[R29 optional rich media]
  R02 --> R03[R03 language selector]
  R02 --> R04[R04 localized dates and statuses]
  R02 --> R05[R05 localized reminders]
  R01[R01 timezone support] --> R04
  R01 --> R12[R12 next occurrences]
  R01 --> R18[R18 ICS feed]
  R01 --> R26[R26 public schedule]
  R13[R13 delivery diagnostics] --> R28[R28 service dashboard]
  R15[R15 workspace settings] --> R21[R21 multi-workspace]
  R21 --> R22[R22 Discord OAuth]
  R21 --> R23[R23 roles and permissions]
  R22 --> R23
  R21 --> R27[R27 audit log]
  R22 --> R27
  R24[R24 provider abstraction] --> R16[R16 destinations and routing]
  R24 --> R31[R31 Telegram]
  R24 --> R32[R32 WhatsApp]
  R24 --> R34[R34 Email]
  R24 --> R35[R35 LINE]
  R24 --> R36[R36 Messenger]
  R24 --> R37[R37 WeChat]
  R24 --> R38[R38 Viber]
  R16 -. recommended .-> R31
  R16 -. recommended .-> R33[R33 Web Push]
  R19[R19 mobile UX] -. recommended .-> R33
  R05 -. recommended .-> R29
  R16 -. recommended .-> R29
~~~

## Notification architecture and channel scope

The scheduler must decide that a reminder is due without constructing provider-specific payloads. Canonical reminder content flows through reusable destinations into capability-aware notification providers. Credentials remain server-side, and delivery identity must eventually include event occurrence, reminder offset, and destination so one provider's success cannot suppress another provider's retry.

The intended channel sequence is approximately:

1. Discord as the existing provider.
2. R24 provider abstraction.
3. R31 Telegram as the first proof of reuse.
4. R16 destination routing.
5. R33 Web Push and R34 Email.
6. R32 WhatsApp.
7. R35 LINE and R36 Messenger.
8. R37 WeChat and R38 Viber when regional feasibility justifies them.

SMS, KakaoTalk, Slack, Microsoft Teams, and generic enterprise notification channels are intentionally out of scope unless the user revisits that decision.

## Optional HyperFrames policy

HyperFrames is not part of routine pull-request or changelog work. Do not offer or run PR-to-video automatically, create a per-PR approval gate, or install or refresh HyperFrames during ordinary orchestration. R29 is the planned optional production use case, with motion graphics preferred for reusable rich reminder media. Rendering belongs outside the scheduler Worker, plain text remains the reliable primary path, and generated projects or assets stay outside this repository unless explicitly requested.

## Sequencing rule

Do not begin a ticket until the preceding ticket has:

1. passed manual preview testing;
2. had every required production D1 migration applied successfully (or explicitly recorded that no migration is required);
3. had its pull request verified as merged;
4. completed a successful production Cloudflare deployment;
5. passed production smoke testing; and
6. been pulled into a clean, updated local default branch.

An already-implemented ticket that is still moving through preview or release verification must finish unchanged before work starts on a newly queued ticket.

## Released foundation sequence

1. `feature/one-time-reminders`
2. `feature/copy-reminders`
3. `feature/history-reminder-type-label`
4. `feature/reminder-archive`
5. `feature/event-reminder-preview-test-send`

### Transition state

- `feature/one-time-reminders` has completed its production migration, merge, production deployment, smoke test, and clean-local-default-branch gates.
- `feature/reminder-archive` was already implemented before this roadmap update and has completed its production migrations, merge, production deployment, smoke test, and clean-local-default-branch gates. Do not alter or restart that implementation as part of roadmap work.
- `feature/copy-reminders` completed manual preview, merge, production deployment, smoke testing, and clean-local-default-branch gates without a D1 migration.
- `feature/history-reminder-type-label` completed every release gate. PR #6 merged as `88666703120ad6bd5b8f0069eec030b2d8fc2158`; migration `0005_delivery_schedule_type.sql` is present in production with no pending migrations; the production Worker build passed as version `db9ba21d-c8f9-4ba3-888a-8c2abefb91ea`; and production use/smoke testing was confirmed by the administrator.
- `feature/event-reminder-preview-test-send` completed every release gate. The administrator approved manual preview testing on 2026-09-14; no D1 migration was required; production Worker version `ce2eec36-8390-497d-b11c-6f22b2ed0b91` received 100% traffic with the production D1 binding; protected-route smoke checks passed without a production login, data mutation, reminder send, or Discord message; and local `main` is clean at merge commit `803b858c28a666aef8e14d3aa42d0e84816fa32e`.

The requested numbering is retained. Reminder-archive's earlier out-of-order release is recorded as a completed transition and does not change the remaining gate order.

## Ticket: one-time reminders

- **Branch:** `feature/one-time-reminders`
- **Status:** fully released; production migration `0002_one_time_reminders.sql` applied and release gates verified.
- **Dependency for later work:** both recurring and one-time reminder behavior must remain supported.

## Ticket: copy reminders

- **Branch:** `feature/copy-reminders`
- **Status:** fully released. PR #4 merged as `f1e071fbbe983720463254453363eac276e4d782`; production deployment `39c4c358-c9c0-47c9-8a96-ffd5efa50009` and smoke tests passed.
- **Preview commit:** `e684c5ca21909f8e539f853a122c207b7ab865f1`.
- **Automated verification:** 32 tests passed; syntax and diff checks passed.
- **D1 migration:** none required in staging or production.
- **Cloudflare preview:** successful staging build, version `6c31d9f4-8114-46ff-be87-f32a8ef8d5fb`, at `https://feature-copy-reminders-wos-event-reminders-staging.chute-risk9361.workers.dev`.
- **Release gate:** complete; the local default branch was fast-forwarded cleanly before the next ticket began.
- **Dependency (satisfied):** implementation began only after one-time reminders were merged and verified in production and reminder-archive completed all repository delivery gates.
- **Compatibility:** correctly support both recurring and one-time reminders.

### User experience

- Add a `Copy` button to each non-archived reminder in the current schedule.
- Clicking `Copy` opens the existing Add Reminder dialog.
- Populate the dialog with the source reminder's editable settings.
- Clear the reminder ID so Save creates a new reminder instead of updating the original.
- Append the exact suffix `(Copy)` to the source reminder name.
- Append another suffix when the source is already a copy: `Bear Trap` becomes `Bear Trap (Copy)`, and `Bear Trap (Copy)` becomes `Bear Trap (Copy) (Copy)`.
- Respect the 100-character name limit while preserving the complete final `(Copy)` suffix. Truncate only the source-name portion as needed.
- Do not create a reminder when `Copy` is clicked. The user must explicitly press Save.

### State to copy

Copy all editable settings:

- schedule type;
- event date;
- start time;
- recurring interval, when applicable;
- reminder-minutes value;
- Discord message; and
- enabled/disabled state.

Do not copy system-managed state:

- database ID;
- created or updated timestamps;
- delivery history;
- last-sent timestamp;
- completion state;
- failure state; or
- archive state.

### Behavior and constraints

- Save through the normal reminder-creation path and its existing validation.
- Keep the source reminder unchanged and make the saved copy independent.
- Preserve recurring schedule settings for a recurring copy.
- Preserve the schedule of a future one-time reminder.
- For an expired one-time reminder, open the populated dialog but require the user to select a valid future date and time before Save succeeds.
- Do not add a validation bypass for expired copies.
- Do not copy historical deliveries.
- Do not implement archive behavior in this ticket.
- Avoid a dedicated backend copy endpoint unless the existing creation API cannot safely support the workflow.

### Required automated tests

Tests must cover:

- Copy button rendering;
- opening the dialog in copy mode;
- clearing the source ID;
- appending `(Copy)`;
- repeated-copy naming;
- the 100-character maximum while preserving the suffix;
- copying every editable recurring setting;
- copying every editable one-time setting;
- leaving the source reminder unchanged;
- assigning a new ID to the saved copy and giving it no delivery history;
- rejecting an expired one-time copy until its date/time is corrected; and
- existing create and edit behavior remaining unchanged.

### Delivery checklist

1. Verify all predecessor and in-flight release gates are complete.
2. Create `feature/copy-reminders` from a clean, freshly updated default branch.
3. Implement only this ticket and run all tests.
4. Confirm whether the ticket contains a D1 migration; it should preferably require none.
5. Commit and push only this ticket.
6. Create a pull request targeting the repository default branch.
7. Confirm Cloudflare creates a successful non-production preview and record its URL, version, build status, and staging bindings.
8. Provide a manual testing checklist.
9. Stop before merging and wait for explicit preview approval.
10. After approval, execute every release gate in `AGENTS.md` and `docs/DEPLOYMENT.md`.
11. Begin `feature/history-reminder-type-label` only after the copy-reminders pull request, production deployment, migration state, smoke test, and clean local default branch are fully verified.

## Ticket: history reminder type label

- **Branch:** `feature/history-reminder-type-label`
- **Status:** fully released. PR #6 merged as `88666703120ad6bd5b8f0069eec030b2d8fc2158`; migration `0005_delivery_schedule_type.sql` is applied with no remaining production pending state; production deployment `db9ba21d-c8f9-4ba3-888a-8c2abefb91ea` succeeded; and the administrator confirmed the production smoke test by actively using the build.
- **Dependency (satisfied):** implementation began from a clean, freshly updated default branch only after copy reminders was verified in production.
- **D1 migration:** `0005_delivery_schedule_type.sql`, applied to staging and production; the current production migration check reports no pending migrations.

### Requirements

- Add a `Type` column to Recent deliveries/History.
- Display `Recurring` or `One time` as accessible badges.
- Snapshot the reminder type in each historical delivery record at delivery creation time.
- Do not derive a historical type from the reminder's current state.
- Default all historical records that predate the snapshot column to `recurring`.
- Return the stored type through the deliveries API.
- Preserve delivery history and its type snapshot after reminder archival or permanent deletion.
- Keep this ticket isolated from additional archive behavior.

### Required regression coverage

- The versioned migration adds a constrained, non-null snapshot column with a `recurring` default.
- Existing historical records migrate to `recurring` without data loss.
- Recurring and one-time deliveries store their type at delivery creation.
- A later reminder-type change does not alter the historical snapshot.
- The deliveries API returns the stored type.
- The frontend renders the Type column and accessible labels.
- Permanent reminder deletion retains both delivery history and the stored type.
- Existing one-time, copy, and archive behavior remains passing.

### Release evidence

- Pull request: [#6](https://github.com/Tor-Production/wos-event-reminders/pull/6), merged 2026-08-25 as `88666703120ad6bd5b8f0069eec030b2d8fc2158`.
- Build checks: staging and production Workers Builds succeeded on the merge commit.
- Production deployment: Worker version `db9ba21d-c8f9-4ba3-888a-8c2abefb91ea` deployed 2026-08-25T08:27:25Z.
- Production D1: migration `0005_delivery_schedule_type.sql` is applied; a current migration check reports no pending migrations.
- Manual preview and production smoke test: confirmed by the administrator through active use of the deployed build.

## Ticket: event reminder preview and per-event test send

- **Branch:** `feature/event-reminder-preview-test-send`
- **Status:** fully released; every repository release gate is complete.
- **Merged commit:** `803b858c28a666aef8e14d3aa42d0e84816fa32e`.
- **Production state:** Worker version `ce2eec36-8390-497d-b11c-6f22b2ed0b91` deployed on 2026-09-14 and serves 100% of production traffic with the expected production D1 binding.
- **Goal:** show a live English reminder preview in the create/edit workflow and allow a validated, non-persisting test send of the current event form values.
- **Architecture:** preview, per-event test sends, and scheduled delivery must use one canonical server-side reminder-message renderer. Test sends must have a clear `[TEST]` identifier and must not mutate schedules, delivery history, retry state, or idempotency state.
- **Compatibility:** preserve the global webhook/configuration Send test feature unless the implementation establishes that it is redundant; support recurring and one-time reminders.
- **D1 migration:** none. Preview/test requests validate and render the submitted form data without persisting it; existing schema safely supports the feature.
- **Manual preview:** explicitly approved by the administrator on 2026-09-14; the administrator confirmed the tested behavior works.
- **Production smoke:** the dashboard returned HTTP 200 with the Reminder Preview UI, while unauthenticated session, preview, and test-send requests each returned HTTP 401. No Discord message or production mutation was performed.
- **Local synchronization:** clean `main` and `origin/main` both resolve to `803b858c28a666aef8e14d3aa42d0e84816fa32e`.

### Required verification

- Test recurring and one-time rendering, preview/scheduled equivalence, test-only formatting, authentication, invalid inputs, delivery failures, and no scheduler/idempotency mutation.
- Run `npm test`, `node --check src/index.js`, and `node --check public/app.js`.
- Use only the isolated staging Worker/database and staging Discord webhook for preview and manual test sends; stop before merge for explicit preview approval.

## Ticket: reminder archive

- **Branch:** `feature/reminder-archive`
- **Status:** fully released before copy-reminders began. Production migrations `0003_reminder_archive.sql` and `0004_preserve_deleted_delivery_history.sql` were applied successfully; deployment and smoke-test gates passed.
- **Transition rule:** do not modify or restart its implementation for later roadmap tickets.
