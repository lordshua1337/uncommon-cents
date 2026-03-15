// Stage 7: You Plan Retirement -- stage-specific lesson content

import type { StageLessonContent } from "../types";

// ls-7-01: Quick Win
export const fourPercentRuleBroken: StageLessonContent = {
  body: `The 4% rule says: if you withdraw 4% of your portfolio in year one of retirement, then adjust for inflation each year after, your portfolio will last 30 years. This was based on the Trinity Study (1998), which ran simulations on historical market returns from 1926-1995.

The 4% rule is not broken. But it's not right for you the way most people apply it.

**The problems:**

**Problem 1: 30 years is not enough**
If you retire at 55, you need 40+ years of income, not 30. The 4% rule has a higher failure rate over 40-year periods. More conservative guidance for early retirement: 3.3-3.5%.

**Problem 2: Historical returns may not repeat**
The 1926-1995 period included some of the strongest bull markets in history. Current valuations (as of 2025) are historically high, which many analysts believe implies lower forward returns. Some researchers recommend 3.5% for new retirees.

**Problem 3: Inflation flexibility matters more than the number**
The real insight from the Trinity Study isn't "4%." It's that retirees who can reduce spending by 10-20% during market downturns have dramatically better outcomes than those who can't. If you can cut spending in a bad year, you can safely withdraw slightly more in good years.

**The honest number:**

- Retiring at 65, expecting to live 30 years: 4% is probably fine
- Retiring at 55-60, expecting to live 35-40 years: 3.5% is safer
- Retiring at 50 or earlier, with 40+ years ahead: 3-3.3%

**The practical math:**

At 4%: $1,000,000 portfolio = $40,000/year in withdrawals
At 3.5%: $1,000,000 portfolio = $35,000/year
At 3%: $1,000,000 portfolio = $30,000/year

Add Social Security income when it starts. Most retirement plans are underfunded because people don't account for Social Security as a meaningful income stream. At full retirement age, Social Security replaces 40-50% of average earnings for middle-income earners.

Your number is not "4%." Your number is 4% minus however early you're retiring, plus Social Security when it starts.`,
  keyTakeaways: [
    "The 4% rule is based on 30-year periods -- if you retire early, use 3-3.5% for safety",
    "At 4%: $1M = $40,000/year. At 3.5%: $1M = $35,000/year. Know your number.",
    "Spending flexibility in down years dramatically improves portfolio survival rates",
    "Social Security should be included in retirement income projections -- it replaces 40-50% of earnings for most people",
    "High current market valuations suggest slightly more conservative withdrawal rates may be prudent",
  ],
  actionItem:
    "Calculate your retirement number: estimate your annual retirement spending. Divide by your withdrawal rate (4%, 3.5%, or 3% depending on how early you retire). Subtract expected Social Security income (create an account at ssa.gov to see your estimated benefit). What's the gap? That's your target portfolio.",
};

// ls-7-09: Boss Lesson
export const retirementCountdown: StageLessonContent = {
  body: `The decade before retirement is where the real planning happens. The numbers you've been building for 30 years now need to be turned into income. Here's what to do 10 years out, 5 years out, and 1 year out.

**10 Years Out: The Foundation**

Asset allocation shift. The classic "100 minus your age in stocks" rule is too conservative for most people, but 100% stocks at 55 is too risky. Begin gradually shifting toward a more conservative allocation. A common glide path: at 10 years out, move to 80% stocks / 20% bonds or bond funds. At 5 years out, 70/30. At retirement, 60/40 or your planned allocation.

The "bond tent" strategy: temporarily increase bond allocation just before and just after retirement, then gradually shift back toward stocks over the first 5-7 years. This protects against sequence-of-returns risk (a major crash in your first years of retirement is devastating because you're selling at the bottom).

Social Security decision: run the numbers on when to claim. Claiming at 62 vs 70 is a difference of 76% in monthly benefit. For most people with average or above-average health, delaying until 67 or 70 pays off significantly. The break-even point for delaying from 62 to 67 is roughly age 77-78.

**5 Years Out: The Optimization**

Healthcare bridge plan. If retiring before 65 (Medicare age), you need health insurance for those years. Options: COBRA from employer (expensive), ACA marketplace, spouse's employer plan, or early retirement healthcare through union/professional association. The ACA marketplace income-based subsidies are significant if you can manage your income below 400% of poverty level -- Roth conversions and other income affect your subsidy eligibility.

Roth conversion ladder. If you have significant Traditional IRA or 401(k) balances, the 5 years before claiming Social Security and 5 years before RMDs begin is your conversion window. Fill up lower tax brackets with Roth conversions. Every dollar you convert now at 12-22% avoids higher rates later when SS + RMDs push you into higher brackets.

Test your budget. Spend one year living on your projected retirement income. Not as a sacrifice -- as a data-gathering experiment. You'll quickly discover which estimates are wrong.

**1 Year Out: The Transition**

Build your cash buffer: 1-2 years of expenses in cash (HYSA or short-term bonds). This is your "do not touch the portfolio in a downturn" reserve. When markets crash in year one of retirement (and eventually they will), you live from the cash buffer, not from selling stocks at the bottom.

File for Social Security at least 3 months before you need the first payment -- processing takes time.

Review Medicare enrollment. You must enroll during a specific window. Missing it results in permanent premium penalties. Initial enrollment period: 7 months surrounding your 65th birthday (3 months before, the month of, and 3 months after).

Notify your 401(k) custodian and any pension administrators of your upcoming retirement. Roll 401(k) to IRA if desired (more control over RMDs and Roth conversions).

Update your estate documents. Your will, power of attorney, and healthcare directive should reflect your current wishes.

The goal is not to arrive at retirement day with a plan. It's to arrive with a tested, operational system that generates income for the next 30+ years without you having to think too hard about it.`,
  keyTakeaways: [
    "10 years out: start glide path to more conservative allocation and model Social Security claiming scenarios",
    "5 years out: plan healthcare bridge to Medicare, begin Roth conversion ladder in low-tax years",
    "1 year out: build 1-2 year cash buffer so you never sell stocks in a downturn during the critical first years",
    "Social Security: claiming at 70 vs 62 is a 76% monthly benefit difference -- run the numbers based on your health",
    "Medicare enrollment has a specific window around your 65th birthday -- missing it causes permanent premium penalties",
  ],
  actionItem:
    "Go to ssa.gov and create or log into your Social Security account. Download your earnings record and projected benefit amounts at 62, 67, and 70. Run the break-even calculation: if you delay to 70, how old do you need to live to break even compared to claiming at 62? This single calculation reshapes most people's retirement timeline.",
  proTip:
    "The biggest risk in retirement is not running out of money -- it's sequence of returns risk. If markets drop 40% in your first year of retirement and you sell to fund expenses, you permanently reduce your portfolio's recovery potential. The cash buffer isn't being conservative. It's being smart about timing.",
};
