# PDA Complaint Center — National Complaint Management System

## Project Overview
An AI-powered National Complaint Management System for the Pakistan Government. Features a blockchain-ready architecture, multi-language support (English and Urdu), and Role-Based Access Control (RBAC) with 9 distinct user roles. Supports both Demo Mode (quick-login, sample data) and Live Mode (real credentials, cross-role connected tickets).

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4, Radix UI components
- **Routing**: React Router v7
- **State Management**: React Context API
- **Charts**: Recharts
- **Package Manager**: pnpm (NOT npm/yarn)

## Color Scheme
- Government green: `#01411C` (dark), `#0B5D1E` (medium), `#DFF5E1` (light/bg)

## Architecture
- **Frontend-only SPA** — no backend server
- **Demo Mode**: 12 mock users + 12 sample tickets; quick-login with password `demo123`
- **Live Mode**: 9 real live users (LU001-LU009) + 10 connected tickets (LT-0001 to LT-0010) covering all workflow stages
- **Data flow**: All dashboards use `useApp().tickets` from `AppContext`, which sources from `allTickets` (mockTickets + liveTickets combined in `mock-data.ts`)

## User Roles (9 total)
1. Citizen
2. Call Center Officer
3. Support Agent
4. Field Engineer
5. Supervisor
6. Department Head
7. Executive
8. Auditor
9. System Admin

## Live Mode Credentials
| Role | Email | Password |
|------|-------|----------|
| Citizen | ctlive@gov.pk | ct12345 |
| Call Center Officer | ccolive@gov.pk | cco12345 |
| Support Agent | salive@gov.pk | sa12345 |
| Field Engineer | felive@gov.pk | fe12345 |
| Supervisor | suplive@gov.pk | sup12345 |
| Department Head | dhlive@gov.pk | dh12345 |
| Executive | exelive@gov.pk | exe12345 |
| Auditor | audlive@gov.pk | aud12345 |
| System Admin | adlive@gov.pk | ad12345 |

## Escalation Engine
- **Service**: `src/app/services/escalation-engine.ts`
- **Role chain**: Agent/CCO/FE → Supervisor (Level 1) → Department Head (Level 2) → Executive (Level 3)
- **Target lookup**: same-department first, any matching role as fallback
- **Resolution timeouts**: Critical L1=1h, High L1=2h, Medium L1=6h, Low L1=12h (doubles each level)
- **Ticket fields**: `escalatedAt`, `escalatedBy`, `escalatedTo`, `escalationReason`, `escalationLevel`
- **AppContext**: `escalateTicket(ticketId, reason, escalatedTo)` — updates status, persists to localStorage, sends notification, logs audit
- **Mock data**: TCK-0002 (Demo escalated: Ayesha→Ali Akbar), LT-0005 (Live escalated: Nadia→Hina Baig)
- **UI**: Modal in AgentDashboard + SupervisorDashboard; escalation trail card in TicketDetails

## Key Files
- `src/app/data/mock-data.ts` — All users (demo + live), tickets, comments, notifications; exports `allTickets`, `allUsers`, `liveUsers`, `liveCredentials`
- `src/app/context/AppContext.tsx` — Central state using `allTickets` and `mockUsers[0]` as default
- `src/app/pages/Login.tsx` — Demo/Live toggle, quick-login (Demo), clickable credential table (Live)
- `src/app/services/audit-service.ts` — Positional args: `logEvent(eventType, ticketId, user, metadata)`
- `src/app/services/ticket-service.ts` — Ticket creation with AuditService
- `src/app/pages/TicketDetails.tsx` — Full ticket management: status, reassign (uses `allUsers`), comments, audit trail
- `src/app/pages/ExecutiveDashboard.tsx` — Charts and alerts using AppContext tickets
- `src/app/pages/Root.tsx` — Layout with live notification badge

## Key Directories
- `src/app/pages/` — Role-specific dashboards
- `src/app/components/` — Reusable UI components
- `src/app/context/` — React Context providers (AppContext, LanguageContext)
- `src/app/services/` — AI analysis, SLA engine, blockchain adapter
- `src/app/data/` — mock-data.ts (single source of truth)
- `src/app/types/` — TypeScript interfaces
- `src/assets/` — Static assets (logo images)

## Development
- Run: `pnpm run dev` → port 5000
- Build: `pnpm run build` → `dist/`
- Static site (no server needed for deployment)

## Important Notes
- `AuditService.logEvent` takes 4 positional args: `(eventType, ticketId, user, metadata)` — NOT an object literal
- All user lookups and filters must use `allUsers` (not `mockUsers`) to include live users
- `allTickets = [...mockTickets, ...liveTickets]` — always use this in AppContext
- Toast feedback via `sonner`
- Live mode credential table is clickable (auto-fills email + password fields)
