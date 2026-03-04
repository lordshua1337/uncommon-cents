# Uncommon Cents — Expansion Pack Specification

---

## ⚠️ CRITICAL: BUILD RULES — READ BEFORE DOING ANYTHING

**This is an EXPANSION PACK. It ADDS to the existing Uncommon Cents application. It does NOT replace anything.**

- **DO NOT** delete, overwrite, replace, or refactor any existing code, components, data, routes, or styles.
- **DO NOT** restructure the existing 12-category card system. It stays exactly as-is.
- **DO NOT** rename, reorganize, or "improve" existing files, directories, or architecture.
- **DO** add new modules, components, data files, and routes that integrate with the existing structure.
- **DO** extend existing interfaces/types where needed — append to them, never rewrite them.
- **DO** use the existing navigation, styling, and component patterns already in the codebase as your guide for how new content should look and behave.
- **If something in this spec conflicts with existing implementation decisions, the existing implementation wins.** Ask before overriding.

**Integration approach:**
1. Read and understand the existing codebase FIRST before writing anything.
2. Identify the existing data models, component patterns, routing, and state management.
3. Add expansion pack content using those same patterns.
4. New modules (Money Scripts, Fraud Defenses, Operating Loop) should plug into the existing navigation — not live in a parallel universe.
5. Each of the 12 new strategy cards maps to an EXISTING category by `categoryId`. They are additions to those categories, not replacements for existing content in them.

---

## PURPOSE

This spec defines content and structure for the **Expansion Pack** module of the Uncommon Cents app. It contains two payloads:

1. **12 Ultra-Uncommon Wealth Strategies** (one per existing card category)
2. **10 AI-Era Fraud Defenses**

Plus a **behavioral foundation layer** (Money Scripts) that contextualizes everything.

Claude Code: implement exactly what's specified. Don't improvise structure. Don't summarize. Every field below is intentional.

---

## ARCHITECTURE CONTEXT

The Uncommon Cents app uses 12 card categories. This expansion pack adds one "advanced play" card to each category, plus a 10-item fraud defense module, plus a behavioral self-assessment layer. All content is AI-navigable — users explore via conversation, not linear reading.

---

## MODULE 1: BEHAVIORAL FOUNDATION — MONEY SCRIPTS

### Purpose
This module surfaces BEFORE the strategies. It's the "operating system check" — users need to understand their behavioral wiring before strategies make sense.

### Data Model: `MoneyScriptAssessment`

```typescript
interface MoneyScriptAssessment {
  id: string; // "money-scripts"
  title: "The Money Operating System You Inherited";
  subtitle: "Your financial behavior is shaped by scripts formed in childhood that operate largely outside awareness.";
  
  researchContext: {
    keyFinding: "Financial socialization during childhood lays a foundation associated with later financial behavior and well-being.";
    earlyFormation: "Children's money habits may form as early as age 7. Children as young as 5 show distinct tightwad vs spendthrift tendencies that predict real spending behavior.";
    source: "Klontz et al., Financial Planning Association; OECD; Michigan Ross";
  };
  
  scripts: MoneyScript[];
  counterMoves: ScriptCounterMove[];
  trackingChallenge: TrackingChallenge;
}
```

### The Four Money Scripts

```typescript
interface MoneyScript {
  id: string;
  name: string;
  triggerPhrase: string; // The gut-check self-read prompt
  association: "destructive" | "protective";
  description: string;
  riskPattern: string;
}
```

| id | name | triggerPhrase | association | riskPattern |
|----|------|--------------|-------------|-------------|
| `avoidance` | Money Avoidance | "Rich people are greedy" / "Money corrupts" / "I don't deserve it" | destructive | Avoidance → binge spending → shame → denial cycle. Can coexist with worship/status beliefs creating whiplash patterns. |
| `worship` | Money Worship | "More money will finally make me feel safe/happy" | destructive | Endless accumulation without satisfaction. Lower net worth paradox — the pursuit undermines the goal. |
| `status` | Money Status | "I need the newest/best to feel legit" | destructive | Higher revolving credit balances. External validation drives spending beyond means. |
| `vigilance` | Money Vigilance | "Save, stay discreet, prepare" | protective | Generally protective UNLESS it becomes chronic anxiety. Then it flips to deprivation backlash. |

### Counter-Moves (Script → Intervention Pairing)

```typescript
interface ScriptCounterMove {
  scriptId: string;
  intervention: string;
  mechanism: string;
}
```

| scriptId | intervention | mechanism |
|----------|-------------|-----------|
| `avoidance` | Automation + forced visibility | Alerts, calendar money dates. Remove the option to not-look. |
| `worship` | "Enough number" + debt kill rules | Define a concrete target. "More" is infinite — cap it. |
| `status` | Pre-commitment budgets + friction | Wishlist delay rules. 72-hour purchase delays on non-essentials. |
| `vigilance` | Permission to enjoy within guardrails | Structured "fun money" allocation so vigilance doesn't become deprivation backlash. |

### 30-Day Tracking Challenge

```typescript
interface TrackingChallenge {
  instruction: "Every time you spend, avoid, or panic-check accounts, write the 5-word thought that preceded it.";
  purpose: "That's your money script showing itself. Making these beliefs conscious is the entry point to challenging and changing them.";
  duration: 30; // days
}
```

---

## MODULE 2: THE TWELVE ULTRA-UNCOMMON STRATEGIES

### Data Model: `ExpansionCard`

```typescript
interface ExpansionCard {
  id: string;
  categoryId: string; // Maps to existing 12-category system
  number: number; // 1-12
  title: string;
  tagline: string; // One-line hook
  
  coreMechanic: string; // What the actual rule/edge is
  whyUncommon: string; // Why most people miss this
  executionNotes: string[]; // Step-level guidance
  failureMode: string; // How this goes wrong
  
  legalBasis: LegalReference[];
  behavioralLink?: string; // Which money script this interacts with
}

interface LegalReference {
  authority: string; // IRS, SEC, SSA, FTC, etc.
  reference: string; // Notice 2014-54, IRC §1202, etc.
  url: string;
}
```

---

### Card 1: Tax Accounts

```yaml
id: mega-backdoor-roth
categoryId: tax-accounts
number: 1
title: "Mega Backdoor Roth via After-Tax Split Rollover"
tagline: "The hidden trapdoor inside some 401(k) plans."

coreMechanic: |
  If your 401(k) allows after-tax employee contributions AND either in-plan 
  Roth conversions or in-service distributions, you can move after-tax 
  contributions into Roth space — accelerating tax-free compounding beyond 
  normal Roth contribution limits.

whyUncommon: |
  Requires specific plan features most people never check for. The mechanics 
  are picky — that's exactly why they're powerful.

executionNotes:
  - Confirm your plan allows after-tax (non-Roth) employee contributions
  - Confirm your plan allows in-plan Roth conversions OR in-service distributions
  - Allocate pre-tax amounts to traditional IRA/plan, after-tax amounts to Roth IRA
  - Execute promptly to minimize earnings on after-tax amounts (earnings are pre-tax)

failureMode: |
  If your plan doesn't support the right features, you can't force this. 
  Sloppy execution can accidentally convert earnings (pre-tax) into taxable income.

legalBasis:
  - authority: IRS
    reference: "Notice 2014-54 — Rollovers to multiple destinations"
    url: "https://www.irs.gov/retirement-plans/rollovers-of-after-tax-contributions-in-retirement-plans"

behavioralLink: "Money vigilance types execute this well. Money avoiders never check their plan documents."
```

---

### Card 2: Tax Strategy

```yaml
id: basis-reset-year
categoryId: tax-strategy
number: 2
title: "The Basis Reset Year"
tagline: "Tax-gain harvesting + wash-sale-safe loss harvesting, timed to life transitions."

coreMechanic: |
  Intentionally create a year where you harvest gains at low rates and harvest 
  losses where appropriate, without wash-sale violations. Convert life 
  transitions (job change, sabbatical, early retirement gap) into permanent 
  tax advantage through cost-basis resets.

whyUncommon: |
  Most people think tax moves happen in April. The real game is annual income 
  shaping — choosing WHEN to realize gains, WHEN to realize losses, and WHEN 
  to reset cost basis so future taxes shrink.

executionNotes:
  - Capital losses offset gains; excess losses deduct up to $3,000/year against ordinary income, remainder carries forward
  - Wash-sale rule disallows loss deductions if you repurchase "substantially identical" securities within 30-day window
  - Target low-income years (job transition, sabbatical, consulting year, partial retirement) for gain harvesting at lower brackets
  - Pair with Roth conversions in the same window year for compounding benefit

failureMode: |
  Wash-sale violations from repurchasing too soon. Also: harvesting gains in a 
  year that isn't actually low-income (surprise bonus, severance timing, etc.).

legalBasis:
  - authority: IRS
    reference: "Topic 409 — Capital Gains and Losses"
    url: "https://www.irs.gov/taxtopics/tc409"
  - authority: SEC/IRS
    reference: "Wash Sale Rules"
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/wash-sales"

behavioralLink: "Requires vigilance-level tracking. Worship types may resist 'leaving money on the table' to harvest losses."
```

---

### Card 3: Equity Comp

```yaml
id: startup-tax-geometry
categoryId: equity-comp
number: 3
title: "Startup Tax Geometry"
tagline: "83(b) + QSBS + ISO/AMT awareness — or taxes will clown you in 4K."

coreMechanic: |
  Treat startup equity as a portfolio of options with distinct tax regimes. 
  Build a decision tree across three rule systems: 83(b) elections, ISO/AMT 
  exposure, and QSBS eligibility.

whyUncommon: |
  The uncommon play isn't "exercise early." It's building a decision tree that 
  maps when to file 83(b), when to exercise ISOs, how to manage AMT exposure, 
  and how to preserve QSBS eligibility simultaneously.

executionNotes:
  - 83(b) elections MUST be filed within 30 days of property transfer — miss it and the election is void
  - ISOs can trigger AMT at exercise even when regular taxable income isn't recognized
  - QSBS (IRC §1202) can allow 100% exclusion for qualifying stock acquired after Sept 27, 2010, subject to holding period and corporate eligibility
  - Map all three rule systems before making any exercise decisions

failureMode: |
  Missing the 30-day 83(b) window. Triggering unexpected AMT liability. 
  Inadvertently disqualifying QSBS through corporate structure changes.

legalBasis:
  - authority: IRS
    reference: "83(b) Election — Form 15620"
    url: "https://www.irs.gov/pub/irs-pdf/f15620.pdf"
  - authority: IRS
    reference: "Topic 427 — Stock Options"
    url: "https://www.irs.gov/taxtopics/tc427"
  - authority: IRS
    reference: "IRC §1202 — QSBS"
    url: "https://www.irs.gov/pub/irs-wd/202418001.pdf"
```

---

### Card 4: Real Estate

```yaml
id: 14-day-rule
categoryId: real-estate
number: 4
title: "The 14-Day Rule (Done Right)"
tagline: "Your home as a high-demand micro-asset — with documentation that survives scrutiny."

coreMechanic: |
  IRS Pub 527: If you rent property you also use as your home for fewer than 
  15 days/year, you generally don't include the rent in income (with limits on 
  related expense deductions). Use your home selectively for high-demand events, 
  peak weeks, or legitimate business meetings.

whyUncommon: |
  Everyone's heard of the "Augusta Rule." Almost nobody executes it with 
  defensible pricing and documentation-grade records.

executionNotes:
  - Must be property you also use as your home
  - Fewer than 15 rental days per year
  - Pricing must be defensible (comparable market rates for similar properties)
  - If a business claims the deduction, "ordinary and necessary" expense rules apply
  - IRS expects records that clearly support income and deductions — that's not optional

failureMode: |
  Greed, sloppiness, or both. Inflated pricing without comparables. No records. 
  The IRS literally tells you to keep records to prove deductions.

legalBasis:
  - authority: IRS
    reference: "Publication 527 — Residential Rental Property"
    url: "https://www.irs.gov/pub/irs-pdf/p527.pdf"
  - authority: USC
    reference: "26 USC §280A"
    url: "https://www.law.cornell.edu/uscode/text/26/280A"
  - authority: IRS
    reference: "Recordkeeping Requirements"
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep"
```

---

### Card 5: Business

```yaml
id: plan-turbo-stack
categoryId: business
number: 5
title: "Solo 401(k) + Defined Benefit Plan Turbo Stack"
tagline: "Stack a defined contribution plan with a defined benefit plan for maximum tax-deferred savings."

coreMechanic: |
  For self-employed/owner-operators with high, stable income: combine a solo 
  401(k) (defined contribution) with a cash balance or traditional defined 
  benefit plan. DB plans support large contributions based on actuarial 
  assumptions — the combination creates a high-powered tax-deferred engine.

whyUncommon: |
  Most small business owners do nothing or open a SEP and call it a day. The 
  existence of cash balance plans isn't secret — the owner-operator stacking 
  move is what's uncommon.

executionNotes:
  - Requires stable, high income to justify DB plan contributions
  - DB contributions are based on actuarial calculations — need a plan actuary
  - Solo 401(k) handles the DC side with both employee and employer contributions
  - Combined limits far exceed what either plan allows alone
  - IRS outlines available retirement plan types for self-employed people

failureMode: |
  Income volatility kills this. If income drops, DB plan funding requirements 
  don't — you're locked into actuarially required contributions.

legalBasis:
  - authority: IRS
    reference: "Defined Benefit Plan Limits"
    url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-defined-benefit-plan-benefit-limits"
  - authority: IRS
    reference: "Retirement Plans for Self-Employed People"
    url: "https://www.irs.gov/retirement-plans/retirement-plans-for-self-employed-people"
```

---

### Card 6: Retirement

```yaml
id: ss-delayed-claiming
categoryId: retirement
number: 6
title: "Social Security Delayed Claiming as Longevity Insurance"
tagline: "Build a bridge plan to delay benefits — convert part of your portfolio into a stronger income floor."

coreMechanic: |
  SSA is explicit: benefits increase for each month you delay beyond full 
  retirement age, stopping at 70. Treat this as an inflation-adjusted lifetime 
  income lever. Build a "bridge plan" (taxable asset drawdown, part-time work, 
  planned withdrawals) to fund the delay period.

whyUncommon: |
  This isn't just "maximize benefits." It's "reduce the risk of outliving your 
  money by converting part of your retirement plan into a stronger floor." 
  Most people claim early because the math feels free.

executionNotes:
  - Each month of delay past full retirement age increases benefit permanently
  - Increase stops at age 70 — no benefit to delaying further
  - Build cashflow bridge from taxable accounts, part-time income, or planned withdrawals
  - Pairs well with Roth conversion window during bridge years (low-income years)

failureMode: |
  Health issues that shorten expected lifespan change the math. Also: running 
  out of bridge funding and being forced to claim early anyway.

legalBasis:
  - authority: SSA
    reference: "Delayed Retirement Credits"
    url: "https://www.ssa.gov/benefits/retirement/planner/delayret.html"

behavioralLink: "Money worship types over-optimize the math and forget the human risk. Avoidance types claim early to stop thinking about it."
```

---

### Card 7: Investing

```yaml
id: tax-alpha-engine
categoryId: investing
number: 7
title: "Tax Alpha Engine"
tagline: "Direct-indexing mindset + wash-sale discipline + fee obsession."

coreMechanic: |
  After-tax returns are what pay for your life. Fees and taxes are controllable 
  to a painful extent. Run a system of disciplined rebalancing, loss harvesting 
  with wash-sale controls, and relentless fee minimization.

whyUncommon: |
  Most investing advice is "pick good funds." The uncommon edge is understanding 
  that tax drag and fee drag are the two largest controllable leaks in a portfolio.

executionNotes:
  - Fees compound against you — SEC warns of major long-term impact
  - Capital loss deduction and carryforward rules are explicit (up to $3K/year + unlimited carryforward)
  - Wash-sale 30-day "substantially identical" rule is the tripwire
  - Even without true direct indexing, run tax-aware rebalancing and harvesting
  - Track cost basis at the lot level, not just the position level

failureMode: |
  Wash-sale violations. Over-trading in pursuit of tax losses (trading costs 
  exceed tax benefit). Ignoring fees on "good" funds.

legalBasis:
  - authority: SEC
    reference: "Investor Bulletin — Fees and Expenses"
    url: "https://www.sec.gov/investor/alerts/ib_fees_expenses.pdf"
  - authority: IRS
    reference: "Publication 550 — Investment Income and Expenses"
    url: "https://www.irs.gov/pub/irs-pdf/p550.pdf"
  - authority: IRS
    reference: "Topic 409 — Capital Gains and Losses"
    url: "https://www.irs.gov/taxtopics/tc409"

behavioralLink: "Status types chase performance and ignore fees. Vigilance types execute this naturally."
```

---

### Card 8: Estate Planning

```yaml
id: 529-estate-freeze
categoryId: estate-planning
number: 8
title: "529 Estate Freeze via 5-Year Election"
tagline: "Move assets out of your estate faster through the gift-tax framework while funding education."

coreMechanic: |
  IRS Form 709 special rule: you can elect under §529(c)(2)(B) to treat certain 
  transfers to a qualified tuition program as made ratably over a 5-year period. 
  This lets you front-load 5 years of gift-tax-excluded contributions in one shot.

whyUncommon: |
  It's literally in the IRS paperwork. Most people never read Form 709 
  instructions. This is an "it's in the manual" strategy.

executionNotes:
  - Election is made on Form 709 (gift tax return)
  - Contribution is treated as spread over 5 calendar years for gift tax purposes
  - Moves assets out of estate while funding education with long compounding runway
  - If contributor dies within the 5-year period, proportional amount comes back into estate
  - Can be done for multiple beneficiaries

failureMode: |
  Contributor dying within the 5-year window partially unwinds the estate benefit. 
  Also: overfunding 529s relative to actual education needs (though Secure 2.0 
  added Roth rollover option for excess).

legalBasis:
  - authority: IRS
    reference: "Form 709 — Gift Tax Return"
    url: "https://www.irs.gov/pub/irs-pdf/f709.pdf"
```

---

### Card 9: Insurance

```yaml
id: liability-income-barbell
categoryId: insurance
number: 9
title: "Liability + Income Protection Barbell"
tagline: "Insure catastrophic risks that can permanently derail wealth creation."

coreMechanic: |
  Stop thinking of insurance as an investment. Use the barbell model: umbrella 
  liability (extends coverage above home/auto limits) on one end, disability 
  insurance (protects income) on the other. These are the two catastrophic risks 
  most wealth-builders ignore.

whyUncommon: |
  Insurance gets sold like an investment. The correct model is: insure 
  catastrophic risks, self-insure small risks. Most "financial freedom" plans 
  ignore income protection until the first injury or burnout event.

executionNotes:
  - Umbrella liability extends coverage beyond home/auto/renters policy limits
  - Disability insurance protects income — distinguish "own occupation" vs "any gainful employment" definitions
  - Treat future income like a bond portfolio and insure it accordingly
  - Short-term vs long-term disability serve different functions

failureMode: |
  Buying investment-like insurance products (whole life, indexed universal) when 
  you need catastrophic coverage. Wrong disability definition that doesn't cover 
  your actual occupation.

legalBasis:
  - authority: NAIC
    reference: "Umbrella Policy Guide"
    url: "https://content.naic.org/article/whats-umbrella-policy"
  - authority: NAIC
    reference: "Disability Insurance Guide"
    url: "https://content.naic.org/article/consumer-insight-if-disability-were-keep-you-earning-living-how-would-you-pay-your-bills"
```

---

### Card 10: Debt

```yaml
id: debt-service-ratio-attack
categoryId: debt
number: 10
title: "Debt-Service Ratio Attack"
tagline: "Optimize mandatory payments, not just APR. Required payments are the measure of financial fragility."

coreMechanic: |
  The Fed defines household debt service ratio as total required payments ÷ 
  disposable income. Most people optimize for interest rate and ignore the 
  bigger constraint: mandatory payment burden. Restructure life to reduce 
  mandatory payments and make principal paydown the automated default.

whyUncommon: |
  Two compounding traps keep people stuck: (1) Credit card APRs averaged 25.2% 
  for general purpose and 31.3% for private label in 2024 with $160B in interest 
  charges. (2) Minimum payments act as behavioral anchors that prolong repayment.

executionNotes:
  - Calculate your debt service ratio (total required monthly payments ÷ monthly disposable income)
  - Restructure to reduce mandatory-payment-to-income ratio FIRST
  - Automate principal paydown above minimums as the default
  - Your investing capacity is what creates freedom — mandatory payments shrink it

failureMode: |
  Consolidating debt but then re-accumulating revolving balances (the avoidance → 
  binge cycle). Optimizing APR while leaving payment structure unchanged.

legalBasis:
  - authority: Federal Reserve Board
    reference: "Household Debt Service Ratio"
    url: "https://www.federalreserve.gov/releases/housedebt/about.htm"
  - authority: CFPB
    reference: "Consumer Credit Card Market Report 2025"
    url: "https://www.federalregister.gov/documents/2026/01/07/2026-00081/consumer-credit-card-market-report-of-the-consumer-financial-protection-bureau-2025"
  - authority: NBER
    reference: "Minimum Payment Anchoring Effects"
    url: "https://www.nber.org/system/files/working_papers/w22742/w22742.pdf"

behavioralLink: "Avoidance types don't calculate the ratio. Worship types justify debt as 'leverage.' Status types carry high minimums for lifestyle maintenance."
```

---

### Card 11: Behavior

```yaml
id: friction-protocol
categoryId: behavior
number: 11
title: "The Friction Protocol"
tagline: "Rules that override panic and dopamine. Treat your future panicked self as a predictable adversary."

coreMechanic: |
  Prospect theory (Kahneman & Tversky) shows humans don't treat gains and losses 
  symmetrically. Excessive trading among individual investors materially reduces 
  performance. Build commitment devices that make bad behavior hard when stress 
  is high.

whyUncommon: |
  Everyone knows "don't panic sell." Almost nobody builds a system that makes 
  panic selling structurally difficult. The protocol treats your future panicked 
  self as a predictable adversary, not as "you but irrational."

executionNotes:
  - 72-hour delay rule before any sell during drawdowns
  - Written "if-then" plan (e.g., "If portfolio down 15%, then review IPS, do not trade, rebalance only")
  - Account-level controls (trade password, device restrictions, advisor gate)
  - Pre-commit to rules BEFORE the stress event, not during it

failureMode: |
  Writing rules but building in easy overrides. The protocol only works if 
  future-you can't easily bypass it in the moment.

legalBasis:
  - authority: Academic
    reference: "Kahneman & Tversky — Prospect Theory"
    url: "https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_Tversky_1979_Prospect_theory.pdf"
  - authority: Academic
    reference: "Odean — Do Investors Trade Too Much?"
    url: "https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/doinvestors.pdf"

behavioralLink: "ALL scripts need this. Avoidance types freeze. Worship types chase. Status types panic-sell to protect image. Vigilance types over-monitor."
```

---

### Card 12: Career

```yaml
id: engineered-low-income-year
categoryId: career
number: 12
title: "Engineer a Low-Income Year Window on Purpose"
tagline: "The adult version of 'choose your battles' — use life transitions as tax optimization windows."

coreMechanic: |
  Many of the best tax moves (Roth conversions, basis resets, bracket 
  strategies) become dramatically more powerful in low-taxable-income years. 
  Engineer a planned window year — job transition, sabbatical, consulting 
  year, partial retirement — and stack multiple high-leverage moves in it.

whyUncommon: |
  This isn't quitting your job for vibes. It's treating career transitions as 
  strategic windows and running coordinated tax moves during the gap. Also 
  pairs with the finding that candidates are often more worried than they need 
  to be about jeopardizing an offer by negotiating.

executionNotes:
  - Plan the window year in advance (ideally 12+ months ahead)
  - Stack moves in the window: Roth conversions, gain harvesting, basis resets
  - IRS Form 8606 mechanics matter — year-end IRA balances affect taxable conversion amounts
  - Negotiate the next role from a position of preparation, not desperation
  - Use the window for professional development, not just tax moves

failureMode: |
  Unplanned income during the "low" year (severance timing, side income, 
  capital gains from a forced sale). Also: extending the window too long and 
  depleting reserves.

legalBasis:
  - authority: IRS
    reference: "Form 8606 — Nondeductible IRAs"
    url: "https://www.irs.gov/pub/irs-pdf/f8606.pdf"
  - authority: HBR
    reference: "Negotiation Research"
    url: "https://hbr.org/2024/05/research-negotiating-is-unlikely-to-jeopardize-your-job-offer"
```

---

## MODULE 3: AI-ERA FRAUD DEFENSES

### Context
FTC reported consumer fraud losses over $12.5B in 2024. FBI IC3 reported over $16B in internet crime losses. AI tools have accelerated impersonation — convincing voice/text no longer requires a skilled con artist.

### Design Principle
All defenses follow **blast-radius reduction**: assume breach happens, minimize damage per incident.

### Data Model: `FraudDefense`

```typescript
interface FraudDefense {
  id: string;
  number: number; // 1-10
  title: string;
  tagline: string;
  
  threat: string; // What attack this defends against
  action: string[]; // Concrete steps
  whyItWorks: string; // Mechanism
  
  regulatoryBasis: {
    authority: string;
    reference: string;
    url: string;
  }[];
}
```

---

### Defense 1: Credit Freeze

```yaml
id: credit-freeze
number: 1
title: "Freeze Your Credit, Not Your Lifestyle"
tagline: "Makes it harder for identity thieves to open new accounts in your name."

threat: "Identity theft via new account fraud"
action:
  - Freeze credit at all three bureaus (Equifax, Experian, TransUnion)
  - Keep PINs stored securely — you'll need them to temporarily lift for legitimate applications
  - Also freeze child credit files if applicable
whyItWorks: "Blocks the most common identity theft vector — fraudulent new account opening."

regulatoryBasis:
  - authority: FTC
    reference: "Credit Freezes and Fraud Alerts"
    url: "https://consumer.ftc.gov/articles/credit-freezes-and-fraud-alerts"
```

### Defense 2: Phishing-Resistant MFA

```yaml
id: phishing-resistant-mfa
number: 2
title: "Phishing-Resistant MFA, Not Just a Text Code"
tagline: "SMS codes are a fallback, not a primary defense."

threat: "Account takeover via phishing, SIM swap, or code interception"
action:
  - Use FIDO2/WebAuthn hardware keys (YubiKey, etc.) for high-value accounts
  - Use authenticator apps (TOTP) as secondary tier
  - Treat SMS 2FA as last resort only
whyItWorks: "Hardware-bound authentication can't be phished remotely — attacker needs physical possession."

regulatoryBasis:
  - authority: CISA
    reference: "Implementing Phishing-Resistant MFA"
    url: "https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf"
```

### Defense 3: Phone Number Lockdown

```yaml
id: phone-lockdown
number: 3
title: "Lock Down Your Phone Number Like a House Key"
tagline: "SIM swapping lets attackers hijack your number and intercept SMS codes."

threat: "SIM swap / port-out fraud leading to account takeover"
action:
  - Set carrier account PIN (not just device PIN)
  - Enable port-out lock/freeze with your carrier
  - Use a separate number for financial accounts if possible
  - Move high-value 2FA off SMS entirely
whyItWorks: "Carrier-level PIN + port lock prevents unauthorized number transfer."

regulatoryBasis:
  - authority: FCC
    reference: "SIM Swap and Port-Out Fraud Rules"
    url: "https://docs.fcc.gov/public/attachments/DOC-398483A1.pdf"
```

### Defense 4: Sacrificial Spend Card

```yaml
id: sacrificial-card
number: 4
title: "Your Online Spend Card Should Be a Sacrificial Shield"
tagline: "Reduce blast radius — limit what any single compromise can cost you."

threat: "Online card theft / merchant data breach"
action:
  - Use a separate credit card for online purchases with low limit or virtual card numbers
  - Prefer credit over debit online — Regulation Z limits unauthorized credit liability to $50 max
  - Debit risk is higher — Regulation E has tiered liability that can exceed $50 if reporting is delayed
  - Never use primary debit card for online transactions
whyItWorks: "Breach of the sacrificial card has limited blast radius. Credit card dispute protections are stronger than debit."

regulatoryBasis:
  - authority: CFPB
    reference: "Regulation Z — Unauthorized Use Liability"
    url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/12"
  - authority: CFPB
    reference: "Regulation E — Unauthorized EFT Liability"
    url: "https://www.consumerfinance.gov/rules-policy/regulations/1005/6"
```

### Defense 5: Push Alert Monitoring

```yaml
id: push-alerts
number: 5
title: "Push Alerts for Everything — Then Actually Look"
tagline: "Fraud is a time game. Sooner you detect, smaller the loss."

threat: "Delayed fraud detection leading to compounding losses"
action:
  - Enable push notifications for ALL financial accounts (every transaction)
  - Review alerts same-day, not "when you get to it"
  - Reg Z gives a 60-day window to assert billing errors — but faster is always better
  - Set up low-threshold alerts ($1+ transactions) not just large ones
whyItWorks: "Rapid detection collapses the fraud timeline before cascading damage occurs."

regulatoryBasis:
  - authority: CFPB
    reference: "Regulation Z — Billing Error Resolution (60-day window)"
    url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/13"
```

### Defense 6: Family Safe-Phrase

```yaml
id: family-safe-phrase
number: 6
title: "Family Safe-Phrase to Defeat AI Voice Scams"
tagline: "A low-tech, high-power authentication layer that AI can't guess from your social media."

threat: "AI voice cloning used in family emergency scam calls"
action:
  - Establish a verbal safe-phrase known only to family members
  - Practice using it so it feels natural under stress
  - If anyone calls claiming emergency and can't provide the phrase, assume scam
  - Change the phrase periodically
whyItWorks: "Scammers can clone voice from short audio clips. They can't clone a secret passphrase."

regulatoryBasis:
  - authority: FTC
    reference: "AI-Enhanced Family Emergency Schemes"
    url: "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes"
```

### Defense 7: Encrypted App Red Flag

```yaml
id: encrypted-app-red-flag
number: 7
title: "Never Move to Encrypted Apps Because Someone Tells You To"
tagline: "'Move to Signal/Telegram now' from an unknown contact is a red flag, not a convenience."

threat: "Social engineering via platform migration to avoid detection"
action:
  - Treat any request to move conversation to secondary platform as a red flag
  - Verify identity through a separate, known channel before any platform switch
  - FBI has flagged this as a specific tactic used by impersonators
whyItWorks: "Scammers push to encrypted apps to escape platform monitoring and create urgency/isolation."

regulatoryBasis:
  - authority: FBI
    reference: "Malicious Messaging Campaign — AI Vishing/Smishing"
    url: "https://www.ic3.gov/PSA/2025/PSA250515"
  - authority: FBI
    reference: "Senior Officials Impersonation Alert"
    url: "https://www.fbi.gov/investigate/cyber/alerts/2025/senior-us-officials-continue-to-be-impersonated-in-malicious-messaging-campaign"
```

### Defense 8: No-Go Payment List

```yaml
id: no-go-payments
number: 8
title: "Build a No-Go Payment List"
tagline: "If someone demands crypto, gift cards, wire, or 'urgent' weirdness — assume scam until proven otherwise."

threat: "Fraud via irreversible payment rails"
action:
  - Hard rule: NEVER pay via cryptocurrency, gift cards, or wire transfer based on unsolicited requests
  - Any "urgent" payment demand is a scam signal, not a reason to rush
  - FBI IC3 repeatedly flags these payment rails as primary fraud vectors
whyItWorks: "These payment methods are chosen by scammers specifically because they are hard/impossible to reverse."

regulatoryBasis:
  - authority: FBI
    reference: "IC3 Annual Internet Crime Report"
    url: "https://www.fbi.gov/news/press-releases/fbi-releases-annual-internet-crime-report"
```

### Defense 9: Official Recovery Rails

```yaml
id: recovery-rails
number: 9
title: "Use Official Recovery Rails Immediately"
tagline: "Speed matters because fraud cascades."

threat: "Delayed response allowing fraud to spread across accounts/services"
action:
  - If something feels off, act immediately — don't "wait and see"
  - File with FTC IdentityTheft.gov for structured remediation steps
  - Place fraud alerts and/or credit freezes
  - Contact affected financial institutions directly using numbers from official statements (not from suspicious communications)
whyItWorks: "Structured rapid response limits cascade damage across connected accounts."

regulatoryBasis:
  - authority: FTC
    reference: "Identity Theft Recovery Resources"
    url: "https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft"
```

### Defense 10: Data Minimization

```yaml
id: data-minimization
number: 10
title: "Practice Data Minimization Like a Security Engineer"
tagline: "Segment your identity and reduce exposed surfaces."

threat: "Broad identity exposure enabling multi-vector attacks"
action:
  - Separate email addresses for financial accounts vs general use vs social media
  - Separate phone numbers for financial accounts if possible
  - Unique passwords per service (password manager required)
  - Least-privilege access — don't give apps/services more data than they need
  - FTC guidance on segmenting access and requiring phishing-resistant auth maps directly to personal security
whyItWorks: "Segmentation means compromise of one surface doesn't cascade to others. This is enterprise security thinking applied to personal life."

regulatoryBasis:
  - authority: FTC
    reference: "Security Through Data Management and Segmentation"
    url: "https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/12/lenses-security-preventing-mitigating-digital-security-risks-through-data-management-software"
```

---

## MODULE 4: THE OPERATING LOOP

### Purpose
This is the synthesis — the repeatable system that ties everything together. Present as an interactive checklist/dashboard, not a wall of text.

### The Uncommon Cents Operating Loop

```typescript
interface OperatingLoop {
  steps: LoopStep[];
  principle: "The trap isn't that people don't know. It's that people don't have a system that survives stress, temptation, and life randomness.";
}

interface LoopStep {
  order: number;
  action: string;
  linkedModules: string[]; // IDs of relevant expansion cards
}
```

| Order | Action | Linked Cards |
|-------|--------|-------------|
| 1 | Identify your money script (avoidance, worship, status, vigilance). Design around your predictable weaknesses. | `money-scripts` |
| 2 | Eliminate mandatory-payment fragility first. Debt-service-ratio thinking. | `debt-service-ratio-attack` |
| 3 | Max out legal tax shelters that match your life stage. | `mega-backdoor-roth`, `plan-turbo-stack`, `529-estate-freeze` |
| 4 | Run a tax-aware investing system (fees down, losses harvested, wash-sale discipline). | `tax-alpha-engine`, `basis-reset-year` |
| 5 | Buy insurance where downside is life-altering (liability, disability). | `liability-income-barbell` |
| 6 | Install fraud armor — the internet is not polite society. | All 10 fraud defenses |

---

## GUARDRAILS & DISCLAIMERS

Implement these as persistent UI/UX elements, not buried footnotes:

- **Tax moves depend on facts and documentation.** The IRS expects recordkeeping systems that clearly show income and deductions.
- **Many strategies have eligibility gates** (plan features, age rules, holding periods, corporate structure). The power comes from respecting the gates, not pretending they don't exist.
- **Fraud protection is layered defenses**, not one trick: credit freeze + phishing-resistant auth + phone protection + blast-radius segmentation.
- **This is education, not personalized financial/tax/legal advice.** Users should consult qualified professionals for their specific situation.
- **All legal references are to US federal rules.** State-level variations exist for many of these strategies.

---

## IMPLEMENTATION NOTES FOR CLAUDE CODE

### Content Rendering
- Each `ExpansionCard` should be navigable via the existing 12-category card system
- Fraud defenses are a separate navigable module (not shoehorned into the 12 categories)
- Money Scripts assessment should be surfaced as an onboarding/orientation flow
- The Operating Loop is a dashboard-level view that links to individual cards

### AI Navigation Layer
- Users should be able to ask questions like "what tax moves should I make this year?" and get routed to relevant cards based on their situation
- Behavioral links on cards should surface when the AI detects relevant script patterns in conversation
- Fraud defenses should be proactively surfaced when users discuss online transactions, new accounts, or suspicious contacts

### Source Citations
- Every card carries its `legalBasis` references — these should be accessible but not cluttering the primary UI
- Present as expandable "Sources" sections, not inline footnotes
- URLs are live links to authoritative sources (IRS, SEC, SSA, FTC, FBI, CISA, CFPB, NAIC, Fed, academic papers)

### Tone
- Direct, no hedging, no guru energy
- "Here's the rule, here's the move, here's how it breaks" structure
- Behavioral self-awareness integrated throughout, not bolted on as an afterthought
