# Origo Matching & Engagement Engine v1 — Launch Spec

**Audience**: Engineering (Backend / Recommendation)
**Status**: Launch-Critical

---

## 1. What We Are Building (Alignment)

Origo is a campus‑first social discovery & relationship facilitation platform.

*   **We are NOT optimizing for**:
    *   Infinite scrolling
    *   Swipe volume
    *   Vanity metrics
*   **We ARE optimizing for**:
    *   Conversations started
    *   Conversations sustained
    *   Trust, comfort, and contextual relevance

**Dating is treated as a high‑stakes, stricter mode of the same system.**

---

## 2. Core Design Principles (Non‑Negotiable)

1.  **Quality > Quantity**
2.  **Explainability > Black‑box accuracy**
3.  **Learning > Fancy ML**
4.  **Predictable behavior > Aggressive optimization**
5.  **Ship → Learn → Improve**

---

## 3. System Architecture

User Signals
→ Candidate Generation (Rules)
→ Feature Engineering (Pairwise)
→ Scoring & Ranking
→ Constraints & Safety
→ Presentation & Hooks
→ Feedback Logging
→ Analytics & Iteration

---

## 4. Modes (Same Engine, Different Configs)

### Dating Mode:
*   **Daily matches**: 3–5
*   **Exploration**: ≤ 15%
*   **Filters**: Strong mutual intent
*   **Pacing**: Slower

### Social Mode:
*   **Daily matches**: 8–12
*   **Exploration**: ≤ 30%
*   **Filters**: Softer
*   **Novelty**: Higher

---

## 5. Candidate Generation (Rules Only)

*   Same campus
*   Matching intent
*   Active recently
*   Hard preferences respected
*   Exclude recently seen users

**Implementation**:
*   **SQL‑first**
*   Indexed queries
*   ~200 candidates per run

---

## 6. Feature Engineering (Pairwise)

All features must be explicit, interpretable, and logged:
*   Interest similarity (cosine/jaccard)
*   Community overlap
*   Personality alignment
*   Availability overlap
*   Activity score
*   Freshness

---

## 7. Scoring & Ranking (v1)

```
score =
  w1 * interest_similarity +
  w2 * community_overlap +
  w3 * personality_alignment +
  w4 * activity_score +
  w5 * freshness
```
*Weights configurable per mode.*

---

## 8. Constraints & Safety Layer (Applied after ranking)

*   Diversity enforcement
*   Freshness constraints
*   Popularity bias control
*   Safety exclusions

---

## 9. Presentation & Engagement Hooks

### Launch‑Day Hooks:
*   **Daily discovery limit**
*   **“Why this match?” explainability**
*   **First‑message prompts**

### Retention Hooks:
*   Weekly recap (connections, communities)
*   Preference nudges (“More like this?”)
*   Learning transparency messages

---

## 10. Feedback Logging (Critical)

**Log all**:
*   Profile views
*   Likes / Skips
*   Messages sent
*   Replies received
*   Conversation duration

---

## 11. Personalization

*   **Immediate**: Boost engaged features, De‑weight ignored features
*   **Short‑Term**: User bias terms, Time‑of‑day preference tuning
*   **Post‑Launch**: Offline logistic regression, Weekly retraining

---

## 12. Analytics & Metrics

*   **Core**: Conversations per user, Reply rate, D1 / D7 retention
*   **Supporting**: Profile completion, Match engagement
*   **Safety**: Blocks, Reports

---

## 13. What NOT to Build Before Launch

*   ❌ Deep learning
*   ❌ Embeddings / vector DBs
*   ❌ Kafka / Redis
*   ❌ Real‑time ML
*   ❌ Infinite swipe feeds

---

## 14. Launch Checklist (Engineer‑Facing)

### A. Must‑Have:
*   [ ] Onboarding flow complete
*   [ ] Candidate filtering implemented
*   [ ] Pairwise feature computation
*   [ ] Feature‑based ranking pipeline
*   [ ] Dating vs Social configs
*   [ ] Constraints layer active
*   [ ] Explainability strings returned
*   [ ] Feedback logging wired
*   [ ] Basic analytics available

### B. Should‑Have:
*   [ ] Weekly recap logic
*   [ ] Preference nudges
*   [ ] Per‑user weight tuning
*   [ ] Cold‑start fallback

### C. Explicitly REMOVE / AVOID:
*   [ ] No neural networks
*   [ ] No embeddings
*   [ ] No Kafka / Redis
*   [ ] No real‑time ML
*   [ ] No infinite feeds

### D. Change from Pitch MVP:
*   [ ] Replace hard rules with features
*   [ ] Limit daily matches
*   [ ] Add diversity & freshness
*   [ ] Log all interactions
*   [ ] Make ranking explainable

---

## 15. Post‑Launch Roadmap

*   **Week 1–2**: Monitor metrics, Manual tuning
*   **Week 3–4**: Offline learning, Better personalization
*   **Later**: Embeddings only if scale demands
