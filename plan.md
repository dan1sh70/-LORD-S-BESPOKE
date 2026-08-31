# LORD'S BESPOKE ALTERATION ERP

## Full System Plan & Architecture Document

---

## 1. Project Overview

This is a **multi-role ERP platform for a garment alteration business network**. A central business (Super Admin) oversees a distributed network of **Readymade Shops** (customer-facing storefronts), **Workshops** run by **Masters**, individual **Tailors/Workers**, and **Delivery Boys** who move garments between shops and workshops.

The core object moving through the system is the **Alteration Order** — a garment dropped off by a customer at a shop, altered at a workshop, and returned to the shop for customer pickup.

### Core Design Principle: Strict Role Isolation

The single most important architectural rule in this system is **contact isolation**:

- The **Customer only ever interacts with the Shop**.
- **Master, Tailor, and Delivery Boy never contact the Customer directly.**
- Each role only talks to the roles immediately adjacent to it in the workflow (Shop ↔ Delivery Boy ↔ Master ↔ Tailor).

This isolation must be enforced at the **permissions/API layer**, not just the UI layer — it is a business rule, not a preference.

---

## 2. Actors / Panels

| Role | Core Responsibility | Talks To |
| --- | --- | --- |
| **Super Admin** | Owns and controls the entire ERP: users, pricing, wallets, settings, reports | Everyone (full access) |
| **Readymade Shop** | Customer-facing; creates orders, requests pickup, hands garments back to customer | Customer, System (not Master/Tailor/Delivery Boy directly) |
| **Master** | Workshop head; receives garments, inspects, assigns tailors, does QC | System, Tailor, Delivery Boy |
| **Tailor / Worker** | Performs the actual alteration work | Master only |
| **Delivery Boy** | Transports garments between Shop ↔ Workshop | Shop, Workshop (not Customer) |

---

## 3. Master Order Lifecycle (Cross-Role State Machine)

This is the backbone of the entire system — every panel's dashboard is essentially a filtered view of this single state machine.

```
Order Created (Shop)
   ↓
Pickup Requested (Shop)
   ↓
Pickup Assigned (Admin/System assigns Delivery Boy)
   ↓
Picked Up (Delivery Boy, from Shop)
   ↓
Workshop Delivered (Delivery Boy → Master)
   ↓
Master Received (Master confirms + verifies quantity)
   ↓
Inspection (Master checks garment, alteration notes, damage, priority, due date)
   ↓
Tailor Assigned (Master selects Tailor)
   ↓
Accepted (Tailor)
   ↓
Work Started (Tailor)
   ↓
Work In Progress (25% → 50% → 75% → 90%)
   ↓
Work Completed (Tailor submits + final notes)
   ↓
Quality Check (Master: measurement / fitting / finishing)
   ├── QC Failed → Return To Tailor (with reason) → Rework → back to Work Completed
   └── QC Passed ↓
Ready For Delivery
   ↓
Delivery Boy Assigned (return leg)
   ↓
Collected From Workshop (Delivery Boy)
   ↓
Delivered To Shop (Delivery Boy → Shop, Shop confirms)
   ↓
Customer Delivery (Shop hands garment to customer)
   ↓
Order Closed
```

**Key architectural implication:** the Order entity needs a single canonical `status` field plus a full `status_history` / timeline log (who changed it, when, and why) — this is required for the Reports, Order Tracking, and Notification features present in *every* panel.

---

## 4. Data Model (Entities)

### 4.1 Core Entities

- **Shop** — id, name, owner, mobile, GST, address, city/state/pin, status (active/suspended), wallet_id
- **Customer** — id, name, mobile, shop_id (owning shop), order_history, total_orders, total_business
- **Master** — id, name, mobile, workshop_name, address, experience, specialization, wallet_id
- **Tailor/Worker** — id, name, mobile, specialization, experience, master_id (workshop they belong to), wallet_id
- **Delivery Boy** — id, name, mobile, vehicle_type, vehicle_number, license_number, wallet_id
- **Order** — id (auto-generated order number), customer_id, shop_id, garment_type, alteration_details (structured, see 4.2), delivery_date, priority, status, status_history[], master_id, tailor_id, delivery_boy_id (pickup leg), delivery_boy_id (return leg), qc_result, price
- **Wallet** (per user, any role) — main_balance, growth_balance, todays_work_balance, reward_balance, transaction_history[]
- **Associate/Referral** — user_id, referral_code, referral_link, upline_id, 10-level downline tree, level_income[], bonus_income
- **Price Master** — garment_type × alteration_type × urgency_tier (Normal / Urgent / Very Urgent / VIP / Festival) → price
- **Notification** — recipient_id, type, message, read_status, timestamp
- **Help Desk Ticket** — id, raised_by, subject, status (new/pending/resolved/closed), assigned_to, thread[]

### 4.2 Garment / Alteration Taxonomy

Each garment type has its own alteration checklist (used to build the "Alteration Details" form when a Shop creates an order, and the Tailor's task checklist):

| Garment | Alteration Points |
| --- | --- |
| Shirt | Length, Sleeve, Collar, Cuff, Shoulder, Fitting, Button Change, Pocket Repair |
| Pant | Waist, Length, Bottom, Zip, Hook, Elastic, Pocket Repair |
| Suit | Coat Sleeve, Shoulder, Chest, Waist, Length, Button, Lining |
| Blazer | Sleeve, Shoulder, Chest, Waist, Collar, Button |
| Sherwani | Length, Sleeve, Chest, Waist, Collar, Button |
| Ladies Wear | Length, Chest, Waist, Hip, Sleeve, Zip, Hook, Neck |

This taxonomy should live in a config table (not hardcoded) since Super Admin's Price Master needs to reference the same list.

---

## 5. Permission Matrix

| Capability | Super Admin | Shop | Master | Tailor | Delivery Boy |
| --- | :---: | :---: | :---: | :---: | :---: |
| Create Order | ✔ | ✔ | ✘ | ✘ | ✘ |
| Edit Customer Details | ✔ | ✔ | ✘ | ✘ | ✘ |
| Assign Tailor | ✔ | ✘ | ✔ | ✘ | ✘ |
| Assign Delivery Boy | ✔ | ✘ | (config-dependent) | ✘ | ✘ |
| Perform Alteration / Update Progress | — | ✘ | ✘ | ✔ | ✘ |
| Quality Check | ✔ | ✘ | ✔ | ✘ | ✘ |
| Pickup / Deliver Garment | — | ✘ | ✘ | ✘ | ✔ |
| Change Price Master | ✔ | ✘ | ✘ | ✘ | ✘ |
| Change System Settings | ✔ | ✘ | ✘ | ✘ | ✘ |
| View Own Wallet | ✔ | ✔ | ✔ | ✔ | ✔ |
| View All Wallets | ✔ | ✘ | ✘ | ✘ | ✘ |
| Delete / Reopen Orders | ✔ | ✘ | ✘ | ✘ | ✘ |
| Edit Completed Order | ✘ | ✘ | ✘ | ✘ | ✘ |
| View Other Shop's Data | — | ✘ | ✘ | ✘ | ✘ |

This matrix should be enforced server-side via role-based middleware, not just conditional UI rendering.

---

## 6. Common Cross-Panel Modules

Every role's panel repeats the same four sub-systems, which strongly suggests these should be built as **shared, reusable services** rather than duplicated per-role:

1. **Wallet Module** — Main / Growth / Today's Work / Reward wallets + transaction history, identical shape across all 5 roles.
2. **Notification Module** — event-driven; each state transition in the Order Lifecycle (§3) fires a notification to the relevant next-role.
3. **Reports Module** — daily/weekly/monthly views, filtered by role scope (Shop sees its own orders; Master sees workshop performance; Super Admin sees everything).
4. **Help Desk Module** — ticketing, shared schema, different scopes (Super Admin sees all tickets; others see only their own).

Building these as shared services (rather than copy-pasted per role) will substantially reduce implementation and maintenance cost.

---

## 7. Wallet & Associate (MLM-style) System

- Every role has 4 wallet buckets: **Main, Growth, Today's Work, Reward**.
- **Associate/Referral system** is a 10-level deep tree: each user has a referral code/link, and income flows upward through levels (Level Income + Bonus Income + Reward Income), visible to Super Admin in aggregate and to each user for their own downline.
- Super Admin additionally controls **Withdrawal Requests** (approve/reject) — this is a financial control point and should have an audit trail.

---

## 8. Suggested Technical Architecture

### 8.1 High-Level Stack Recommendation

```
┌─────────────────────────────────────────────────────────┐
│                     Client Apps                          │
│  Shop App | Master App | Tailor App | Delivery App | Admin│
│         (Mobile-first: React Native / Flutter)            │
│              Admin Panel: Web (React)                     │
└───────────────────────┬───────────────────────────────────┘
                         │ REST/GraphQL API (JWT auth)
┌───────────────────────▼───────────────────────────────────┐
│                  API / Application Layer                  │
│  - Role-based Access Control (RBAC) middleware             │
│  - Order Service   - Wallet Service   - Notification Svc  │
│  - User Service    - Reports Service  - HelpDesk Service  │
└───────────────────────┬───────────────────────────────────┘
                         │
┌───────────────────────▼───────────────────────────────────┐
│                     Data Layer                             │
│  Primary DB (PostgreSQL/MySQL): Orders, Users, Wallets      │
│  Cache (Redis): sessions, live progress %, notifications    │
│  File Storage (S3-compatible): invoices/PDFs, photos        │
└──────────────────────────────────────────────────────────┘
                         │
              Push Notification Service (FCM)
              SMS/WhatsApp Gateway (order updates)
```

### 8.2 Key Non-Functional Requirements

- **Multi-tenancy**: Shops and Masters are independent tenants; data must be scoped so no shop/workshop can see another's orders (explicitly listed as a restriction in the source spec).
- **Auditability**: every status change, price change, and wallet transaction needs an immutable log — needed for disputes, QC-failure tracking, and financial reconciliation.
- **Real-time updates**: progress bars (25/50/75/90/100%) and order status should push live to Shop and Master dashboards (websockets or polling).
- **Offline resilience**: Delivery Boy and Tailor apps likely used in low-connectivity environments — should support offline action queuing (accept/complete/update progress) with sync-on-reconnect.
- **Localization**: system settings explicitly call for multi-language support (English, Hindi, Gujarati, Marathi, with room for more).
- **PDF/Invoice generation**: Shop needs order slip + invoice + PDF download — a dedicated invoicing microservice or library integration.

### 8.3 Suggested Build Phases

| Phase | Scope |
| --- | --- |
| **Phase 1 — MVP Core** | User auth + roles, Order creation (Shop), Order state machine, Master inspection + Tailor assignment, Tailor work + progress updates, Master QC, basic notifications |
| **Phase 2 — Logistics** | Delivery Boy panel, pickup/delivery workflow, map/navigation integration, call feature |
| **Phase 3 — Financial** | Wallet system, Price Master, invoicing/PDF, withdrawal requests |
| **Phase 4 — Growth Layer** | Associate/referral 10-level tree, bonus/level income engine |
| **Phase 5 — Admin & Reporting** | Super Admin full dashboard, all reports, system settings, help desk, notification broadcast center |
| **Phase 6 — Polish** | Multi-language, offline sync, performance/quality analytics, GPS tracking for delivery |

---

## 9. Notification Map (who gets notified when)

| Event | Notified Role(s) |
| --- | --- |
| Pickup Requested | Delivery Boy (on assignment) |
| Pickup Complete | Master |
| Order Received at Workshop | Shop |
| Tailor Assigned | Tailor |
| Work Started / Completed | Master |
| QC Failed | Tailor (with reason) |
| Ready For Delivery | Delivery Boy (on assignment), Shop |
| Delivered to Shop | Shop, (Shop notifies customer manually — customer is never system-notified directly, per contact-isolation rule) |
| Broadcast/System/Festival | All or role-targeted (Super Admin only) |

---

## 10. Open Questions to Resolve Before Build

1. **Delivery Boy assignment**: is it always Admin-controlled, or can Master assign directly for the return leg? (Spec is ambiguous — Master doc says "may be Admin Control".)
2. **Multi-workshop shops**: can one Shop route orders to different Masters/workshops based on garment type or load, or is it a fixed 1:1 Shop–Workshop relationship?
3. **Pricing at order-creation time**: does the Shop see/quote price to the customer immediately (from Price Master), or is it computed later?
4. **Wallet crediting rules**: exact formulas for how Growth/Reward/Today's-Work wallets are credited per completed order need to be defined (currently just structural, not rule-based, in the source docs).
5. **Referral tree depth exceptions**: does every role (Shop, Master, Tailor, Delivery Boy) participate in the same 10-level associate tree, or is it Shop/Associate-only?

---

## 11. Summary

This ERP is fundamentally an **order-orchestration system with strict role isolation**, layered with a **wallet/incentive engine** and a **10-level referral network**. The technical win comes from treating Wallet, Notifications, Reports, and Help Desk as shared services across all five panels rather than rebuilding them per role, and from modeling the Order Lifecycle (§3) as a single well-audited state machine that every panel is just a scoped view into.
