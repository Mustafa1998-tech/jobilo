# Jobilo - AI System Architecture

---

## AI Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   AI Services Layer                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  OpenAI GPT  │  │  Embeddings  │  │  Moderation API  │  │
│  │    4o-mini   │  │  (text-      │  │  (safety check)  │  │
│  │              │  │   embedding) │  │                   │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│  ┌──────┴─────────────────┴────────────────────┴──────┐    │
│  │                 AI Engine (NestJS Service)           │    │
│  │                                                      │    │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────────────┐   │    │
│  │  │ Recommender│ │ Generator│ │  Classifier      │   │    │
│  │  │ System     │ │ System   │ │  System          │   │    │
│  │  └────────────┘ └──────────┘ └──────────────────┘   │    │
│  │                                                      │    │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────────────┐   │    │
│  │  │ Translator │ │ Fraud    │ │  Search          │   │    │
│  │  │            │ │ Detector │ │  (NLP)           │   │    │
│  │  └────────────┘ └──────────┘ └──────────────────┘   │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Caching: Redis (reduce API calls, cache common results)     │
│  Queue: Bull (background processing for heavy tasks)         │
│  Monitoring: Token usage, latency, error tracking            │
└─────────────────────────────────────────────────────────────┘
```

---

## AI Features Breakdown

| # | Feature | Model | Latency Target | Cache TTL |
|---|---------|-------|---------------|-----------|
| 1 | AI Proposal Writer | GPT-4o-mini | < 5s | 0 (real-time) |
| 2 | Profile Improvement | GPT-4o-mini | < 3s | 0 (real-time) |
| 3 | Freelancer Recommendations | Embeddings + Cosine Similarity | < 500ms | 1 hour |
| 4 | Project Recommendations | Embeddings + Cosine Similarity | < 500ms | 1 hour |
| 5 | Project Analysis | GPT-4o-mini | < 4s | 0 (real-time) |
| 6 | Fraud Detection | GPT-4o-mini + Rules Engine | < 2s | 0 (on creation) |
| 7 | Proposal Quality Score | GPT-4o-mini | < 2s | 0 (real-time) |
| 8 | Skills Classification | GPT-4o-mini | < 2s | 0 (real-time) |
| 9 | Auto Translation | GPT-4o-mini | < 2s | 1 day |
| 10 | Chat Assistant | GPT-4o-mini (RAG) | < 3s | 0 (real-time) |
| 11 | Smart Search | Embeddings + PostgreSQL pgvector | < 300ms | 5 min |
| 12 | Recommendation Engine | Hybrid (Content + Collaborative) | < 1s | 1 hour |

---

## Detailed Feature Design

### 1. AI Proposal Writer

**Purpose**: مساعدة المستقلين في كتابة عروض احترافية.

**Input**:
```json
{
  "projectDescription": "نحتاج مطور React لبناء موقع...",
  "freelancerProfile": {
    "title": "Full Stack Developer",
    "skills": ["React", "Node.js", "MongoDB"],
    "experience": "3 years",
    "portfolio": ["Project A", "Project B"]
  },
  "tone": "professional",
  "keyPoints": ["React expertise", "Fast delivery", "Previous similar work"]
}
```

**Prompt Template**:
```
You are an expert freelancing proposal writer for Jobilo platform.
Write a professional proposal in {language} for this project:

PROJECT: {projectDescription}

FREELANCER PROFILE: {freelancerProfile}

Guidelines:
- Tone: {tone}
- Highlight relevant skills: {keyPoints}
- Max 500 words
- Include: greeting, understanding of project, relevant experience, approach, call to action
- Be specific, avoid generic phrases
```

**Output**:
```json
{
  "proposal": "عزيزي العميل، بعد اطلاعي على متطلبات مشروعك...",
  "suggestedPrice": 750,
  "priceReason": "بناءً على خبرتي 3 سنوات في React ومشاريع مشابهة...",
  "suggestedDuration": 25,
  "matchScore": 95,
  "highlights": ["مطابقة للمهارات بنسبة 95%", "مشروعان مشابهان مكتملان"]
}
```

**Implementation**:
```typescript
async generateProposal(dto: GenerateProposalDto): Promise<AIProposalResponse> {
  const project = await this.projectRepo.findById(dto.projectId);
  const freelancer = await this.freelancerRepo.findByUserId(dto.userId);
  
  const prompt = this.buildProposalPrompt(project, freelancer, dto);
  const response = await this.openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });
  
  return this.parseProposalResponse(response.choices[0].message.content);
}
```

---

### 2. Profile Improvement Suggestions

**Purpose**: تحسين الملف الشخصي للمستقلين.

**Input**: Full freelancer profile data.

**Analysis Areas**:
| Area | What AI Checks |
|------|---------------|
| Title | Is it clear and professional? |
| Bio | Is it compelling? Missing keywords? |
| Skills | Missing relevant skills? Outdated? |
| Portfolio | Quality of descriptions? |
| Pricing | Competitive? Too high/low? |

**Output**:
```json
{
  "score": 72,
  "suggestions": [
    {
      "section": "title",
      "severity": "high",
      "message": "أضف تخصصك الرئيسي للعنوان. مثلاً: 'Full Stack React & Node.js Developer'",
      "current": "Developer",
      "suggested": "Full Stack React & Node.js Developer"
    },
    {
      "section": "bio",
      "severity": "medium",
      "message": "أضف إنجازات محددة مع أرقام. مثلاً: 'طورت 12 موقعاً إلكترونياً'",
      "current": "أنا مطور ويب...",
      "suggested": "أنا مطور Full Stack بخبرة 3 سنوات، طورت 12 مشروعاً ناجحاً..."
    },
    {
      "section": "skills",
      "severity": "low",
      "message": "أضف TypeScript وNext.js لقائمة مهاراتك - مطلوبان بكثرة",
      "suggestedSkills": ["TypeScript", "Next.js"]
    }
  ],
  "profileStrength": "جيد - يمكن تحسينه"
}
```

---

### 3. Freelancer Recommendations (for Clients)

**Purpose**: اقتراح أفضل المستقلين لمشروع معين.

**Algorithm**: Hybrid (Content-based + Collaborative Filtering)

**Content-based** (80% weight):
```sql
-- Match freelancer skills with project required skills
-- Match freelancer experience level with project level
-- Match freelancer hourly rate with project budget
-- Match freelancer rating threshold
```

**Collaborative** (20% weight):
```sql
-- Freelancers who completed similar projects
-- Clients with similar hiring patterns
```

**Implementation**:
```typescript
async recommendFreelancers(projectId: string, limit = 10): Promise<RecommendedFreelancer[]> {
  const project = await this.projectRepo.findById(projectId);
  
  // Step 1: Get project embeddings
  const projectEmbedding = await this.embeddingsService.embed(project.description);
  
  // Step 2: Semantic search over freelancer profiles
  const semanticMatches = await this.vectorSearch(
    'freelancer_profiles',
    projectEmbedding,
    limit * 2
  );
  
  // Step 3: Score with rules-based filtering
  const scored = semanticMatches
    .filter(f => this.meetsCriteria(f, project))
    .map(f => ({
      ...f,
      matchScore: this.calculateMatchScore(f, project)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
  
  return scored;
}
```

---

### 4. Project Recommendations (for Freelancers)

**Purpose**: اقتراح مشاريع مناسبة للمستقل.

**Algorithm**: Same hybrid approach but reversed.

**Input**: Freelancer profile + history.

```sql
SELECT p.*, 
  calc_match_score(p, freelancer_profile) as match_score
FROM projects p
WHERE p.status = 'OPEN'
  AND p.created_at > NOW() - INTERVAL '30 days'
ORDER BY match_score DESC
LIMIT 20;
```

**Match Score Formula**:
```
matchScore = (skillMatch * 0.5) 
           + (budgetMatch * 0.2) 
           + (experienceMatch * 0.15) 
           + (clientRating * 0.1) 
           + (categoryMatch * 0.05)
```

---

### 5. Project Analysis

**Purpose**: تحليل المشروع وتقديم نصائح للعميل.

**Input**: Project description + category + budget.

**Output**:
```json
{
  "completeness": 85,
  "missingFields": ["مدة المشروع", "مستوى الخبرة المطلوب"],
  "suggestions": [
    {
      "type": "description",
      "message": "أضف متطلبات تقنية محددة لتستقبل عروضاً أدق",
      "importance": "high"
    },
    {
      "type": "budget",
      "message": "الميزانية المقترحة ($500-1000) مناسبة لمشاريع React المماثلة",
      "importance": "info"
    }
  ],
  "estimatedProposals": "8-15",
  "estimatedTimeToFirstProposal": "2-4 ساعات"
}
```

---

### 6. Fraud Detection System

**Purpose**: كشف المشاريع والحسابات الاحتيالية.

**Layers**:
```
1. Rules Engine (fast, deterministic)
   └── Suspicious patterns: impossible budget, copy-paste descriptions

2. ML Model (GPT-4o-mini classification)
   └── Contextual analysis: scam language patterns

3. Behavioral Analysis
   └── User behavior anomalies: rapid posting, multiple accounts

4. Manual Review Queue
   └── Flagged items for admin review
```

**Rules Engine**:
```typescript
fraudRules = [
  { check: 'budget_too_high_for_project', weight: 0.3 },
  { check: 'duplicate_description', weight: 0.4 },
  { check: 'new_user_with_high_value_project', weight: 0.3 },
  { check: 'suspicious_email_domain', weight: 0.2 },
  { check: 'copy_paste_proposal', weight: 0.5 },
  { check: 'too_many_projects_in_short_time', weight: 0.4 },
  { check: 'impossible_claims', weight: 0.6 },  // "I can build Facebook in 1 day"
]

// Score > 0.7 → auto-block
// Score > 0.4 → flag for manual review
// Score < 0.4 → allow
```

**Implementation**:
```typescript
async checkFraud(entity: Project | User | Proposal): Promise<FraudResult> {
  const ruleScore = this.applyRules(entity);
  const aiScore = await this.aiFraudCheck(entity);
  const combinedScore = (ruleScore * 0.6) + (aiScore * 0.4);
  
  if (combinedScore > 0.7) return { status: 'BLOCKED', score: combinedScore, reasons };
  if (combinedScore > 0.4) return { status: 'FLAGGED', score: combinedScore, reasons };
  return { status: 'CLEAR', score: combinedScore };
}
```

---

### 7. Proposal Quality Scoring

**Purpose**: تقييم جودة العروض وتصنيفها.

**Criteria**:
| Criterion | Weight | Description |
|-----------|--------|-------------|
| Relevance | 30% | هل العرض يتعلق بالمشروع؟ |
| Completeness | 20% | هل يغطي جميع المتطلبات؟ |
| Professionalism | 20% | اللغة، التنسيق، التوقيع |
| Specificity | 15% | تفاصيل محددة vs كلام عام |
| Value Proposition | 15% | هل يشرح القيمة المضافة؟ |

**Output**:
```json
{
  "score": 88,
  "breakdown": {
    "relevance": 92,
    "completeness": 85,
    "professionalism": 90,
    "specificity": 80,
    "valueProposition": 88
  },
  "feedback": "عرض ممتاز! أضف مثالاً عن مشروع مشابه لتحسينه"
}
```

---

### 8. Skills Classification

**Purpose**: تصنيف المهارات وتوحيدها.

**Process**:
```
Input: "I know React, Node.js, and working with MongoDB"
                    ↓
AI Classification:
  - React → Web Development → Frontend
  - Node.js → Web Development → Backend
  - MongoDB → Database → NoSQL
                    ↓
Output: [{skill: "React", category: "Frontend", confidence: 0.98}, ...]
```

---

### 9. Auto Translation

**Purpose**: ترجمة المحتوى بين العربية والإنجليزية.

**Supported Languages (Phase 1)**:
- العربية ↔ English
- العربية ↔ Français (Phase 2)

**Content Types**:
| Type | When | Caching |
|------|------|---------|
| Project descriptions | On view | 24h |
| Proposals | On view | 24h |
| Messages | On send/receive | 1h |
| Reviews | On view | 24h |
| Profile bios | On view | 24h |

---

### 10. Chat Assistant (AI Support Bot)

**Purpose**: مساعدة المستخدمين في المنصة.

**Architecture**: GPT-4o-mini + RAG (Retrieval Augmented Generation)

**Knowledge Base**:
- FAQ documents
- Platform documentation
- Help articles
- Community guidelines

**Context**:
```json
{
  "userQuery": "كيف أستلم أموالي؟",
  "userContext": {
    "role": "freelancer",
    "hasCompletedProjects": true,
    "currentBalance": 500
  }
}
```

**Response**:
```json
{
  "answer": "لاستلام أموالك:\n1. اذهب إلى المحفظة\n2. اختر 'سحب'\n3. اختر وسيلة السحب\n4. أدخل المبلغ\n5. تأكيد\n\nسيتم التحويل خلال 3-5 أيام عمل.",
  "quickActions": [
    { "label": "فتح المحفظة", "action": "/wallet" },
    { "label": "إضافة وسيلة سحب", "action": "/wallet/accounts" },
    { "label": "التحدث مع الدعم", "action": "/support" }
  ],
  "helpful": true,
  "confidence": 0.95
}
```

---

### 11. Smart Search (NLP)

**Purpose**: بحث ذكي يفهم نية المستخدم.

**Implementation**:
```typescript
// 1. Query Understanding
// "مشاريع React بميزانية 1000 دولار"
// → intent: search_projects
// → filters: { skill: "React", budgetMax: 1000 }
// → vector: embedding of query

// 2. Hybrid Search
results = await Promise.all([
  vectorSearch(queryEmbedding, 50),    // Semantic
  fullTextSearch(query, 50),           // Keyword
  collaborativeFiltering(userId, 20)   // Personalization
]);

// 3. Merge & Rank
ranked = mergeAndRank(results, {
  semanticWeight: 0.4,
  keywordWeight: 0.3,
  personalizationWeight: 0.2,
  recencyWeight: 0.1
});
```

---

### 12. Recommendation Engine

**Purpose**: محرك التوصيات الشامل.

**Hybrid Approach**:

```
┌─────────────────────────────────────────────────────┐
│                   User Profile                       │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Skills       │  │ History      │  │ Rating   │  │
│  │ + Embeddings │  │ + Behavior   │  │ + Trust  │  │
│  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  │
│         │                 │                │        │
│  ┌──────┴─────────────────┴────────────────┴─────┐ │
│  │           Recommendation Scorer                │ │
│  │  Score = (Content*0.4) + (Collaborative*0.3)  │ │
│  │        + (Popularity*0.2) + (Recency*0.1)     │ │
│  └────────────────────┬──────────────────────────┘ │
│                       │                            │
│  ┌────────────────────▼──────────────────────────┐ │
│  │           Ranked Recommendations               │ │
│  │  1. Project A  (match: 95%)                    │ │
│  │  2. Project B  (match: 88%)                    │ │
│  │  3. Project C  (match: 82%)                    │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## AI Cost Analysis

| Feature | Tokens/Request | Cost/Request | Requests/Day (est.) | Daily Cost |
|---------|---------------|-------------|-------------------|-----------|
| Proposal Writer | 1,500 | $0.002 | 1,000 | $2.00 |
| Profile Suggestion | 800 | $0.001 | 200 | $0.20 |
| Recommendations | 0 (embeddings) | $0.0001 | 10,000 | $1.00 |
| Fraud Detection | 500 | $0.0007 | 500 | $0.35 |
| Quality Score | 400 | $0.0006 | 500 | $0.30 |
| Translation | 300 | $0.0004 | 2,000 | $0.80 |
| Chat Assistant | 400 | $0.0006 | 500 | $0.30 |
| Smart Search | 100 | $0.0001 | 5,000 | $0.50 |
| **Total** | | | **19,700** | **$5.45/day** |

**Monthly AI Cost**: ~$165 (at 30K RPM, using GPT-4o-mini at $0.15/M input tokens, $0.60/M output tokens)

---

## AI Performance & Optimization

| Strategy | Implementation | Impact |
|----------|---------------|--------|
| **Caching** | Redis cache for embeddings & translations | 60% fewer API calls |
| **Batching** | Process multiple items in single call | 40% cost reduction |
| **Model Selection** | GPT-4o-mini for most tasks (cheaper, faster) | 95% cost vs GPT-4 |
| **Streaming** | SSE streaming for long responses | Better UX |
| **Fallback** | Rule-based fallback when AI unavailable | 100% uptime |
| **Queue** | Bull queue for non-urgent AI tasks | Rate limit management |
| **Token Budget** | Max tokens per request capped | Predictable costs |
| **Prompt Optimization** | Shorter prompts, cached system prompts | 30% token reduction |

---

## AI Security & Ethics

| Concern | Mitigation |
|---------|-----------|
| **Prompt Injection** | Input sanitization, output validation |
| **PII Leakage** | Strip PII before sending to OpenAI |
| **Content Moderation** | OpenAI Moderation API check |
| **Bias** | Regular prompt audits, diverse training |
| **Hallucinations** | Fact-checking layer, disclaimer |
| **Rate Abuse** | Per-user rate limiting on AI endpoints |
| **Data Privacy** | No training on user data (Opt-Out) |
| **Transparency** | "AI-generated" label on AI content |
