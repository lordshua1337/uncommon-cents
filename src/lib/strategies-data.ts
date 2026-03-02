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
];
