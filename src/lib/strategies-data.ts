export interface Strategy {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
  }[];
  keyNumbers: {
    label: string;
    value: string;
  }[];
  commonMistake: string;
  uncommonInsight: string;
}

export const strategies: Strategy[] = [
  {
    id: "roth-conversion",
    title: "Roth Conversion Ladder",
    subtitle: "Pay taxes now, never again",
    icon: "ArrowUpDown",
    summary:
      "Converting traditional IRA/401k money to Roth during low-income years means you pay taxes at a lower bracket now and never pay taxes on that money again -- including all future growth.",
    sections: [
      {
        heading: "How It Works",
        content:
          "A Roth conversion moves money from a traditional (pre-tax) retirement account to a Roth (after-tax) account. You pay income tax on the converted amount in the year you convert. After that, the money grows tax-free and withdrawals in retirement are tax-free. The strategy is to convert during years when your income is lower -- early retirement, sabbatical, career transitions, or any year you're in a lower tax bracket than you expect to be in later.",
      },
      {
        heading: "The Ladder Strategy",
        content:
          "If you retire early (before 59.5), you can't access Roth contributions penalty-free for 5 years after conversion. The ladder works by converting a year's worth of living expenses each year. After 5 years, the first conversion becomes accessible, and each year after that another year's conversion unlocks. You build a rolling 5-year pipeline of tax-free money.",
      },
      {
        heading: "When to Convert",
        content:
          "The ideal time is any year your taxable income is unusually low: the gap between retirement and Social Security, a sabbatical year, a year of large deductions, or early retirement before pensions kick in. The goal is to fill up a low tax bracket with conversions. Converting $50K in a year you're in the 12% bracket beats leaving it to be taxed at 22-24% later.",
      },
    ],
    keyNumbers: [
      { label: "2025 standard deduction (married)", value: "$30,000" },
      { label: "12% bracket ceiling (married)", value: "$96,950" },
      { label: "Optimal conversion zone", value: "$0 - $96,950" },
      { label: "5-year rule for penalty-free access", value: "5 years" },
    ],
    commonMistake:
      "Converting too much in a single year, pushing yourself into a higher tax bracket and losing the advantage. Or worse -- not accounting for how the conversion income affects Medicare premiums (IRMAA) two years later.",
    uncommonInsight:
      "If you have a year with large medical deductions, a business loss, or significant charitable giving, that's a golden opportunity to convert more because those deductions offset the conversion income. Pair large deductions with large conversions.",
  },
  {
    id: "401k-overfunding",
    title: "The 401k Overfunding Trap",
    subtitle: "More isn't always better",
    icon: "AlertTriangle",
    summary:
      "Maxing out your 401k for decades creates a massive pre-tax balance that will generate huge Required Minimum Distributions (RMDs) in retirement -- potentially pushing you into higher tax brackets than you were trying to avoid.",
    sections: [
      {
        heading: "The Problem",
        content:
          "Traditional 401k contributions reduce your taxable income today. Great. But the money grows tax-deferred, not tax-free. When you take it out in retirement, every dollar is taxed as ordinary income. If you've been maxing out for 20-30 years, you might have $2M+ in pre-tax accounts. At age 73, the IRS forces you to take Required Minimum Distributions (RMDs) whether you need the money or not.",
      },
      {
        heading: "RMD Math",
        content:
          "A $2M traditional IRA at age 73 requires about a $75K distribution in year one. Combined with Social Security ($30-40K), that's $105-115K in forced taxable income. You might be in the 22-24% bracket in retirement -- the same or higher than when you contributed. The entire tax deferral strategy backfired.",
      },
      {
        heading: "The Balanced Approach",
        content:
          "Get the employer match (always). Then split additional contributions between traditional and Roth 401k. If no Roth 401k is available, max the match, then fund a Roth IRA, then fund a taxable brokerage account. Diversifying across tax treatments (pre-tax, Roth, taxable) gives you flexibility in retirement to manage your tax bracket year by year.",
      },
    ],
    keyNumbers: [
      { label: "2025 401k contribution limit", value: "$23,500" },
      { label: "Catch-up (50+)", value: "+$7,500" },
      { label: "RMD start age", value: "73" },
      { label: "RMD % at 73", value: "~3.8%" },
    ],
    commonMistake:
      "Blindly maxing the traditional 401k because 'tax deduction good' without modeling what RMDs will look like in 25 years. The math often doesn't work if you're in the 22%+ bracket today.",
    uncommonInsight:
      "If you're in the 22% or higher bracket and your employer offers a Roth 401k, you should seriously consider splitting contributions. You're essentially buying tax rate insurance -- locking in today's rate against unknown future rates.",
  },
  {
    id: "whole-life-cash-value",
    title: "Whole Life Cash Value Protection",
    subtitle: "The asset creditors can't touch",
    icon: "Shield",
    summary:
      "In most states, the cash value inside a whole life insurance policy is partially or fully protected from creditors, lawsuits, and bankruptcy proceedings. It's one of the few truly protected asset classes.",
    sections: [
      {
        heading: "How Cash Value Protection Works",
        content:
          "Whole life insurance builds cash value over time. In most states, this cash value is protected from creditors by state law. If you're sued, go through bankruptcy, or face a judgment, the cash value in your whole life policy is typically exempt -- meaning creditors can't seize it. The level of protection varies by state: Florida and Texas offer unlimited protection, while other states cap the exemption.",
      },
      {
        heading: "Who Needs This",
        content:
          "Business owners, doctors, real estate investors, contractors -- anyone in a profession with above-average lawsuit risk. If you have assets worth protecting and you're in a litigious field, the cash value in a whole life policy acts as a financial bunker. It's also useful for estate planning: the death benefit passes income-tax-free to beneficiaries and can be structured to avoid estate tax.",
      },
      {
        heading: "The Trade-Offs",
        content:
          "Whole life is expensive compared to term insurance. The returns on cash value are modest (3-5% tax-equivalent). It takes 10-15 years for the cash value to exceed what you've paid in premiums. This is not a get-rich strategy -- it's a protect-what-you-have strategy. Think of it as expensive insurance for your other assets, not as an investment.",
      },
    ],
    keyNumbers: [
      { label: "States with unlimited protection", value: "FL, TX +4" },
      { label: "Typical cash value return", value: "3-5%" },
      { label: "Break-even period", value: "10-15 years" },
      { label: "Death benefit tax", value: "$0 (income tax free)" },
    ],
    commonMistake:
      "Buying whole life as an investment. The returns are mediocre compared to index funds. The value is in the protection, the tax advantages, and the estate planning -- not the growth.",
    uncommonInsight:
      "For high-income earners who've maxed all other tax-advantaged accounts, a properly structured whole life policy (with paid-up additions riders) can function as a tax-free savings account with creditor protection. The 'infinite banking' crowd oversells it, but the core concept has merit for the right situation.",
  },
  {
    id: "backdoor-roth",
    title: "Backdoor Roth IRA",
    subtitle: "The legal loophole for high earners",
    icon: "KeyRound",
    summary:
      "If you earn too much to contribute directly to a Roth IRA, you can legally get money in through the back door: contribute to a traditional IRA (non-deductible), then immediately convert to Roth.",
    sections: [
      {
        heading: "The Income Problem",
        content:
          "In 2025, if your modified AGI exceeds $150K (single) or $236K (married), you can't contribute directly to a Roth IRA. But there's no income limit on traditional IRA contributions (they just won't be deductible). And there's no income limit on Roth conversions. Congress left a loophole.",
      },
      {
        heading: "The Backdoor Move",
        content:
          "Step 1: Contribute $7,000 ($8,000 if 50+) to a traditional IRA. Don't deduct it. Step 2: Convert the entire traditional IRA to a Roth IRA. Since you already paid tax on the contribution (it was non-deductible), you owe little to no tax on the conversion. Step 3: File Form 8606 with your tax return to document the non-deductible contribution.",
      },
      {
        heading: "The Pro Rata Trap",
        content:
          "If you have existing pre-tax money in any traditional IRA, the conversion is taxed proportionally across ALL your traditional IRA money (the pro-rata rule). If you have $93K pre-tax and add $7K after-tax, only 7% of your conversion is tax-free. Solution: roll all pre-tax IRA money into your 401k first (if your plan allows it), leaving only the after-tax contribution to convert cleanly.",
      },
    ],
    keyNumbers: [
      { label: "2025 IRA contribution limit", value: "$7,000" },
      { label: "Catch-up (50+)", value: "+$1,000" },
      { label: "Roth income limit (married)", value: "$236,000" },
      { label: "Tax on clean conversion", value: "~$0" },
    ],
    commonMistake:
      "Forgetting about the pro-rata rule. If you have a $200K rollover IRA sitting somewhere, the backdoor Roth doesn't work cleanly. You need to deal with the existing pre-tax balance first.",
    uncommonInsight:
      "The mega backdoor Roth is even more powerful: some 401k plans allow after-tax contributions beyond the $23,500 limit (up to $70,000 total). If you can do in-plan conversions, you can get up to $46,500 extra into Roth per year. Check if your plan supports this.",
  },
  {
    id: "tax-loss-harvesting",
    title: "Tax-Loss Harvesting",
    subtitle: "Turn investment losses into tax savings",
    icon: "Scissors",
    summary:
      "When investments drop in value, selling them locks in a 'tax loss' you can use to offset gains and up to $3,000 of ordinary income per year. Then you immediately buy a similar (not identical) investment to stay in the market.",
    sections: [
      {
        heading: "The Mechanics",
        content:
          "If you bought an S&P 500 fund at $10,000 and it's now worth $7,000, selling it creates a $3,000 capital loss. That loss offsets any capital gains you have. If you have no gains, you can deduct up to $3,000 against ordinary income. Excess losses carry forward to future years indefinitely. Then you buy a different but similar fund (like switching from an S&P 500 fund to a Total Market fund) to stay invested.",
      },
      {
        heading: "The Wash Sale Rule",
        content:
          "You cannot sell a security at a loss and buy a 'substantially identical' security within 30 days before or after the sale. This is the wash sale rule. Buying the exact same fund back within 30 days disallows the loss. But buying a different fund that tracks a different (though similar) index is generally fine. Switch from Vanguard S&P 500 to Fidelity Total Market, for example.",
      },
      {
        heading: "The Compound Effect",
        content:
          "Harvesting losses every year can add 0.5-1.5% to your after-tax returns over time. It's not about timing the market -- it's about systematically capturing tax benefits during normal market volatility. Even in good years, individual positions may be down temporarily. Automated platforms do this daily.",
      },
    ],
    keyNumbers: [
      { label: "Annual income offset limit", value: "$3,000" },
      { label: "Loss carryforward", value: "Unlimited" },
      { label: "Wash sale window", value: "30 days" },
      { label: "Typical annual benefit", value: "0.5-1.5%" },
    ],
    commonMistake:
      "Only harvesting losses during big crashes. The best harvesting happens routinely throughout the year, during normal volatility, in individual positions that temporarily dip.",
    uncommonInsight:
      "Tax-loss harvesting is most valuable in your highest-earning years. A $3,000 deduction is worth $1,110 if you're in the 37% bracket but only $360 in the 12% bracket. Harvest aggressively while your income is high.",
  },
  {
    id: "hsa-strategy",
    title: "The HSA Triple Tax Advantage",
    subtitle: "The most tax-advantaged account that exists",
    icon: "Heart",
    summary:
      "Health Savings Accounts are the only account in the US tax code with a triple tax advantage: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses. No other account does all three.",
    sections: [
      {
        heading: "Triple Tax Advantage",
        content:
          "Contribution: deductible from income (like a traditional 401k). Growth: tax-free (like a Roth IRA). Withdrawals: tax-free when used for qualified medical expenses. No other account gets all three benefits. A Roth gives you two (free growth + free withdrawals). A traditional 401k gives you two (deductible contributions + free growth until withdrawal). The HSA gets the hat trick.",
      },
      {
        heading: "The Stealth Retirement Account",
        content:
          "Here's the move most people miss: pay medical expenses out of pocket today, let your HSA invest and grow for decades, then reimburse yourself tax-free in retirement. There's no time limit on reimbursement. A $200 copay you paid in 2025 can be reimbursed from your HSA in 2055. Just save the receipts. Meanwhile, that $200 has been compounding tax-free for 30 years.",
      },
      {
        heading: "After 65",
        content:
          "Once you turn 65, HSA withdrawals for non-medical expenses are taxed as ordinary income (like a traditional IRA) but with no penalty. So worst case, it becomes a traditional IRA. Best case, you have decades of receipts to reimburse tax-free. After 65, Medicare premiums are also a qualified HSA expense.",
      },
    ],
    keyNumbers: [
      { label: "2025 limit (individual)", value: "$4,300" },
      { label: "2025 limit (family)", value: "$8,550" },
      { label: "Catch-up (55+)", value: "+$1,000" },
      { label: "Tax advantages", value: "3 (only account with all 3)" },
    ],
    commonMistake:
      "Using the HSA as a spending account -- paying medical bills directly from it instead of investing it and paying out of pocket. You're giving up decades of tax-free compound growth.",
    uncommonInsight:
      "If you have a family HSA and invest the maximum every year from age 30 to 65, assuming 7% returns, you'll have roughly $900K in tax-free money. That's your entire medical cost coverage in retirement, completely tax-free.",
  },
  {
    id: "asset-location",
    title: "Asset Location: The Tax Alpha Nobody Talks About",
    subtitle: "Same investments, different accounts, different taxes",
    icon: "ArrowUpDown",
    summary:
      "Asset location is choosing WHICH account to hold each investment in. Putting tax-inefficient assets (bonds, REITs) in tax-advantaged accounts and tax-efficient assets (index funds) in taxable accounts can add 0.5-1% per year to your after-tax returns.",
    sections: [
      {
        heading: "The Core Idea",
        content:
          "You probably own multiple account types: 401(k)/IRA (tax-deferred), Roth (tax-free), and taxable brokerage. The same investments behave very differently depending on which account they're in. Bond interest is taxed as ordinary income (up to 37%). If that bond is in your 401(k), you defer the tax. If it's in your Roth, you never pay it. But if it's in your taxable account, you're paying 37% on the interest every year. Meanwhile, stock index funds in a taxable account are highly tax-efficient: they generate few distributions and qualify for the lower capital gains rate (0-20%).",
      },
      {
        heading: "The Optimal Order",
        content:
          "Tax-advantaged accounts (Traditional IRA/401k): bonds, REITs, actively managed funds -- anything that generates taxable income. Roth accounts: your highest-growth assets (small cap, emerging markets, growth stocks) -- because all that growth is tax-free forever. Taxable accounts: total market index funds, tax-managed funds, individual stocks you plan to hold long-term -- they're naturally tax-efficient.",
      },
      {
        heading: "The Practical Challenge",
        content:
          "Asset location only works if your total allocation across ALL accounts matches your target. If your target is 70/30 stocks/bonds, your 401(k) might be 100% bonds, your Roth might be 100% stocks, and your taxable might be 80/20 -- but the total is 70/30. Think of it as one big portfolio split across multiple accounts, not separate portfolios in each account.",
      },
    ],
    keyNumbers: [
      { label: "Typical annual tax alpha", value: "0.5-1.0%" },
      { label: "Bond tax rate (ordinary income)", value: "Up to 37%" },
      { label: "LTCG rate (qualified stocks)", value: "0-20%" },
      { label: "REIT dividend tax rate", value: "Up to 37%" },
    ],
    commonMistake:
      "Treating each account as a separate portfolio with its own allocation, instead of viewing them as one portfolio spread across tax-optimized containers.",
    uncommonInsight:
      "Over 30 years, the difference between good and bad asset location can exceed $200K on a $500K portfolio. It's free money -- no additional risk, no additional savings, just smarter placement of investments you already own.",
  },
  {
    id: "mega-backdoor-roth",
    title: "The Mega Backdoor Roth",
    subtitle: "The $46K/year Roth hack",
    icon: "KeyRound",
    summary:
      "If your employer's 401(k) allows after-tax contributions and in-plan Roth conversions, you can funnel up to $46,000 extra per year into Roth -- far beyond the $7,000 IRA limit. Not all plans support it, but if yours does, it's the most powerful savings vehicle available.",
    sections: [
      {
        heading: "How It Works",
        content:
          "The total 401(k) limit in 2025 is $70,000 (employee + employer contributions). Most people only use the $23,500 employee portion. But if your plan allows 'after-tax contributions' (different from Roth contributions), you can contribute the remaining gap between your employee + employer contributions and the $70,000 cap. Then you convert those after-tax contributions to Roth -- either in-plan or via rollover to a Roth IRA.",
      },
      {
        heading: "Who Can Do This",
        content:
          "Your employer plan must specifically allow two things: (1) after-tax contributions beyond the $23,500 employee limit, and (2) in-plan Roth conversions or in-service withdrawals for after-tax money. Ask HR or your plan administrator. Major providers like Fidelity, Vanguard, and Schwab support it in many plans. If you have a Solo 401(k), you can design your plan to allow it.",
      },
      {
        heading: "The Math",
        content:
          "2025 total 401(k) limit: $70,000. You contribute $23,500 (employee). Employer matches $8,000. That's $31,500. Remaining space: $38,500. You can contribute $38,500 in after-tax contributions and immediately convert them to Roth. Combined with a Backdoor Roth IRA ($7,000) and HSA ($8,550 family), that's up to $54,050 per year in tax-advantaged savings -- per person.",
      },
    ],
    keyNumbers: [
      { label: "Total 401(k) limit (2025)", value: "$70,000" },
      { label: "Max Mega Backdoor Roth contribution", value: "~$38-46K" },
      { label: "Combined tax-advantaged savings (per person)", value: "$54K+" },
      { label: "Roth value after 15yr at 7%", value: "~$1.2M" },
    ],
    commonMistake:
      "Not converting the after-tax contributions immediately. If you leave them sitting as after-tax, the EARNINGS become taxable on conversion. Convert as quickly as possible -- ideally automatically.",
    uncommonInsight:
      "A dual-income couple both doing Mega Backdoor Roth can shelter over $100K/year in Roth accounts. Over 20 years at 7% growth, that's over $4M in completely tax-free retirement savings. That's a different retirement than someone who only maxed their IRA.",
  },
  {
    id: "charitable-giving-strategy",
    title: "Charitable Giving Tax Strategies",
    subtitle: "Give smarter, not just more",
    icon: "Heart",
    summary:
      "Donating appreciated stock instead of cash avoids capital gains tax AND gives you a full fair market value deduction. Donor-advised funds let you bunch deductions. QCDs let retirees give from their IRA without paying income tax on the distribution.",
    sections: [
      {
        heading: "Donate Appreciated Stock",
        content:
          "If you bought stock at $10 and it's now worth $100, selling it to donate the cash means paying capital gains tax on $90 of gain. Instead, donate the stock directly to charity: you get a deduction for the full $100, the charity receives $100, and NOBODY pays capital gains tax on the $90. You avoid up to $21.42 in tax ($90 x 23.8% LTCG + NIIT) versus selling and donating cash. Then use the cash you would have donated to buy new stock at the higher basis.",
      },
      {
        heading: "Donor-Advised Fund (DAF) Bunching",
        content:
          "The standard deduction in 2025 is $30,000 for married filers. If your total deductions (state tax, mortgage interest, charity) are close to $30,000, your charitable giving provides zero additional tax benefit. Solution: bunch 2-3 years of giving into a single year using a DAF. Contribute $30K to the DAF in one year (pushing you well above the standard deduction), then distribute from the DAF to your chosen charities over the next 2-3 years. Alternate between bunching years and standard deduction years.",
      },
      {
        heading: "Qualified Charitable Distributions (QCDs)",
        content:
          "If you're 70.5 or older, you can donate up to $105,000 directly from your IRA to charity. This is a QCD. It counts toward your Required Minimum Distribution (RMD) but is NOT included in your taxable income. For retirees who give to charity anyway, this is dramatically better than taking the RMD, paying tax on it, and then donating from checking. The QCD reduces your AGI, which can lower your Medicare premiums (IRMAA), reduce the taxation of Social Security benefits, and keep you below various phase-out thresholds.",
      },
    ],
    keyNumbers: [
      { label: "Max QCD per year (70.5+)", value: "$105,000" },
      { label: "Avoided LTCG on donated stock", value: "Up to 23.8%" },
      { label: "DAF bunching benefit", value: "2-3x deduction in 1 year" },
      { label: "Standard deduction (married, 2025)", value: "$30,000" },
    ],
    commonMistake:
      "Donating cash instead of appreciated stock. If you're giving $5K+ to charity and have appreciated investments, donating the stock is almost always better. Your accountant should be asking about this.",
    uncommonInsight:
      "The trifecta: donate appreciated stock to a DAF in a high-income year. Take the deduction when your marginal rate is highest. Distribute from the DAF to charities over multiple years. Buy replacement stock at the new (higher) cost basis. You've avoided capital gains, maximized the deduction, and reset your basis. This is how wealthy families structure their charitable giving.",
  },
  {
    id: "social-security-timing",
    title: "Social Security Timing Strategy",
    subtitle: "Every year you wait adds 8%",
    icon: "Clock",
    summary:
      "You can claim Social Security between 62 and 70. Every year you delay past your Full Retirement Age (FRA) increases your benefit by 8%. Claiming at 62 permanently reduces it by up to 30%. The difference between 62 and 70 can be over $1,000/month for life.",
    sections: [
      {
        heading: "The Math Behind the Decision",
        content:
          "If your Full Retirement Age benefit is $2,000/month: Claiming at 62 gets you $1,400/month (30% cut). Claiming at 67 (FRA) gets you $2,000/month. Claiming at 70 gets you $2,480/month (24% increase). That $2,480 vs $1,400 is a $1,080/month difference -- $12,960/year -- for the rest of your life, with COLA adjustments. The 'breakeven age' where delayed claiming catches up to early claiming is typically around 80-82. If you live past 82, you come out ahead by waiting. Average life expectancy at 62 is about 84 for men and 87 for women.",
      },
      {
        heading: "When Early Claiming Makes Sense",
        content:
          "Early claiming at 62 can be optimal if: you have a terminal illness or significantly shortened life expectancy; you have no other income and need the money to survive; you plan to invest the entire benefit and can reliably earn more than 8% after-tax; or your spouse has a higher benefit and will provide a survivor benefit. The key question: do you need this money to live on, or are you just taking it because 'it is available'?",
      },
      {
        heading: "The Bridge Strategy",
        content:
          "If you retire at 60 or 62 but want to delay Social Security to 70, you need a 'bridge' -- income to cover the gap years. Options: draw down taxable brokerage accounts first, do Roth conversions during these low-income years (filling up the 12% or 22% bracket), use cash reserves, or work part-time. This gap period is the most tax-efficient window many retirees will ever have -- low income, low brackets, opportunity to optimize before RMDs start at 73.",
      },
    ],
    keyNumbers: [
      { label: "Benefit increase per year after FRA", value: "8%" },
      { label: "Max reduction at 62 (if FRA is 67)", value: "-30%" },
      { label: "Typical breakeven age", value: "80-82" },
      { label: "Survivor benefit", value: "100% of higher earner's" },
    ],
    commonMistake:
      "Taking Social Security at 62 'because I might not live that long' without actually running the numbers. Most people underestimate their longevity. A 62-year-old woman has a 50% chance of living to 88. The psychological pull of 'a bird in the hand' costs many retirees hundreds of thousands over their lifetime.",
    uncommonInsight:
      "For married couples, the higher earner delaying to 70 is almost always optimal because of the survivor benefit. When one spouse dies, the surviving spouse gets the HIGHER of the two benefits. If the higher earner took Social Security at 62 ($1,400/month), the survivor is stuck with that reduced amount. If they waited until 70 ($2,480/month), the survivor gets $2,480. Delaying is insurance for the surviving spouse. This is the single biggest Social Security optimization most couples miss.",
  },
  {
    id: "i-bond-strategy",
    title: "Series I Bond Strategy",
    subtitle: "The government's inflation-proof savings account",
    icon: "Landmark",
    summary:
      "I Bonds are US Treasury savings bonds that pay a rate tied to inflation. The rate adjusts every 6 months. You can buy up to $10,000/year electronically (plus $5,000 via tax refund). They are risk-free, tax-deferred, and state-tax-exempt.",
    sections: [
      {
        heading: "How I Bonds Work",
        content:
          "I Bonds pay a composite rate made of two parts: a fixed rate (set when you buy, lasts the life of the bond -- currently around 1.2%) and an inflation rate (resets every 6 months based on CPI). Your money is locked for 1 year minimum. If you redeem between years 1-5, you forfeit the last 3 months of interest. After 5 years, no penalty. They mature after 30 years. Interest is federal-tax-deferred until redemption and completely exempt from state and local taxes.",
      },
      {
        heading: "When I Bonds Shine",
        content:
          "I Bonds are optimal for: your emergency fund (after the 1-year lockup), money you will need in 2-7 years (too short for stock risk, I Bonds beat savings accounts in high-inflation environments), college savings (interest is tax-free if used for education and you meet income limits), and the conservative allocation of a retiree's portfolio. They are NOT good for: money you might need within 12 months, or long-term growth (stocks will outperform over 20+ years).",
      },
      {
        heading: "The Optimization Play",
        content:
          "Buy I Bonds in late October or April (just before the new rate announcement) so you can see the upcoming rate before committing. A married couple can purchase $20,000/year electronically, plus $10,000 via tax refund overpayment, for $30,000 total. The fixed rate component is your real yield -- if the fixed rate is above 1%, the bond is attractive for the long term because you are getting 1%+ ABOVE inflation, guaranteed by the US government, with no credit risk.",
      },
    ],
    keyNumbers: [
      { label: "Annual purchase limit (electronic)", value: "$10,000" },
      { label: "Additional via tax refund", value: "$5,000" },
      { label: "Minimum holding period", value: "1 year" },
      { label: "Early redemption penalty (yr 1-5)", value: "3 months interest" },
    ],
    commonMistake:
      "Ignoring I Bonds because the current composite rate seems low. The composite rate changes every 6 months -- what matters for long-term holding is the FIXED rate, which is locked for the life of the bond. A 1.2% fixed rate means you earn 1.2% above inflation for up to 30 years, completely risk-free. No other investment offers that.",
    uncommonInsight:
      "I Bonds are one of the only inflation hedges available to retail investors that has zero credit risk, zero market risk, and tax deferral. TIPS (Treasury Inflation-Protected Securities) also track inflation but trade on the secondary market with price volatility and pay taxable 'phantom income' annually. I Bonds avoid both problems. For the conservative sleeve of a portfolio, I Bonds are objectively superior to TIPS held in a taxable account.",
  },
  {
    id: "income-smoothing",
    title: "Income Smoothing Strategy",
    subtitle: "Fill every bracket, waste no deduction",
    icon: "BarChart3",
    summary:
      "The US tax system is progressive -- higher income gets taxed at higher rates. If your income varies wildly year to year, you overpay in high years and waste bracket space in low years. Income smoothing means shifting income between years to stay in the optimal bracket range.",
    sections: [
      {
        heading: "The Problem: Volatile Income",
        content:
          "A freelancer earning $200K one year and $50K the next pays more tax over two years than someone earning $125K both years -- even though the total is the same ($250K). Why? The $200K year pushes income into the 32% bracket, while the $50K year wastes the entire 12% and most of the 22% bracket space. Progressive rates reward consistency and punish volatility. The same principle applies to retirees with variable capital gains, business owners with lumpy revenue, or anyone with stock vesting schedules.",
      },
      {
        heading: "Smoothing Tools",
        content:
          "In high-income years: maximize pre-tax 401(k) contributions, defer bonuses or stock sales to January, harvest capital losses, make large charitable contributions (DAF bunching), and fund a solo 401(k) or SEP if self-employed. In low-income years: do Roth conversions to 'fill up' the 12% or 22% bracket, realize capital gains at the 0% rate (income under $47,025 single in 2025), accelerate ordinary income if possible. The goal is to keep your marginal rate within a 2-bracket range every year.",
      },
      {
        heading: "Retirement Income Smoothing",
        content:
          "The years between retirement (say age 60) and RMDs (age 73) are a golden window. Income is low (no salary), RMDs have not started, and Social Security can be delayed. During this window: do Roth conversions filling the 22% or 24% bracket, take capital gains at the 0% or 15% rate, and draw down traditional accounts strategically. If you do nothing during this window, your RMDs at 73+ may push you into the 24-32% bracket -- meaning you end up paying MORE tax in retirement than you saved during your working years.",
      },
    ],
    keyNumbers: [
      { label: "Top of 12% bracket (single, 2025)", value: "$47,150" },
      { label: "Top of 22% bracket (single, 2025)", value: "$100,525" },
      { label: "0% LTCG threshold (single)", value: "$47,025" },
      { label: "Roth conversion gap (retire 60 to RMD 73)", value: "13 years" },
    ],
    commonMistake:
      "Ignoring the gap years between retirement and RMDs. Many retirees take the standard deduction, claim Social Security early, and leave their traditional IRA untouched for 10+ years -- missing the lowest-tax window they will ever have. Then RMDs at 73 force distributions at much higher rates.",
    uncommonInsight:
      "The most tax-efficient retirees often pay MORE tax in their early retirement years, not less. They deliberately fill up the 22-24% bracket with Roth conversions. This seems counterintuitive -- why pay tax when you do not have to? Because paying 22% now to avoid 32% later is a 10-percentage-point arbitrage. Over a 20-year retirement, this single strategy can save six figures in cumulative tax.",
  },
  {
    id: "529-education-planning",
    title: "529 Plan and Education Tax Strategy",
    subtitle: "Tax-free growth for education -- if you use it right",
    icon: "GraduationCap",
    summary:
      "529 plans offer tax-free growth and tax-free withdrawals for qualified education expenses. Many states add a state tax deduction for contributions. But the rules are specific, and mistakes are expensive.",
    sections: [
      {
        heading: "The Tax Triple Play",
        content:
          "529 contributions are not federally deductible, but 30+ states offer a state income tax deduction or credit. The money grows tax-free. Withdrawals for qualified education expenses are tax-free. This 'triple play' (state deduction + tax-free growth + tax-free withdrawal) makes 529s one of the best tax-advantaged vehicles available. Qualified expenses include: tuition, room and board, books, computers, internet access, and up to $10,000/year for K-12 tuition.",
      },
      {
        heading: "Superfunding and Gift Tax Strategy",
        content:
          "You can contribute up to 5 years of the annual gift tax exclusion ($19,000 x 5 = $95,000 per beneficiary in 2025) in a single year without triggering gift tax. A married couple can superfund $190,000 per child. This front-loads growth and is one of the most powerful estate planning tools for grandparents: the money leaves your estate immediately, grows tax-free for decades, and funds education. If you have the cash, superfunding at birth gives 18 years of tax-free compounding.",
      },
      {
        heading: "SECURE 2.0: 529-to-Roth Rollover",
        content:
          "Starting in 2024, unused 529 funds can be rolled over to a Roth IRA for the beneficiary. Conditions: the 529 must have been open for 15+ years, annual rollovers are limited to the Roth IRA contribution limit ($7,000 in 2025), and the lifetime rollover cap is $35,000. This eliminates the biggest objection to 529s ('what if my kid doesn't go to college?'). Worst case: you've created a funded Roth IRA for your child. Over-fund the 529 deliberately and let the excess become retirement savings.",
      },
    ],
    keyNumbers: [
      { label: "Annual gift exclusion (2025)", value: "$19,000" },
      { label: "5-year superfunding max (single)", value: "$95,000" },
      { label: "529-to-Roth lifetime rollover cap", value: "$35,000" },
      { label: "K-12 tuition limit per year", value: "$10,000" },
    ],
    commonMistake:
      "Not using your own state's 529 plan when your state offers a tax deduction. Some parents choose Vanguard's Nevada 529 or Utah's plan for lower fees -- but if your state gives a 5-6% deduction on contributions, the tax benefit usually outweighs the fee difference. Always check your state's plan first.",
    uncommonInsight:
      "The 529-to-Roth rollover changes the calculus completely. Previously, the risk of 'overfunding' the 529 (penalties on non-qualified withdrawals) discouraged aggressive funding. Now, overfunding is a feature: contribute $95K at birth, it grows tax-free for 18 years, use what you need for college, and roll the rest into a Roth IRA. Your child starts adulthood with potentially $35,000+ in a Roth -- a massive head start on tax-free compounding.",
  },
];
