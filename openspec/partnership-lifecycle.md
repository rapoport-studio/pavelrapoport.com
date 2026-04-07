# Partnership Lifecycle — From Idea to Product

> Reusable framework for turning a conversation with a
> domain expert into a registered company with a working MVP.
> Based on the VIVOD experience (Pavel × Misha).

---

## Stages

### Stage 0 — Signal

A person appears with pain and domain expertise.

**What happens:**
- Someone from network shares a problem
- Pavel evaluates: is there product-market fit between
  their pain and his capabilities?
- Can AI solve or accelerate this?

**Checklist:**
- [ ] Source documented (friend, network, cold intro)
- [ ] Domain expertise identified
- [ ] Pain described in one sentence
- [ ] AI leverage estimated (high / medium / low)
- [ ] First impression: partnership potential? (yes / maybe / no)

**Platform action:**
- AI Listener captures the conversation
- No project yet — just a note in the system
- Linked to the person's profile (network or new contact)

**VIVOD example:**
Pavel and Misha — long-time friends. Misha runs facade
construction operations. Pain: total chaos, no digital
tools. Trigger: conversation during war sirens.
AI leverage: high (planning, scheduling, progress tracking).

---

### Stage 1 — Discovery

2-3 deep conversations to understand the problem.

**What happens:**
- What specifically doesn't work?
- Who are the customers?
- What's the market size?
- Pavel validates: can technology solve this?
- Is there enough here for a product, not just a tool?

**Checklist:**
- [ ] Problem statement written (1 page)
- [ ] Target customer (ICP) defined
- [ ] Market size estimated
- [ ] Competitive landscape reviewed
- [ ] Technology approach sketched

**Platform action:**
- AI Listener creates Draft Project
- Domain map starts forming: entities, relationships
- Draft specs generated with [DRAFT] markers
- Task: "Review draft: [project name]"

**VIVOD example:**
Facade construction: builders, buildings, floors, strips,
blocks, contracts. Customers: construction companies in Israel.
Market: every building under construction. No real competitors
in digital facade management.

**Artifact:** Problem Statement

---

### Stage 2 — Alignment

Agree on roles, equity, and rules before any code.

**What happens:**
- Who is CEO (business, sales, customers)?
- Who is CTO (product, technology, AI)?
- Equity split, vesting schedule
- Decision rights: who decides what?
- Exit scenarios: what if one leaves?
- Investment: who puts in what (money, time, assets)?

**Checklist:**
- [ ] Roles defined (CEO / CTO / other)
- [ ] Equity split agreed
- [ ] Vesting schedule agreed (e.g., 4 years, 1 year cliff)
- [ ] Decision rights documented
- [ ] Exit scenarios discussed
- [ ] Investment terms (cash, time, equipment)
- [ ] Founders Agreement drafted

**Platform action:**
- Organization created (type: partnership)
- Both partners added as owners
- Contract entity created: type = joint_ip
- IP Registry initialized

**VIVOD example:**
Pavel: CTO — product, technology, AI architecture.
Misha: CEO — business, domain expertise, sales.
Equity: to be formalized (VVD-25 — still open, risk!).

**Artifact:** Founders Agreement

**Learning from VIVOD:** Do this BEFORE the first line
of code. Not after. Legal risk compounds every day
without a signed agreement.

---

### Stage 3 — Init

Set up everything needed to start building.

**What happens:**
- Register company (if needed)
- Buy domain
- Create infrastructure: GitHub org, Supabase project,
  Linear workspace
- First OpenSpec: MVP scope, 3-month roadmap
- Brand basics: name, logo, colors

**Checklist:**
- [ ] Company registered (or partnership agreement signed)
- [ ] Domain purchased and DNS configured
- [ ] GitHub organization created
- [ ] Supabase project created
- [ ] Linear workspace/team created
- [ ] Cloudflare configured
- [ ] OpenSpec initialized with project.md
- [ ] MVP scope defined (max 3-month horizon)
- [ ] First milestone set
- [ ] Brand name and basic identity

**Platform action:**
- Project status: draft → shaping
- All connections configured via integrations
- Domain added and verified
- OpenSpec specs generated from domain map
- Pipeline initialized

**VIVOD example:**
vivod.app domain. GitHub org. Supabase project.
Linear workspace: AI Development Studio / VIVOD team.
OpenSpec with domains: facade, auth, contracts,
worker-app, agents, entities, design, infra, api.

**Artifact:** Project Init Checklist + OpenSpec v0.1

---

### Stage 4 — Build

Sprint execution, regular demos, partner sync.

**What happens:**
- Sprint cycles (1-2 weeks)
- Weekly sync between partners
- Demo milestones (show progress, get feedback)
- AI agent executes tasks from specs
- Code reviews, quality gates

**Checklist:**
- [ ] Sprint cadence established
- [ ] Weekly partner sync scheduled
- [ ] Demo milestones defined
- [ ] Shared Linear board active
- [ ] OpenSpec propose cycles running
- [ ] CI/CD pipeline working
- [ ] Staging environment available

**Platform action:**
- Project status: shaping → speccing → building
- Pipeline: propose → approve → ship cycles
- Tasks assigned to AI and humans
- Budget tracking active
- Sprint reviews documented

**VIVOD example:**
Active development. FORGE audit system for code quality.
Regular demos to Misha. Linear board shared between both.

**Artifact:** Sprint reviews, audit reports

---

### Stage 5 — Validate

Test with real customers. Go/no-go decision.

**What happens:**
- Pilot client uses the product
- Measure: does it solve the pain?
- Collect feedback, iterate
- Go/no-go: continue investing or pivot?
- Define success criteria before pilot starts

**Checklist:**
- [ ] Pilot client identified
- [ ] Success criteria defined (before pilot!)
- [ ] Pilot launched
- [ ] Feedback collected
- [ ] Metrics measured
- [ ] Go/no-go decision made
- [ ] Next phase planned (scale / pivot / kill)

**Platform action:**
- Project status: building → delivered (if successful)
- Validation report generated
- Finance: first revenue tracked
- Decision logged with date and reasoning

**VIVOD example:**
Pilot clients: Gishat Havalim, Euro Towers.
Criteria: 10 demos → 2-3 conversions.
Product used in real facade construction.

**Artifact:** Validation Report

---

## Decision Log

Every partnership needs a decision log. Key decisions
with dates, context, and who decided.

```
Decision Log entry:
  id, project_id, organization_id
  date
  decision: text
  context: why this decision was made
  decided_by: [user_ids]
  outcome: what happened after (filled later)
  linked_to: spec / task / milestone (optional)
```

Examples from VIVOD:
```
2024-01-XX: Decided to build facade management platform
  Context: Misha's pain + no competitors
  Decided by: Pavel, Misha

2024-XX-XX: Chose "VIVOD" as name
  Context: Hebrew for "output/execution"
  Decided by: Pavel, Misha

2024-XX-XX: First pilot with Gishat Havalim
  Context: Misha's existing client, ready to try
  Decided by: Misha (client relationship)
```

---

## Learnings (from VIVOD, for future partnerships)

1. **Founders agreement FIRST.** Before any code.
   VIVOD's VVD-25 is still open — legal risk.

2. **Equity and roles on paper before line one.**
   Verbal agreements decay. Paper doesn't.

3. **Pilot client from day one.** VIVOD had Gishat Havalim
   immediately — this worked perfectly. Don't build
   in vacuum.

4. **Decision log from day one.** Key decisions are
   currently scattered across Linear, WhatsApp, memory.
   Write them down with dates.

5. **Regular partner sync.** Weekly 30-min call minimum.
   Don't assume alignment — verify it.

6. **Clear domain boundaries.** CEO doesn't review code.
   CTO doesn't negotiate with clients. Trust the roles.

7. **OpenSpec as shared language.** When both partners
   can read the spec and understand what's being built,
   miscommunication drops dramatically.

---

## New Entities (for platform)

| Entity | Domain | What it captures |
|--------|--------|-----------------|
| **Idea** | `projects` | Pre-project: problem statement, AI leverage score, market estimate |
| **DecisionLog** | `projects` | Key decisions with date, context, who decided |
| **Milestone** | `projects` | Trackable checkpoint per stage |
| **PilotClient** | `projects` | Pilot customer: who, criteria, feedback, outcome |
| **FoundersAgreement** | `organizations` | Roles, equity, vesting, exit terms (extends Contract) |
| **PartnershipStage** | `organizations` | Current stage (0-5) with checklist completion |

These entities extend what's already in `projects` and
`organizations` specs. They should be added via propose
cycles, not direct spec edits.
