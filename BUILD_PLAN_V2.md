# Uncommon Cents v2 Build Plan

## Current State (v1)
- 4 pages: home, learn (6 strategies), calculators (Roth + HSA), ask (AI coach)
- 6 strategies in `src/lib/strategies-data.ts` with deep content
- 2 calculators: Roth Conversion, HSA Growth
- AI coach using Claude API
- Design: Inter font, green accent, clean card-based UI, dark background

## V2 Vision
A comprehensive financial intelligence platform. Financial Wikipedia meets calculator engine, navigated by an AI coach that understands the user's situation. 13 knowledge domains, dozens of calculators, honest analysis of every financial product.

## Build Spec Location
Full spec (673 lines): `/tmp/uncommoncents_spec.txt` (converted from `/Users/joshhohenstein/Downloads/files-2/UncommonCents_Build_Spec_v2.docx`)

---

## Phase 1: Knowledge Domain System (Data Layer)

### New file: `src/lib/domains.ts`
Define 13 financial knowledge domains:
1. Tax-Advantaged Accounts (401k, Roth, HSA, 529, etc.)
2. Tax Optimization Strategies (bracket management, loss harvesting, etc.)
3. Equity Compensation (ISOs, RSUs, 83b, ESPP, etc.)
4. Real Estate Finance (rental analysis, 1031, BRRRR, etc.)
5. Business, Self-Employment and Entity Structures
6. Retirement Income Planning (SWR, SS optimization, RMDs, etc.)
7. Investing Concepts and Portfolio Construction
8. Estate Planning and Wealth Transfer
9. Insurance as a Financial Instrument (honest analysis)
10. Debt Strategy and Credit
11. Behavioral Finance
12. Income and Career Finance
13. International and Expat Finance

Each domain: `{ id, slug, name, description, icon, conceptCount }`

### New file: `src/lib/concepts.ts`
Concept entries with 3 depth layers:
```typescript
interface FinancialConcept {
  id: string;
  slug: string;
  domainId: string;
  name: string;
  summary: string;
  complexityMin: 1 | 2 | 3;
  hasCalculator: boolean;
  policyDependent: boolean;
  policySources?: { source: string; url: string; year: number }[];
  relatedConceptSlugs: string[];
  honestAnalysis?: string;
  layers: {
    accessible: string;
    intermediate: string;
    advanced: string;
  };
}
```

Priority concepts (at least 5-8 per domain, 80+ total):
- Domain 1: 401k, Roth 401k, Mega Backdoor Roth, Backdoor Roth IRA, HSA, 529, Solo 401k, SEP-IRA
- Domain 2: Tax bracket management, Roth conversion laddering, tax-loss harvesting, 0% LTCG, DAF bunching, QCD, IRMAA management
- Domain 3: ISOs, NSOs, RSUs, 83b election, ESPP, concentrated stock strategies
- Domain 4: Buy vs rent, rental property analysis, 1031 exchange, house hacking, BRRRR
- Domain 5: S-Corp optimization, entity selection, SE tax, business exit, home office
- Domain 6: Safe withdrawal rate, sequence of returns risk, SS claiming, RMDs, bucket strategy, annuity types
- Domain 7: Asset allocation, asset location, factor investing, direct indexing, bond strategies
- Domain 8: Gift tax, estate tax, step-up basis, buy-borrow-die, revocable trust, irrevocable trusts
- Domain 9: Term vs permanent life, IUL honest analysis, disability insurance, LTC insurance
- Domain 10: Debt avalanche vs snowball, mortgage vs invest, student loans, credit optimization
- Domain 11: Loss aversion, recency bias, mental accounting, overconfidence, DCA vs lump sum
- Domain 12: Total comp analysis, negotiation value, freelance rate setting
- Domain 13: FEIE, foreign tax credit, FBAR/FATCA

### New file: `src/lib/policy-data.ts`
IRS/regulatory limits with source citations:
```typescript
interface PolicyLimit {
  id: string;
  conceptSlug: string;
  name: string;
  value: number | string;
  year: number;
  jurisdiction: 'US';
  source: string;
  sourceUrl: string;
  lastVerified: string;
}
```
2025 limits for all tax-advantaged accounts, contribution limits, income thresholds, etc.

---

## Phase 2: Calculator Expansion

### Keep existing calculators, add 15+ more:
1. **401k Contribution Optimizer** - maximize match, Roth vs traditional by bracket
2. **Mega Backdoor Roth Calculator** - capacity by plan type
3. **Backdoor Roth Pro-Rata Calculator** - impact of existing IRA balances
4. **Tax Bracket Fill Analyzer** - optimal Roth conversion by bracket
5. **Tax-Loss Harvesting Benefit Calculator** - offset value by bracket
6. **0% LTCG Opportunity Calculator** - by income situation
7. **DAF Bunching Optimizer** - itemize vs standard deduction analysis
8. **ISO AMT Impact Calculator** - exercise timing analysis
9. **RSU Tax Withholding Gap Calculator** - supplemental rate vs marginal
10. **S-Corp vs Sole Prop Comparison** - by income level
11. **Rental Property Analyzer** - full return decomposition
12. **Social Security Claiming Optimizer** - break-even by age
13. **RMD Calculator** - by age and balance
14. **IRMAA Threshold Tracker** - income management
15. **Buy vs Rent Break-Even** - full cost accounting
16. **Debt Payoff Optimizer** - avalanche vs snowball comparison
17. **Freelance Rate Calculator** - fully-loaded hourly rate

Each calculator: form inputs with labels, policy source display, sensitivity sliders, save scenario, export.

### New file: `src/lib/calculators.ts`
Calculator configs with input/output field definitions, formulas, policy limit references.

---

## Phase 3: New Pages

### `/explore` page -> Domain Explorer
- Grid of 13 domains with icons, concept counts
- Click domain -> filtered concept list
- Search bar with fuzzy search across all concepts
- Filter by: has_calculator, complexity, policy_dependent

### New: `/concepts/[slug]` page -> Concept Detail
- Three-tab depth: Accessible / Intermediate / Advanced
- Related concepts grid
- Calculator link if applicable
- Policy sources if policy_dependent
- Honest Analysis section
- "Ask the coach about this" button

### `/calculators` page rewrite -> Calculator Hub
- Grouped by domain
- Recently used at top
- Search
- Each shows: name, one-line purpose, associated concept link

### Calculator detail pages -> Standard layout
- Calculator name + context + concept link
- Input fields with labels, info icons, defaults
- Policy source for regulatory inputs
- Primary output prominent, secondary below
- Sensitivity sliders for live updates
- Save Scenario button
- "Ask the coach about this result" button

### `/learn` page -> redirect to `/explore` or keep as curated strategy overviews

### `/ask` page upgrade -> AI Coach
- Situation awareness from onboarding profile
- Concept chips in responses (link to concept detail)
- Calculator chips (link to calculator pre-filled)
- "Show my assumptions" expandable
- Advice boundary handling

### New: `/onboarding` page -> Situation Calibration
- Employment type (W-2, self-employed, business owner, student, retired)
- Benefits access (401k, HSA, stock options, pension)
- Life stage (building foundation, mid-career, pre-retirement, retired)
- Income range (as tax brackets)
- Country
- Goals (tax reduction, retirement, real estate, business, estate, investing)
- Store in localStorage

### Update home page
- Personalized feed based on onboarding profile
- Timely alerts (IRS limit updates, tax deadlines, open enrollment)
- Recently viewed concepts
- Domain preview cards
- Calculator highlights

---

## Phase 4: Enhanced AI Coach

### Update system prompt
- Inject user situation profile
- Inject relevant concept summaries as retrieval context
- Add concept chip format instructions
- Add calculator chip format instructions
- Add advice boundary rules (never recommend specific securities/funds)
- Add "show assumptions" data
- Add quantitative claim awareness (reference policy data)

### Advice boundary handling
- Security recommendation -> explain category, not specific
- Tax advice specific -> framework + CPA questions
- Legal advice -> framework + attorney questions

---

## Phase 5: Content Build

### Expand strategies-data.ts -> concepts.ts
- Convert existing 6 strategies to concept format with 3 depth layers
- Add 74+ new concepts across 13 domains
- Write all depth layers (accessible 150w, intermediate 300-500w, advanced 500-1000w)
- Add honest analysis notes for insurance products, annuities, etc.
- Cross-link all related concepts

### Build policy data
- All 2025 IRS limits with source URLs
- Contribution limits for all account types
- Income thresholds and phaseouts
- IRMAA brackets
- Gift/estate tax exemptions

---

## Phase 6: Polish and Deploy

### Compliance
- Disclaimer on every page footer: "Educational content only. Not financial, tax, or legal advice."
- Disclaimer on coach screen
- Disclaimer on every calculator result
- No specific security/fund recommendations anywhere

### Mobile-first responsive
- All new pages mobile-optimized
- Calculator inputs touch-friendly
- Domain grid responsive

### Deploy
- Vercel deployment
- Push to GitHub
- Update josh-hub project card

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/domains.ts` | NEW - 13 domain definitions |
| `src/lib/concepts.ts` | NEW - 80+ concepts with 3 depth layers |
| `src/lib/policy-data.ts` | NEW - IRS limits with sources |
| `src/lib/calculators.ts` | NEW - Calculator configs |
| `src/lib/search.ts` | NEW - Client-side fuzzy search |
| `src/app/page.tsx` | UPDATE - Personalized home |
| `src/app/explore/page.tsx` | NEW - Domain explorer (replace learn?) |
| `src/app/concepts/[slug]/page.tsx` | NEW - Concept detail |
| `src/app/calculators/page.tsx` | UPDATE - Calculator hub |
| `src/app/calculators/[slug]/page.tsx` | NEW - Individual calculator |
| `src/app/ask/page.tsx` | UPDATE - Coach with chips |
| `src/app/onboarding/page.tsx` | NEW - Situation calibration |
| `src/components/nav.tsx` | UPDATE - New routes |
| `src/components/concept-chip.tsx` | NEW |
| `src/components/calculator-chip.tsx` | NEW |
| `src/components/policy-source.tsx` | NEW |
| `src/lib/system-prompt.ts` | UPDATE (or create) - Full coach context |
| `src/app/layout.tsx` | UPDATE |
| `src/app/globals.css` | UPDATE |
