# Jobilo - Diagrams (Flowcharts, Activity, Sequence, Class)

---

## 1. Project Lifecycle Flowchart

```
                    ┌──────────┐
                    │   DRAFT  │
                    └────┬─────┘
                         │ Publish
                    ┌────▼─────┐
                    │   OPEN   │◄────────────┐
                    └────┬─────┘             │
                         │ Receive proposals │
                    ┌────▼─────┐             │
                    │UNDER     │             │
                    │ REVIEW   │             │
                    └────┬─────┘             │
                     ┌───┴───┐               │
                     │       │               │
               ┌─────▼─┐ ┌───▼────┐          │
               │ACCEPT  │ │REJECT  │          │
               │Proposal│ │Proposal│          │
               └───┬────┘ └───┬────┘          │
                   │          └───────────────┘
              ┌────▼─────┐
              │IN PROGRESS│
              └────┬─────┘
                   │ Work submitted
              ┌────▼──────┐
              │UNDER      │
              │REVIEW     │
              └────┬──────┘
               ┌───┴────┐
               │        │
          ┌────▼──┐ ┌───▼────┐
          │APPROVE│ │DISPUTE │
          └───┬───┘ └───┬────┘
              │         │
         ┌────▼────┐ ┌──▼──────┐
         │COMPLETED│ │ DISPUTED│
         └─────────┘ └──┬──────┘
                        │
                   ┌────▼────┐
                   │RESOLVED │
                   └─────────┘

Cancelled ← Any state (client or mutual)
Archived  ← After 90 days of completion
```

---

## 2. User Registration Flowchart

```
              ┌──────────────────┐
              │   User arrives   │
              │  at Landing Page │
              └────────┬─────────┘
                       │ Click "Sign Up"
              ┌────────▼─────────┐
              │ Choose User Type │
              │ (Freelancer/     │
              │  Client/Both)    │
              └────────┬─────────┘
                       │
              ┌────────▼─────────┐
              │  Registration    │
              │     Form         │
              │ Name, Email,     │
              │ Password, Terms  │
              └────────┬─────────┘
                       │
              ┌────────▼─────────┐
              │    Validate      │
              │     Input        │
              └────────┬─────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
    ┌──────▼──────┐         ┌──────▼──────┐
    │  Valid      │         │  Invalid    │
    └──────┬──────┘         └──────┬──────┘
           │                       │
    ┌──────▼──────┐         ┌──────▼──────┐
    │ Check Email │         │ Show Error  │
    │  Uniqueness │         │  Messages   │
    └──────┬──────┘         └──────┬──────┘
           │                       │
    ┌──────▼──────┐               │
    │  Available  │               │
    └──────┬──────┘               │
           │                      │
    ┌──────▼──────┐               │
    │  Create User│               │
    │  (Pending)  │               │
    └──────┬──────┘               │
           │                      │
    ┌──────▼──────┐               │
    │  Send Email │               │
    │  Verification│              │
    └──────┬──────┘               │
           │                      │
    ┌──────▼──────┐               │
    │User Verifies│               │
    │   Email     │               │
    └──────┬──────┘               │
           │                      │
    ┌──────▼──────┐               │
    │  Activate   │               │
    │   Account   │               │
    └──────┬──────┘               │
           │                      │
    ┌──────▼──────┐               │
    │Redirect to  │               │
    │Profile Setup│               │
    └─────────────┘               │
                                  │
           ◄──────────────────────┘
```

---

## 3. Sequence Diagrams

### 3.1: Submit Proposal Sequence

```
Freelancer              Frontend               API                  Database            AI Service
    │                      │                    │                      │                   │
    │  1. Click "Apply"    │                    │                      │                   │
    │─────────────────────►│                    │                      │                   │
    │                      │                    │                      │                   │
    │                      │  2. GET /projects/ │                      │                   │
    │                      │     :id            │                      │                   │
    │                      │───────────────────►│                      │                   │
    │                      │                    │  3. Find Project     │                   │
    │                      │                    │─────────────────────►│                   │
    │                      │                    │  4. Return Project   │                   │
    │                      │                    │◄─────────────────────│                   │
    │                      │  5. Project Data   │                      │                   │
    │                      │◄───────────────────│                      │                   │
    │                      │                    │                      │                   │
    │  6. Show Proposal    │                    │                      │                   │
    │     Form + AI Draft  │                    │                      │                   │
    │◄────────────────────│                    │                      │                   │
    │                      │                    │                      │                   │
    │  7. Click "Generate  │                    │                      │                   │
    │     with AI"         │                    │                      │                   │
    │─────────────────────►│                    │                      │                   │
    │                      │  8. POST /ai/      │                      │                   │
    │                      │     generate-      │                      │                   │
    │                      │     proposal       │                      │                   │
    │                      │───────────────────►│                      │                   │
    │                      │                    │  9. Generate Draft   │                   │
    │                      │                    │─────────────────────────────────────►   │
    │                      │                    │  10. AI Draft        │                   │
    │                      │                    │◄─────────────────────────────────────   │
    │                      │  11. Draft Text    │                      │                   │
    │                      │◄───────────────────│                      │                   │
    │  12. Display Draft   │                    │                      │                   │
    │◄────────────────────│                    │                      │                   │
    │                      │                    │                      │                   │
    │  13. Edit & Submit   │                    │                      │                   │
    │─────────────────────►│                    │                      │                   │
    │                      │  14. POST /        │                      │                   │
    │                      │     proposals      │                      │                   │
    │                      │───────────────────►│                      │                   │
    │                      │                    │  15. Validate Input  │                   │
    │                      │                    │─────────────────────►│                   │
    │                      │                    │  16. Save Proposal   │                   │
    │                      │                    │─────────────────────►│                   │
    │                      │                    │  17. Proposal Saved  │                   │
    │                      │                    │◄─────────────────────│                   │
    │                      │                    │                      │                   │
    │                      │                    │  18. Send            │                   │
    │                      │                    │      Notification    │                   │
    │                      │                    │      to Client       │                   │
    │                      │                    │─────────────────────►│                   │
    │                      │                    │                      │                   │
    │                      │  19. Success       │                      │                   │
    │                      │◄───────────────────│                      │                   │
    │  20. Show Success    │                    │                      │                   │
    │     Toast + Redirect │                    │                      │                   │
    │◄────────────────────│                    │                      │                   │
```

### 3.2: Payment & Escrow Sequence

```
Client                Frontend               API                  Stripe              Database
  │                      │                    │                      │                   │
  │  1. Accept Proposal  │                    │                      │                   │
  │─────────────────────►│                    │                      │                   │
  │                      │  2. POST /contracts│                      │                   │
  │                      │───────────────────►│                      │                   │
  │                      │                    │  3. Create Contract  │                   │
  │                      │                    │─────────────────────►│                   │
  │                      │                    │  4. Contract Created │                   │
  │                      │                    │◄─────────────────────│                   │
  │                      │  5. Show Payment   │                      │                   │
  │                      │     Options        │                      │                   │
  │◄────────────────────│                    │                      │                   │
  │                      │                    │                      │                   │
  │  6. Select Payment   │                    │                      │                   │
  │     Method & Pay     │                    │                      │                   │
  │─────────────────────►│                    │                      │                   │
  │                      │  7. POST /payments │                      │                   │
  │                      │     /create-intent │                      │                   │
  │                      │───────────────────►│                      │                   │
  │                      │                    │  8. Create Payment   │                   │
  │                      │                    │     Intent           │                   │
  │                      │                    │─────────────────────►│                   │
  │                      │                    │  9. Payment Intent   │                   │
  │                      │                    │◄─────────────────────│                   │
  │                      │  10. Client Secret │                      │                   │
  │                      │◄───────────────────│                      │                   │
  │  11. Confirm Card    │                    │                      │                   │
  │     Payment          │                    │                      │                   │
  │─────────────────────►│                    │                      │                   │
  │                      │  12. stripe.       │                      │                   │
  │                      │      confirm       │                      │                   │
  │                      │      CardPayment   │                      │                   │
  │                      │──────────────────────────────────────────►│                   │
  │                      │                    │                      │                   │
  │                      │  13. Webhook:      │                      │                   │
  │                      │     payment_intent │                      │                   │
  │                      │     .succeeded     │                      │                   │
  │                      │◄──────────────────────────────────────────│                   │
  │                      │                    │                      │                   │
  │                      │                    │  14. Update Payment  │                   │
  │                      │                    │     → FUNDED         │                   │
  │                      │                    │─────────────────────►│                   │
  │                      │                    │  15. Update Wallet   │                   │
  │                      │                    │─────────────────────►│                   │
  │                      │                    │  16. Send Notification│                  │
  │                      │                    │     (Both parties)   │                   │
  │                      │  17. Success       │                      │                   │
  │                      │◄───────────────────│                      │                   │
  │  18. Show Success    │                    │                      │                   │
  │◄────────────────────│                    │                      │                   │
```

### 3.3: Dispute Resolution Sequence

```
Freelancer           Client               Admin                API                DB
    │                    │                    │                  │                  │
    │  1. Open Dispute   │                    │                  │                  │
    │───────────────────────────────────────────────────────────►│                  │
    │                    │                    │                  │                  │
    │                    │                    │  2. Create       │                  │
    │                    │                    │     Dispute      │                  │
    │                    │                    │     Record       │                  │
    │                    │                    │─────────────────►│                  │
    │                    │                    │                  │                  │
    │  3. Notification   │  3. Notification   │                  │                  │
    │◄───────────────────│◄───────────────────│                  │                  │
    │                    │                    │                  │                  │
    │  4. Submit         │  5. Submit         │                  │                  │
    │     Evidence       │     Evidence       │                  │                  │
    │────────────────────│───────────────────►│                  │                  │
    │                    │                    │                  │                  │
    │                    │                    │  6. Review       │                  │
    │                    │                    │     Evidence     │                  │
    │                    │                    │                  │                  │
    │                    │                    │  7. Communicate  │                  │
    │                    │                    │     with Parties │                  │
    │                    │                    │─────────────────►│                  │
    │                    │                    │                  │                  │
    │  8. Chat/Mediate   │  8. Chat/Mediate   │                  │                  │
    │◄───────────────────│◄───────────────────│─────────────────►│                  │
    │                    │                    │                  │                  │
    │                    │                    │  9. Make Decision│                  │
    │                    │                    │─────────────────►│                  │
    │                    │                    │                  │                  │
    │                    │                    │                  │  10. Execute     │
    │                    │                    │                  │      Ruling      │
    │                    │                    │                  │─────────────────►│
    │                    │                    │                  │                  │
    │  11. Result        │  11. Result        │                  │                  │
    │◄───────────────────│◄───────────────────│                  │                  │
```

---

## 4. Class Diagram (Core Domain Models)

```
┌──────────────────────────────┐
│           User               │
├──────────────────────────────┤
│ - id: UUID                   │
│ - email: String              │
│ - passwordHash: String       │
│ - role: UserRole             │
│ - status: UserStatus         │
│ - locale: String             │
│ - timezone: String           │
│ - createdAt: DateTime        │
│ - updatedAt: DateTime        │
├──────────────────────────────┤
│ + register(email, password)  │
│ + login(email, password)     │
│ + verifyEmail(otp)           │
│ + resetPassword(token)       │
│ + updateProfile(data)        │
└──────────────────────────────┘
            ▲
            │
┌───────────┴───────────────┐
│                           │
│     ┌─────────────────────┤
│     │    User Role:       │
│     │  - Freelancer       │
│     │  - Client           │
│     │  - Admin            │
│     │  - SuperAdmin       │
│     └─────────────────────┘
│
┌──────────────────┐    ┌──────────────────┐
│ FreelancerProfile│    │  ClientProfile   │
├──────────────────┤    ├──────────────────┤
│ - title: String  │    │ - companyName    │
│ - bio: Text      │    │ - companySize    │
│ - hourlyRate     │    │ - industry       │
│ - skills[]       │    │ - isVerified     │
│ - rating         │    │ - totalSpent     │
│ - successScore   │    │ - hireRate       │
├──────────────────┤    ├──────────────────┤
│ + addSkill()     │    │ + verify()       │
│ + updateRate()   │    │ + postProject()  │
│ + calculateScore()│   │ + hireFreelancer()│
└──────────────────┘    └──────────────────┘

┌──────────────────────────────────┐
│            Project               │
├──────────────────────────────────┤
│ - id: UUID                       │
│ - clientId: UUID                 │
│ - title: String                  │
│ - description: Text              │
│ - budgetMin/Max: Decimal         │
│ - projectType: Fixed|Hourly      │
│ - durationDays: Int              │
│ - experienceLevel: SkillLevel    │
│ - status: ProjectStatus          │
│ - skills: ProjectSkill[]         │
│ - proposalsCount: Int            │
│ - createdAt: DateTime            │
├──────────────────────────────────┤
│ + publish()                      │
│ + close()                        │
│ + updateStatus()                 │
│ + getMatchingFreelancers()       │
└──────────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│          Proposal            │    │          Contract            │
├──────────────────────────────┤    ├──────────────────────────────┤
│ - id: UUID                   │    │ - id: UUID                   │
│ - projectId: UUID            │    │ - projectId: UUID            │
│ - freelancerId: UUID         │    │ - proposalId: UUID?          │
│ - coverLetter: Text          │    │ - freelancerId: UUID         │
│ - bidAmount: Decimal         │    │ - clientId: UUID             │
│ - durationDays: Int          │    │ - totalAmount: Decimal       │
│ - status: ProposalStatus     │    │ - platformFee: Decimal       │
│ - aiScore: Decimal           │    │ - status: ContractStatus     │
│ - isAiGenerated: Boolean     │    │ - milestones: Milestone[]    │
├──────────────────────────────┤    ├──────────────────────────────┤
│ + submit()                   │    │ + sign()                     │
│ + withdraw()                 │    │ + complete()                 │
│ + accept()                   │    │ + cancel()                   │
│ + reject()                   │    │ + addMilestone()             │
└──────────────────────────────┘    └──────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│         Milestone            │    │          Payment             │
├──────────────────────────────┤    ├──────────────────────────────┤
│ - id: UUID                   │    │ - id: UUID                   │
│ - contractId: UUID           │    │ - contractId: UUID           │
│ - title: String              │    │ - payerId: UUID              │
│ - amount: Decimal            │    │ - payeeId: UUID              │
│ - status: MilestoneStatus    │    │ - amount: Decimal            │
│ - dueDate: DateTime          │    │ - platformFee: Decimal       │
│ - deliverables: Deliverable[]│    │ - status: PaymentStatus      │
├──────────────────────────────┤    ├──────────────────────────────┤
│ + submit()                   │    │ + fund()                     │
│ + approve()                  │    │ + release()                  │
│ + reject()                   │    │ + refund()                   │
└──────────────────────────────┘    └──────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│          Review              │    │          Dispute             │
├──────────────────────────────┤    ├──────────────────────────────┤
│ - id: UUID                   │    │ - id: UUID                   │
│ - contractId: UUID           │    │ - contractId: UUID           │
│ - reviewerId: UUID           │    │ - openedBy: UUID             │
│ - revieweeId: UUID           │    │ - reason: Text               │
│ - rating: 1-5                │    │ - status: DisputeStatus      │
│ - comment: Text              │    │ - resolution: Text?          │
├──────────────────────────────┤    ├──────────────────────────────┤
│ + submit()                   │    │ + open()                     │
│ + flag()                     │    │ + resolve()                  │
│ + respond()                  │    │ + escalate()                 │
└──────────────────────────────┘    └──────────────────────────────┘
```

---

## 5. Activity Diagram: Create & Complete Project

```
┌────────────────────────────────────────────────────┐
│              Client Activity                        │
├────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌───────────────┐   │
│  │ Fill Form│   │ Preview  │   │ Publish Project│   │
│  └────┬─────┘   └────┬─────┘   └──────┬────────┘   │
│       │              │               │             │
│       ▼              ▼               ▼             │
│  ┌────────────────────────────────────────────┐    │
│  │         Review Proposals (AI Sorted)       │    │
│  └────────────────────┬───────────────────────┘    │
│                       │                            │
│                 ┌─────┴─────┐                      │
│                 │  Accept    │                      │
│                 │  Proposal  │                      │
│                 └─────┬─────┘                      │
│                       │                            │
│                 ┌─────┴─────┐                      │
│                 │  Fund      │                      │
│                 │  Escrow    │                      │
│                 └─────┬─────┘                      │
│                       │                            │
│                 ┌─────┴─────┐                      │
│                 │  Review   │                      │
│                 │  Work     │                      │
│                 └─────┬─────┘                      │
│                       │                            │
│              ┌────────┴────────┐                   │
│              │                 │                    │
│         ┌────▼────┐      ┌────▼────┐               │
│         │ Approve │      │ Dispute │               │
│         └────┬────┘      └────┬────┘               │
│              │                 │                    │
│         ┌────▼────┐      ┌────▼────┐               │
│         │ Release │      │Open     │               │
│         │ Payment │      │Dispute  │               │
│         └────┬────┘      └────┬────┘               │
│              │                 │                    │
└──────────────┼─────────────────┼────────────────────┘
               │                 │
┌──────────────┼─────────────────┼────────────────────┐
│  Freelancer  │                 │                    │
│  Activity    │                 │                    │
├──────────────┼─────────────────┼────────────────────┤
│              │                 │                     │
│    ┌─────────┴──────┐   ┌─────┴──────┐             │
│    │ Start Working  │   │ Submit     │             │
│    │ on Milestones  │   │ Evidence   │             │
│    └────────────────┘   └────────────┘             │
│              │                                      │
│    ┌─────────▼──────┐                               │
│    │ Submit Work    │                               │
│    └────────────────┘                               │
│              │                                      │
│    ┌─────────▼──────┐                               │
│    │ Receive        │                               │
│    │ Payment        │                               │
│    └────────────────┘                               │
└──────────────────────────────────────────────────────┘
```

---

## 6. State Machine Diagrams

### User State
```
       ┌─────────┐
       │ PENDING │ ──Verify Email──► ┌────────┐
       └─────────┘                   │ ACTIVE │
                                     └───┬────┘
                                   ┌─────┴─────┐
                                   │           │
                              ┌────▼───┐  ┌───▼────┐
                              │SUSPENDED│  │ BANNED │
                              └─────────┘  └────────┘
```

### Project State
```
DRAFT → OPEN → UNDER_REVIEW → IN_PROGRESS → COMPLETED
                  │                │
                  ▼                ▼
               REJECTED        DISPUTED → RESOLVED
                  
OPEN → CANCELLED (any time)
IN_PROGRESS → ON_HOLD (pause)
COMPLETED → ARCHIVED (after 90d)
```

### Proposal State
```
PENDING → ACCEPTED (creates contract)
PENDING → REJECTED
PENDING → WITHDRAWN
PENDING → SHORTLISTED → ACCEPTED/REJECTED
```

---

## 7. Data Migration Flow (Neon Branching)

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Main DB │    │  Branch  │    │   PR     │
│ (Prod)   │───►│ (Dev)    │───►│ Review   │
└──────────┘    └──────────┘    └──────────┘
                    │
               ┌────▼────┐
               │  Apply  │
               │ Migrate │
               └────┬────┘
                    │
               ┌────▼────┐
               │  Merge  │
               │  Branch │
               └────┬────┘
                    │
               ┌────▼────┐
               │  Deploy │
               │  to Prod│
               └─────────┘
```

## 8. Notification Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐
│  Event   │────►│ Queue     │────►│ Handler  │
│ Trigger  │     │ (In-app)  │     │          │
└──────────┘     └───────────┘     └────┬─────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                    │
               ┌────▼────┐        ┌─────▼─────┐       ┌─────▼────┐
               │ In-App  │        │   Email   │       │   Push   │
               │ Notif   │        │  (Resend) │       │  (Later) │
               └─────────┘        └───────────┘       └──────────┘
```
