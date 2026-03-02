export interface FinancialConcept {
  id: string;
  slug: string;
  domainId: string;
  name: string;
  summary: string;
  complexityMin: 1 | 2 | 3;
  hasCalculator: boolean;
  relatedConceptSlugs: string[];
  honestAnalysis?: string;
  layers: {
    accessible: string;
    intermediate: string;
    advanced: string;
  };
}

export const concepts: FinancialConcept[] = [
  // ─── Domain 1: Tax-Advantaged Accounts ─────────────────────────────────

  {
    id: "c1-01",
    slug: "roth-vs-traditional",
    domainId: "d1",
    name: "Roth vs Traditional: The Tax Timing Decision",
    summary:
      "Pay taxes now (Roth) or later (Traditional)? The answer depends on your current and future tax brackets -- and most advice gets this wrong.",
    complexityMin: 1,
    hasCalculator: true,
    relatedConceptSlugs: ["roth-conversion-ladder", "backdoor-roth", "tax-bracket-management"],
    layers: {
      accessible:
        "Traditional 401k/IRA: you put in pre-tax money (reducing your taxable income today), the money grows tax-free, and you pay taxes when you withdraw in retirement. Roth 401k/IRA: you put in after-tax money (no tax break today), the money grows tax-free, and you pay ZERO taxes when you withdraw in retirement. The common advice is 'Roth if you think your tax rate will be higher in retirement, Traditional if lower.' This is correct but incomplete. Most people in their peak earning years are in a higher bracket NOW than they will be in retirement, making Traditional contributions more efficient. The real power move: contribute Traditional during high-income years, then do Roth conversions during low-income years (early retirement, gap years, sabbaticals).",
      intermediate:
        "The math is straightforward but counterintuitive. If your tax rate is the same now and in retirement, Roth and Traditional produce identical after-tax wealth. Here's why: $6,000 Traditional at 24% = $6,000 in the account, taxed at withdrawal. $6,000 Roth at 24% = you actually only invest $4,560 of equivalent pre-tax dollars ($6,000 - 24% tax = $4,560, but you can contribute the full $6,000). The Roth advantage only appears when your future tax rate is HIGHER than your current rate.\n\nKey factors most people miss: (1) In retirement, you control your income -- you can withdraw just enough to stay in a low bracket. (2) Social Security taxation: 50-85% of Social Security becomes taxable above certain income thresholds. Large Traditional withdrawals push you over these thresholds. (3) IRMAA: Medicare premiums increase when income exceeds thresholds. Large Traditional withdrawals trigger IRMAA surcharges. (4) The standard deduction creates a 0% tax bracket in retirement -- your first ~$30k (married filing jointly) is effectively tax-free.\n\nThe optimal strategy for most high earners: max Traditional contributions during working years (reducing taxes at your marginal rate), then do strategic Roth conversions in early retirement to 'fill up' lower brackets before Social Security and RMDs begin.",
      advanced:
        "The analysis becomes more complex with state tax considerations. If you live in a high-income-tax state now (CA, NY, NJ) but plan to retire in a no-income-tax state (FL, TX, NV, WA), Traditional contributions get a double benefit: federal deduction now + zero state tax on withdrawal later. Conversely, if you're in a no-tax state now and might move to a high-tax state, Roth makes more sense.\n\nThe 'tax diversification' argument -- having both Roth and Traditional buckets -- has merit beyond optimization. Tax law is uncertain. Having both types gives you flexibility to manage income, qualify for ACA subsidies before Medicare, control IRMAA, and hedge against legislative risk. A common sophisticated approach: contribute Traditional to employer plan (captures employer match and high-bracket deduction), plus Backdoor Roth IRA (contributions for those over the income limit), plus HSA (triple tax advantage).\n\nThe mega analysis: if you can max ALL accounts, the Traditional vs Roth decision within your 401k matters less than most people think. The real leverage is in (1) actually maxing out every available account, (2) using the right ASSET LOCATION (putting tax-inefficient assets in tax-advantaged accounts), and (3) having a Roth conversion strategy for the gap years between retirement and RMDs/SS."
    },
    honestAnalysis:
      "The financial media treats Roth vs Traditional as a simple binary. It's not. The answer changes based on income, state of residence, retirement plans, and tax law -- all of which are uncertain. Anyone who gives you a confident one-word answer is oversimplifying.",
  },

  {
    id: "c1-02",
    slug: "hsa-triple-tax",
    domainId: "d1",
    name: "HSA: The Triple Tax Advantage",
    summary:
      "The most tax-advantaged account in the tax code. Tax-deductible going in, tax-free growth, tax-free withdrawals. Nothing else gets all three.",
    complexityMin: 1,
    hasCalculator: true,
    relatedConceptSlugs: ["roth-vs-traditional", "tax-bracket-management"],
    layers: {
      accessible:
        "A Health Savings Account (HSA) is the only account in the entire US tax code with a TRIPLE tax advantage: (1) contributions are tax-deductible (reduce your taxable income), (2) investments grow tax-free (no capital gains tax ever), and (3) withdrawals for qualified medical expenses are tax-free. Not even a Roth IRA gets all three (Roth has no deduction going in). The catch: you must have a High Deductible Health Plan (HDHP) to contribute. The strategy most people miss: pay medical expenses out of pocket, keep the receipts, and let your HSA money invest and grow for decades. You can reimburse yourself for those old receipts at ANY point in the future -- even 30 years later.",
      intermediate:
        "2025 contribution limits: $4,300 individual / $8,550 family, plus $1,000 catch-up if 55+. Unlike FSAs, HSA funds never expire and roll over indefinitely. The key insight: treat your HSA as a RETIREMENT account, not a medical spending account.\n\nThe receipt-hoarding strategy in detail: Pay for glasses, dental work, prescriptions, and doctor visits with cash or a credit card. Save every receipt. Let your HSA invest in index funds for years or decades. When you want the money, submit those old receipts for tax-free reimbursement. There is no time limit on reimbursement. This effectively turns the HSA into a super-Roth: tax-deductible contributions + tax-free growth + tax-free withdrawals (via medical receipt reimbursement).\n\nAfter age 65, HSA withdrawals for non-medical expenses are taxed as ordinary income (like a Traditional IRA) but with no penalty. So even if you run out of medical receipts, you still have a tax-deferred retirement account. Before 65, non-medical withdrawals face a 20% penalty plus income tax.",
      advanced:
        "Advanced HSA strategies: (1) If self-employed, HSA contributions also reduce self-employment tax (unlike Traditional IRA deductions, which only reduce income tax). (2) HSA contributions via payroll deduction avoid FICA taxes entirely -- contributing through your employer saves an additional 7.65% vs contributing independently. (3) Some states (CA, NJ) do not recognize HSA tax benefits for state income tax -- contributions are taxable, and investment gains are taxable at the state level. Factor this into the analysis.\n\nAsset location consideration: because HSAs have the most favorable tax treatment of any account, they should hold your highest-expected-return assets (typically stock index funds). Bonds and stable value belong in less advantaged accounts.\n\nThe long-term math: $8,550/year invested for 30 years at 7% real return = ~$860,000 in a completely tax-free account. If you've been saving medical receipts, you can pull that entire amount out without paying a single dollar in tax. Even a Roth can't match this because Roth contributions don't get a tax deduction going in."
    },
  },

  {
    id: "c1-03",
    slug: "backdoor-roth",
    domainId: "d1",
    name: "Backdoor Roth IRA",
    summary:
      "The legal workaround that lets high earners contribute to a Roth IRA regardless of income. Contribute to a Traditional IRA, convert to Roth. Simple in theory, tricky in practice.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["roth-vs-traditional", "mega-backdoor-roth", "roth-conversion-ladder"],
    layers: {
      accessible:
        "Roth IRAs have income limits -- if you make too much (over ~$161k single / ~$240k married in 2025), you can't contribute directly. The Backdoor Roth is a legal two-step workaround: (1) Contribute to a Traditional IRA (no income limit for contributions, though the deduction phases out). (2) Convert that Traditional IRA to a Roth IRA. Since you contributed after-tax dollars (no deduction), the conversion is essentially tax-free. Congress has been aware of this for years and has not closed it. The IRS has never challenged it. It's legal, established, and used by millions of high earners.",
      intermediate:
        "The critical pitfall: the Pro-Rata Rule. If you have ANY pre-tax money in ANY Traditional, SEP, or SIMPLE IRA, the conversion is NOT tax-free. The IRS looks at ALL your IRA balances and calculates the taxable portion proportionally. Example: you have $95,000 in a Traditional IRA (pre-tax) and contribute $7,000 (after-tax) for a Backdoor Roth. Total IRA balance: $102,000. After-tax portion: $7,000 / $102,000 = 6.9%. When you convert $7,000, only 6.9% ($483) is tax-free. The other $6,517 is taxable income.\n\nThe fix: roll your existing Traditional/SEP/SIMPLE IRA into your employer 401(k) BEFORE doing the Backdoor Roth. 401(k) balances are NOT counted in the pro-rata calculation. Once your Traditional IRA balance is $0, the Backdoor Roth conversion is clean and tax-free.\n\nExecution steps: (1) Open a Traditional IRA if you don't have one. (2) Contribute $7,000 ($8,000 if 50+). Do NOT invest it -- leave it in cash or money market. (3) Wait a short period (no required waiting period, but many advisors suggest a few days). (4) Convert the entire Traditional IRA to Roth. (5) File Form 8606 with your tax return to report the non-deductible contribution.",
      advanced:
        "The legislative risk: Build Back Better (2021) proposed eliminating the Backdoor Roth for high earners. It failed, but the provision could return. Some advisors recommend executing Backdoor Roths as soon as possible each year in case legislation passes mid-year with retroactive effect.\n\nThe Backdoor Roth + Mega Backdoor Roth combination for maximum tax-advantaged savings: (1) Max 401(k) employee contributions ($23,500 in 2025). (2) Backdoor Roth IRA ($7,000). (3) HSA ($8,550 family). (4) Mega Backdoor Roth ($46,000, if employer plan allows). Total tax-advantaged savings: $85,050/year per person. For a dual-income household, that's $170,100/year in tax-advantaged accounts -- an amount that, invested for 20-30 years, can fully fund retirement for most high-earning couples.\n\nState tax note: some states (like California) do not conform to the Federal Roth conversion rules and may tax the conversion differently. Consult a CPA familiar with your state's treatment."
    },
  },

  {
    id: "c1-04",
    slug: "mega-backdoor-roth",
    domainId: "d1",
    name: "Mega Backdoor Roth",
    summary:
      "The most powerful tax optimization most people have never heard of. Contribute up to $46,000 extra to your 401(k) after-tax, then convert to Roth. Not all plans allow it.",
    complexityMin: 3,
    hasCalculator: false,
    relatedConceptSlugs: ["backdoor-roth", "roth-vs-traditional"],
    layers: {
      accessible:
        "The total 401(k) contribution limit in 2025 is $70,000 (employee + employer). Most people only use the employee portion ($23,500). But if your employer plan allows after-tax contributions (different from Roth contributions), you can contribute more -- up to the $70,000 total limit minus your employee contributions and employer match. Then you convert those after-tax contributions to Roth. This is the Mega Backdoor Roth: it lets you get up to $46,000 extra per year into a Roth account, far beyond the $7,000 Roth IRA limit. The catch: your employer plan must specifically allow after-tax contributions AND in-plan Roth conversions (or in-service withdrawals to a Roth IRA). Many plans don't.",
      intermediate:
        "How to check if your plan allows it: (1) Ask your HR/benefits department if your 401(k) allows 'after-tax contributions' (not Roth contributions -- these are different). (2) Ask if the plan allows 'in-plan Roth conversions' or 'in-service withdrawals/rollovers' for after-tax money. Both must be yes.\n\nThe math: 2025 total 401(k) limit = $70,000. You contribute $23,500 (employee). Employer matches $10,000. That's $33,500 used. Remaining space: $70,000 - $33,500 = $36,500. You can contribute up to $36,500 in after-tax contributions and convert them to Roth.\n\nAutomatic conversion is ideal. Some plans (Fidelity, Vanguard, Schwab) offer automatic in-plan Roth conversion of after-tax contributions. This means every after-tax dollar is immediately converted to Roth before it generates any earnings (earnings on after-tax contributions are taxable when converted, so converting quickly minimizes the tax hit).\n\nIf your plan only allows in-service withdrawals (not in-plan conversions), you roll the after-tax contributions to a Roth IRA and the earnings to a Traditional IRA. This achieves the same result but requires more paperwork.",
      advanced:
        "The Mega Backdoor Roth is arguably the single most valuable benefit a 401(k) plan can offer high-earning employees. A household maxing out Mega Backdoor Roth for both spouses can shelter an additional $72,000-$92,000 per year in Roth accounts.\n\nThe impact over time: $46,000/year in Mega Backdoor Roth for 15 years at 7% real return = ~$1.2 million in Roth. Combined with regular Roth 401(k)/IRA contributions, a high-earning couple could accumulate $3-5 million in Roth accounts by their mid-50s -- producing completely tax-free income in retirement.\n\nPlan design considerations for business owners: if you run an S-Corp or have a Solo 401(k), you can design your plan to allow after-tax contributions. Solo 401(k) providers that support Mega Backdoor Roth include MySolo401k.net and some Fidelity/Schwab plans. This gives self-employed individuals access to the same strategy available to employees of companies with generous plans.\n\nLegislative risk: the Mega Backdoor Roth has been targeted for elimination in multiple legislative proposals. SECURE 2.0 did not eliminate it. The strategy remains legal as of 2025, but executing it while available is prudent."
    },
    honestAnalysis:
      "This is a strategy for high earners with significant savings capacity. If you're struggling to max out a basic 401(k), the Mega Backdoor Roth is not relevant to you yet. Focus on the basics first.",
  },

  {
    id: "c1-05",
    slug: "529-plan",
    domainId: "d1",
    name: "529 Plans: Education Savings",
    summary:
      "Tax-free growth for education expenses. Now with a Roth IRA escape hatch thanks to SECURE 2.0, making them more flexible than ever.",
    complexityMin: 1,
    hasCalculator: true,
    relatedConceptSlugs: ["roth-vs-traditional", "estate-planning-basics"],
    layers: {
      accessible:
        "A 529 plan is a tax-advantaged account for education expenses. Contributions grow tax-free, and withdrawals for qualified education expenses (tuition, books, room and board, K-12 tuition up to $10,000/year) are completely tax-free. Many states also give you a state income tax deduction for contributions. The new SECURE 2.0 rule (effective 2024): if you've had a 529 for at least 15 years, you can roll up to $35,000 (lifetime limit) into a Roth IRA for the beneficiary. This eliminates the old fear of 'what if my kid doesn't go to college?' -- excess 529 money can become retirement savings.",
      intermediate:
        "Key details most people miss: (1) You can change the beneficiary to any family member at any time -- sibling, cousin, parent, yourself. If one child gets a scholarship, redirect the funds to another family member. (2) You can superfund a 529 with 5 years of gift tax exclusion at once ($90,000 per person in 2025, $180,000 per couple) without using lifetime gift tax exemption. This is powerful for grandparents who want to reduce their estate. (3) The 529 is owned by the parent/grandparent, not the child -- it stays under your control regardless of the child's age.\n\nState tax deduction arbitrage: some states (like Indiana, Utah, Vermont) give generous tax deductions for 529 contributions to ANY state's plan. Other states only give deductions for their own plan. A few states (California, Delaware, Hawaii) give no deduction at all. Always check if your state's plan is good before defaulting to the state deduction -- a bad plan with a deduction may still be worse than a good plan without one.\n\nCommon mistake: investing 529 money too conservatively. For a newborn, the money has 18+ years to grow. An all-equity index fund is appropriate for early years, shifting to bonds as college approaches. Age-based portfolios do this automatically.",
      advanced:
        "SECURE 2.0 Roth rollover details: the 529 must have been open for 15+ years. Rollovers are subject to annual Roth IRA contribution limits ($7,000 in 2025). Contributions made in the last 5 years and their earnings cannot be rolled over. This means the optimal strategy for the Roth conversion escape hatch: open a 529 for a child at birth (or even before, with yourself as beneficiary, then change to the child), contribute early, and if the funds aren't needed for education, begin rolling $7,000/year to Roth starting when the 529 is 15 years old.\n\nFinancial aid impact: parent-owned 529s are reported as parent assets on FAFSA, assessed at a maximum 5.64% (vs 20% for student assets). Grandparent-owned 529s no longer count as student income under the simplified FAFSA (effective 2024-25), eliminating the old penalty for grandparent contributions. This makes grandparent 529s a powerful financial aid-friendly way to pay for education.\n\nEstate planning angle: 529 superfunding removes $90,000-$180,000 from the grandparent's estate immediately (for gift tax purposes) while retaining control of the account. If the grandparent needs the money back, they can change the beneficiary to themselves and withdraw (with penalties on earnings, but the principal is always accessible). This is one of the few tools that offers estate reduction + retained control."
    },
  },

  // ─── Domain 2: Tax Optimization ────────────────────────────────────────

  {
    id: "c2-01",
    slug: "tax-bracket-management",
    domainId: "d2",
    name: "Tax Bracket Management",
    summary:
      "The foundation of all tax strategy: understanding how marginal brackets work and deliberately managing income to stay in lower ones.",
    complexityMin: 1,
    hasCalculator: true,
    relatedConceptSlugs: ["roth-conversion-ladder", "roth-vs-traditional"],
    layers: {
      accessible:
        "The most common tax misconception: 'If I earn more and move into a higher bracket, all my income gets taxed at that higher rate.' Wrong. The US has a MARGINAL tax system. Only the income WITHIN each bracket is taxed at that rate. If the 22% bracket ends at $100,525 (married filing jointly, 2025) and you earn $110,000, only $9,475 is taxed at 24%. Your first ~$23,200 is taxed at 10%, the next ~$71,300 at 12%, and so on. Understanding this eliminates the fear of earning more and opens up strategic opportunities: if you're near the top of a bracket, you can time deductions, Roth conversions, or income recognition to avoid jumping into the next one.",
      intermediate:
        "Practical bracket management moves: (1) If you're near the top of the 12% bracket ($94,300 MFJ in 2025), this is the sweet spot for Roth conversions -- convert enough to fill this bracket. Long-term capital gains are taxed at 0% within the 12% bracket. (2) If you're in the 22% bracket but expect to drop to 12% next year (job change, sabbatical, early retirement), defer income and accelerate deductions this year, then do conversions next year. (3) Bunching charitable donations: if your itemized deductions are near the standard deduction, alternate between years -- bunch two years of donations into one year using a Donor Advised Fund (DAF) to exceed the standard deduction, then take the standard deduction the next year.\n\nThe 'tax torpedo' zone: between $32,000 and $44,000 of combined income (single) or $44,000 and $68,000 (married), each additional dollar of income causes $0.85 of Social Security to become taxable. This creates an effective marginal rate much higher than the statutory bracket. Planning around this zone is critical for retirees.",
      advanced:
        "Multi-year bracket management is where the real value is. A comprehensive strategy considers: (1) Current year income and bracket, (2) Expected income changes (promotions, job changes, retirement, spouse starting/stopping work), (3) Roth conversion opportunities in low-income years, (4) Capital gain harvesting in years when the 0% LTCG bracket has room, (5) RMD projections (large Traditional IRA/401k balances will force high income in your 70s), (6) Social Security claiming strategy (delay to 70 for larger benefit, but that larger benefit is more taxable), (7) ACA subsidy cliffs (if retiring before 65, managing income to qualify for premium tax credits).\n\nThe optimal lifetime tax strategy for a high earner retiring at 55: (1) Max Traditional 401k during working years (deductions at 32-37%). (2) Do massive Roth conversions from 55-62, filling the 12% and 22% brackets. (3) Claim Social Security at 70 for maximum benefit. (4) RMDs from remaining Traditional balance start at 73 (SECURE 2.0). (5) By conversion time, most of the Traditional balance has been Roth-converted at rates far below the original deduction rate. Net savings: hundreds of thousands in taxes over a lifetime."
    },
  },

  {
    id: "c2-02",
    slug: "roth-conversion-ladder",
    domainId: "d2",
    name: "Roth Conversion Ladder",
    summary:
      "The FIRE community's essential tool: convert Traditional retirement funds to Roth in low-income years, then withdraw the conversions tax-free after 5 years.",
    complexityMin: 2,
    hasCalculator: true,
    relatedConceptSlugs: ["roth-vs-traditional", "tax-bracket-management", "safe-withdrawal-rate"],
    layers: {
      accessible:
        "If you retire early (before 59.5), most retirement money is 'locked' behind penalties. The Roth Conversion Ladder solves this. Here's how: (1) In retirement, convert a chunk of your Traditional 401k/IRA to a Roth IRA each year. This is taxable income, but if you have low/no other income, it might be taxed at 0-12%. (2) Wait 5 years. Roth CONVERSION dollars (not earnings) can be withdrawn penalty-free after a 5-year seasoning period, regardless of age. (3) After the initial 5-year ramp, you have a steady stream of penalty-free, potentially low-tax money every year. You bridge the gap with taxable brokerage withdrawals, Roth contribution basis, or cash savings during the first 5 years.",
      intermediate:
        "The mechanics: each year's conversion starts its own 5-year clock. Convert $50,000 in 2025 -- those dollars are accessible penalty-free in 2030. Convert $50,000 in 2026 -- accessible in 2031. And so on. You're building a 'ladder' where a new rung becomes available each year.\n\nThe 5-year bridge is the hardest part. Options: (1) Taxable brokerage account withdrawals (only gains are taxed, and LTCG rates may be 0% if your income is low enough). (2) Roth IRA contribution basis -- you can always withdraw what you originally contributed to a Roth (not conversions, not earnings) penalty-free at any age. (3) Cash/savings. (4) Part-time income.\n\nTax optimization during the ladder: in early retirement, your income might be near zero. You can convert enough to fill the 0% and 10% brackets almost for free. The standard deduction ($30,000 MFJ) alone means your first $30,000 of conversions is tax-free. Add the 10% bracket ($23,200) and you can convert ~$53,200 at an effective rate under 5%. Compare this to the 32-37% deduction rate you got when contributing during your high-earning years. The spread is your profit.",
      advanced:
        "ACA subsidy interaction: if you're under 65 and buying health insurance on the marketplace, your conversion income affects your premium tax credits. Too much conversion income can cost thousands in lost subsidies. The 'cliff' was eliminated by ARP (now extended through 2025), replacing it with a smooth phase-out, but conversions still affect subsidy amounts. Optimal strategy: convert just enough to stay below the threshold where subsidies phase out significantly, or convert aggressively if you have other coverage (spouse's employer plan, VA benefits, etc.).\n\nInteraction with other income: if you have rental income, dividends, or capital gains, these reduce your conversion space within low brackets. A comprehensive ladder strategy accounts for all income sources, not just conversion amounts.\n\nAlternative to the 5-year wait: Rule 72(t) / SEPP (Substantially Equal Periodic Payments) allows penalty-free withdrawals from Traditional IRAs before 59.5 based on a fixed schedule. This is inflexible (you must continue for 5 years or until 59.5, whichever is longer) but eliminates the 5-year bridge problem. Many early retirees combine a small 72(t) for immediate needs with a Roth Conversion Ladder for long-term flexibility."
    },
  },

  {
    id: "c2-03",
    slug: "tax-loss-harvesting",
    domainId: "d2",
    name: "Tax-Loss Harvesting",
    summary:
      "Selling investments at a loss to offset gains and reduce your tax bill -- then immediately buying something similar to stay invested. Legal, effective, and automated by some brokerages.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["tax-bracket-management", "asset-allocation"],
    layers: {
      accessible:
        "When an investment drops in value, you have a paper loss. Tax-loss harvesting turns that paper loss into a real tax benefit: sell the losing investment, use the loss to offset capital gains (and up to $3,000 of ordinary income per year), and immediately buy a similar (but not 'substantially identical') investment to stay in the market. You get the tax benefit without missing out on future growth. Example: you own a Vanguard S&P 500 fund that's down $10,000. Sell it, claim the $10,000 loss on your taxes, and buy a Schwab S&P 500 fund (similar exposure, different fund). You save ~$2,400 in taxes (at 24%) while maintaining the same market position.",
      intermediate:
        "The wash sale rule: you cannot buy a 'substantially identical' security within 30 days before or after the sale. Same fund, same share class = wash sale (loss disallowed). But buying a different fund that tracks a different index is fine: selling VTI (total US market) and buying SCHB (also total US market but different index provider) is generally accepted. Selling a Vanguard S&P 500 fund and buying a Fidelity S&P 500 fund tracking the same index is riskier -- the IRS has not given clear guidance.\n\nUnlimited loss carryforward: if your losses exceed your gains plus the $3,000 ordinary income offset, the excess carries forward indefinitely. A large market downturn can generate losses you use for years. The 2008-2009 crash generated losses that many investors were still harvesting against a decade later.\n\nWhere to harvest: only in taxable brokerage accounts. Tax-advantaged accounts (401k, IRA, HSA) have no capital gains taxes, so harvesting is pointless there. This is why tax-loss harvesting is most valuable for people who have significant money in taxable accounts after maxing out all tax-advantaged accounts.",
      advanced:
        "Automated tax-loss harvesting (Wealthfront, Betterment, and some Vanguard/Schwab services) monitors portfolios daily and harvests whenever a loss opportunity appears. Studies suggest this adds 0.5-1.5% per year in after-tax returns, though the benefit depends heavily on market volatility, account size, and tax bracket.\n\nThe cost basis trap: harvesting reduces your cost basis in the replacement position, which means larger gains when you eventually sell. Tax-loss harvesting is a tax DEFERRAL, not tax elimination. However, the deferral is extremely valuable: (1) money saved now can be invested, earning returns, (2) you might be in a lower bracket when you eventually realize the gain, (3) if you hold until death, the step-up in basis eliminates the deferred gain entirely.\n\nDirect indexing takes tax-loss harvesting to the next level: instead of holding an index fund, you hold the individual stocks in the index. This creates hundreds of individual positions, dramatically increasing harvesting opportunities (some stocks are down even when the index is up). Direct indexing requires significant assets ($100k+ minimum at most providers) but can generate 1-2% additional after-tax alpha through enhanced harvesting."
    },
  },

  // ─── Domain 3: Equity Compensation ─────────────────────────────────────

  {
    id: "c3-01",
    slug: "rsu-basics",
    domainId: "d3",
    name: "RSUs: Restricted Stock Units",
    summary:
      "The most common equity compensation for tech employees. Simpler than stock options but still misunderstood. They're taxed as ordinary income when they vest -- period.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["iso-vs-nso", "asset-allocation"],
    layers: {
      accessible:
        "RSUs are a promise from your employer to give you shares of company stock on a set schedule (the 'vesting schedule'). A typical schedule: 25% vests after one year, then the rest vests monthly or quarterly over the next three years. When RSUs vest, you receive actual shares -- and the full market value is taxed as ordinary income (like salary). If you get $100,000 in RSUs that vest and the stock price is $200/share, you receive 500 shares and owe income tax on the full $100,000. Your employer automatically withholds shares to cover taxes (typically 22-37% federal + state + FICA). The remaining shares are yours to keep or sell.",
      intermediate:
        "Key mistakes with RSUs: (1) Double-counting: your RSU grant is NOT free money on top of salary. Most companies factor RSU value into your total comp. A $200,000 total comp offer might be $140,000 salary + $60,000 RSUs. (2) Not selling at vest: once RSUs vest, holding them is a conscious decision to invest that amount in your company's stock. Ask yourself: 'If someone handed me $60,000 cash right now, would I use it all to buy my company's stock?' If not, sell some and diversify. (3) Basis confusion: your cost basis is the fair market value at vesting, not zero. If RSUs vest at $200/share and you sell later at $210/share, your taxable gain is $10/share, not $210/share. Many people overpay taxes because they don't track basis correctly.\n\nThe concentrated stock risk: if RSUs are a large percentage of your net worth, you have undiversified risk. Enron, Lehman Brothers, and WeWork employees learned this the hard way. Financial planners generally recommend keeping no more than 10-15% of your portfolio in any single stock, including your employer.",
      advanced:
        "RSU tax planning for high earners: (1) If your RSUs push you into a higher bracket in the vesting year, there's limited ability to defer (unlike options, RSUs vest automatically). However, you can manage other income: reduce Traditional 401(k) contributions to Roth (already paying high taxes, so the Roth deduction loss is small), harvest losses in taxable accounts to offset the vest income, or time other income recognition around vesting dates. (2) Net Unrealized Appreciation (NUA): does NOT apply to RSUs received as an employee. NUA only applies to employer stock held inside a 401(k). (3) Charitable giving: donating appreciated vested RSU shares (held >1 year post-vest) to charity gives a deduction for the full market value while avoiding capital gains tax on the appreciation."
    },
  },

  {
    id: "c3-02",
    slug: "iso-vs-nso",
    domainId: "d3",
    name: "ISOs vs NSOs: Stock Option Types",
    summary:
      "Two types of stock options, two very different tax treatments. ISOs can get capital gains treatment but trigger AMT. NSOs are simpler but always taxed as income.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["rsu-basics", "total-comp-analysis"],
    layers: {
      accessible:
        "Stock options give you the right to buy company stock at a set price (the 'strike price' or 'exercise price'). If the stock goes up, you profit from the difference. Two types exist: Incentive Stock Options (ISOs) get potentially favorable tax treatment but are complex. Non-Qualified Stock Options (NSOs) are straightforward: when you exercise (buy the stock), the difference between market price and strike price is taxed as ordinary income. ISOs: no ordinary income tax at exercise (just potential AMT), and if you hold the shares 1 year after exercise + 2 years after grant, the entire gain is taxed as long-term capital gains (15-20% instead of up to 37%). The catch: the 'spread' at exercise triggers Alternative Minimum Tax (AMT), which can create a surprise tax bill.",
      intermediate:
        "ISO qualifying disposition rules: to get the favorable long-term capital gains treatment, you must hold the shares for BOTH (1) 1 year after exercise AND (2) 2 years after the grant date. If you sell before either period, it's a 'disqualifying disposition' and the spread at exercise is taxed as ordinary income (same as an NSO). The AMT trap: the ISO spread (market price minus strike price) is added to your income for AMT calculation purposes. If you exercise $500,000 in ISOs and the spread is $400,000, you could owe ~$112,000 in AMT even though you haven't sold anything. If the stock drops after exercise, you owe AMT on gains you no longer have.\n\nThe 2017 TCJA increased the AMT exemption significantly ($85,700 single / $133,300 MFJ in 2025), meaning many ISO exercises that would have triggered AMT pre-2017 no longer do. But large exercises still can.\n\nNSOs are simpler: exercise, pay ordinary income tax on the spread, done. Any subsequent appreciation from the exercise price is capital gain. NSOs can be granted to contractors, advisors, and board members (ISOs are employee-only). NSOs have no AMT implications.",
      advanced:
        "Strategic ISO exercise: (1) Exercise early in the year -- if the stock drops and you sell before year-end, you can undo the AMT impact. (2) Exercise in a low-income year (between jobs, sabbatical) to minimize both regular tax and AMT. (3) 'Cashless exercise' (exercise and immediately sell) eliminates the holding period but also eliminates AMT risk and stock concentration risk. (4) Section 83(b) election: available for early-exercise options (not standard ISOs, but relevant for early-stage startups that allow early exercise). File within 30 days of exercise to be taxed on current value instead of future value.\n\nAMT credit: AMT paid due to ISO exercise generates an AMT credit carryforward that can offset future regular tax liability. This means the AMT is not a permanent extra tax but a timing difference -- you'll eventually get it back through lower taxes in future years. However, the recovery can take 5-15 years, and you need cash to pay the AMT upfront.\n\nFor startup employees: ISOs typically have a 90-day post-departure exercise window. If you leave the company, you must exercise within 90 days or lose the options. Some companies offer extended exercise windows (up to 10 years), which is highly valuable. Note: extending beyond 90 days converts ISOs to NSOs for tax purposes."
    },
  },

  // ─── Domain 6: Retirement Income ───────────────────────────────────────

  {
    id: "c6-01",
    slug: "safe-withdrawal-rate",
    domainId: "d6",
    name: "Safe Withdrawal Rate (The 4% Rule)",
    summary:
      "The most cited rule in retirement planning: withdraw 4% of your portfolio in year one, adjust for inflation, and you'll probably never run out of money. Probably.",
    complexityMin: 1,
    hasCalculator: true,
    relatedConceptSlugs: ["sequence-of-returns-risk", "roth-conversion-ladder"],
    layers: {
      accessible:
        "In 1994, financial planner William Bengen studied every 30-year period in US stock market history and found that a retiree who withdrew 4% of their portfolio in the first year of retirement, then adjusted that amount for inflation each year, never ran out of money -- even through the Great Depression and 1970s stagflation. This became the '4% Rule.' It implies: to retire, you need 25x your annual expenses saved (4% of 25x = 1x). If you spend $80,000/year, you need $2,000,000. If you spend $40,000/year, you need $1,000,000. The 4% Rule is a starting point, not gospel. It assumed a 50/50 stock/bond portfolio, 30-year retirement, and US market history. Your situation may differ.",
      intermediate:
        "Criticisms and refinements of the 4% Rule: (1) It's based on US market data, which had exceptional returns in the 20th century. International markets have had lower returns, suggesting 3-3.5% might be safer globally. (2) It assumes a fixed 30-year retirement. If you retire at 40, you need a 50-60 year plan, and 3.5% or lower is more appropriate. (3) It assumes you never adjust spending -- in reality, retirees cut spending when markets crash and spend more when portfolios grow. Flexible withdrawal strategies (Guyton-Klinger guardrails, VPW) outperform rigid rules.\n\nThe 'guardrails' approach: set a baseline withdrawal rate (4%), but reduce by 10% if your portfolio drops below 80% of its starting value, and increase by 10% if it grows above 120%. This dynamic approach had a 0% failure rate in historical simulations while allowing higher initial spending.\n\nSpending patterns in retirement are not flat. Research shows spending decreases in real terms through retirement ('the retirement spending smile'): higher spending in early active years, lower in middle years, then potentially higher again late in life due to healthcare costs. A 4% rule that assumes constant real spending overestimates needs in middle retirement and underestimates late-life healthcare costs.",
      advanced:
        "The Trinity Study (1998) formalized Bengen's work using Monte Carlo simulation across various portfolios. Key findings: (1) A 75/25 stock/bond allocation had the highest success rate at 4%, not the 50/50 Bengen tested. More stocks = more growth = more sustainability, despite higher volatility. (2) A 3% withdrawal rate had 100% success across ALL tested allocations for 30-year periods. (3) For 40+ year retirements, 3.25-3.5% is the historical safe rate.\n\nModern adjustments: (1) Low bond yields in the 2010s-2020s challenged the 4% rule because bonds provide less return than historical averages. Morningstar's 2024 research suggested 3.7% for new retirees with traditional portfolios. (2) Social Security and pensions reduce the amount of portfolio income needed, effectively increasing the safe withdrawal rate on the remaining portfolio. (3) Tax management (Roth conversions, capital gain harvesting, ACA subsidy optimization) can add 0.5-1% to sustainable spending by reducing the tax drag on withdrawals.\n\nThe 'die with zero' philosophy (Bill Perkins) challenges the entire framework: if you systematically underspend to avoid running out of money, you sacrifice experiences and leave a large unintended inheritance. The counterargument: uncertainty about lifespan, healthcare costs, and market returns makes a buffer rational. The compromise: use annuities or Social Security to cover baseline expenses, and spend portfolio assets more aggressively on experiences."
    },
    honestAnalysis:
      "The 4% Rule is the best starting point we have, but treating it as gospel is a mistake. Your actual safe withdrawal rate depends on your asset allocation, tax situation, Social Security, flexibility, time horizon, and risk tolerance. Use it as a framework, not a guarantee.",
  },

  {
    id: "c6-02",
    slug: "sequence-of-returns-risk",
    domainId: "d6",
    name: "Sequence of Returns Risk",
    summary:
      "The order your returns come in matters more than the average. Bad returns early in retirement can destroy a portfolio even if the long-term average is fine.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["safe-withdrawal-rate", "roth-conversion-ladder"],
    layers: {
      accessible:
        "Imagine two retirees, both starting with $1,000,000 and withdrawing $40,000/year. Both get an average 7% return over 30 years. Retiree A gets great returns in the first few years, then bad ones later. Retiree B gets terrible returns early, then great ones later. Same average return. Wildly different outcomes: Retiree A ends with $3 million. Retiree B runs out of money in year 22. Why? Because Retiree B was withdrawing money while the portfolio was shrinking, locking in losses. This is sequence of returns risk: the order of returns matters enormously when you're withdrawing money.",
      intermediate:
        "Sequence risk is only dangerous when you're WITHDRAWING. During accumulation (saving phase), bad early returns are actually helpful -- you buy more shares at lower prices (dollar-cost averaging). The risk flips when you start withdrawing: selling shares at low prices depletes the portfolio faster.\n\nThe 'retirement risk zone' is the 5 years before and 10 years after retirement. This 15-year window is when your portfolio is largest (so losses are biggest in absolute terms) and when early withdrawals can cause irreversible damage. Mitigation strategies: (1) Bond tent / rising equity glide path: increase bond allocation in the 5 years before retirement, then gradually shift back to stocks over the first 10 years. This reduces the impact of a crash right at retirement. (2) Cash buffer: keep 1-3 years of expenses in cash/short-term bonds so you don't have to sell stocks during a downturn. (3) Flexible spending: cut discretionary spending by 10-20% during market downturns. (4) Part-time income in early retirement provides a 'return floor' regardless of market conditions.",
      advanced:
        "Michael Kitces and Wade Pfau's research on the 'rising equity glide path' is counterintuitive: starting retirement with a lower stock allocation (30-40%) and gradually INCREASING it to 60-80% over 15 years produces better outcomes than the traditional approach of starting aggressive and becoming conservative. Why? The lower equity allocation at the start protects against sequence risk during the most vulnerable period. By the time equity allocation increases, withdrawals have reduced the portfolio's dependence on market returns.\n\nThe bucket strategy operationalizes sequence risk management: Bucket 1 (1-3 years of expenses in cash/CDs), Bucket 2 (3-7 years in bonds/stable investments), Bucket 3 (everything else in stocks). You spend from Bucket 1, refill it from Bucket 2 periodically, and refill Bucket 2 from Bucket 3 only when stocks are up. During a crash, you have 3-7 years of expenses without touching stocks, giving the market time to recover.\n\nSocial Security as sequence risk insurance: delaying Social Security to 70 increases the benefit by ~8%/year (guaranteed, inflation-adjusted). This provides a larger guaranteed income floor, reducing the amount of portfolio income needed and thus reducing exposure to sequence risk. For many retirees, spending portfolio assets from 62-70 while delaying Social Security is optimal sequence risk management."
    },
  },

  // ─── Domain 7: Investing ───────────────────────────────────────────────

  {
    id: "c7-01",
    slug: "asset-allocation",
    domainId: "d7",
    name: "Asset Allocation: The Only Decision That Really Matters",
    summary:
      "How you split your money between stocks, bonds, and other assets determines 90%+ of your portfolio's performance. Stock picking barely registers.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["asset-location", "tax-loss-harvesting"],
    layers: {
      accessible:
        "The Brinson study (1986, updated 1991) found that asset allocation -- the split between stocks, bonds, and cash -- explains about 90% of a portfolio's performance variation over time. Individual stock picking, market timing, and fund selection explain the remaining 10%. This is the most important finding in investment research and the most ignored. The simple version: decide what percentage of your portfolio should be in stocks (growth, volatile) vs bonds (stability, less growth), implement it with low-cost index funds, and rebalance annually. A 23-year-old should be nearly 100% stocks. A 65-year-old retiree might be 50-60% stocks. The exact number depends on your risk tolerance, time horizon, and income needs.",
      intermediate:
        "Common allocation frameworks: (1) Age in bonds rule (100 minus age = stock percentage): simple but too conservative for most people. A 30-year-old doesn't need 30% bonds. Updated version: 120 or 130 minus age. (2) Target-date funds: all-in-one funds that automatically shift from aggressive to conservative as you approach retirement. Vanguard 2060, Fidelity 2055, etc. These are an excellent default for people who don't want to think about allocation. (3) Risk-capacity approach: your allocation should reflect not just your willingness to accept volatility (risk tolerance) but your financial ability to absorb losses (risk capacity). A young tech worker with a secure job and no debt has high risk capacity regardless of how they feel about market drops.\n\nThe stock portion matters too: US vs international. Home bias is real -- US investors typically overweight US stocks because they're familiar. But the US is ~60% of global market cap, meaning 40% of the world's stock market value is outside the US. A globally diversified portfolio (60-70% US, 30-40% international) reduces country-specific risk.\n\nBonds as ballast: bonds aren't for returns -- they're for stability. When stocks drop 30-50%, bonds typically drop 5-10% or even rise. This allows rebalancing: sell bonds high, buy stocks low. The rebalancing bonus adds 0.5-1% annualized return over time.",
      advanced:
        "Alternative assets and their role: (1) REITs (Real Estate Investment Trusts): publicly traded real estate exposure. Tax-inefficient (dividends taxed as ordinary income), so best held in tax-advantaged accounts. 5-15% allocation adds diversification. (2) TIPS (Treasury Inflation-Protected Securities): bonds that adjust for inflation. Ideal for retirees whose primary risk is purchasing power erosion. (3) Commodities: low correlation to stocks but negative expected real returns over long periods. Questionable diversification benefit for long-term investors. (4) Cryptocurrency: too volatile and too new to have reliable risk/return estimates. If you include it, limit to 1-5% as a speculative position, not a strategic allocation.\n\nFactor investing: tilting toward size (small-cap), value, profitability, and momentum factors has historically produced excess returns over the market. The debate: are these returns compensation for bearing real risk (Fama-French view) or behavioral anomalies that will be arbitraged away (behavioral view)? Regardless, small-cap value has outperformed large-cap growth by ~2-3% annually over the past century, though with significant tracking error and long periods of underperformance.\n\nThe asset allocation decision is separate from the asset LOCATION decision (which assets go in which accounts). Tax-inefficient assets (bonds, REITs, actively managed funds) should go in tax-advantaged accounts. Tax-efficient assets (total stock market index funds, municipal bonds) should go in taxable accounts. Getting both decisions right maximizes after-tax wealth."
    },
  },

  {
    id: "c7-02",
    slug: "asset-location",
    domainId: "d7",
    name: "Asset Location: Which Account Holds What",
    summary:
      "Asset allocation decides what to own. Asset location decides where to own it. Putting the right assets in the right accounts can add 0.5-1% per year in after-tax returns.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["asset-allocation", "roth-vs-traditional", "hsa-triple-tax"],
    layers: {
      accessible:
        "You likely have multiple account types: 401(k) (tax-deferred), Roth IRA (tax-free), HSA (triple-tax-free), and a taxable brokerage account. The question: which investments should go in which account? The principle is simple: put your most tax-inefficient investments in the most tax-advantaged accounts. Bonds generate interest taxed as ordinary income (up to 37%) -- put them in your Traditional 401(k). REITs pay dividends taxed as ordinary income -- put them in your Roth. Total stock market index funds generate mostly long-term capital gains (taxed at 15-20%) and are tax-efficient -- fine for your taxable account.",
      intermediate:
        "The location hierarchy:\n\n1. HSA (triple tax advantage): highest-return assets here. Stock index funds, growth funds. This is the best account for aggressive investments because gains are never taxed if used for medical expenses.\n\n2. Roth IRA/401(k) (tax-free growth and withdrawal): put your highest-expected-return assets here -- stocks, small-cap value, REITs. These assets produce the most growth, and all of it is tax-free.\n\n3. Traditional 401(k)/IRA (tax-deferred): bonds, bond funds, TIPS. The interest is taxed as ordinary income anyway, so there's no benefit to holding bonds in a taxable account. Deferring the tax is pure gain.\n\n4. Taxable brokerage: tax-efficient stock index funds (low turnover, qualified dividends), municipal bonds (tax-free interest), individual stocks for tax-loss harvesting.\n\nThe anti-pattern: many people hold the same target-date fund in every account. This wastes the tax advantages because you're putting tax-inefficient bonds in your taxable account and tax-efficient stocks in your Traditional 401(k).",
      advanced:
        "Quantitative estimates of asset location benefit vary: William Reichenstein's research suggests 0.2-0.5% annually for moderate portfolios, while other studies show up to 1% for investors with high bond allocations and high tax brackets. The benefit increases with: (1) larger spreads between tax rates (high marginal rate during accumulation), (2) longer time horizons (more time for tax-free compounding), and (3) greater asset diversity across accounts.\n\nEdge cases: (1) If all your retirement money is in Roth (no Traditional), asset location is irrelevant within retirement accounts -- everything is tax-free. (2) If you're doing Roth conversions, the Traditional 401(k) will eventually become Roth, so you want high-growth assets there now to maximize the value converted. This temporarily inverts the standard advice (stocks in Traditional, bonds in taxable). (3) For very large taxable accounts, municipal bonds may be more valuable than corporate bonds in a Traditional 401(k) -- run the after-tax yield comparison.\n\nThe most common mistake: asset location only matters for the TAXABLE vs TAX-ADVANTAGED decision. Within tax-advantaged accounts, it matters less (Roth vs Traditional is a question of current vs future tax rates, not asset type). The priority order for optimization: (1) Save enough. (2) Get the right asset allocation. (3) Use tax-advantaged accounts. (4) Optimize asset location. Most people never get past step 1."
    },
  },

  // ─── Domain 11: Behavioral Finance ─────────────────────────────────────

  {
    id: "c11-01",
    slug: "loss-aversion",
    domainId: "d11",
    name: "Loss Aversion: Why Losing Hurts Twice as Much",
    summary:
      "Humans feel the pain of losing $100 about twice as strongly as the pleasure of gaining $100. This asymmetry explains most of our worst financial decisions.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["recency-bias", "sequence-of-returns-risk"],
    layers: {
      accessible:
        "Daniel Kahneman and Amos Tversky's prospect theory (Nobel Prize, 2002) showed that losing money feels about twice as painful as gaining the same amount feels good. This means: (1) You'll hold losing investments too long, hoping to break even rather than accepting the loss (disposition effect). (2) You'll sell winning investments too early, locking in gains before they evaporate. (3) You'll avoid the stock market entirely after experiencing a loss, missing the recovery. (4) You'll check your portfolio too often -- the more frequently you look, the more likely you'll see a loss, and the more pain you'll feel. The solution: automate your investments (set it and forget it), check your portfolio quarterly at most, and remember that short-term losses are the price you pay for long-term gains.",
      intermediate:
        "Loss aversion creates measurable portfolio damage. Dalbar's annual study consistently shows that the average investor earns 3-4% less than the funds they invest in, primarily because of behavior: buying after markets rise (feeling confident), selling after markets fall (feeling afraid). Over 30 years, this behavior gap costs more than most people's houses.\n\nThe myopic loss aversion experiment: investors who checked their portfolios monthly allocated 40% to stocks. Investors who checked annually allocated 70% to stocks. Same people, same options, same information -- just different check frequencies. The monthly checkers saw more temporary losses and became more conservative, earning significantly less over time.\n\nPractical countermeasures: (1) Pre-commit to an investment plan when calm (Investment Policy Statement). (2) Automate contributions and rebalancing so decisions don't depend on how you feel. (3) Reframe losses as 'buying on sale' -- a 30% market drop means everything is 30% cheaper. (4) Keep a 'panic fund' (1 month of expenses in checking) so you never have to sell investments to cover bills during a crash.",
      advanced:
        "Loss aversion interacts with other biases to create destructive feedback loops. During market crashes: recency bias (expecting recent trends to continue) + loss aversion (pain of further losses) + herding (everyone else is selling) = panic selling at the bottom. During bubbles: recency bias (stocks only go up) + FOMO + overconfidence = buying at the top. The combination is what makes the average investor systematically buy high and sell low.\n\nThe institutional response: target-date funds, robo-advisors, and auto-enrollment in 401(k)s are all designed to protect people from their own loss aversion. Behavioral finance research has directly shaped policy: the Pension Protection Act of 2006 (allowing auto-enrollment) has increased retirement savings rates by 20-40% at companies that adopted it. The nudge architecture works because it removes decision points where loss aversion would otherwise cause inaction or panic."
    },
  },

  {
    id: "c11-02",
    slug: "recency-bias",
    domainId: "d11",
    name: "Recency Bias",
    summary:
      "The tendency to expect recent trends to continue forever. US stocks crushed international for 15 years, so everyone owns only US stocks. Until they don't.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["loss-aversion", "asset-allocation"],
    layers: {
      accessible:
        "Recency bias is the tendency to weight recent events more heavily than historical data when making predictions. In investing, this means: if US stocks have outperformed international stocks for the past decade, you assume they always will. If crypto went up 300% last year, you assume it will keep going. If a stock dropped 50%, you assume it will drop more. This bias makes people performance-chase: they pour money into whatever performed best recently and abandon what underperformed. The problem: reversion to the mean is one of the strongest forces in investing. What outperforms in one decade often underperforms in the next.",
      intermediate:
        "Historical evidence of reversion: US stocks outperformed international stocks from 2010-2024 by a wide margin. But from 2000-2009, international stocks outperformed the US by ~3% annually. From 1970-1989, international stocks dominated. The cycle repeats. Investors who went all-US after the 2010s tech boom would have been wrong in every previous cycle.\n\nThe same pattern exists in asset classes: (1) Growth vs value: growth dominated 2010-2020; value dominated 2000-2007 and has historically outperformed over full cycles. (2) Large vs small cap: large caps dominated recently; small caps outperformed for most of the 20th century. (3) Bonds: the 40-year bond bull market (1981-2020) convinced many people that bonds always provide stability and returns. The 2022 bond crash (-13% for aggregate bonds) was a rude awakening.\n\nThe Callan Periodic Table of Investment Returns is the best visual antidote to recency bias: it shows asset class returns ranked by performance each year. The 'quilt chart' reveals how dramatically leadership rotates -- there is no asset class that consistently leads.",
      advanced:
        "The mechanism behind reversion to the mean: (1) Valuation: outperformance drives up prices, which reduces future expected returns. The CAPE ratio (Cyclically Adjusted P/E) of US stocks is ~33 in 2025 vs ~15 for international developed markets. Higher valuations predict lower future returns with reasonable reliability over 10+ year periods. (2) Capital flows: outperformance attracts capital, which drives up prices further (momentum), but eventually the inflows create overvaluation that corrects (reversion). (3) Economic cycles: the factors that drove one decade's outperformance (US tech dominance, dollar strength, low rates) can reverse in the next.\n\nThe implication for portfolio construction: maintain a diversified allocation REGARDLESS of recent performance. Rebalancing is the mechanism that forces you to buy low and sell high -- selling some of the recent winner and buying more of the recent loser. This is emotionally difficult (recency bias screams 'sell the losers, buy the winners') but empirically sound."
    },
  },

  // ─── Domain 8: Estate Planning ─────────────────────────────────────────

  {
    id: "c8-01",
    slug: "estate-planning-basics",
    domainId: "d8",
    name: "Estate Planning Basics: Step-Up in Basis and the Gift Tax",
    summary:
      "The two most important estate concepts: the step-up in basis (the biggest tax loophole in the code) and the gift/estate tax exemption ($13.6M per person in 2025).",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["asset-allocation", "529-plan"],
    layers: {
      accessible:
        "When you die, something remarkable happens to your investments: the cost basis 'steps up' to the current market value. If you bought $100,000 of stock that is now worth $1,000,000, your heirs inherit it with a basis of $1,000,000 -- and they owe ZERO capital gains tax on the $900,000 gain. If they sell the next day at $1,000,000, their taxable gain is $0. This is the step-up in basis, and it is the single largest tax benefit in the entire US tax code. It means capital gains accumulated over a lifetime can completely escape taxation.\n\nThe gift and estate tax: in 2025, each person can transfer up to $13.61 million (or $27.22 million for a married couple) during life or at death without paying federal gift/estate tax. Anything above that is taxed at 40%. The annual gift exclusion lets you give $19,000 per person per year ($38,000 from a married couple) without even counting toward your lifetime exemption.",
      intermediate:
        "The step-up in basis creates a powerful incentive: NEVER sell highly appreciated assets during your lifetime if you can avoid it. Instead, borrow against them (interest may be deductible), live off the loan proceeds, and let the assets pass to heirs with a stepped-up basis. This is the 'buy, borrow, die' strategy used by the ultra-wealthy.\n\nWarning: the $13.61M exemption is currently set to drop to approximately $7 million per person on January 1, 2026, when the Tax Cuts and Jobs Act (TCJA) provisions expire. If you have an estate near or above $7 million, 2025 may be the last year to use the higher exemption. Strategies: make large gifts now, fund irrevocable trusts, or use the exemption through other planning vehicles.\n\nCommon estate planning documents everyone needs (regardless of wealth): (1) Will -- who gets your stuff and who raises your minor children. (2) Revocable living trust -- avoids probate, maintains privacy, provides seamless management if you become incapacitated. (3) Durable Power of Attorney -- who makes financial decisions if you can't. (4) Healthcare Directive/Living Will -- what medical care you want if you can't communicate. (5) Beneficiary designations on retirement accounts and life insurance -- these override your will.",
      advanced:
        "Advanced estate planning techniques: (1) Grantor Retained Annuity Trust (GRAT): transfer appreciating assets to an irrevocable trust, receive annuity payments back over a set term, and anything above the IRS 'hurdle rate' (7520 rate, currently ~5%) passes to beneficiaries tax-free. Effective when interest rates are high and asset appreciation is expected. (2) Spousal Lifetime Access Trust (SLAT): an irrevocable trust where your spouse is the beneficiary, removing assets from your estate while maintaining indirect access. Popular before the exemption sunset. (3) Charitable Remainder Trust (CRT): donate appreciated assets, receive income for life, avoid capital gains tax, get a partial charitable deduction, and the remainder goes to charity. (4) Dynasty Trust: a trust designed to last multiple generations, avoiding estate tax at each generational transfer.\n\nThe 'clawback' question: if you use the $13.61M exemption now and it drops to $7M in 2026, will the IRS claw back the excess gifts? The IRS has issued anti-clawback regulations (November 2019) confirming they will NOT claw back. Gifts made under the current exemption are protected even if the exemption drops. This is the strongest argument for acting before 2026."
    },
    honestAnalysis:
      "The step-up in basis is a massive wealth preservation tool that primarily benefits the wealthy. The buy-borrow-die strategy is legal but raises legitimate fairness questions. Understanding how the system actually works -- rather than how you think it should work -- is essential for making good financial decisions within it.",
  },

  // ─── Domain 9: Insurance ───────────────────────────────────────────────

  {
    id: "c9-01",
    slug: "term-vs-permanent",
    domainId: "d9",
    name: "Term vs Permanent Life Insurance (Honest Analysis)",
    summary:
      "Term life insurance is almost always the right answer. Permanent (whole, universal, IUL) is almost always sold, not bought. Here's the math both sides use.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["estate-planning-basics", "asset-allocation"],
    layers: {
      accessible:
        "Term life insurance is simple: you pay a fixed premium for a fixed period (10, 20, or 30 years), and if you die during that period, your beneficiaries get a death benefit. A healthy 30-year-old can get $1 million of 20-year term coverage for about $30-50/month. Permanent life insurance (whole life, universal life, indexed universal life / IUL) lasts your entire life and includes a 'cash value' investment component. It costs 5-15x more than term for the same death benefit. The insurance industry pushes permanent policies because the commissions are 10-100x higher than term. The honest truth: for 90%+ of people, 'buy term and invest the difference' in index funds produces more wealth than any permanent policy.",
      intermediate:
        "Why permanent life insurance is usually a bad deal: (1) High fees. Whole life policies have internal costs of 1-3% annually. IUL policies have caps on returns (you don't get full market upside), floors (you don't lose money, but you give up the upside for that protection), and spread/participation rate charges. (2) Illiquidity. Cash value is tied up in the policy. Accessing it means surrendering the policy (losing the death benefit and paying surrender charges) or taking a loan against it (interest charges reduce your benefit). (3) Opportunity cost. The premium difference between term and permanent, invested in a simple index fund, almost always produces more wealth over 20-30 years.\n\nWhen permanent life insurance DOES make sense: (1) High-net-worth estate planning: if your estate exceeds the gift/estate tax exemption and you need permanent liquidity to pay estate taxes. An Irrevocable Life Insurance Trust (ILIT) can hold a permanent policy outside your estate, providing tax-free cash to pay the estate tax bill. (2) Families with special needs dependents who will need lifelong financial support (term would expire). (3) Business succession planning: key-person insurance, buy-sell agreements.\n\nThe IUL sales pitch: 'market-linked returns with no downside risk, plus tax-free retirement income through policy loans.' The reality: caps limit your upside (typically 8-12%), participation rates may give you only 50-100% of the index return, and the internal costs eat into the growth. Net returns typically end up at 3-5% -- comparable to a conservative bond portfolio but with far less liquidity and transparency.",
      advanced:
        "The 'buy term and invest the difference' analysis: $1M 20-year term for a 35-year-old = ~$50/month. $1M whole life = ~$800/month. Difference: $750/month invested in a total market index fund at 7% real return for 20 years = ~$390,000. The whole life policy's cash value after 20 years: typically $200,000-$280,000 (after commissions, mortality charges, and policy fees). The term + invest approach wins by $100,000-$190,000.\n\nThe dividend argument for whole life: mutual insurance companies (Northwestern Mutual, Mass Mutual, Guardian) pay dividends on whole life policies. Advocates argue that participating whole life with paid-up additions provides guaranteed growth + dividends + tax advantages. The best whole life policies from top mutual companies do produce reasonable long-term returns (4-5% after costs, tax-advantaged). But you must hold them for 15-20+ years for the math to work, and you must overfund them (paid-up additions) to maximize the cash value relative to the death benefit.\n\nThe honest framework: (1) If you need life insurance and are not wealthy, buy term. (2) If you've maxed out all tax-advantaged accounts, have no debt, and have a specific estate planning need, THEN consider permanent life insurance as a tax-advantaged vehicle. (3) Never buy permanent insurance from someone who earns a commission on it without getting a second opinion from a fee-only financial planner."
    },
    honestAnalysis:
      "The insurance industry has enormous financial incentives to sell permanent policies. Agent commissions on a permanent policy are typically 50-100% of the first year's premium -- vs 30-70% for term. This creates a systemic bias in advice. Fee-only fiduciaries almost universally recommend term for most people. Commission-based agents almost universally recommend permanent. Draw your own conclusion.",
  },

  // ─── Domain 10: Debt Strategy ──────────────────────────────────────────

  {
    id: "c10-01",
    slug: "debt-avalanche-vs-snowball",
    domainId: "d10",
    name: "Debt Avalanche vs Snowball",
    summary:
      "The avalanche method (highest interest first) is mathematically optimal. The snowball method (smallest balance first) is psychologically powerful. Both beat doing nothing.",
    complexityMin: 1,
    hasCalculator: true,
    relatedConceptSlugs: ["loss-aversion"],
    layers: {
      accessible:
        "If you have multiple debts, which do you pay off first? Two approaches: Avalanche: pay minimum on everything, then throw all extra money at the debt with the HIGHEST interest rate. When it's gone, move to the next highest. This saves the most money in interest -- it's the math-optimal approach. Snowball: pay minimum on everything, then throw all extra money at the SMALLEST balance. When it's gone, move to the next smallest. This creates 'quick wins' that build motivation -- it's the psychology-optimal approach. Dave Ramsey popularized the snowball. Most financial planners recommend the avalanche. The truth: both work. The best method is the one you'll actually stick with. If you need motivation, go snowball. If you're disciplined and want to minimize total interest, go avalanche.",
      intermediate:
        "The math difference is real but often smaller than people assume. Example: $30,000 in debt across 4 cards (rates: 24%, 18%, 12%, 6%; balances: $8,000, $5,000, $12,000, $5,000). The avalanche saves about $1,200 in interest over the snowball method. That's meaningful but not life-changing. The behavioral difference is larger: studies show that people using the snowball method are more likely to become debt-free because the early wins (eliminating the first small balance) create momentum and motivation.\n\nA hybrid approach: if your highest-interest debt also has a small balance, both methods agree -- pay that first. If your highest-interest debt has the largest balance (common with credit cards), consider a modified approach: pay off one small debt first for psychological momentum, then switch to the avalanche for all remaining debts.\n\nWhat to do BEFORE choosing a method: (1) Build a $1,000 emergency fund so you don't add more debt during the payoff process. (2) Get current on all payments. (3) Stop using the credit cards. (4) Check for balance transfer offers (0% APR for 12-18 months) to reduce interest while paying down principal.",
      advanced:
        "The optimal debt payoff strategy depends on more than just the debt itself. Consider: (1) 401(k) match: if your employer matches contributions, the match is a guaranteed 50-100% return -- higher than any debt interest rate. Always get the full match before accelerating debt payoff. (2) High-interest debt vs investing: any debt above ~7% should be paid off before investing in taxable accounts. Below 4% (like a low-rate mortgage), investing typically wins. The 4-7% range is a gray area that depends on risk tolerance and tax situation. (3) Tax deductibility: mortgage interest and student loan interest are tax-deductible, reducing their effective rate. A 5% mortgage at a 24% marginal rate effectively costs 3.8%. (4) Behavioral considerations: if debt causes you significant stress, the psychological benefit of paying it off may justify suboptimal financial math."
    },
  },

  // ─── Domain 4: Real Estate ─────────────────────────────────────────────

  {
    id: "c4-01",
    slug: "buy-vs-rent",
    domainId: "d4",
    name: "Buy vs Rent: The Real Math",
    summary:
      "Buying is not always better than renting. The real comparison includes maintenance, taxes, opportunity cost, and transaction costs -- not just 'building equity vs throwing money away.'",
    complexityMin: 1,
    hasCalculator: true,
    relatedConceptSlugs: ["asset-allocation", "tax-bracket-management"],
    layers: {
      accessible:
        "The claim 'renting is throwing money away' is one of the most repeated and most misleading financial truisms. When you own a home, you also 'throw away' money on: mortgage interest ($150,000-$400,000+ over the life of a 30-year mortgage), property taxes (1-3% of home value annually, forever), maintenance (1-2% of home value annually), insurance, HOA fees, and transaction costs (5-6% when you sell). The rent vs buy decision depends on: how long you plan to stay (buying only makes sense if 5+ years), the price-to-rent ratio in your area (if the monthly cost of buying is much higher than renting, renting + investing wins), and what you'd do with the money saved by renting (invest it, or spend it?).",
      intermediate:
        "The price-to-rent ratio: take the purchase price and divide by annual rent. A ratio under 15 favors buying. 15-20 is a toss-up. Over 20 favors renting. In many major cities (San Francisco, New York, Seattle), ratios exceed 25-30, meaning renting and investing the difference significantly outperforms buying.\n\nThe opportunity cost: a $100,000 down payment invested in the stock market at 7% grows to $386,000 in 20 years. If you put it into a house instead, you get the appreciation on the house (historically 3-4% nationally) but lose the stock market return on that capital. The house 'wins' only if you factor in leverage (the house appreciates on its full value, not just your equity) AND if the house appreciates faster than inflation + your mortgage rate.\n\nThe leverage cuts both ways: with 20% down on a $500,000 house, you have 5:1 leverage. A 20% increase in home value ($100,000) is a 100% return on your $100,000 down payment. But a 20% decrease means you've lost 100% of your equity. Leverage amplifies both gains and losses.\n\nTax benefits of ownership: mortgage interest deduction is only valuable if you itemize (and the TCJA raised the standard deduction so high that most homeowners no longer itemize). The $250k/$500k capital gains exclusion on your primary residence is genuinely valuable if your home appreciates significantly.",
      advanced:
        "The NYT's 'Is It Better to Buy or Rent?' calculator is the gold standard for this analysis. It accounts for all factors: purchase price, rent equivalent, mortgage rate, down payment, property taxes, maintenance, insurance, investment return, tax rates, and time horizon. The key inputs that swing the result: (1) Time horizon (buying wins at 7+ years in most scenarios, renting wins under 5 years). (2) Investment return assumption (at 10% market return, renting wins more often; at 5%, buying wins more). (3) Home price appreciation rate (at 2% real appreciation, renting often wins; at 4%+, buying wins).\n\nThe 'forced savings' argument for homeownership has merit: many people who would not otherwise invest will build equity through mortgage payments. If the realistic alternative to homeownership is spending (not investing) the difference, buying wins by default because it forces wealth accumulation. This is a behavioral argument, not a mathematical one, but it's valid for many people.\n\nHousing as an inflation hedge: your mortgage payment is fixed (assuming a fixed-rate mortgage) while rents increase with inflation. After 20+ years of inflation, the real cost of your mortgage payment has decreased substantially while renters are paying market rates. This long-term inflation protection is a real benefit of ownership that simple calculators often underweight."
    },
    honestAnalysis:
      "The real estate industry has enormous financial incentives to promote homeownership. Agents earn 5-6% commissions. Lenders earn origination fees and interest. The cultural narrative 'renting is throwing money away' serves these interests. The actual math is situation-dependent, and for many people in high-cost markets on short time horizons, renting and investing is the better financial choice.",
  },

  // ─── Domain 5: Business Finance ────────────────────────────────────────

  {
    id: "c5-01",
    slug: "s-corp-optimization",
    domainId: "d5",
    name: "S-Corp Tax Optimization",
    summary:
      "The most valuable tax strategy for self-employed people earning $60k+. Pay yourself a reasonable salary, take the rest as distributions, and save 15.3% SE tax on the distribution portion.",
    complexityMin: 2,
    hasCalculator: true,
    relatedConceptSlugs: ["tax-bracket-management", "mega-backdoor-roth"],
    layers: {
      accessible:
        "If you're self-employed (freelancer, consultant, contractor, small business owner) earning more than ~$60,000/year, an S-Corporation election could save you thousands in taxes annually. Here's how: as a sole proprietor, you pay 15.3% self-employment tax (Social Security + Medicare) on ALL your net income. With an S-Corp, you pay yourself a 'reasonable salary' (which is subject to payroll taxes) and take the remaining profit as a 'distribution' (which is NOT subject to self-employment tax). Example: you earn $150,000. As a sole proprietor, you pay ~$21,200 in SE tax. As an S-Corp with a $70,000 salary, you pay SE tax only on $70,000 (~$10,700), saving ~$10,500.",
      intermediate:
        "The 'reasonable salary' requirement: the IRS requires S-Corp owners to pay themselves a salary that is reasonable for the type of work they do. You cannot pay yourself $20,000 salary and take $130,000 as distribution -- the IRS will reclassify the distribution as salary and charge you back taxes plus penalties. General guidance: the salary should be what you'd pay someone to do your job. For most professionals, 40-60% of net income is a safe range.\n\nThe cost-benefit analysis: S-Corps have additional costs: (1) Payroll processing ($50-200/month). (2) Additional tax return (Form 1120-S, ~$500-1,500 to prepare). (3) State filing fees ($100-800 depending on state). (4) Potential franchise tax (California charges $800/year minimum). The total additional cost is $2,000-$5,000/year. If your SE tax savings exceed this, the S-Corp is worth it. The breakeven is typically around $50,000-$70,000 in net self-employment income.\n\nRetirement plan advantages: as an S-Corp, you can contribute to a Solo 401(k) both as an employee (up to $23,500) AND as an employer (up to 25% of salary). A $100,000 salary allows $23,500 employee + $25,000 employer = $48,500 in tax-deferred contributions. Add after-tax contributions for Mega Backdoor Roth and total savings can exceed $70,000/year.",
      advanced:
        "Advanced S-Corp strategies: (1) Qualified Business Income (QBI) deduction: the 20% QBI deduction under Section 199A applies to S-Corp distributions but NOT to salary. Higher distributions = larger QBI deduction. This creates tension with the 'reasonable salary' requirement -- you want salary high enough to satisfy the IRS but low enough to maximize QBI deduction and minimize payroll taxes. (2) Accountable plan: the S-Corp can reimburse the owner for business expenses (home office, mileage, phone, internet) tax-free through an accountable plan, reducing both income tax and SE tax. (3) Health insurance: the S-Corp can pay the owner's health insurance premiums, which are then deductible on the owner's personal return (line 1 of Schedule 1, not an itemized deduction). (4) State-level pass-through entity tax (PTET): many states now allow S-Corps to pay state tax at the entity level, effectively allowing owners to deduct state taxes beyond the $10,000 SALT cap.\n\nThe S-Corp vs C-Corp question has been reopened by the TCJA's 21% flat corporate rate. For businesses that retain significant earnings (rather than distributing them), a C-Corp may be more tax-efficient. But for service businesses that distribute most income, S-Corp remains superior. The analysis depends on income level, distribution patterns, state taxes, and whether the business is being built for sale (C-Corp treatment may be preferable for QSBS exclusion)."
    },
  },

  // ─── Domain 12: Career Finance ─────────────────────────────────────────

  {
    id: "c12-01",
    slug: "total-comp-analysis",
    domainId: "d12",
    name: "Total Compensation Analysis",
    summary:
      "Your salary is not your compensation. Benefits, equity, retirement match, insurance, and perks can add 20-50% to the total value. Learn to evaluate the whole package.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["rsu-basics", "roth-vs-traditional", "hsa-triple-tax"],
    layers: {
      accessible:
        "When comparing job offers, most people focus on salary. This is a mistake. Total compensation includes: (1) Base salary. (2) Bonus (guaranteed vs target -- there's a big difference). (3) Equity (RSUs, stock options, profit sharing). (4) 401(k) match (a 6% match on a $150,000 salary = $9,000/year in free money). (5) Health insurance (employer contribution can be $10,000-$25,000/year). (6) HSA contributions (some employers contribute $500-$1,500). (7) Other benefits: ESPP, education reimbursement, commuter benefits, parental leave. A $140,000 offer with great benefits can be worth more than a $160,000 offer with minimal benefits.",
      intermediate:
        "How to calculate and compare: (1) Base salary (annualized). (2) Expected bonus: use the target bonus percentage multiplied by the company's historical payout rate. A '20% target bonus' at a company that paid 90-110% of target is worth ~$28,000 on a $140,000 base. At a company that paid 50-70% of target, it's worth ~$14,000. (3) Equity: for RSUs, take the annual vesting amount at current stock price. For options, the value depends on strike price vs current price and vesting schedule. (4) 401(k) match: the full match amount if you contribute enough to get it (and you should always get the full match). (5) Health insurance: the employer's contribution to premiums (listed on your benefits statement).\n\nThe benefits most people undervalue: (1) Mega Backdoor Roth availability (worth $10,000-$20,000/year in tax savings for high earners). (2) ESPP with a 15% discount (guaranteed 15% return if you sell immediately -- one of the best guaranteed returns available). (3) Extended parental leave (the financial value of 16 weeks vs 6 weeks is enormous). (4) Remote work (saving commute costs, time, and enabling geographic arbitrage).",
      advanced:
        "Negotiation leverage points most people miss: (1) Signing bonus: companies are more flexible on one-time costs than recurring salary. A $20,000 signing bonus is easier to get than a $10,000 salary increase. (2) Equity refresh grants: annual RSU grants on top of the initial offer. Ask what the typical refresh range is for your level. (3) Level negotiation: getting hired at a higher level (Senior vs Mid) has compounding effects -- higher salary bands, larger equity grants, bigger bonuses, and faster promotion trajectory. The lifetime value of a level bump can exceed $500,000. (4) PTO: at a $200,000 total comp, each day of PTO is worth ~$770. An extra week of PTO is equivalent to a $3,850 raise.\n\nThe geographic arbitrage calculation: a fully remote role paying $200,000 SF-market rates while living in a city with 50% lower cost of living is equivalent to ~$300,000 in purchasing power. After the remote work normalization of 2020-2024, this is one of the largest financial optimizations available to knowledge workers. The risk: some companies are adjusting pay for location, reducing the arbitrage."
    },
  },

  // ─── Domain 13: International ──────────────────────────────────────────

  {
    id: "c13-01",
    slug: "feie-foreign-tax-credit",
    domainId: "d13",
    name: "FEIE vs Foreign Tax Credit",
    summary:
      "Americans abroad: you still owe US taxes. The Foreign Earned Income Exclusion and Foreign Tax Credit are your two tools -- and choosing wrong can cost you thousands.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["tax-bracket-management", "roth-vs-traditional"],
    layers: {
      accessible:
        "The US is one of only two countries (with Eritrea) that taxes its citizens on worldwide income regardless of where they live. If you're an American living abroad, you file US taxes on everything you earn globally. Two mechanisms offset this: (1) Foreign Earned Income Exclusion (FEIE): excludes up to $130,000 (2025) of foreign earned income from US taxation. You pay zero US tax on that amount. (2) Foreign Tax Credit (FTC): credits foreign taxes paid against your US tax bill dollar-for-dollar. If you paid $30,000 in UK taxes, you reduce your US tax by $30,000. You can use one or the other for earned income in a given year.",
      intermediate:
        "Which to choose depends on your income and the foreign country's tax rate: (1) If you live in a low-tax country (UAE, Singapore, Panama) and earn under $130,000: FEIE eliminates your US tax entirely. Easy choice. (2) If you live in a high-tax country (UK, Germany, France, Japan) and earn over $130,000: FTC is usually better because the foreign taxes you paid exceed what you'd owe the US, generating excess credits you can carry forward. (3) If you earn under $130,000 in a high-tax country: FEIE may seem to eliminate US tax, but it also eliminates your ability to claim foreign tax credits on that income. The excess foreign taxes are 'wasted.'\n\nCritical FEIE limitation: the FEIE only applies to EARNED income (salary, self-employment). Investment income, rental income, pensions, and Social Security are NOT excludable. If you have significant investment income, FEIE alone won't cover your US tax situation.\n\nThe FEIE stacking penalty: if you use FEIE to exclude $130,000 of income, your remaining income is taxed starting at the rate that WOULD apply if the excluded income were included. This means your 'first dollar' above the exclusion is not taxed at 10% -- it's taxed at whatever bracket $130,000+ of income falls in. This surprises many expats.",
      advanced:
        "Strategic considerations: (1) FEIE election is revocable but with a 5-year waiting period to re-elect after revocation. Choosing FTC initially keeps all options open. (2) Self-employed expats who take FEIE still owe self-employment tax on excluded income (FEIE only excludes income tax, not SE tax). FTC with an S-Corp (paying yourself a salary in the foreign country) may be more efficient. (3) Housing exclusion/deduction: in addition to FEIE, you can exclude or deduct foreign housing costs above a base amount (~$19,500 in 2025). In high-cost cities (London, Tokyo, Hong Kong), this adds $15,000-$35,000 in additional exclusion. (4) Treaty benefits: US tax treaties with many countries provide additional protections (reduced withholding on dividends, pension exemptions). Treaty provisions override the Code where they are more favorable.\n\nFBAR and FATCA: any American with foreign financial accounts exceeding $10,000 aggregate at any point during the year must file FinCEN Form 114 (FBAR). Failure to file carries penalties of $10,000-$100,000+ per violation. FATCA (Form 8938) has higher thresholds but applies to a broader range of foreign assets. These are reporting requirements only -- they don't create additional tax -- but the penalties for non-filing are severe."
    },
    honestAnalysis:
      "The US global taxation system is genuinely burdensome for Americans abroad. Many expats are unaware of their filing obligations until they face penalties. The FEIE/FTC choice is not a DIY decision for most situations -- a CPA specializing in expat taxes is a necessary expense.",
  },

  // ─── Additional Concepts for Thin Domains ──────────────────────────────

  {
    id: "c4-02",
    slug: "house-hacking",
    domainId: "d4",
    name: "House Hacking: Live Free While Building Wealth",
    summary:
      "Buy a multi-unit property, live in one unit, rent the others. Your tenants pay your mortgage while you build equity.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["buy-vs-rent"],
    layers: {
      accessible:
        "House hacking is simple: buy a duplex, triplex, or fourplex. Live in one unit. Rent out the others. Your tenants' rent covers most or all of your mortgage payment, so you live for free (or close to it) while building equity in a property that appreciates over time.\n\nThe magic is that properties with 1-4 units qualify for residential mortgages. That means you can put down as little as 3.5% (FHA) instead of the 20-25% required for investment properties. You get investor benefits at homeowner mortgage rates.\n\nExample: buy a duplex for $400K with 3.5% down ($14K). Your mortgage is $2,400/month. You rent the other unit for $1,800/month. Your net housing cost: $600/month. Your neighbor in a comparable single-family home pays $2,400/month. You're saving $1,800/month -- $21,600/year -- while building equity in a $400K asset.",
      intermediate:
        "FHA loans allow 3.5% down on properties up to 4 units, but you must live in one unit for at least 12 months (owner-occupancy requirement). After 12 months, you can move out and rent all units, or refinance into a conventional loan and buy your next house hack.\n\nThe numbers that matter: (1) Debt-to-income ratio: lenders count 75% of projected rental income toward your qualifying income. (2) Cash-on-cash return: if you put $14K down and your tenants cover all but $600/month of your costs, you're paying $7,200/year for a $400K asset -- a 5.7x leveraged position. (3) Appreciation: at 3% annual appreciation, your $400K property gains $12K in year one. On your $14K investment, that's an 86% return before rental income.\n\nCommon strategies: (1) Live-in flip: buy, renovate while living there (FHA 203k), increase value, move out. (2) Rent by the room: single-family home where you rent individual rooms for higher total income than renting the whole unit. (3) ADU conversion: add an accessory dwelling unit to a single-family property.\n\nTax benefits: mortgage interest deduction on your unit, depreciation on rental units, property tax deduction, and all operating expenses for rental units are deductible.",
      advanced:
        "Scaling house hacking: the most effective strategy is the 'BRRRR-hack' -- Buy, Renovate, Rent, Refinance, Repeat with owner-occupied financing. Year 1: buy a duplex with FHA (3.5% down), renovate both units using a 203k loan. Year 2: refinance into conventional, pull out your equity, move to the next property. Repeat annually.\n\nAfter 4-5 cycles, you own multiple properties with minimal capital deployed. The key constraint is the 12-month occupancy requirement -- violating it is mortgage fraud. But after 12 months, you're free to move.\n\nAdvanced tax strategy: cost segregation studies on your rental units allow accelerated depreciation, creating paper losses that offset rental income. Combined with the Section 199A deduction for qualified business income (if you qualify as a real estate professional), you can generate significant tax-free cash flow.\n\nRisks: being a landlord is work. Tenant turnover, maintenance emergencies, vacancy months, and problem tenants are real. Budget 5-10% of gross rent for vacancy, 5-10% for maintenance, and 8-10% for management (even if you self-manage, value your time). The 'live free' math only works if you include realistic operating expenses."
    },
    honestAnalysis:
      "House hacking works, but it means living next to or with your tenants. Not everyone wants to be a 25-year-old landlord dealing with noise complaints and plumbing emergencies. The financial returns are real, but the lifestyle trade-off is significant and often underestimated by real estate influencers.",
  },
  {
    id: "c5-02",
    slug: "solo-401k",
    domainId: "d5",
    name: "Solo 401(k): The Self-Employed Supercharger",
    summary:
      "Self-employed? A Solo 401(k) lets you contribute up to $69,000/year as both employee and employer -- far more than an IRA or SEP.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["roth-vs-traditional", "s-corp-optimization"],
    layers: {
      accessible:
        "If you're self-employed or have a side business, the Solo 401(k) is possibly the most powerful retirement account available. You can contribute up to $69,000 per year (2025) -- compared to $7,000 for an IRA or ~$15,000 for most SEP-IRAs at moderate income levels.\n\nThe trick: you wear two hats. As the employee, you can contribute up to $23,500. As the employer, you can contribute up to 25% of your net self-employment income. Together, these can reach $69,000. If you're over 50, add another $7,500 in catch-up contributions.\n\nYou can also choose Roth contributions for the employee portion, giving you tax-free growth on up to $23,500/year. The employer portion is always pre-tax.",
      intermediate:
        "Solo 401(k) mechanics: (1) Eligibility: any business with no full-time employees other than you and your spouse. Side businesses count -- you can have a W-2 job AND a Solo 401(k) for side income. (2) Contribution formula: employee side is $23,500 flat. Employer side is 25% of W-2 salary (if S-Corp) or 20% of net SE income (if sole prop/LLC). (3) Combined limit: $69,000 total (employee + employer), not counting catch-up.\n\nThe S-Corp advantage: if your side business earns $150K and you elect S-Corp status, you pay yourself a reasonable salary of $80K. Employee contribution: $23,500. Employer contribution: 25% x $80K = $20,000. Total: $43,500 sheltered from taxes. Plus the $70K in distributions avoids self-employment tax.\n\nIf you already max out a W-2 employer 401(k), your employee contributions are shared across all plans. But the employer contribution has its own limit per plan. So you can still contribute the employer portion to a Solo 401(k) even if you've maxed employee contributions elsewhere.",
      advanced:
        "Advanced Solo 401(k) strategies: (1) Mega Backdoor Roth via Solo 401(k): if your plan document allows after-tax contributions + in-plan Roth conversions, you can contribute the full $69,000 - employee - employer portions as after-tax, then immediately convert to Roth. This effectively lets you put up to $69,000/year into a Roth account regardless of income. (2) Voluntary after-tax contributions: the gap between your employee + employer contributions and $69,000 can be filled with after-tax dollars, which can then be converted to Roth (the mega backdoor). (3) Loan provision: Solo 401(k)s can include loan provisions, allowing you to borrow up to 50% of the balance (max $50,000) for any purpose -- effectively using retirement funds without triggering taxes or penalties.\n\nPlan administration: you can open a Solo 401(k) at most brokerages for free (Fidelity, Schwab, Vanguard). However, if you want the mega backdoor Roth option, you need a custodian that supports after-tax contributions and in-plan conversions -- not all do. MySolo401k and Nabers Group offer customizable plan documents. Once your plan exceeds $250,000, you must file Form 5500-EZ annually with the IRS."
    },
    honestAnalysis:
      "The Solo 401(k) is genuinely the best retirement account for self-employed people. The main limitation is that it only works if you have no employees. Once you hire someone full-time, you need a regular 401(k) with all its compliance costs. Plan around this if you're growing.",
  },
  {
    id: "c8-02",
    slug: "beneficiary-designations",
    domainId: "d8",
    name: "Beneficiary Designations: The Document That Beats Your Will",
    summary:
      "Your retirement accounts and life insurance pass by beneficiary designation, not by your will. Get these wrong and your estate plan is meaningless.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["estate-planning-basics"],
    layers: {
      accessible:
        "Here is a fact that surprises most people: your will does NOT control who gets your 401(k), IRA, or life insurance. These assets pass by beneficiary designation -- a form you filled out (or forgot to fill out) when you opened the account.\n\nThis means if you got divorced, remarried, and updated your will to leave everything to your new spouse, but never changed the beneficiary on your 401(k)... your ex-spouse gets the 401(k). Your will is irrelevant. The beneficiary form wins.\n\nThis is the single most common estate planning mistake in America. Review your beneficiary designations on every account at least once a year, and always after major life events (marriage, divorce, birth, death).",
      intermediate:
        "Accounts controlled by beneficiary designation (not your will): 401(k), 403(b), IRA, Roth IRA, HSA, life insurance, annuities, transfer-on-death (TOD) brokerage accounts, payable-on-death (POD) bank accounts. Together, these often represent 70-90% of a person's total wealth.\n\nCommon mistakes: (1) Naming minor children directly -- they can't inherit until 18, so a court appoints a guardian to manage the money (expensive, inflexible). Solution: name a trust for the benefit of minors. (2) Naming your estate as beneficiary -- this forces retirement accounts through probate (public, slow, expensive) and may accelerate required distributions. (3) Not naming contingent beneficiaries -- if your primary beneficiary dies before you and you have no contingent, the account goes through probate.\n\nSpousal rights: in community property states and for ERISA-governed plans (401k), your spouse has legal rights to be the beneficiary. You generally cannot name someone other than your spouse without their written consent.",
      advanced:
        "SECURE Act implications: the 2020 SECURE Act eliminated the 'stretch IRA' for most non-spouse beneficiaries. Previously, a beneficiary could take distributions over their lifetime. Now, most non-spouse beneficiaries must empty inherited retirement accounts within 10 years. This creates a potential tax bomb -- decades of tax-deferred growth forced into income over 10 years.\n\nStrategies: (1) Roth conversions during your lifetime reduce the tax burden on beneficiaries (Roth IRAs still have the 10-year rule but distributions are tax-free). (2) Charitable remainder trusts (CRTs) as beneficiaries can spread distributions and provide income to heirs beyond 10 years. (3) Accumulation trusts vs conduit trusts: conduit trusts pass distributions directly to beneficiaries (simpler but subject to 10-year rule). Accumulation trusts can retain distributions inside the trust, but trust income above $15,200 is taxed at the highest marginal rate (37%).\n\nPer stirpes vs per capita: 'per stirpes' means if a beneficiary dies before you, their share passes to their children. 'Per capita' means it's split among the surviving beneficiaries. Per stirpes is almost always the better choice for contingent designations."
    },
    honestAnalysis:
      "This is legitimately the most important estate planning action most people can take, and it costs $0. Logging into your accounts and reviewing beneficiary designations takes 30 minutes and prevents more family financial disasters than any other single action.",
  },
  {
    id: "c9-02",
    slug: "umbrella-insurance",
    domainId: "d9",
    name: "Umbrella Insurance: Cheap Protection for Everything You Own",
    summary:
      "A $1M umbrella policy costs $200-$400/year and protects your entire net worth from lawsuits, accidents, and liability claims that exceed your auto or homeowner's coverage.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["term-vs-permanent", "estate-planning-basics"],
    layers: {
      accessible:
        "Your auto insurance covers you up to $300,000 (typical). Your homeowner's covers up to $300,000 in liability. But if someone is seriously injured in a car accident you cause, the medical bills alone can exceed $1 million. If a guest is injured at your home, the lawsuit can be six or seven figures.\n\nUmbrella insurance sits on top of your existing policies and kicks in when they run out. A $1 million umbrella policy typically costs $200-$400 per year. A $2 million policy costs $300-$500 per year. For the price of a streaming subscription, you protect your entire net worth.\n\nWho needs it? Anyone with assets to protect. If you own a home, have savings or investments, or earn a good income, you are a target for lawsuits. Umbrella insurance is the cheapest form of wealth protection available.",
      intermediate:
        "What umbrella covers beyond auto and homeowners: (1) Libel and slander claims -- including social media posts. (2) False arrest or wrongful eviction (if you're a landlord). (3) Invasion of privacy. (4) Liability in foreign countries. (5) Legal defense costs -- even if you win, defending a lawsuit costs $50K-$200K+.\n\nWhat it does NOT cover: intentional acts, business activities (need a separate commercial policy), professional malpractice, and criminal acts.\n\nRequirements: most umbrella insurers require you to carry higher-than-minimum limits on your auto and homeowner's policies first (typically $300K/$500K auto liability and $300K+ homeowner's liability). This may increase your underlying premiums slightly, but the total cost is still remarkably low.\n\nHow much to carry: common advice is to match your net worth. If you have $2M in assets, carry a $2M umbrella. If your income and earning potential are high, consider carrying more -- future wages can be garnished by lawsuit judgments.",
      advanced:
        "Asset protection layering: umbrella insurance is layer one. For significant wealth ($1M+), consider: (1) State-specific exemptions: some states (Florida, Texas) offer unlimited homestead protection. (2) Retirement accounts: 401(k)s and IRAs have federal creditor protection. (3) Irrevocable trusts: assets transferred to properly structured irrevocable trusts are generally beyond creditor reach after the fraudulent transfer lookback period (typically 2-4 years). (4) LLCs for investment properties: each rental property in its own LLC limits liability to that property's assets.\n\nUmbrella policy limits are typically available up to $5-10M from standard carriers. Beyond that, you enter the excess liability market (Lloyd's of London, specialty carriers). High-net-worth individuals should work with a broker who specializes in HNW coverage.\n\nThe cost-benefit math: a $2M umbrella policy costs $400/year. Over 30 years, you pay $12,000 in premiums. A single uninsured lawsuit judgment of $500K would take years of income to pay and could force bankruptcy. The expected value calculation overwhelmingly favors carrying umbrella coverage."
    },
    honestAnalysis:
      "Umbrella insurance is genuinely one of the best financial deals available. The only reason more people don't have it is that insurance agents don't push it aggressively (low commissions relative to life insurance). If you have any assets at all, this is a no-brainer purchase.",
  },
  {
    id: "c10-02",
    slug: "emergency-fund-optimization",
    domainId: "d10",
    name: "Emergency Fund: How Much Is Enough (And Where to Keep It)",
    summary:
      "The 3-6 month rule is a starting point, not a formula. The right emergency fund size depends on your income stability, expenses, and what counts as an emergency.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["debt-avalanche-vs-snowball"],
    layers: {
      accessible:
        "An emergency fund is cash you can access immediately when life goes sideways -- job loss, medical bills, car breaks down, furnace dies. It is NOT an investment. Its job is not to grow. Its job is to be there.\n\nThe standard advice is 3-6 months of essential expenses. Not income -- expenses. If you earn $6,000/month but your essential bills are $4,000/month, you need $12,000-$24,000.\n\nWhere to keep it: a high-yield savings account (HYSA). Not in the stock market (can lose value right when you need it). Not under your mattress (loses to inflation). Not in CDs (can't access without penalty). A HYSA at an online bank currently pays 4-5% APY while remaining fully liquid.",
      intermediate:
        "Calibrating the right size: (1) Stable W-2 job, dual income household, low expenses: 3 months is fine. (2) Single income, variable expenses, or health issues: 6 months minimum. (3) Self-employed, commission-based, or seasonal income: 6-12 months. (4) Pre-retirement (within 5 years of retiring): 12-24 months (you don't want to sell investments in a downturn early in retirement).\n\nThe tiered approach: (1) Tier 1: $1,000 in checking for immediate access. (2) Tier 2: 1-2 months in HYSA for quick access. (3) Tier 3: remaining 2-4 months in a money market fund or short-term Treasury fund (slightly higher yield, 1-2 day access).\n\nHYSA options: Marcus (Goldman Sachs), Ally, Wealthfront, Betterment, SoFi. Compare APYs monthly -- online banks compete aggressively on rates. At $20,000 balance and 4.5% APY, you earn $900/year in interest. That's free money for holding your emergency fund in the right place.",
      advanced:
        "The opportunity cost debate: keeping $30,000 in cash earning 4.5% when the stock market averages 10% feels like leaving money on the table. The math says you 'lose' about $1,650/year in expected returns. But this analysis ignores sequence risk: if you're forced to sell stocks during a 30% drawdown to cover a $20,000 emergency, you lock in losses and miss the recovery. The expected cost of NOT having an emergency fund (selling investments at the worst time, taking on high-interest debt, or missing opportunities) far exceeds the opportunity cost of holding cash.\n\nAdvanced alternatives: (1) HELOC as backup: a home equity line of credit can serve as a backup emergency fund. You pay nothing unless you draw on it. But this only works if you have home equity and can qualify. (2) Roth IRA contributions (not earnings) can be withdrawn penalty-free at any time. Some people use a Roth as a dual-purpose emergency/retirement fund. (3) I-bonds: up to $10,000/year in inflation-protected savings bonds. Can't be redeemed for 12 months, and you lose 3 months of interest if redeemed before 5 years, but they track inflation and are state-tax-free.\n\nThe psychological value: beyond the math, an emergency fund provides peace of mind that is worth more than any marginal return difference. Financial stress is correlated with worse health outcomes, worse decision-making, and lower productivity. The ROI on reduced financial anxiety is real but unmeasurable."
    },
    honestAnalysis:
      "The 'optimal emergency fund' debate is mostly academic. Having one at all puts you ahead of 56% of Americans who can't cover a $1,000 emergency. Start with $1,000, then build to one month, then three. Perfect is the enemy of funded.",
  },
  {
    id: "c12-02",
    slug: "salary-negotiation",
    domainId: "d12",
    name: "Salary Negotiation: The Highest-ROI Hour of Your Career",
    summary:
      "A single successful negotiation can be worth $500K+ over a career. Most people never negotiate because they don't know how.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["total-comp-analysis"],
    layers: {
      accessible:
        "Not negotiating your salary is the most expensive mistake you can make early in your career. Here's why: raises are almost always percentage-based. If you start at $60,000 instead of $55,000 (a $5,000 difference), and get 3% raises annually for 30 years, that single negotiation is worth over $130,000 in additional lifetime earnings. Factor in higher 401(k) matches, higher Social Security benefits, and investing the difference, and it's $500,000+.\n\nThe basic script: 'I'm excited about this role. Based on my research and what I bring to the table, I was expecting something in the range of $X-$Y. Is there flexibility?' Then stop talking.\n\nMost employers expect you to negotiate. They build room into the initial offer. By not negotiating, you're literally leaving money on the table that was budgeted for you.",
      intermediate:
        "Negotiation preparation: (1) Research: use Glassdoor, Levels.fyi, Blind, Payscale, and the Bureau of Labor Statistics to find the range for your role, level, and location. (2) Know your number: determine your target (what you want) and your walk-away (the minimum you'll accept). (3) Timing: negotiate AFTER you have the written offer, never during interviews. (4) Leverage: the best leverage is another offer. The second best is specific, quantifiable accomplishments.\n\nBeyond base salary: if they can't move on base, negotiate: signing bonus (one-time cost, easier to approve), extra PTO (costs nothing on paper), remote work flexibility, title upgrade (affects future earning power), accelerated review timeline (6-month review instead of annual), professional development budget, or equity.\n\nThe ask: 'Thank you for the offer. I'm very interested in this role. I've done some research and based on [specific reasons], I was hoping we could discuss a base salary of $X. I understand there may be constraints, so I'm also open to discussing other forms of compensation.'",
      advanced:
        "Advanced negotiation tactics: (1) Never give the first number if you can avoid it. If pressed: 'I'd prefer to understand the full scope of the role before discussing numbers. What range has been budgeted for this position?' (2) Use round numbers strategically: asking for $87,500 (precise) implies research; asking for $90,000 (round) implies anchoring. Research suggests precise numbers are perceived as more informed. (3) The 'exploding offer' counter: if given a deadline, respond with 'I want to give this the consideration it deserves. Would it be possible to have until [date]?' Most deadlines are flexible.\n\nInternal negotiations (raises/promotions): (1) Document your wins continuously -- maintain a 'brag document' of measurable impact. (2) Time your ask: after a major win, during budget planning season, or when you have outside interest. (3) Frame it as a market correction, not a reward: 'Based on what I'm seeing in the market for someone with my experience and the results I've delivered, I believe my compensation should be at $X.' (4) If denied, get specifics: 'What would need to be true for me to reach $X in the next 6 months?' Get it in writing.\n\nThe compound effect: a $10K higher starting salary at age 25, compounded at 3% annual raises, with the difference invested at 7%, is worth $1.1M by age 65. One conversation. One million dollars. This is the highest-ROI activity in personal finance, and most people skip it because they're uncomfortable for 15 minutes."
    },
    honestAnalysis:
      "Negotiation advice is easy to give and hard to follow, especially for people in precarious financial situations, marginalized groups who face backlash for negotiating, or fields with rigid pay scales (government, union, education). The advice to 'just negotiate' ignores real power dynamics. That said, in roles where negotiation is expected (tech, finance, consulting), not negotiating is genuinely leaving money on the table.",
  },
  {
    id: "c7-03",
    slug: "dollar-cost-averaging",
    domainId: "d7",
    name: "Dollar-Cost Averaging vs Lump Sum: The Psychology of Investing",
    summary:
      "Investing a fixed amount regularly beats trying to time the market. But lump sum investing actually outperforms DCA most of the time -- so why do experts still recommend DCA?",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["asset-allocation", "loss-aversion"],
    layers: {
      accessible:
        "Dollar-cost averaging (DCA) means investing a fixed amount on a regular schedule -- like $500 every month into an index fund. When prices are high, your $500 buys fewer shares. When prices are low, your $500 buys more shares. Over time, your average cost per share is lower than the average price.\n\nThe alternative is lump sum investing -- putting all your money in at once. Studies show lump sum wins about 2/3 of the time because markets go up more often than they go down. Time in the market beats timing the market.\n\nBut DCA has a huge psychological advantage: you never invest everything at the worst possible moment. If the market drops 30% after you invest your lump sum, you feel terrible and might panic sell. If you're DCA-ing, the drop means your next purchase is 30% cheaper. DCA turns bad markets into sales.",
      intermediate:
        "The Vanguard study (2012, updated): analyzed 1,000+ rolling periods in the US, UK, and Australian markets. Lump sum investing beat DCA about 2/3 of the time, with an average outperformance of 2.3% over 12 months. However: (1) The 1/3 of the time DCA won, it won by protecting you from investing right before major drawdowns. (2) The psychological benefit is not captured in the math. A person who DCA's and stays invested beats a person who lump sums, panics during a crash, and sells.\n\nWhen DCA is clearly better: (1) When you earn money over time (salary), DCA is automatic -- you invest each paycheck. No choice needed. (2) When you're anxious about a lump sum. If $100K is sitting in cash and you're afraid to invest it all at once, DCA over 6-12 months is better than paralysis. (3) In highly volatile or expensive-looking markets, DCA reduces regret risk.\n\nAutomation is key: set up automatic investments so DCA happens without you making monthly decisions. Every decision point is an opportunity to procrastinate. Remove the decision.",
      advanced:
        "Behavioral analysis: DCA's real value is as a commitment device. It removes the two most damaging investor behaviors: (1) market timing (waiting for a 'better' entry point that never comes) and (2) panic selling (liquidating at the bottom). Dollar-cost averaging into a diversified index fund with automatic rebalancing is the single most reliable wealth-building strategy available to individual investors -- not because it's mathematically optimal, but because it's psychologically sustainable.\n\nValue averaging (VA): a lesser-known alternative where you set a target portfolio value path (e.g., $1,000/month growth). When the market is down, you invest more to hit the target. When the market is up, you invest less (or even sell). VA has been shown to outperform DCA in backtests, but it's more complex and requires variable cash flows, making it impractical for most people.\n\nThe real answer: for 401(k) contributions from your paycheck, DCA is the only option (and it works great). For a windfall (inheritance, bonus, sale of a house), the mathematically correct answer is lump sum if you can handle the volatility. If you can't, DCA over 3-12 months. The worst option by far is sitting in cash indefinitely while 'waiting for a good time to invest.' Cash drag in a bull market is the most common invisible cost in personal finance."
    },
    honestAnalysis:
      "The DCA vs lump sum debate is mostly about psychology, not math. The best strategy is the one you'll actually stick with through a 30% drawdown. For most people, that's DCA with automatic investments. Stop optimizing and start investing.",
  },
  {
    id: "c6-03",
    slug: "social-security-optimization",
    domainId: "d6",
    name: "Social Security: When to Claim (The $200K Decision)",
    summary:
      "You can claim Social Security at 62, 67, or 70. Each year you delay increases your benefit by 8%. This single decision can be worth $200,000+ in lifetime benefits.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["safe-withdrawal-rate", "sequence-of-returns-risk"],
    layers: {
      accessible:
        "You can start Social Security benefits as early as 62, at your full retirement age (67 for most people), or as late as 70. For each year you delay past 62, your monthly check grows by about 7-8%. At 62, you get roughly 70% of your full benefit. At 70, you get 124%.\n\nExample: if your full benefit at 67 is $2,000/month: at 62 you'd get $1,400/month, at 70 you'd get $2,480/month. That's $1,080/month difference between earliest and latest -- $12,960/year for life, adjusted for inflation.\n\nThe break-even point is around age 80. If you live past 80 (and most people do -- average life expectancy at 65 is about 85), delaying to 70 pays more total dollars. If you're in poor health or need the money now, claiming early makes sense.",
      intermediate:
        "Spousal coordination: married couples have powerful optimization options. (1) The higher earner should almost always delay to 70 (maximizes the survivor benefit -- when one spouse dies, the surviving spouse gets the higher of the two benefits). (2) The lower earner can claim at 62 to provide household income while the higher earner's benefit grows. (3) Spousal benefits: a non-working or lower-earning spouse can receive up to 50% of the higher earner's full retirement benefit.\n\nThe survivor benefit is the key insight most people miss: when one spouse dies, the surviving spouse keeps only one Social Security check (the higher one). If the higher earner claimed at 62 ($1,400/month) instead of 70 ($2,480/month), the surviving spouse is locked into the lower amount for life. Delaying the higher earner's claim is essentially buying a life insurance policy that pays $1,080/month forever, inflation-adjusted.\n\nTaxation: up to 85% of Social Security benefits are taxable if your combined income exceeds $34,000 (single) or $44,000 (married). Roth conversions before claiming Social Security can reduce the tax hit on benefits later.",
      advanced:
        "Break-even analysis by scenario: (1) Single, good health, longevity in family: delay to 70. The internal rate of return on delaying is approximately 7-8% -- risk-free, inflation-adjusted. No other guaranteed investment offers this. (2) Single, poor health: claim at 62 or FRA. (3) Married, both healthy: higher earner delays to 70, lower earner claims at 62-FRA. (4) Married, one unhealthy: the unhealthy spouse claims early; the healthy spouse delays.\n\nAdvanced strategies: (1) File and suspend (eliminated in 2015 for new filers, but existing suspensions are grandfathered). (2) Restricted application (only available if born before 1/2/1954 -- being phased out). (3) Coordination with pension income, Roth conversions, and RMDs to manage tax brackets in retirement.\n\nThe IRMAA trap: high income in retirement (from RMDs, Roth conversions, or capital gains) can trigger Income-Related Monthly Adjustment Amount surcharges on Medicare Parts B and D. A $1 overshoot of the IRMAA threshold can cost $2,000-$4,000/year in additional premiums. Social Security claiming strategy should be coordinated with Medicare premium management."
    },
    honestAnalysis:
      "For most people, delaying Social Security to 70 is mathematically correct. But 'most people' doesn't mean everyone. If you're in poor health, need the income, or have a strong alternative use for the money (paying off high-interest debt), claiming early is rational. The mistake is claiming early without understanding the trade-off.",
  },
  // ─── Domain 2: Tax Optimization (new additions) ────────────────────────

  {
    id: "c2-05",
    slug: "zero-percent-capital-gains",
    domainId: "d2",
    name: "The 0% Capital Gains Rate (Most People Don't Know It Exists)",
    summary:
      "If your taxable income is below ~$47K (single) or ~$94K (married), your long-term capital gains tax rate is literally zero. This changes how you should harvest gains, not just losses.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["tax-bracket-management", "roth-conversion-ladder", "tax-loss-harvesting"],
    layers: {
      accessible:
        "Most people know there are three capital gains tax rates: 0%, 15%, and 20%. But most don't realize how accessible the 0% bracket is. In 2025, if your taxable income (after deductions) is below $47,025 (single) or $94,050 (married filing jointly), your long-term capital gains rate is 0%. Literally free.\n\nThis matters enormously in early retirement, sabbatical years, or any year your income is low. Instead of just doing Roth conversions in low-income years, you can also sell appreciated investments and pay zero tax on the gains. It's tax-gain harvesting -- the opposite of tax-loss harvesting.",
      intermediate:
        "The 0% bracket stacks on top of your ordinary income. If you're married with $60,000 in ordinary income and $34,050 in long-term capital gains, your total is $94,050 -- right at the threshold. All $34,050 in gains is taxed at 0%.\n\nStrategic applications: (1) Retirees in the gap between retirement and Social Security/RMDs can sell appreciated stock at 0% tax. (2) Anyone taking a year off can harvest gains tax-free. (3) Business owners with a down year can use the opportunity. (4) You can sell and immediately rebuy, resetting your cost basis higher (no wash sale rule for gains).\n\nThe interaction with other income: the 0% bracket is based on taxable income, which is after the standard deduction ($30,000 married in 2025). So a married couple with $124,050 in gross income (including gains) and no other deductions still qualifies for some 0% treatment.\n\nCombine with tax-loss harvesting: harvest losses in high-income years (to offset gains taxed at 15-20%), and harvest gains in low-income years (taxed at 0%). You're managing your tax rate across years, not just within a single year.",
      advanced:
        "The 0% bracket interacts with ACA premium subsidies, IRMAA thresholds, and state taxes in complex ways. Capital gains that are federally tax-free can still trigger state taxes (most states tax capital gains as ordinary income). They also count as MAGI for ACA subsidy calculations -- meaning 'free' federal capital gains could cost you thousands in lost healthcare subsidies.\n\nOptimal strategy for early retirees on ACA: calculate your modified AGI ceiling for maximum ACA subsidies, then fill remaining room with Roth conversions and 0% capital gains harvesting. The order matters -- conversions and gains both count as MAGI.\n\nThe step-up-in-basis interaction: if you're considering holding appreciated stock until death (for the step-up basis), compare the value of a guaranteed 0% rate today vs. a potential step-up later. The 0% rate is certain. The step-up depends on future legislation (it was temporarily eliminated in 2010 and has been targeted by multiple proposals)."
    },
    honestAnalysis:
      "The 0% rate is real and powerful, but it requires low income to access. It's most useful during intentional low-income periods like early retirement, not as an everyday strategy for working professionals.",
  },

  // ─── Domain 3: Equity Compensation (new additions) ────────────────────

  {
    id: "c3-04",
    slug: "83b-election",
    domainId: "d3",
    name: "The 83(b) Election: 30 Days to Save Thousands in Tax",
    summary:
      "When you receive restricted stock, you can elect to pay tax on it NOW at its current (low) value instead of later at its (hopefully higher) value. Miss the 30-day window and the opportunity is gone forever.",
    complexityMin: 3,
    hasCalculator: false,
    relatedConceptSlugs: ["iso-vs-nso", "rsu-basics"],
    layers: {
      accessible:
        "When a startup gives you restricted stock (shares that vest over time), you normally pay tax as each batch vests. If the stock is worth $0.10 when granted but $10 when it vests, you pay tax on $10 per share. An 83(b) election lets you pay tax on $0.10 per share RIGHT NOW, when the stock is nearly worthless.\n\nIf the company succeeds and the stock becomes valuable, all that appreciation is taxed as long-term capital gains (max 20%) instead of ordinary income (up to 37%). The savings can be enormous -- potentially hundreds of thousands of dollars for early startup employees.\n\nThe catch: you must file the election with the IRS within 30 days of receiving the stock. Not 30 business days. Not 30 days from vesting. 30 calendar days from the grant date. Miss it and you cannot fix it. The form is a simple letter -- there's no official IRS form.",
      intermediate:
        "Who should file 83(b): early-stage startup employees who receive restricted stock at a low 409A valuation. If shares are worth $0.001 each and you get 100,000 shares, the tax on the 83(b) election is minimal (maybe $3-4 with state tax). If those shares are worth $10 each when they vest 4 years later, you saved tax on $1M of income.\n\nWho should NOT file: (1) Anyone who might leave the company before vesting (you cannot get refunded for tax paid on forfeited shares). (2) Anyone receiving stock that is already highly valued (paying tax on $50K worth of stock you might forfeit is risky). (3) RSU recipients -- 83(b) does NOT apply to RSUs because you don't receive actual shares until vesting.\n\nThe timeline: (1) Day 0: receive restricted stock grant. (2) Within 30 days: mail 83(b) election to IRS (many advisors recommend certified mail). Send a copy to your employer. Keep a copy for your records. (3) Attach a copy to your tax return for that year. (4) Hold shares for 1+ year after grant (and 2+ years for ISOs) to qualify for long-term capital gains on sale.",
      advanced:
        "The 83(b) election converts what would be ordinary income (the spread at vesting) into long-term capital gains (the spread at sale). The maximum rate difference is 37% - 20% = 17 percentage points, plus the 3.8% NIIT may apply differently.\n\nRisk analysis: the 83(b) is essentially a bet that the stock will appreciate. If the company fails, you paid tax on worthless stock with no refund. However, for early-stage employees where the 409A valuation is pennies per share, the tax cost of the election is trivially small -- often under $100. The expected value calculation is almost always favorable at that stage.\n\nState tax considerations: California conforms to the federal 83(b) treatment. However, if you file 83(b) in one state and vest in another, the tax treatment can be complex. Some states may try to tax the vesting event regardless of the federal 83(b) election.\n\nThe partnership/LLC twist: 83(b) elections also apply to profits interests in partnerships and LLCs. A profits interest with no current value can be subject to 83(b) to lock in zero tax basis. This is common in private equity and venture capital compensation structures."
    },
    honestAnalysis:
      "The 83(b) election is one of the highest-ROI tax moves available to startup employees. The cost is usually trivial and the potential savings enormous. But it requires action within 30 days -- and most people don't learn about it until it's too late. If you're joining a startup and receiving restricted stock, this should be one of your first conversations with a tax advisor.",
  },

  {
    id: "c3-05",
    slug: "espp-free-money",
    domainId: "d3",
    name: "ESPP: The Closest Thing to Free Money at Work",
    summary:
      "Employee Stock Purchase Plans let you buy company stock at a 15% discount. If you sell immediately, that's a near-guaranteed 15%+ return in months. Most people don't enroll.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["rsu-basics", "iso-vs-nso"],
    layers: {
      accessible:
        "An Employee Stock Purchase Plan (ESPP) lets you buy your company's stock at a discount -- typically 15% off the market price. Money is deducted from your paycheck over a period (usually 6 months), and at the end, you buy shares at the discounted price.\n\nThe simplest strategy: enroll, buy at the discount, sell immediately. You make roughly 15% on your money in 6 months with very little risk (the stock could drop more than 15% during the purchase period, but most plans have a 'look-back' provision that uses the lower of the start or end price). This is arguably the highest risk-adjusted return available to individual employees.",
      intermediate:
        "How a typical ESPP works: (1) Offering period begins. Stock price is noted (say $100). (2) 6 months of payroll deductions (up to 15% of salary or $25K/year in stock). (3) Purchase date arrives. Stock is now $120. (4) You buy at 85% of the LOWER of $100 or $120 = 85% of $100 = $85/share. (5) Shares are worth $120. That's a 41% return ($85 to $120).\n\nThe look-back provision makes this incredible: if the stock goes up during the period, you get 15% off the starting (lower) price. If the stock goes down, you get 15% off the ending (lower) price. You always get the better deal.\n\nTax treatment: if you sell immediately (disqualifying disposition), the discount is taxed as ordinary income on your W-2, and any additional gain is short-term capital gains. If you hold 1 year from purchase + 2 years from offering date (qualifying disposition), a portion is taxed more favorably. For most people, the immediate sell strategy wins because you eliminate stock concentration risk.",
      advanced:
        "The risk analysis of holding vs. immediate sale: holding for qualifying disposition saves maybe 5-10% in taxes on the discount portion. But it concentrates your portfolio in company stock for 1-2 years. You already have concentration risk through your salary, bonus, and other equity comp. Adding ESPP shares to that concentration is usually not worth the modest tax savings.\n\nMaximum benefit: if your plan allows 15% of salary and you earn $200K, that's $30K/year in ESPP purchases (capped at $25K in stock value per year by IRS rules). At a 15% discount with immediate sale, that's roughly $4,400/year in near-guaranteed profit. Over a 10-year career at a company, that's $44K in essentially free money.\n\nThe only reason not to enroll: if you literally cannot afford the cash flow reduction during the purchase period. Even then, many people can temporarily reduce 401(k) contributions to fund ESPP participation (the ESPP return is often higher than the tax savings from 401(k) contributions above the employer match)."
    },
    honestAnalysis:
      "ESPP with immediate sell is as close to free money as exists in personal finance. The main barrier is inertia -- people don't sign up. If your company offers an ESPP and you're not enrolled, you are leaving guaranteed money on the table.",
  },

  // ─── Domain 4: Real Estate (new additions) ────────────────────────────

  {
    id: "c4-04",
    slug: "1031-exchange",
    domainId: "d4",
    name: "1031 Exchange: Defer Taxes on Real Estate Gains Forever",
    summary:
      "Sell an investment property, buy another of equal or greater value, and pay zero capital gains tax. Repeat until death, when heirs get a stepped-up basis. Legally, the gains can be deferred indefinitely.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["buy-vs-rent", "house-hacking", "estate-planning-basics"],
    layers: {
      accessible:
        "A 1031 exchange (named after Section 1031 of the tax code) lets you sell an investment property and defer all capital gains taxes by reinvesting the proceeds into a new property. You're not avoiding the tax permanently -- you're deferring it. But if you keep exchanging into larger properties, you can defer indefinitely. And when you die, your heirs get a stepped-up basis, potentially eliminating the deferred tax entirely.\n\nThis is how many real estate investors build massive portfolios: buy a duplex, exchange into a small apartment building, exchange into a larger one, and never pay capital gains tax along the way.",
      intermediate:
        "The strict rules: (1) 45-day identification period: after selling, you have 45 days to identify potential replacement properties (up to 3, or more under certain rules). (2) 180-day closing: you must close on the replacement property within 180 days of selling. (3) Must be 'like-kind': any real property for any real property (a condo can be exchanged for raw land, a rental house for a commercial building). (4) Must use a Qualified Intermediary (QI): you cannot touch the money between sale and purchase. The QI holds the funds.\n\nThe equity and debt rules: the replacement property must be of equal or greater value, and you must use equal or greater debt. If you sell a $500K property with $300K mortgage and $200K equity, the replacement must be at least $500K total. Any cash you take out ('boot') is taxable.\n\nCannot be used for your primary residence or a fix-and-flip (must be held for investment or business use). The IRS has no fixed holding period, but most advisors recommend holding at least 1-2 years to demonstrate investment intent.",
      advanced:
        "Advanced 1031 strategies: (1) Reverse exchange: buy the replacement property first, then sell the old one within 180 days. Requires a special 'parking' arrangement with an Exchange Accommodation Titleholder. More expensive but eliminates the pressure of finding a replacement in 45 days. (2) Improvement exchange: the replacement property can include a property that needs renovation, with the exchange funds used for improvements during the exchange period.\n\nThe step-up basis endgame: the most powerful aspect of 1031 exchanges is the estate planning angle. Under current law, when you die, your heirs receive a 'stepped-up' cost basis equal to fair market value at death. All the deferred capital gains from decades of 1031 exchanges are eliminated in a single step. A $100K property exchanged over 30 years into a $5M portfolio could pass to heirs with zero capital gains tax ever paid on the appreciation.\n\nDelaware Statutory Trust (DST): investors who want to exit active management can 1031 exchange into a DST -- a passive, professionally managed real estate investment. This is the most common 'exit strategy' for aging real estate investors who want income without landlord headaches while preserving the tax deferral."
    },
    honestAnalysis:
      "The 1031 exchange is one of the most powerful wealth-building tools in the tax code, but it's complex and expensive to execute properly. QI fees, compressed timelines, and the risk of not finding suitable replacement property within 45 days are real. It's best suited for intentional real estate investors, not accidental landlords.",
  },

  // ─── Domain 5: Business Finance (new additions) ────────────────────────

  {
    id: "c5-04",
    slug: "qbi-deduction",
    domainId: "d5",
    name: "QBI Deduction: The 20% Pass-Through Tax Break",
    summary:
      "If you're self-employed or own a pass-through business (LLC, S-Corp, sole proprietor), you may deduct 20% of your business income -- effectively lowering your tax rate by up to 7.4 percentage points.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["s-corp-optimization", "solo-401k"],
    layers: {
      accessible:
        "The Qualified Business Income (QBI) deduction, created by the Tax Cuts and Jobs Act (2017), lets owners of pass-through businesses (sole proprietorships, partnerships, S-Corps, LLCs) deduct up to 20% of their business income from their taxable income. If your business earns $100,000, you might only pay tax on $80,000.\n\nThis effectively reduces the top tax rate on pass-through income from 37% to 29.6% -- making it more competitive with the corporate tax rate of 21%. The deduction is taken on your personal return; it doesn't reduce self-employment tax, just income tax.",
      intermediate:
        "The limitations get complex above certain income levels. If your taxable income exceeds $191,950 (single) or $383,900 (married) in 2025, the deduction starts phasing out for 'Specified Service Trades or Businesses' (SSTBs) -- which includes most professional services: law, medicine, accounting, consulting, financial services, athletics, performing arts. Above the threshold, the deduction may be limited by the W-2 wages paid by the business or 2.5% of qualified property.\n\nThis is where S-Corp optimization intersects with QBI: by paying yourself a reasonable salary (W-2 wages), you create the W-2 wage floor that supports a larger QBI deduction. The interaction between S-Corp salary, QBI deduction, and self-employment tax savings creates a three-variable optimization problem.\n\nThe SSTB phase-out creates a cliff: one dollar over the threshold can dramatically reduce the deduction. Active tax management (Roth conversions, charitable giving, retirement contributions) around the threshold can save thousands.",
      advanced:
        "QBI deduction optimization: (1) Aggregate or separate business activities to maximize the deduction. Multiple businesses can be aggregated if they share common ownership, centralized management, or interdependence. (2) For SSTBs above the income threshold, consider splitting the business into SSTB and non-SSTB components (with proper economic substance). (3) Real Estate Safe Harbor: rental real estate can qualify for QBI under Rev. Proc. 2019-38 if you maintain separate books, spend 250+ hours annually, and keep contemporaneous records.\n\nThe sunset risk: the QBI deduction expires December 31, 2025, under current law. Extension or modification is being debated. Business owners should model their tax situation with and without QBI to prepare for either outcome. If it sunsets, the effective tax rate on pass-through income could increase by up to 7.4 percentage points overnight."
    },
    honestAnalysis:
      "The QBI deduction is a significant tax benefit, but it's fiendishly complex for high earners in service businesses. The phase-outs, SSTB rules, and W-2 wage limitations mean the deduction often isn't a simple 20% cut. Get a CPA who understands the interactions.",
  },

  {
    id: "c5-05",
    slug: "entity-selection",
    domainId: "d5",
    name: "LLC vs S-Corp vs C-Corp: Which Entity is Right?",
    summary:
      "The entity you choose affects taxes, liability, administration, and fundraising. Most small businesses should start as an LLC and consider S-Corp election when profits exceed $40-50K.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["s-corp-optimization", "qbi-deduction", "solo-401k"],
    layers: {
      accessible:
        "Sole Proprietorship: simplest, no formation needed. You and the business are legally the same. All income reported on Schedule C. You pay self-employment tax (15.3%) on everything. No liability protection.\n\nLLC (Limited Liability Company): separates personal and business assets. By default, taxed the same as a sole proprietorship (Schedule C), but gives liability protection. Minimal paperwork. Best starting point for most businesses.\n\nS-Corp (S Corporation): not a separate entity type -- it's a tax election. An LLC or corporation can elect S-Corp status. The key benefit: you pay yourself a 'reasonable salary' and take the rest as distributions, which are NOT subject to self-employment tax (saving 15.3% on distributions). Makes sense when profits consistently exceed $40-50K.\n\nC-Corp: separate tax entity. Pays its own tax at 21% flat rate. Profits are taxed again when distributed as dividends (double taxation). Best for businesses seeking VC/PE funding or planning to go public.",
      intermediate:
        "The S-Corp break-even calculation: self-employment tax saved on distributions vs. additional costs of S-Corp (payroll processing $500-2,000/year, additional tax return ~$1,000-2,000/year, reasonable salary requirements, state-specific fees). Typically breaks even around $40-50K in net business income.\n\nExample: $120K net business income. As a sole proprietor, you pay SE tax on all $120K = ~$18,360. As an S-Corp paying yourself $60K salary and taking $60K in distributions: SE tax on $60K salary = ~$9,180, plus S-Corp admin costs of ~$3,000 = $12,180. Savings: ~$6,180/year.\n\nState considerations: some states (California) charge an $800 minimum franchise tax on LLCs/S-Corps regardless of income. New York City has an additional S-Corp tax. Texas franchise tax, Washington B&O tax, etc. Entity selection must account for state-specific costs.\n\nThe reasonable salary requirement: the IRS requires S-Corp owners who work in the business to pay themselves a 'reasonable salary' before taking distributions. If you pay yourself too little (to maximize the SE tax savings), the IRS can reclassify distributions as wages and hit you with back taxes, penalties, and interest. Use compensation data for your role and industry.",
      advanced:
        "C-Corp considerations: the 21% flat corporate rate is attractive when (1) you're reinvesting most profits in the business (avoiding double taxation), (2) you want to use tax-favored fringe benefits (health insurance, education, etc. are deductible by C-Corps), (3) you plan to take advantage of Qualified Small Business Stock (QSBS) -- Section 1202 allows up to $10M in capital gains exclusion on C-Corp stock held 5+ years. QSBS is the reason most VC-backed startups are C-Corps.\n\nHolding company structures: some business owners create a C-Corp parent with S-Corp subsidiaries to capture benefits of both. Others use Series LLCs (available in some states) to isolate liability across multiple business lines without multiple entity filings.\n\nThe entity selection matrix: Freelancer under $40K profit -> Sole prop or single-member LLC. Freelancer $40-100K+ profit -> LLC with S-Corp election. Small business with employees -> LLC or Corp with S-Corp election. Venture-funded startup -> C-Corp (for QSBS and investor preferences). Real estate holding -> LLC (often multi-member for asset protection)."
    },
    honestAnalysis:
      "Entity selection is important but over-debated. Start as an LLC, switch to S-Corp when the tax math works, and don't overthink it. The entity structure matters far less than actually building a profitable business. Don't let formation paralysis stop you from starting.",
  },

  // ─── Domain 6: Retirement Income (new additions) ──────────────────────

  {
    id: "c6-04",
    slug: "rmd-strategies",
    domainId: "d6",
    name: "RMD Strategies: Managing Forced Withdrawals",
    summary:
      "At 73, the IRS forces you to withdraw from traditional retirement accounts whether you need the money or not. The withdrawals are taxed as income. Poor planning here can cost you tens of thousands.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["roth-conversion-ladder", "social-security-optimization", "safe-withdrawal-rate"],
    layers: {
      accessible:
        "Required Minimum Distributions (RMDs) are the IRS's way of making sure you eventually pay taxes on your traditional retirement accounts. Starting at age 73 (as of SECURE 2.0), you must withdraw a minimum amount each year from traditional IRAs, 401(k)s, 403(b)s, and most other tax-deferred accounts. The amount is based on your account balance divided by a life expectancy factor from the IRS Uniform Lifetime Table.\n\nRoth IRAs have no RMDs (as of SECURE 2.0, Roth 401(k)s are also exempt). This is one of the biggest advantages of Roth accounts -- your money can continue growing tax-free for as long as you want.\n\nIf you fail to take your full RMD, the penalty is 25% of the amount you should have withdrawn (reduced from the previous 50% by SECURE 2.0). This can be reduced to 10% if corrected in a timely manner.",
      intermediate:
        "The RMD problem: a $2M traditional IRA at age 73 requires an RMD of approximately $75,000 (balance / 26.5). Combined with Social Security ($30-40K), that's $105-115K in forced taxable income. You might be in the 22-24% bracket whether you need the money or not.\n\nPre-RMD strategies (the 'gap years' between retirement and 73): (1) Roth conversions: convert traditional IRA to Roth during low-income years, 'filling up' the 10% and 12% brackets. Every dollar converted is one less dollar of future RMDs. (2) Qualified Charitable Distributions (QCDs): after age 70.5, you can donate up to $105,000 directly from your IRA to charity. QCDs count toward your RMD but are NOT included in taxable income. This is the most tax-efficient way to give to charity in retirement. (3) Accelerated spending from traditional accounts: spend down traditional accounts first while delaying Social Security and letting Roth accounts grow.\n\nThe IRMAA connection: RMDs that push your income above $103,000 (single) or $206,000 (married) trigger higher Medicare Part B and D premiums. IRMAA surcharges are based on income from two years prior, so a large RMD in 2025 increases your premiums in 2027.",
      advanced:
        "Advanced RMD management: (1) Aggregation rules: RMDs from multiple traditional IRAs can be taken from any one IRA (you calculate each account's RMD separately but can withdraw the total from whichever has the worst investments). 401(k) RMDs must be taken from each account separately. (2) The 'still working' exception: if you're still employed and don't own more than 5% of the company, you can delay RMDs from your current employer's 401(k) until you actually retire. Does not apply to IRAs or former employer plans. (3) The Net Unrealized Appreciation (NUA) strategy: if your 401(k) holds employer stock, you can distribute the shares and pay only ordinary income tax on the original cost basis (not current value). The appreciation is taxed at favorable long-term capital gains rates when eventually sold. This can be done before RMDs to reduce the account balance.\n\nProjection modeling: the key to RMD planning is running multi-decade projections that include Social Security, pensions, RMDs, Roth conversions, portfolio growth, IRMAA thresholds, and tax brackets simultaneously. Simple single-variable decisions ('should I convert this year?') often miss the multi-variable interactions. Software tools (Boldin, Pralana, Income Strategy) can model these scenarios."
    },
    honestAnalysis:
      "RMD planning is where most retirement planning actually gets complex. The gap between retirement and age 73 is the most valuable tax planning window most people get -- and most people waste it by doing nothing. Start projecting your RMDs well before retirement.",
  },

  {
    id: "c6-05",
    slug: "bucket-strategy",
    domainId: "d6",
    name: "The Bucket Strategy: Organizing Retirement Income",
    summary:
      "Divide your retirement savings into short-term (cash), medium-term (bonds), and long-term (stocks) buckets. This prevents you from selling stocks during downturns and provides psychological safety.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["sequence-of-returns-risk", "safe-withdrawal-rate", "asset-allocation"],
    layers: {
      accessible:
        "The biggest risk in early retirement isn't running out of money -- it's selling stocks during a crash to pay your bills. The bucket strategy prevents this by keeping 1-2 years of expenses in cash, 3-5 years in bonds, and the rest in stocks. When markets crash, you live off the cash and bond buckets while stocks recover.\n\nBucket 1 (Now): 1-2 years of expenses in cash/money market. Safe, liquid, boring. This is your 'sleep at night' money.\n\nBucket 2 (Soon): 3-5 years of expenses in bonds, CDs, short-term bond funds. Low volatility, provides income.\n\nBucket 3 (Later): Everything else in stocks/growth investments. This bucket has decades to recover from any crash. You don't touch it until Buckets 1 and 2 need refilling.",
      intermediate:
        "The rebalancing mechanism: in good years, sell some stock gains from Bucket 3 to refill Buckets 1 and 2. In bad years, live off Buckets 1 and 2 and let Bucket 3 recover. You're essentially building a buffer that insulates your withdrawals from market timing.\n\nThe psychological benefit is arguably more important than the mathematical benefit. Studies show that retirees using a bucket strategy are less likely to panic sell during market downturns because they can see their short-term expenses are covered regardless of what stocks do. This behavioral advantage can prevent the single most destructive retirement mistake: selling at the bottom.\n\nTax-aware bucket management: Bucket 1 (cash) should be in taxable accounts for easy access. Bucket 2 (bonds) can be in traditional IRAs (since bond income is taxed as ordinary income anyway). Bucket 3 (stocks) should be in Roth accounts when possible (for tax-free growth and no RMDs).",
      advanced:
        "The academic critique: mathematically, a bucket strategy produces nearly identical results to a simple total-return approach with annual rebalancing. The 'cash drag' from holding 1-2 years in cash slightly reduces long-term returns. Some researchers argue the bucket strategy is just a mental accounting framework (a behavioral bias) that produces suboptimal returns.\n\nThe counter-argument: the bucket strategy isn't designed to maximize returns -- it's designed to maximize the probability that a retiree stays the course during a crisis. A mathematically superior strategy that leads to panic selling during a 40% drawdown is worse than a slightly suboptimal strategy that keeps you invested. The bucket strategy's value is behavioral, not mathematical.\n\nDynamic bucket management: advanced practitioners adjust bucket sizes based on market valuations. When CAPE ratios are high (expensive markets), increase the cash/bond buckets to 3-4 years. When CAPE is low (cheap markets), reduce to 1 year and increase stock allocation. This adds a modest valuation-timing element without attempting to time the market."
    },
  },

  // ─── Domain 7: Investing (new additions) ───────────────────────────────

  {
    id: "c7-05",
    slug: "direct-indexing",
    domainId: "d7",
    name: "Direct Indexing: The Rich Person's Index Fund",
    summary:
      "Instead of buying an S&P 500 index fund, buy all 500 stocks individually. Same exposure, but you can harvest tax losses on individual positions throughout the year. Tax alpha of 1-2% annually.",
    complexityMin: 3,
    hasCalculator: false,
    relatedConceptSlugs: ["tax-loss-harvesting", "asset-allocation", "asset-location"],
    layers: {
      accessible:
        "An index fund owns hundreds of stocks as a single package. Direct indexing owns those same stocks individually. The performance is nearly identical, but owning stocks individually lets you sell specific positions that are down (tax-loss harvesting) while keeping your overall portfolio tracking the index.\n\nIn an index fund, you can only sell the entire fund at a gain or loss. In a direct index portfolio, you might have 50 stocks up and 20 stocks down in any given month. You sell the 20 losers, capture the tax losses, and immediately buy similar (but not identical) stocks to maintain your exposure. The tax savings can add 1-2% per year in after-tax return.",
      intermediate:
        "Why this wasn't available to normal people until recently: trading 500+ stocks individually used to be expensive (commissions) and complex (rebalancing). Now, zero-commission brokers and automated platforms (Wealthfront, Aperio, Parametric, Fidelity Managed Accounts) handle it for 0.15-0.40% annual fees.\n\nThe tax alpha calculation: in a typical year, even in a rising market, 30-40% of individual stocks in the S&P 500 are down at any point. Each of those is a tax-loss harvesting opportunity. With daily monitoring and automated trading, direct indexing captures far more losses than quarterly manual harvesting.\n\nCustomization benefits beyond tax: you can exclude specific stocks (ethical/ESG screens), overweight or underweight sectors, or tilt toward factors (value, momentum, quality) without losing the tax harvesting benefits. It's essentially a customized index fund with tax management built in.",
      advanced:
        "The diminishing benefit over time: tax-loss harvesting generates the most alpha in the first few years. As your cost basis rises (from replacing sold positions with new purchases), there are fewer losses to harvest. After 10-15 years, a mature direct indexing portfolio has limited remaining tax alpha because all positions have low cost bases.\n\nTransition management: for investors holding highly appreciated concentrated stock positions, direct indexing platforms can tax-efficiently transition into a diversified portfolio by selling losers first and gradually diversifying.\n\nThe minimum account size debate: traditional direct indexing required $250K-1M minimums. Fractional shares have lowered this to $5K-50K at some platforms. However, the tax alpha is most valuable for investors in the highest brackets with significant taxable portfolios. An investor in the 12% bracket benefits minimally compared to someone in the 37%+ bracket.\n\nThe estate planning angle: at death, all positions receive a step-up in basis. The accumulated 'deferred gains' from years of tax-loss harvesting disappear entirely. This makes direct indexing even more powerful for long-term wealth building when combined with estate planning."
    },
    honestAnalysis:
      "Direct indexing is genuinely useful for high-net-worth investors with large taxable accounts. For someone with $50K in a taxable brokerage, the tax savings don't justify the added complexity and fees. It's a tool for the already-wealthy to become wealthier, not a beginner strategy.",
  },

  // ─── Domain 8: Estate Planning (new additions) ─────────────────────────

  {
    id: "c8-03",
    slug: "buy-borrow-die",
    domainId: "d8",
    name: "Buy, Borrow, Die: How Billionaires Avoid Taxes Legally",
    summary:
      "Buy assets that appreciate. Borrow against them for spending money (no tax on loans). Die with the assets and heirs get a stepped-up basis, erasing the deferred gains. The ultra-wealthy's playbook.",
    complexityMin: 3,
    hasCalculator: false,
    relatedConceptSlugs: ["estate-planning-basics", "beneficiary-designations", "zero-percent-capital-gains"],
    layers: {
      accessible:
        "The 'buy, borrow, die' strategy is how many ultra-wealthy individuals legally avoid paying income or capital gains tax for decades -- sometimes their entire lives.\n\nStep 1: BUY appreciating assets (stocks, real estate, businesses). As long as you don't sell, you don't owe capital gains tax. Your wealth grows, but your taxable income stays low.\n\nStep 2: BORROW against those assets when you need cash. Loans are not taxable income. A billionaire can borrow $10 million against their stock portfolio at 3-5% interest and spend it like income -- with zero tax bill. The interest may even be deductible.\n\nStep 3: DIE with the assets. Under current law, your heirs receive a 'stepped-up' cost basis equal to the fair market value at your death. All the capital gains that accumulated over your lifetime are erased. Your heirs can sell the assets and owe zero tax on the appreciation.",
      intermediate:
        "Why loans work: if you have $100M in stock with a $10M cost basis, selling to fund your lifestyle would trigger a $90M capital gain at 23.8% (including NIIT) = $21.4M in tax. Instead, borrowing $5M against the portfolio costs maybe $200K/year in interest. You avoid $21.4M in tax by paying $200K. The math is overwhelming.\n\nMargin loans and securities-based lending: most large brokerages offer portfolio lines of credit at rates of 2-5% above benchmarks, with borrowing limits of 50-70% of portfolio value. The interest rate is almost always lower than the portfolio's expected return, making the loan accretive to net worth.\n\nThe step-up basis eliminates deferred gains at death. If you bought Amazon stock at $10 and it's $200 when you die, your heirs' basis is $200. They can sell immediately and owe nothing. The $190 of appreciation was never taxed -- not when you earned it, not when you borrowed against it, not when your heirs received it.",
      advanced:
        "Limitations and risks: (1) Margin calls: if the portfolio drops significantly, the lender may demand repayment or additional collateral. Forced selling during a downturn defeats the entire strategy. Diversified portfolios and conservative LTV ratios (30-40%) mitigate this. (2) Interest rate risk: variable-rate margin loans become expensive in high-rate environments. A 7% margin rate changes the math considerably. (3) Legislative risk: the step-up in basis has been targeted by multiple legislative proposals. Biden's 2021 proposal would have taxed unrealized gains at death above $1M. It failed, but the provision could return.\n\nThe middle-class version: you don't need $100M for this to work. A retiree with a $2M portfolio can borrow $200K at 5% for home renovation instead of selling $200K in appreciated stock (which would trigger $50K+ in capital gains tax). The $10K/year in interest is far less than the tax bill.\n\nThe charitable twist: instead of dying with appreciated assets, you can donate them to charity during your lifetime. You get a deduction for the full fair market value and never pay capital gains tax on the appreciation. This is often more tax-efficient than donating cash."
    },
    honestAnalysis:
      "Buy, borrow, die is a real strategy used by the ultra-wealthy. It's legal, well-documented, and arguably the single biggest driver of wealth inequality in the tax code. Whether you think it's brilliant tax planning or a moral failing depends on your politics. Either way, understanding it is important.",
  },

  {
    id: "c8-04",
    slug: "irrevocable-life-insurance-trust",
    domainId: "d8",
    name: "ILIT: Removing Life Insurance from Your Estate",
    summary:
      "Life insurance proceeds are income-tax-free but still count in your taxable estate. An Irrevocable Life Insurance Trust (ILIT) removes the death benefit from your estate entirely, saving 40% estate tax.",
    complexityMin: 3,
    hasCalculator: false,
    relatedConceptSlugs: ["estate-planning-basics", "beneficiary-designations", "term-vs-permanent"],
    layers: {
      accessible:
        "Most people know that life insurance death benefits are income-tax-free. What they don't know is that the death benefit IS included in your taxable estate. If you have a $2M life insurance policy and your estate is already near the exemption limit ($13.61M in 2025), that $2M could be taxed at 40%.\n\nAn Irrevocable Life Insurance Trust (ILIT) solves this: the trust owns the policy (not you), so the death benefit is not part of your estate. Your beneficiaries still receive the money -- just through the trust instead of directly.",
      intermediate:
        "How an ILIT works: (1) You create an irrevocable trust with a trustee (not you -- typically a trusted family member or institution). (2) The trust purchases a life insurance policy on your life (or you transfer an existing policy, but there's a 3-year look-back rule). (3) You make annual gifts to the trust to pay the premiums (within the annual gift exclusion -- $18,000 per beneficiary in 2025). (4) Crummey letters: the trustee must notify beneficiaries of their right to withdraw each gift contribution (this makes the gift qualify for the annual exclusion). (5) At your death, the trust receives the death benefit and distributes it according to the trust terms.\n\nThe 3-year rule: if you transfer an existing policy to an ILIT and die within 3 years, the death benefit is pulled back into your estate. To avoid this, have the ILIT purchase a new policy. The 3-year rule doesn't apply to policies the ILIT originally purchased.",
      advanced:
        "ILIT advanced planning: (1) Second-to-die (survivorship) policies: common for married couples because the estate tax is deferred until the second spouse dies. The ILIT owns a survivorship policy that pays out at the second death, exactly when the estate tax is due. (2) Wealth replacement trust: you donate appreciated assets to charity (getting a tax deduction and avoiding capital gains), then use the tax savings to fund an ILIT that 'replaces' the donated wealth for your heirs. Your family receives the same amount, charity benefits, and you saved on taxes.\n\nDynasty trust variation: in some states (South Dakota, Nevada, Alaska), an ILIT can be structured as a dynasty trust, lasting in perpetuity. The death benefit and subsequent growth are never subject to estate tax across multiple generations.\n\nThe estate tax exemption sunset: the current $13.61M exemption is scheduled to drop to approximately $6-7M on January 1, 2026. If it does, many more estates will face the 40% tax, making ILITs relevant to a much broader population. Estate planning attorneys are recommending that clients establish ILITs now while the higher exemption still exists."
    },
    honestAnalysis:
      "ILITs are essential for high-net-worth estate planning but add significant complexity and cost. They're irrevocable -- once created, you can't easily modify them. If you don't need estate tax planning (your estate is well under the exemption), an ILIT adds cost without benefit.",
  },

  // ─── Domain 9: Insurance (new additions) ───────────────────────────────

  {
    id: "c9-04",
    slug: "disability-insurance",
    domainId: "d9",
    name: "Disability Insurance: Protecting Your Most Valuable Asset",
    summary:
      "Your ability to earn income is worth millions over your career. A 30-year-old earning $80K has $3M+ in future earnings. Disability insurance protects that -- yet most people skip it.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["term-vs-permanent", "umbrella-insurance", "emergency-fund-optimization"],
    layers: {
      accessible:
        "Most people insure their car ($30K), their home ($300K), and even their phone ($1K). But they don't insure the thing that pays for all of those: their ability to earn income. A 30-year-old earning $80,000/year has over $3 million in future earnings ahead of them. If an injury or illness prevents them from working, that income stream stops.\n\nDisability insurance replaces a portion of your income (typically 60-70%) if you can't work due to illness or injury. The odds aren't small: about 1 in 4 workers will experience a disability lasting more than 90 days before retirement.",
      intermediate:
        "Types: (1) Short-term disability (STD): covers the first 3-6 months. Many employers provide this. (2) Long-term disability (LTD): kicks in after STD ends and can last until age 65. This is the critical one. (3) Own-occupation: pays if you can't do YOUR specific job. A surgeon who loses fine motor skills gets paid even if they could work as a teacher. (4) Any-occupation: only pays if you can't do ANY job. Much cheaper but much harder to collect on.\n\nBuying individual vs. employer-provided: employer-provided LTD is better than nothing but has a critical flaw -- benefits are taxable if the employer pays the premium. If your employer provides 60% of salary and benefits are taxed at 30%, you're really getting 42% of your income. Individual policies with after-tax premiums pay TAX-FREE benefits.\n\nCost: typically 1-3% of your income. A $100K earner might pay $100-250/month for a solid own-occupation policy. That's the insurance premium on a $3M+ asset.",
      advanced:
        "Policy riders worth considering: (1) COLA (cost of living adjustment): benefits increase with inflation. Essential for long-term claims. (2) Future increase option: lets you increase coverage as your income grows without new medical underwriting. Get this when you're young and healthy. (3) Residual/partial disability: pays a proportional benefit if you can work part-time but not full-time. Important for gradual disability onset.\n\nThe underwriting window: disability insurance requires medical underwriting. If you develop health issues, you may not be able to get coverage at any price. The best time to buy is when you're young and healthy -- even if you think you can't afford it. A basic policy you buy at 28 and upgrade later is infinitely better than discovering at 40 (with a bad back) that you can't qualify.\n\nTax planning: if you pay premiums with after-tax dollars, benefits are tax-free (Section 104(a)(3)). If your employer pays, benefits are taxable. The optimal strategy: have your employer provide group LTD (it's cheap for them), then supplement with an individual own-occupation policy to fill the gap."
    },
    honestAnalysis:
      "Disability insurance is the most under-purchased type of insurance relative to its importance. People vastly underestimate disability risk (it's more likely than death before 65) and overestimate their ability to 'figure it out' if they can't work. If you have dependents or significant financial obligations, own-occupation LTD is not optional.",
  },

  {
    id: "c9-05",
    slug: "long-term-care",
    domainId: "d9",
    name: "Long-Term Care: The Risk Nobody Wants to Think About",
    summary:
      "The average cost of a private nursing home room is $108K/year. 70% of people over 65 will need some form of long-term care. Medicare doesn't cover it. Medicaid requires you to spend down almost everything.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["term-vs-permanent", "disability-insurance", "estate-planning-basics"],
    layers: {
      accessible:
        "Long-term care (LTC) includes nursing homes, assisted living, in-home care, and adult day services. It's needed when you can't perform basic activities of daily living (bathing, dressing, eating, toileting, continence, transferring). Here's what most people don't know:\n\nMedicare does NOT cover long-term care (except very limited skilled nursing after a hospital stay). Medicaid covers it, but only after you've spent down nearly all your assets (in most states, below $2,000). The average nursing home stay is 2.5 years, costing $270,000 at national average rates.\n\nOptions: (1) Self-insure (save enough to pay out of pocket -- requires $300-500K+ earmarked). (2) Buy LTC insurance. (3) Hybrid policies (life insurance + LTC benefits). (4) Spend down and rely on Medicaid (last resort).",
      intermediate:
        "Traditional LTC insurance: premiums are fixed when you buy (but insurers have raised premiums on existing policies significantly over the past 20 years). Typical costs: $2,000-$5,000/year for a couple buying at age 55. Benefits: typically $150-300/day for 3-5 years with inflation protection. The problem: many people buy it and never use it, and premiums over 30+ years can total $100K+.\n\nHybrid policies (the modern answer): combine life insurance with LTC benefits. If you need long-term care, the policy pays for it. If you never need care, your beneficiaries receive the death benefit. If you change your mind, many hybrids allow you to get most of your premium back. This solves the 'use it or lose it' problem of traditional LTC insurance. Common products: OneAmerica, Lincoln MoneyGuard, Pacific Life.\n\nThe age to buy: too early (40s) and you pay premiums for decades, possibly on a policy that becomes outdated. Too late (70s) and it's unaffordable or you're uninsurable. The sweet spot is typically 55-65, after you know your general health trajectory but before premiums become prohibitive.",
      advanced:
        "Medicaid planning: for those who didn't plan ahead, Medicaid asset protection strategies include (1) Irrevocable trusts funded 5+ years before needing care (the 5-year look-back period). (2) Spousal impoverishment protections: the healthy spouse can keep the home (up to a certain equity level), a car, and assets up to the Community Spouse Resource Allowance (~$148,620 in 2025). (3) Caregiver child exception: the home may be transferred to a child who lived in the home and provided care for 2+ years. (4) Miller trusts (Qualified Income Trusts) for states with income caps for Medicaid eligibility.\n\nThe partnership program: some states have LTC Partnership Programs where buying a qualified LTC policy allows you to protect additional assets from Medicaid spend-down. If you buy a policy that pays $300K in benefits and exhaust it, you can keep $300K in additional assets and still qualify for Medicaid. This is one of the strongest arguments for buying at least some LTC coverage.\n\nSelf-insurance calculation: if you have $2M+ in liquid assets at retirement, self-insuring is viable. The expected value of LTC costs is roughly $200-400K (probability of needing care x average cost). If your portfolio can absorb that without derailing your retirement plan, you can skip the insurance premiums."
    },
    honestAnalysis:
      "Long-term care planning is uncomfortable and expensive, which is why most people ignore it until it's too late. There's no perfect answer -- every option has significant drawbacks. The worst option is doing nothing and assuming Medicare will cover it (it won't).",
  },

  // ─── Domain 10: Debt Strategy (new additions) ─────────────────────────

  {
    id: "c10-04",
    slug: "mortgage-payoff-vs-invest",
    domainId: "d10",
    name: "Pay Off the Mortgage vs Invest: The Math and the Feelings",
    summary:
      "If your mortgage rate is 3-4%, investing at 7-10% historically wins. But the math ignores the psychological value of owning your home free and clear. Both sides have a point.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["debt-avalanche-vs-snowball", "buy-vs-rent", "asset-allocation"],
    layers: {
      accessible:
        "The math is simple: if your mortgage rate is 4% and the stock market returns 10% on average, investing your extra money earns 6% more per year than paying off the mortgage. Over 20 years on a $300K mortgage, that's hundreds of thousands of dollars in additional wealth.\n\nBut money isn't just math. A paid-off house means: no monthly mortgage payment (your cost of living drops dramatically), zero risk of foreclosure, massive peace of mind, and flexibility (you can take career risks, retire early, or survive job loss with much lower expenses).\n\nThe compromise most financial planners recommend: invest at least enough to get your full employer 401(k) match, max out tax-advantaged accounts (Roth IRA, HSA), then split remaining money between mortgage prepayment and taxable investing.",
      intermediate:
        "The after-tax comparison matters: a 4% mortgage with the standard deduction (no itemized deduction benefit) costs 4% after tax. Stock returns of 10% nominal, minus 15-20% capital gains tax on a portion, might be 8-9% after tax. The spread is still 4-5% -- clearly favoring investing.\n\nBut this changes with higher mortgage rates. At 7%, the after-tax mortgage cost is 7% (or ~5% if you're itemizing). Stock returns after tax might be 8-9%. The spread is only 1-2% -- barely enough to compensate for the risk and uncertainty of stock returns. At 7%+ mortgage rates, aggressive prepayment is mathematically competitive.\n\nRisk-adjusted analysis: paying off a mortgage is a guaranteed return equal to your interest rate. Stock returns are uncertain -- they could be negative for a decade. The 'risk-free rate' comparison suggests that mortgage prepayment at 4-5%+ is equivalent to a pretty good risk-free investment. Treasury bonds currently yield 4-5%, and a mortgage payoff is essentially a tax-free bond at your mortgage rate.",
      advanced:
        "The opportunity cost framework: the decision isn't just 'mortgage vs. stocks.' It's 'mortgage vs. best alternative use.' Alternatives include: (1) Funding a backdoor Roth or mega backdoor Roth (tax-free growth forever). (2) Building a taxable brokerage with tax-loss harvesting. (3) Investing in rental property for additional income. (4) Starting or growing a business. Each alternative has different risk/return characteristics.\n\nThe FIRE (Financial Independence) perspective: many early retirees pay off the mortgage specifically to reduce their annual spending number, which directly reduces the portfolio size needed to retire. If your mortgage is $24K/year and you follow the 4% rule, eliminating the mortgage payment means you need $600K less in your portfolio. That could mean retiring 3-5 years earlier.\n\nThe psychological research: behavioral finance research shows that debt, even 'good' low-interest debt, causes measurable stress and reduces life satisfaction. The utility of a debt-free home may exceed the utility of a marginally larger portfolio for many people. This isn't irrational -- it's a legitimate preference for security over optimization."
    },
    honestAnalysis:
      "The purely mathematical answer favors investing over mortgage prepayment at rates below ~5%. But humans aren't spreadsheets. If paying off your home lets you sleep better, take career risks, or retire with confidence, the psychological return may exceed the investment return. There's no wrong answer here -- only wrong reasons (like paying off a 3% mortgage while carrying 18% credit card debt).",
  },

  {
    id: "c10-05",
    slug: "student-loan-strategies",
    domainId: "d10",
    name: "Student Loan Strategy: IBR, PSLF, and the Forgiveness Math",
    summary:
      "The optimal student loan strategy depends on your career path. High-earning private sector? Pay aggressively. Government or nonprofit? Income-driven repayment + PSLF could save you six figures.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["debt-avalanche-vs-snowball", "mortgage-payoff-vs-invest"],
    layers: {
      accessible:
        "Federal student loans have several repayment plans, and choosing the wrong one can cost you tens of thousands of dollars. The big decision tree:\n\nPath 1: High income, private sector. Pay off loans as fast as possible. Use the avalanche method (highest interest first). Every dollar of interest you avoid is a dollar saved.\n\nPath 2: Government, nonprofit, or qualifying employer. Use an Income-Driven Repayment (IDR) plan to keep payments low, and aim for Public Service Loan Forgiveness (PSLF) after 120 qualifying payments (10 years). The forgiven balance is tax-free.\n\nPath 3: Moderate income, private sector. IDR plan for 20-25 years, then the remaining balance is forgiven (but currently taxable as income -- the 'tax bomb').\n\nThe worst strategy: staying on the standard 10-year plan when you qualify for PSLF (you'd pay everything off before forgiveness kicks in) or paying extra on loans you plan to have forgiven (every extra dollar is wasted).",
      intermediate:
        "PSLF in detail: after 120 qualifying monthly payments (10 years) while working full-time for a qualifying employer (government, 501(c)(3) nonprofit, some other nonprofits), your remaining federal loan balance is forgiven tax-free. Qualifying payments must be on an IDR plan or the standard plan.\n\nThe SAVE plan (Saving on a Valuable Education): the newest IDR plan, replacing REPAYE. Payments are capped at 5% of discretionary income for undergraduate loans (10% for graduate). Any remaining balance is forgiven after 20 years (undergraduate) or 25 years (graduate). Interest that exceeds your payment doesn't capitalize (the balance doesn't grow).\n\nThe PSLF optimization strategy: (1) Consolidate all federal loans into Direct Loans (only Direct Loans qualify). (2) Enroll in the IDR plan with the lowest payment. (3) File taxes 'married filing separately' if your spouse has high income (reduces AGI for IDR calculation, though this may increase overall taxes). (4) Maximize pre-tax deductions (401k, HSA) to reduce AGI and therefore your payment. (5) Make 120 payments. (6) Apply for forgiveness. Every dollar you reduce your payment by is a dollar you don't pay.",
      advanced:
        "The forgiveness tax bomb for non-PSLF: under current law, loan forgiveness through IDR plans (after 20-25 years) IS taxable as income. If $200K is forgiven, you owe income tax on $200K. At the 24% bracket, that's $48K in taxes due in a single year. However: (1) This is still less than paying the full $200K. (2) You can prepare by saving in a Roth IRA or taxable account. (3) The tax bomb is scheduled to be tax-free through 2025 under the American Rescue Plan, and legislation may extend this.\n\nRefinancing analysis: refinancing federal loans to a private lender at a lower rate can save interest, but you permanently lose access to IDR plans, PSLF, and forgiveness options. Only refinance if: (1) you're certain you won't pursue PSLF, (2) your income is stable and high, (3) the rate savings is significant, and (4) you can pay off the loan in 3-5 years.\n\nThe physician/lawyer optimization: doctors and lawyers with $200-400K in loans and qualifying employer potential have the most to gain from PSLF. A physician earning $250K with $300K in loans might pay $150K over 10 years on an IDR plan and have $250K+ forgiven tax-free. vs. paying $400K+ total on aggressive repayment. The PSLF savings can exceed $200K."
    },
    honestAnalysis:
      "Student loan optimization is one of the few areas where the right strategy can save six figures. But the rules are complex, change frequently, and the programs have had implementation problems. Verify your employer qualifies for PSLF early, track your payments carefully, and don't rely on forgiveness programs that haven't been officially approved for your situation.",
  },

  // ─── Domain 11: Behavioral Finance (new additions) ─────────────────────

  {
    id: "c11-04",
    slug: "mental-accounting",
    domainId: "d11",
    name: "Mental Accounting: Why You Treat Money Differently Based on Its Source",
    summary:
      "You'd never blow your salary on a risky bet, but you'll gamble with a bonus or inheritance. Mental accounting makes you treat dollars differently based on where they came from -- and it costs you.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["loss-aversion", "recency-bias"],
    layers: {
      accessible:
        "Mental accounting is the tendency to treat money differently based on where it came from or what you've mentally labeled it for. A $1,000 tax refund feels like 'bonus money' so you spend it freely, but you'd agonize over spending $1,000 from your savings account. The money is identical -- a dollar is a dollar -- but your brain treats them differently.\n\nCommon examples: spending a tax refund on something you'd never buy with savings. Keeping money in a savings account earning 1% while carrying credit card debt at 20%. Treating investment gains as 'house money' and taking bigger risks with them. Refusing to sell a losing stock to 'break even' while ignoring better opportunities elsewhere.",
      intermediate:
        "How mental accounting costs you: (1) The 'sunk cost' trap: you keep paying for a gym membership you don't use because you 'already invested' in it. (2) Windfall spending: studies show people spend bonuses, tax refunds, and lottery winnings much faster and more frivolously than regular income. The money is identical but labeled differently in your mind. (3) Account segregation: keeping money in a low-yield 'emergency fund' while carrying high-interest debt. The rational move is to pay off the debt and re-borrow if needed (via a credit line), but it feels risky because those accounts are mentally separate.\n\nWhen mental accounting helps: it can be a useful budgeting tool. The 'envelope system' (assigning money to specific categories) is mental accounting deliberately used to control spending. A 'vacation fund' that you refuse to raid for everyday expenses is irrational but effective. The key is to use mental accounting intentionally (as a budgeting tool) rather than letting it happen unconsciously (leading to poor decisions).",
      advanced:
        "Richard Thaler (Nobel Prize, 2017) formalized mental accounting as a key component of behavioral economics. The core finding: people evaluate economic outcomes relative to reference points, and those reference points are set by mental accounts rather than by overall wealth.\n\nImplications for investing: (1) Narrow framing: checking your portfolio daily makes you see more losses (short-term volatility) and triggers loss aversion. Checking annually smooths the volatility and lets you see the long-term trend. Your 'return evaluation period' affects your risk tolerance. (2) The disposition effect: investors sell winners too early (to 'lock in' gains) and hold losers too long (to avoid 'realizing' losses). Both are mental accounting errors -- the unrealized gain/loss is already real in economic terms. (3) House money effect: after a gain, investors take more risk (the gains feel like 'the market's money, not mine'). After a loss, they become overly conservative. Neither reaction is rational."
    },
    honestAnalysis:
      "Mental accounting is one of the most pervasive cognitive biases and one of the hardest to overcome because it FEELS rational. The cure is to regularly ask yourself: 'Would I make this same decision if this money came from a different source?' If not, you're mental accounting.",
  },

  {
    id: "c11-05",
    slug: "anchoring-bias",
    domainId: "d11",
    name: "Anchoring: Why the First Number You Hear Dominates Your Thinking",
    summary:
      "Your salary negotiation, investment decisions, and purchase behavior are all warped by arbitrary 'anchor' numbers. The original price tag, a Zillow estimate, or your stock's purchase price -- none of these should matter, but they do.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["loss-aversion", "mental-accounting"],
    layers: {
      accessible:
        "Anchoring is when the first number you encounter disproportionately influences your judgment, even when that number is irrelevant. Stores mark prices 'down' from $200 to $80 -- the $200 is the anchor that makes $80 feel like a deal, even if the item was always worth $80.\n\nIn investing: you bought a stock at $50. It drops to $30. You refuse to sell because '$50 is what it's worth.' But the stock doesn't know (or care) what you paid. Its value is determined by its future cash flows, not your purchase price. Your anchor to $50 is costing you money if a better investment is available.\n\nIn salary: you make $80K. A new job offers $95K. You feel great -- an $15K raise! But if the market rate for the role is $110K, you're underpaid by $15K. You anchored to your old salary instead of the market rate.",
      intermediate:
        "Anchoring in financial decisions: (1) Home prices: sellers anchor to their purchase price or Zillow 'Zestimate.' A house is worth what a buyer will pay, not what the seller paid. (2) Retirement planning: people anchor to round numbers ($1M, $2M) without calculating their actual needs. You might need $1.8M or $3.2M -- the anchored round number could be dangerously wrong in either direction. (3) Donation amounts: charities suggest donation amounts ($25, $50, $100) specifically because the middle option becomes an anchor -- most people choose it. (4) Budgeting: if you've always spent $600/month on groceries, you anchor to that amount even when your situation changes (income drop, kids move out).\n\nDe-anchoring strategies: (1) Always research independently before seeing any number. Check market salary data BEFORE getting an offer. Research home values BEFORE seeing the listing price. (2) Generate your own estimate first. 'What would I pay for this if I didn't know the asking price?' (3) Consider multiple reference points instead of fixating on one number.",
      advanced:
        "Kahneman and Tversky's original anchoring experiments showed that even arbitrary numbers (a wheel of fortune spin) influenced subsequent estimates of unrelated quantities (African countries in the UN). The bias persists even when subjects are warned about it. It's one of the most robust findings in behavioral science.\n\nInvestment applications: (1) The 'original cost' anchor leads to tax-loss harvesting resistance. Investors feel selling a loss 'makes it real,' even though the economic loss already occurred. This costs them tax deductions. (2) Analysts anchor to their own prior estimates or consensus estimates, leading to herding behavior and slow reactions to new information. (3) IPO pricing: the initial offering price becomes a powerful anchor that affects trading for months, even though it was set by investment banks (who have their own incentives).\n\nThe power of reframing: instead of thinking 'this stock is down 40% from what I paid,' ask 'if I had this amount in cash today, would I buy this stock?' If not, sell. Your purchase price is sunk cost, not a prediction of future value."
    },
    honestAnalysis:
      "Anchoring is nearly impossible to eliminate entirely -- it's deeply wired into how the brain processes numbers. The best defense is awareness: actively question whether the first number you encountered is influencing your judgment. If you can't shake the anchor, bring in a fresh perspective (advisor, spouse, friend) who isn't anchored to the same number.",
  },

  // ─── Domain 12: Career Finance (new additions) ─────────────────────────

  {
    id: "c12-03",
    slug: "freelance-rate-setting",
    domainId: "d12",
    name: "Freelance Rate Setting: Stop Undercharging",
    summary:
      "Most freelancers charge too little because they anchor to their old salary divided by hours. The correct calculation accounts for self-employment tax, benefits, unbillable hours, and business expenses.",
    complexityMin: 1,
    hasCalculator: false,
    relatedConceptSlugs: ["total-comp-analysis", "salary-negotiation", "s-corp-optimization"],
    layers: {
      accessible:
        "The biggest mistake new freelancers make: they take their old salary, divide by 2,000 hours, and use that as their hourly rate. If they earned $80K, they charge $40/hour. This is a massive pay cut in disguise.\n\nWhy: as an employee, your employer paid 7.65% FICA tax on your behalf (you now pay the full 15.3% as self-employment tax). They paid for health insurance ($5-20K/year), retirement contributions, paid vacation (you now have zero paid time off), equipment, software, and office space. And you won't bill 2,000 hours -- between marketing, admin, invoicing, and finding clients, you'll be lucky to bill 1,200-1,500 hours.\n\nThe real calculation: take your desired income, add self-employment tax (15.3%), add health insurance ($6-12K), add retirement contributions ($6-20K), add business expenses ($3-10K), divide by realistic billable hours (1,200-1,400). An $80K-equivalent usually means $70-90/hour minimum.",
      intermediate:
        "The detailed rate calculation for $80K equivalent:\n- Desired take-home: $80,000\n- Self-employment tax (15.3%): $12,240\n- Health insurance: $8,000\n- Retirement (15% target): $12,000\n- Business expenses: $5,000\n- Required gross: $117,240\n- Billable hours (realistic): 1,300\n- Minimum hourly rate: $90/hour\n\nThat's 2.25x the naive $40/hour calculation. And this doesn't include any profit margin, emergency fund contributions, or the risk premium of inconsistent income.\n\nValue-based pricing: the better approach for established freelancers. Instead of charging by the hour, charge based on the value you deliver. A website redesign that increases a client's revenue by $100K/year is worth $20-50K, regardless of how many hours it takes you. Moving from hourly to project-based or value-based pricing is the single biggest income lever for freelancers.",
      advanced:
        "Rate negotiation psychology: (1) Always quote your rate confidently and without explanation. Justifying your rate signals uncertainty. (2) If a client pushes back, don't lower your rate -- reduce scope instead. 'I can do X and Y at this rate, or just X for less.' (3) Raise your rates annually (3-10%). Current clients who value you will stay. Those who leave were price-sensitive clients you'll replace with better ones.\n\nThe S-Corp optimization layer: once your freelance income exceeds $40-50K consistently, forming an LLC with S-Corp election saves 15.3% self-employment tax on distributions above your reasonable salary. Combined with Solo 401(k) contributions (up to $70,000/year in tax-advantaged savings), a well-structured freelance business can be significantly more tax-efficient than employment.\n\nThe portfolio approach: the most financially resilient freelancers have 3+ clients with no single client exceeding 30% of revenue. This reduces concentration risk (losing one client doesn't mean losing all income) and provides negotiating leverage (you're never desperate to keep any single client)."
    },
    honestAnalysis:
      "Most freelancers are dramatically underpriced because they compare their rate to their old salary without accounting for the full cost of self-employment. The market will often pay more than you expect -- you won't know your true rate ceiling until you've been rejected for being too expensive at least a few times.",
  },

  // ─── Domain 13: International (new additions) ──────────────────────────

  {
    id: "c13-03",
    slug: "fbar-fatca",
    domainId: "d13",
    name: "FBAR and FATCA: The Foreign Account Reporting You Can't Ignore",
    summary:
      "If you have more than $10,000 in foreign financial accounts at any point during the year, you must file an FBAR. The penalties for not filing -- even unintentionally -- can exceed the account balance.",
    complexityMin: 2,
    hasCalculator: false,
    relatedConceptSlugs: ["feie-foreign-tax-credit"],
    layers: {
      accessible:
        "FBAR (FinCEN Form 114): if the total of ALL your foreign financial accounts exceeded $10,000 at any point during the year, you must report every foreign account on an FBAR. This includes bank accounts, investment accounts, pension accounts, and even accounts where you have signature authority (like a company account in another country). The $10,000 threshold is AGGREGATE -- 5 accounts with $2,500 each triggers it.\n\nFATCA (Form 8938): a separate reporting requirement for US taxpayers with foreign financial assets above $50,000 ($200,000 if living abroad). FATCA goes on your tax return; FBAR is filed separately with FinCEN.\n\nThe penalties are terrifying: willful failure to file an FBAR can result in $129,210 per violation per account per year, or 50% of the account balance. Even non-willful failure is $14,489 per account per year. People have had penalties exceeding their total foreign assets.",
      intermediate:
        "What counts as a 'foreign financial account': (1) Bank accounts in any foreign country. (2) Securities/brokerage accounts held with a foreign financial institution. (3) Foreign mutual funds. (4) Foreign pension accounts (UK SIPP, Australian superannuation, Canadian RRSP). (5) Foreign life insurance with cash value. (6) Accounts you have signature authority over, even if you don't own them.\n\nWhat does NOT count: foreign real estate (directly held), foreign stock held in a US brokerage account, US-based accounts in foreign currency.\n\nThe aggregation rule: if you have a $6,000 savings account in the UK and a $5,000 checking account in Germany, your aggregate maximum is $11,000 -- above the $10,000 threshold. You must report BOTH accounts.\n\nThe filing deadline: April 15 with an automatic extension to October 15. FBAR is filed electronically through the BSA E-Filing System, NOT with your tax return.",
      advanced:
        "The Streamlined Filing Compliance Procedures: if you've been non-compliant (failed to file FBARs for previous years) but it wasn't willful, the IRS offers a way to come into compliance with reduced penalties. Under Streamlined: file the last 3 years of amended tax returns and 6 years of delinquent FBARs. Penalty: 5% of the highest aggregate balance for domestic filers, 0% for those living abroad.\n\nThe voluntary disclosure option: for willful non-compliance (you knew about the requirement and didn't file), the formal IRS Voluntary Disclosure Program is more appropriate. Higher penalties but protects against criminal prosecution.\n\nPFIC trap: foreign mutual funds and ETFs held outside US-qualified accounts are classified as Passive Foreign Investment Companies (PFICs), subject to punitive tax treatment. Gains are taxed at the highest ordinary income rate plus an interest charge. This effectively makes foreign mutual funds toxic for US persons. The solution: hold only US-domiciled funds (even in foreign brokerage accounts) or use 'check the box' elections for certain foreign entities.\n\nThe exit tax: US citizens who renounce their citizenship are subject to an exit tax -- treated as if they sold all worldwide assets on the day before expatriation. This captures unrealized gains and can be a massive tax hit. The covered expatriate threshold is $190,000 in average annual net income tax over 5 years, or $866,000 in net worth."
    },
    honestAnalysis:
      "FBAR/FATCA compliance is one of the most common areas where well-meaning Americans abroad get into serious trouble. The rules are complex, the penalties are wildly disproportionate to the offense, and many tax preparers don't understand international reporting. If you have foreign accounts, find a tax preparer who specializes in expat taxation.",
  },
];

export function getConceptBySlug(slug: string): FinancialConcept | undefined {
  return concepts.find((c) => c.slug === slug);
}

export function getConceptsByDomain(domainId: string): FinancialConcept[] {
  return concepts.filter((c) => c.domainId === domainId);
}

export function searchConcepts(query: string): FinancialConcept[] {
  const q = query.toLowerCase();
  return concepts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.layers.accessible.toLowerCase().includes(q)
  );
}
