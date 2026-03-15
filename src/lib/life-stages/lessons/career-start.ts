// Stage 2: You Start Your Career -- stage-specific lesson content

import type { StageLessonContent } from "../types";

// ls-2-01: Quick Win
export const readYourPaystub: StageLessonContent = {
  body: `Your first paycheck looks terrifying. You make $60,000 a year, which is $5,000/month -- but your check says $3,400. Where did $1,600 go?

Here's every line on a typical paystub, translated:

**Gross Pay**: What your employer agreed to pay you. Your W-2 number. Not your take-home.

**Federal Income Tax**: The IRS's cut based on your W-4 elections and tax bracket. If you claimed "0 allowances" on your W-4 (or the equivalent on the new form), you're withholding more than necessary, which means a refund in April -- but also means the government borrowed your money interest-free all year. Adjust if you like a refund, but know that's your money you're waiting to collect.

**State Income Tax**: Your state's cut. Zero in TX, FL, NV, WA, TN, SD, WY, AK. Up to 13.3% in California. Live where you live, but know this number.

**Social Security Tax**: 6.2% of your wages, capped at the annual limit (~$168,000 in 2024). Your employer matches this, invisibly, on top of your salary.

**Medicare Tax**: 1.45% of all wages, no cap. Your employer matches this too.

**401(k) Contribution**: Pre-tax money going to your retirement account. This reduces your taxable income -- meaning federal and state taxes were calculated AFTER this came out, which is why it saves you more than face value.

**Health Insurance Premium**: Your portion of the insurance premium. The employer typically pays 60-80%, you pay the rest.

**HSA or FSA Contribution**: Pre-tax medical savings. If your plan has an HSA, use it.

The punchline: Your real take-home is always smaller than you expected, and that gap is taxes + benefits. Understanding this early prevents the "I make good money but feel broke" confusion that haunts most people in their 20s.`,
  keyTakeaways: [
    "Gross pay vs take-home: expect 25-35% of your gross to disappear to taxes and benefits",
    "401(k) contributions reduce your taxable income -- pre-tax contributions save you more than their face value",
    "Social Security (6.2%) + Medicare (1.45%) = 7.65% off every paycheck, matched by your employer invisibly",
    "Your W-4 withholding elections determine whether you get a refund or owe money in April",
    "A big tax refund isn't a bonus -- it's the government returning your own money without interest",
  ],
  actionItem:
    "Pull up your most recent pay stub. Find your gross pay and take-home pay. Calculate the percentage going to taxes vs benefits. Then check your 401(k) contribution rate -- if it's zero, log into your benefits portal today and set it to at least 3%.",
};

// ls-2-08: Benefits Enrollment
export const benefitsEnrollment: StageLessonContent = {
  body: `Open enrollment is a 30-minute window that could cost you $5,000 to $20,000 if you blow it. Most people pick whatever the default is, or whatever their coworker picked. This is a mistake.

**Health Insurance: The Decision Nobody Explains**

High-Deductible Health Plan (HDHP) vs PPO. The HDHP has lower premiums (monthly cost) but you pay more when you actually use it. The PPO has higher premiums but lower out-of-pocket costs per doctor visit.

The math that matters: add up your annual premiums for each option. Then add your likely out-of-pocket medical costs (one physical per year, maybe one specialist visit). Compare totals. If you're young, healthy, and don't expect major medical expenses, the HDHP almost always wins -- especially because it unlocks...

**The HSA (Health Savings Account)**

Only available with an HDHP. Triple tax advantage: deductible contributions, tax-free growth, tax-free withdrawals for medical expenses. In 2025: $4,300 individual, $8,550 family. This is the most powerful tax account most people have never heard of and it's sitting right there in your benefits portal.

**Life Insurance**

Your employer probably offers 1-2x your salary for free. Take it -- it costs nothing. Should you buy more? Only if people depend on your income. If you're single with no dependents, extra life insurance through work is expensive and unnecessary.

**Disability Insurance**

Statistically, you're far more likely to become disabled than to die during your working years. Short-term disability (60-90 days) and long-term disability (years) should both be enrolled if offered. This is underrated and underused.

**The FSA Trap**

Flexible Spending Account: use-it-or-lose-it. If you don't spend the balance by year end, you lose it. Only enroll if you have predictable medical or childcare expenses and you'll actually use the money.

The most important move: spend 30 minutes comparing the actual annual cost of each health plan option before clicking any defaults.`,
  keyTakeaways: [
    "Compare annual premiums + expected out-of-pocket costs for each health plan -- don't just pick the lowest premium",
    "HDHP + HSA is almost always better for young, healthy people: lower premiums + triple tax-advantaged savings",
    "Free employer life insurance: always take it. Extra life insurance: only if people depend on your income",
    "Disability insurance is statistically more important than life insurance at your age -- enroll if offered",
    "FSAs are use-it-or-lose-it: only contribute what you'll spend, or you're giving money back to your employer",
  ],
  actionItem:
    "During your next open enrollment (or right now if you can make changes), open both health plan summaries side by side. Calculate total annual cost for each: (monthly premium x 12) + expected medical expenses. Pick the cheaper one. Open or maximize your HSA.",
  proTip:
    "Many employers contribute $500-$1,500 to your HSA as part of choosing their HDHP. That free money changes the math considerably -- check the plan details for employer HSA contributions before deciding.",
};

// ls-2-10: Boss Lesson
export const firstYearChecklist: StageLessonContent = {
  body: `Your first year of real income is the most important financial year of your life. The habits you build now -- or fail to build -- compound over 40 years. Getting the fundamentals right in year one is worth more than any single investment decision you'll ever make.

Here's the checklist. Work through it in order.

**Month 1:**
- [ ] Calculate your real take-home pay (do the paystub math)
- [ ] Set up automatic savings transfer on payday (even $100/month)
- [ ] Enroll in 401(k) at minimum to capture full employer match -- this is free money you cannot get back
- [ ] Open a high-yield savings account for your emergency fund
- [ ] Set up autopay for all bills

**Month 2-3:**
- [ ] Fully read and understand your benefits package -- health insurance, HSA, disability
- [ ] Review your W-4 withholding (are you overwithholding?)
- [ ] Start building your emergency fund: target $1,000 first, then 3 months of expenses
- [ ] Get your credit score (free at Credit Karma, Experian, or your bank) -- establish a baseline

**Month 4-6:**
- [ ] If you have student loans: choose your repayment plan. Income-driven repayment if you're targeting PSLF. Standard repayment if you can afford it and want to pay them off.
- [ ] Review your 401(k) investment choices -- if you don't know what to pick, choose the target-date fund for your expected retirement year. Done.
- [ ] Read your employer's vesting schedule -- you may not own that employer match for 1-4 years

**Month 7-12:**
- [ ] Do your first tax filing as a real earner (or hire a CPA if you have unusual complexity)
- [ ] Review your progress: savings rate, emergency fund balance, 401(k) balance
- [ ] Resist the urge to "reward yourself" with a major lifestyle upgrade because you finished a full year -- that's the lifestyle creep trap

The number one financial mistake in year one: waiting. Every month you don't enroll in the 401(k), you're leaving employer match on the table that you never get back. Every month your emergency fund is at $0, you're one car repair away from credit card debt.

The system is boring. Do it anyway.`,
  keyTakeaways: [
    "Capture the full employer 401(k) match immediately -- it's a 50-100% instant return on investment you can never recover if you miss it",
    "Emergency fund before investing: $1,000 fast, then 3 months of expenses, then focus on investing",
    "Review your W-4 withholding -- overwithholding is giving the government an interest-free loan",
    "Pick the target-date fund in your 401(k) if you're unsure -- imperfect action beats perfect paralysis",
    "Lifestyle creep starts in year one: live on year-one income even when you get promoted",
  ],
  actionItem:
    "Today: Log into your company's 401(k) portal. If you're not enrolled, enroll and set your contribution to at least the employer match threshold. This single action is the highest-return financial move available to you right now.",
  proTip:
    "Your first raise is a trap. The temptation to upgrade your lifestyle to match is nearly universal and nearly always wrong. When you get a raise, raise your 401(k) contribution by half the raise amount before you have a chance to spend it.",
};
