export interface LegalReference {
  authority: string;
  reference: string;
  url: string;
}

export interface ExpansionCard {
  id: string;
  domainId: string;
  number: number;
  title: string;
  tagline: string;
  coreMechanic: string;
  whyUncommon: string;
  executionNotes: string[];
  failureMode: string;
  legalBasis: LegalReference[];
  behavioralLink?: string;
}

// Maps spec categoryId -> domain ID for integration with existing system
const categoryToDomain: Record<string, string> = {
  "tax-accounts": "d1",
  "tax-strategy": "d2",
  "equity-comp": "d3",
  "real-estate": "d4",
  "business": "d5",
  "retirement": "d6",
  "investing": "d7",
  "estate-planning": "d8",
  "insurance": "d9",
  "debt": "d10",
  "behavior": "d11",
  "career": "d12",
};

export const expansionCards: ExpansionCard[] = [
  {
    id: "mega-backdoor-roth",
    domainId: categoryToDomain["tax-accounts"],
    number: 1,
    title: "Mega Backdoor Roth via After-Tax Split Rollover",
    tagline: "The hidden trapdoor inside some 401(k) plans.",
    coreMechanic:
      "If your 401(k) allows after-tax employee contributions AND either in-plan Roth conversions or in-service distributions, you can move after-tax contributions into Roth space -- accelerating tax-free compounding beyond normal Roth contribution limits.",
    whyUncommon:
      "Requires specific plan features most people never check for. The mechanics are picky -- that's exactly why they're powerful.",
    executionNotes: [
      "Confirm your plan allows after-tax (non-Roth) employee contributions",
      "Confirm your plan allows in-plan Roth conversions OR in-service distributions",
      "Allocate pre-tax amounts to traditional IRA/plan, after-tax amounts to Roth IRA",
      "Execute promptly to minimize earnings on after-tax amounts (earnings are pre-tax)",
    ],
    failureMode:
      "If your plan doesn't support the right features, you can't force this. Sloppy execution can accidentally convert earnings (pre-tax) into taxable income.",
    legalBasis: [
      {
        authority: "IRS",
        reference: "Notice 2014-54 -- Rollovers to multiple destinations",
        url: "https://www.irs.gov/retirement-plans/rollovers-of-after-tax-contributions-in-retirement-plans",
      },
    ],
    behavioralLink:
      "Money vigilance types execute this well. Money avoiders never check their plan documents.",
  },
  {
    id: "basis-reset-year",
    domainId: categoryToDomain["tax-strategy"],
    number: 2,
    title: "The Basis Reset Year",
    tagline:
      "Tax-gain harvesting + wash-sale-safe loss harvesting, timed to life transitions.",
    coreMechanic:
      "Intentionally create a year where you harvest gains at low rates and harvest losses where appropriate, without wash-sale violations. Convert life transitions (job change, sabbatical, early retirement gap) into permanent tax advantage through cost-basis resets.",
    whyUncommon:
      "Most people think tax moves happen in April. The real game is annual income shaping -- choosing WHEN to realize gains, WHEN to realize losses, and WHEN to reset cost basis so future taxes shrink.",
    executionNotes: [
      "Capital losses offset gains; excess losses deduct up to $3,000/year against ordinary income, remainder carries forward",
      'Wash-sale rule disallows loss deductions if you repurchase "substantially identical" securities within 30-day window',
      "Target low-income years (job transition, sabbatical, consulting year, partial retirement) for gain harvesting at lower brackets",
      "Pair with Roth conversions in the same window year for compounding benefit",
    ],
    failureMode:
      "Wash-sale violations from repurchasing too soon. Also: harvesting gains in a year that isn't actually low-income (surprise bonus, severance timing, etc.).",
    legalBasis: [
      {
        authority: "IRS",
        reference: "Topic 409 -- Capital Gains and Losses",
        url: "https://www.irs.gov/taxtopics/tc409",
      },
      {
        authority: "SEC/IRS",
        reference: "Wash Sale Rules",
        url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/wash-sales",
      },
    ],
    behavioralLink:
      "Requires vigilance-level tracking. Worship types may resist 'leaving money on the table' to harvest losses.",
  },
  {
    id: "startup-tax-geometry",
    domainId: categoryToDomain["equity-comp"],
    number: 3,
    title: "Startup Tax Geometry",
    tagline:
      "83(b) + QSBS + ISO/AMT awareness -- or taxes will clown you in 4K.",
    coreMechanic:
      "Treat startup equity as a portfolio of options with distinct tax regimes. Build a decision tree across three rule systems: 83(b) elections, ISO/AMT exposure, and QSBS eligibility.",
    whyUncommon:
      "The uncommon play isn't \"exercise early.\" It's building a decision tree that maps when to file 83(b), when to exercise ISOs, how to manage AMT exposure, and how to preserve QSBS eligibility simultaneously.",
    executionNotes: [
      "83(b) elections MUST be filed within 30 days of property transfer -- miss it and the election is void",
      "ISOs can trigger AMT at exercise even when regular taxable income isn't recognized",
      "QSBS (IRC section 1202) can allow 100% exclusion for qualifying stock acquired after Sept 27, 2010, subject to holding period and corporate eligibility",
      "Map all three rule systems before making any exercise decisions",
    ],
    failureMode:
      "Missing the 30-day 83(b) window. Triggering unexpected AMT liability. Inadvertently disqualifying QSBS through corporate structure changes.",
    legalBasis: [
      {
        authority: "IRS",
        reference: "83(b) Election -- Form 15620",
        url: "https://www.irs.gov/pub/irs-pdf/f15620.pdf",
      },
      {
        authority: "IRS",
        reference: "Topic 427 -- Stock Options",
        url: "https://www.irs.gov/taxtopics/tc427",
      },
      {
        authority: "IRS",
        reference: "IRC section 1202 -- QSBS",
        url: "https://www.irs.gov/pub/irs-wd/202418001.pdf",
      },
    ],
  },
  {
    id: "14-day-rule",
    domainId: categoryToDomain["real-estate"],
    number: 4,
    title: "The 14-Day Rule (Done Right)",
    tagline:
      "Your home as a high-demand micro-asset -- with documentation that survives scrutiny.",
    coreMechanic:
      "IRS Pub 527: If you rent property you also use as your home for fewer than 15 days/year, you generally don't include the rent in income (with limits on related expense deductions). Use your home selectively for high-demand events, peak weeks, or legitimate business meetings.",
    whyUncommon:
      "Everyone's heard of the \"Augusta Rule.\" Almost nobody executes it with defensible pricing and documentation-grade records.",
    executionNotes: [
      "Must be property you also use as your home",
      "Fewer than 15 rental days per year",
      "Pricing must be defensible (comparable market rates for similar properties)",
      'If a business claims the deduction, "ordinary and necessary" expense rules apply',
      "IRS expects records that clearly support income and deductions -- that's not optional",
    ],
    failureMode:
      "Greed, sloppiness, or both. Inflated pricing without comparables. No records. The IRS literally tells you to keep records to prove deductions.",
    legalBasis: [
      {
        authority: "IRS",
        reference: "Publication 527 -- Residential Rental Property",
        url: "https://www.irs.gov/pub/irs-pdf/p527.pdf",
      },
      {
        authority: "USC",
        reference: "26 USC section 280A",
        url: "https://www.law.cornell.edu/uscode/text/26/280A",
      },
      {
        authority: "IRS",
        reference: "Recordkeeping Requirements",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep",
      },
    ],
  },
  {
    id: "plan-turbo-stack",
    domainId: categoryToDomain["business"],
    number: 5,
    title: "Solo 401(k) + Defined Benefit Plan Turbo Stack",
    tagline:
      "Stack a defined contribution plan with a defined benefit plan for maximum tax-deferred savings.",
    coreMechanic:
      "For self-employed/owner-operators with high, stable income: combine a solo 401(k) (defined contribution) with a cash balance or traditional defined benefit plan. DB plans support large contributions based on actuarial assumptions -- the combination creates a high-powered tax-deferred engine.",
    whyUncommon:
      "Most small business owners do nothing or open a SEP and call it a day. The existence of cash balance plans isn't secret -- the owner-operator stacking move is what's uncommon.",
    executionNotes: [
      "Requires stable, high income to justify DB plan contributions",
      "DB contributions are based on actuarial calculations -- need a plan actuary",
      "Solo 401(k) handles the DC side with both employee and employer contributions",
      "Combined limits far exceed what either plan allows alone",
      "IRS outlines available retirement plan types for self-employed people",
    ],
    failureMode:
      "Income volatility kills this. If income drops, DB plan funding requirements don't -- you're locked into actuarially required contributions.",
    legalBasis: [
      {
        authority: "IRS",
        reference: "Defined Benefit Plan Limits",
        url: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-defined-benefit-plan-benefit-limits",
      },
      {
        authority: "IRS",
        reference: "Retirement Plans for Self-Employed People",
        url: "https://www.irs.gov/retirement-plans/retirement-plans-for-self-employed-people",
      },
    ],
  },
  {
    id: "ss-delayed-claiming",
    domainId: categoryToDomain["retirement"],
    number: 6,
    title: "Social Security Delayed Claiming as Longevity Insurance",
    tagline:
      "Build a bridge plan to delay benefits -- convert part of your portfolio into a stronger income floor.",
    coreMechanic:
      'SSA is explicit: benefits increase for each month you delay beyond full retirement age, stopping at 70. Treat this as an inflation-adjusted lifetime income lever. Build a "bridge plan" (taxable asset drawdown, part-time work, planned withdrawals) to fund the delay period.',
    whyUncommon:
      "This isn't just \"maximize benefits.\" It's \"reduce the risk of outliving your money by converting part of your retirement plan into a stronger floor.\" Most people claim early because the math feels free.",
    executionNotes: [
      "Each month of delay past full retirement age increases benefit permanently",
      "Increase stops at age 70 -- no benefit to delaying further",
      "Build cashflow bridge from taxable accounts, part-time income, or planned withdrawals",
      "Pairs well with Roth conversion window during bridge years (low-income years)",
    ],
    failureMode:
      "Health issues that shorten expected lifespan change the math. Also: running out of bridge funding and being forced to claim early anyway.",
    legalBasis: [
      {
        authority: "SSA",
        reference: "Delayed Retirement Credits",
        url: "https://www.ssa.gov/benefits/retirement/planner/delayret.html",
      },
    ],
    behavioralLink:
      "Money worship types over-optimize the math and forget the human risk. Avoidance types claim early to stop thinking about it.",
  },
  {
    id: "tax-alpha-engine",
    domainId: categoryToDomain["investing"],
    number: 7,
    title: "Tax Alpha Engine",
    tagline:
      "Direct-indexing mindset + wash-sale discipline + fee obsession.",
    coreMechanic:
      "After-tax returns are what pay for your life. Fees and taxes are controllable to a painful extent. Run a system of disciplined rebalancing, loss harvesting with wash-sale controls, and relentless fee minimization.",
    whyUncommon:
      "Most investing advice is \"pick good funds.\" The uncommon edge is understanding that tax drag and fee drag are the two largest controllable leaks in a portfolio.",
    executionNotes: [
      "Fees compound against you -- SEC warns of major long-term impact",
      "Capital loss deduction and carryforward rules are explicit (up to $3K/year + unlimited carryforward)",
      'Wash-sale 30-day "substantially identical" rule is the tripwire',
      "Even without true direct indexing, run tax-aware rebalancing and harvesting",
      "Track cost basis at the lot level, not just the position level",
    ],
    failureMode:
      "Wash-sale violations. Over-trading in pursuit of tax losses (trading costs exceed tax benefit). Ignoring fees on \"good\" funds.",
    legalBasis: [
      {
        authority: "SEC",
        reference: "Investor Bulletin -- Fees and Expenses",
        url: "https://www.sec.gov/investor/alerts/ib_fees_expenses.pdf",
      },
      {
        authority: "IRS",
        reference: "Publication 550 -- Investment Income and Expenses",
        url: "https://www.irs.gov/pub/irs-pdf/p550.pdf",
      },
      {
        authority: "IRS",
        reference: "Topic 409 -- Capital Gains and Losses",
        url: "https://www.irs.gov/taxtopics/tc409",
      },
    ],
    behavioralLink:
      "Status types chase performance and ignore fees. Vigilance types execute this naturally.",
  },
  {
    id: "529-estate-freeze",
    domainId: categoryToDomain["estate-planning"],
    number: 8,
    title: "529 Estate Freeze via 5-Year Election",
    tagline:
      "Move assets out of your estate faster through the gift-tax framework while funding education.",
    coreMechanic:
      "IRS Form 709 special rule: you can elect under section 529(c)(2)(B) to treat certain transfers to a qualified tuition program as made ratably over a 5-year period. This lets you front-load 5 years of gift-tax-excluded contributions in one shot.",
    whyUncommon:
      "It's literally in the IRS paperwork. Most people never read Form 709 instructions. This is an \"it's in the manual\" strategy.",
    executionNotes: [
      "Election is made on Form 709 (gift tax return)",
      "Contribution is treated as spread over 5 calendar years for gift tax purposes",
      "Moves assets out of estate while funding education with long compounding runway",
      "If contributor dies within the 5-year period, proportional amount comes back into estate",
      "Can be done for multiple beneficiaries",
    ],
    failureMode:
      "Contributor dying within the 5-year window partially unwinds the estate benefit. Also: overfunding 529s relative to actual education needs (though Secure 2.0 added Roth rollover option for excess).",
    legalBasis: [
      {
        authority: "IRS",
        reference: "Form 709 -- Gift Tax Return",
        url: "https://www.irs.gov/pub/irs-pdf/f709.pdf",
      },
    ],
  },
  {
    id: "liability-income-barbell",
    domainId: categoryToDomain["insurance"],
    number: 9,
    title: "Liability + Income Protection Barbell",
    tagline:
      "Insure catastrophic risks that can permanently derail wealth creation.",
    coreMechanic:
      "Stop thinking of insurance as an investment. Use the barbell model: umbrella liability (extends coverage above home/auto limits) on one end, disability insurance (protects income) on the other. These are the two catastrophic risks most wealth-builders ignore.",
    whyUncommon:
      "Insurance gets sold like an investment. The correct model is: insure catastrophic risks, self-insure small risks. Most \"financial freedom\" plans ignore income protection until the first injury or burnout event.",
    executionNotes: [
      "Umbrella liability extends coverage beyond home/auto/renters policy limits",
      'Disability insurance protects income -- distinguish "own occupation" vs "any gainful employment" definitions',
      "Treat future income like a bond portfolio and insure it accordingly",
      "Short-term vs long-term disability serve different functions",
    ],
    failureMode:
      "Buying investment-like insurance products (whole life, indexed universal) when you need catastrophic coverage. Wrong disability definition that doesn't cover your actual occupation.",
    legalBasis: [
      {
        authority: "NAIC",
        reference: "Umbrella Policy Guide",
        url: "https://content.naic.org/article/whats-umbrella-policy",
      },
      {
        authority: "NAIC",
        reference: "Disability Insurance Guide",
        url: "https://content.naic.org/article/consumer-insight-if-disability-were-keep-you-earning-living-how-would-you-pay-your-bills",
      },
    ],
  },
  {
    id: "debt-service-ratio-attack",
    domainId: categoryToDomain["debt"],
    number: 10,
    title: "Debt-Service Ratio Attack",
    tagline:
      "Optimize mandatory payments, not just APR. Required payments are the measure of financial fragility.",
    coreMechanic:
      "The Fed defines household debt service ratio as total required payments divided by disposable income. Most people optimize for interest rate and ignore the bigger constraint: mandatory payment burden. Restructure life to reduce mandatory payments and make principal paydown the automated default.",
    whyUncommon:
      "Two compounding traps keep people stuck: (1) Credit card APRs averaged 25.2% for general purpose and 31.3% for private label in 2024 with $160B in interest charges. (2) Minimum payments act as behavioral anchors that prolong repayment.",
    executionNotes: [
      "Calculate your debt service ratio (total required monthly payments / monthly disposable income)",
      "Restructure to reduce mandatory-payment-to-income ratio FIRST",
      "Automate principal paydown above minimums as the default",
      "Your investing capacity is what creates freedom -- mandatory payments shrink it",
    ],
    failureMode:
      "Consolidating debt but then re-accumulating revolving balances (the avoidance to binge cycle). Optimizing APR while leaving payment structure unchanged.",
    legalBasis: [
      {
        authority: "Federal Reserve Board",
        reference: "Household Debt Service Ratio",
        url: "https://www.federalreserve.gov/releases/housedebt/about.htm",
      },
      {
        authority: "CFPB",
        reference: "Consumer Credit Card Market Report 2025",
        url: "https://www.federalregister.gov/documents/2026/01/07/2026-00081/consumer-credit-card-market-report-of-the-consumer-financial-protection-bureau-2025",
      },
      {
        authority: "NBER",
        reference: "Minimum Payment Anchoring Effects",
        url: "https://www.nber.org/system/files/working_papers/w22742/w22742.pdf",
      },
    ],
    behavioralLink:
      "Avoidance types don't calculate the ratio. Worship types justify debt as 'leverage.' Status types carry high minimums for lifestyle maintenance.",
  },
  {
    id: "friction-protocol",
    domainId: categoryToDomain["behavior"],
    number: 11,
    title: "The Friction Protocol",
    tagline:
      "Rules that override panic and dopamine. Treat your future panicked self as a predictable adversary.",
    coreMechanic:
      "Prospect theory (Kahneman & Tversky) shows humans don't treat gains and losses symmetrically. Excessive trading among individual investors materially reduces performance. Build commitment devices that make bad behavior hard when stress is high.",
    whyUncommon:
      "Everyone knows \"don't panic sell.\" Almost nobody builds a system that makes panic selling structurally difficult. The protocol treats your future panicked self as a predictable adversary, not as \"you but irrational.\"",
    executionNotes: [
      "72-hour delay rule before any sell during drawdowns",
      'Written "if-then" plan (e.g., "If portfolio down 15%, then review IPS, do not trade, rebalance only")',
      "Account-level controls (trade password, device restrictions, advisor gate)",
      "Pre-commit to rules BEFORE the stress event, not during it",
    ],
    failureMode:
      "Writing rules but building in easy overrides. The protocol only works if future-you can't easily bypass it in the moment.",
    legalBasis: [
      {
        authority: "Academic",
        reference: "Kahneman & Tversky -- Prospect Theory",
        url: "https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_Tversky_1979_Prospect_theory.pdf",
      },
      {
        authority: "Academic",
        reference: "Odean -- Do Investors Trade Too Much?",
        url: "https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/doinvestors.pdf",
      },
    ],
    behavioralLink:
      "ALL scripts need this. Avoidance types freeze. Worship types chase. Status types panic-sell to protect image. Vigilance types over-monitor.",
  },
  {
    id: "engineered-low-income-year",
    domainId: categoryToDomain["career"],
    number: 12,
    title: "Engineer a Low-Income Year Window on Purpose",
    tagline:
      "The adult version of 'choose your battles' -- use life transitions as tax optimization windows.",
    coreMechanic:
      "Many of the best tax moves (Roth conversions, basis resets, bracket strategies) become dramatically more powerful in low-taxable-income years. Engineer a planned window year -- job transition, sabbatical, consulting year, partial retirement -- and stack multiple high-leverage moves in it.",
    whyUncommon:
      "This isn't quitting your job for vibes. It's treating career transitions as strategic windows and running coordinated tax moves during the gap. Also pairs with the finding that candidates are often more worried than they need to be about jeopardizing an offer by negotiating.",
    executionNotes: [
      "Plan the window year in advance (ideally 12+ months ahead)",
      "Stack moves in the window: Roth conversions, gain harvesting, basis resets",
      "IRS Form 8606 mechanics matter -- year-end IRA balances affect taxable conversion amounts",
      "Negotiate the next role from a position of preparation, not desperation",
      "Use the window for professional development, not just tax moves",
    ],
    failureMode:
      "Unplanned income during the \"low\" year (severance timing, side income, capital gains from a forced sale). Also: extending the window too long and depleting reserves.",
    legalBasis: [
      {
        authority: "IRS",
        reference: "Form 8606 -- Nondeductible IRAs",
        url: "https://www.irs.gov/pub/irs-pdf/f8606.pdf",
      },
      {
        authority: "HBR",
        reference: "Negotiation Research",
        url: "https://hbr.org/2024/05/research-negotiating-is-unlikely-to-jeopardize-your-job-offer",
      },
    ],
  },
];

export function getExpansionCardById(id: string): ExpansionCard | undefined {
  return expansionCards.find((c) => c.id === id);
}

export function getExpansionCardByDomain(
  domainId: string
): ExpansionCard | undefined {
  return expansionCards.find((c) => c.domainId === domainId);
}
