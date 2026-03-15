// Stage 6: You Start a Business -- stage-specific lesson content

import type { StageLessonContent } from "../types";

// ls-6-01: Quick Win
export const separateYourMoney: StageLessonContent = {
  body: `Before you design a logo. Before you build a website. Before you do anything else, open a separate business bank account. This is not optional. This is not something you do "when you're bigger." This is day one.

**Why this matters:**

**Legal protection:** If you're operating as an LLC, commingling personal and business funds pierces the corporate veil. Translation: you lose the legal protection of the LLC and become personally liable for business debts. The entire point of forming an LLC is protection. Mixing funds destroys it.

**Taxes:** When you pay business expenses from a personal account, you have to reconstruct every deductible expense at tax time from memory and bank statements. This takes hours and you will miss things. A dedicated business account makes deductions automatic -- every dollar that flowed through is potentially deductible.

**Professionalism:** When a client pays you, it goes to a business account. When you pay a vendor, it comes from a business account. This looks and feels like a real operation, because it is one.

**The actual setup:**

1. Open a free business checking account. Relay, Mercury, and Bluevine offer fee-free business accounts. Chase and Bank of America charge monthly fees but have wider branch networks.
2. Get a business debit card. Use it for every business expense, nothing else.
3. If you accept credit card payments, connect your payment processor (Stripe, Square) to the business account.
4. Pay yourself from the business account to your personal account. This is "owner's draw" or "salary" -- depending on your entity type.

**The 60-day rule:**

Every 60 days, move money from your business account to your personal account. Don't leave years of business income sitting in the business account. Don't leave your personal rent to chance based on business cash flow. Separate the worlds.

This takes two hours to set up. It protects everything you're building.`,
  keyTakeaways: [
    "Open a business bank account before anything else -- commingling funds pierces your LLC's liability protection",
    "Mercury, Relay, and Bluevine offer free business checking accounts for early-stage businesses",
    "Every business expense should flow through the business account -- makes taxes automatic rather than reconstructed",
    "Pay yourself on a regular schedule from business to personal -- don't blur the line",
    "A separate business account makes you look and operate like a real business from day one",
  ],
  actionItem:
    "Today: Go to mercury.com or relay.fi and apply for a free business checking account. Takes 10 minutes. Once open, apply for any new business expenses or client payments to go through this account starting immediately.",
};

// ls-6-08: Business Insurance
export const businessInsuranceNeeds: StageLessonContent = {
  body: `Most first-time business owners either ignore insurance entirely or massively over-insure because some broker told them they needed everything. Here's the actual map.

**General Liability Insurance (almost everyone needs this)**
Covers third-party bodily injury and property damage claims. If a client visits your office and trips, or if your product damages someone's property, GL covers the resulting lawsuit. Cost: $500-$2,000/year for most small businesses. If you have any physical premises or client-facing operations, this is mandatory.

**Professional Liability / E&O Insurance (service businesses)**
Errors and Omissions covers you when a client claims your professional advice or work caused them financial harm. Essential for: consultants, accountants, lawyers, financial advisors, software developers, architects, anyone whose work or advice could be wrong in ways that cost clients money. Cost: $1,000-$5,000/year depending on revenue and industry.

**Business Owner's Policy (BOP) -- the bundled option**
For businesses with physical property or inventory: a BOP bundles general liability + commercial property insurance at a discount. Cost: $500-$3,000/year. If you have equipment, inventory, or a leased space, a BOP is usually more cost-efficient than separate policies.

**Workers' Compensation**
Required by law in most states if you have employees. Covers employees who are injured on the job. Not needed if you're a solo operator with no employees.

**Cyber Liability Insurance**
If you store customer data, process payments, or operate any digital infrastructure, a data breach can cost hundreds of thousands of dollars. Cyber coverage is increasingly relevant for any business using cloud tools. Cost: $500-$2,000/year.

**What you probably don't need yet:**
- Key Person Insurance (relevant once you have investors or business partners)
- Business Interruption Insurance (relevant once you have significant recurring revenue)
- Directors & Officers Insurance (relevant once you have a board)

**How to buy it:**
Get quotes from NEXT Business Insurance (fully online), Hiscox, or through an independent business insurance broker. Don't call your personal auto or home insurance agent -- small business insurance requires different expertise.`,
  keyTakeaways: [
    "General Liability is the baseline -- any business with physical premises or client interaction needs it ($500-$2,000/year)",
    "Professional Liability (E&O) is essential for any service business where your advice or work can be wrong",
    "BOP bundles GL + property insurance at a discount -- right choice for businesses with equipment or inventory",
    "Workers' Comp is legally required in most states once you have employees -- don't skip this",
    "Cyber liability is increasingly non-optional if you store any customer data or accept online payments",
  ],
  actionItem:
    "Get a general liability quote at NEXT Business Insurance (next.us) or Hiscox. Takes 5 minutes online. If you're a service business (consulting, coaching, tech, design), add a Professional Liability quote. Compare and buy within the week -- one lawsuit without coverage can end your business.",
  proTip:
    "Read your contracts. Many clients, landlords, and vendors require you to carry specific minimum insurance coverages and name them as additional insured. Check contract requirements before buying -- it affects the coverage limits you need.",
};

// ls-6-10: Boss Lesson
export const businessFinanceOperatingSystem: StageLessonContent = {
  body: `Running a business finances on instinct and memory is how smart people go broke. The Business Finance Operating System is the infrastructure every serious business owner needs, built once and maintained monthly.

**The Weekly Rhythm (15 minutes)**
Every Monday: check business bank account balance. Are there any unexpected charges? Any invoices due this week? Any payroll coming up? Early warning means you have time to act.

**The Monthly Rhythm (2 hours)**
Pull a Profit & Loss report from your accounting software (QuickBooks, Wave, or FreshBooks). Ask: Revenue vs last month? Expenses vs last month? Net profit margin? Are you profitable, break-even, or burning cash?

Set aside quarterly estimated tax payment. Rule of thumb: 25-30% of net profit goes to a separate tax savings account every month. This is not optional. The IRS does not care that you "just forgot" about estimated taxes.

**The Quarterly Rhythm (half day)**
- File and pay quarterly estimated taxes (due in April, June, September, January)
- Review key business metrics: revenue trend, customer acquisition cost, retention
- Meet with your CPA or accountant if you have one
- Review and pay any quarterly payroll taxes if you have employees

**The Annual Rhythm (2-3 days)**
- Year-end books cleanup with your accountant
- File business tax return (or extension)
- Update business insurance policies -- did your revenue or headcount change?
- Plan next year's financial targets

**The Infrastructure Checklist**
If you don't have these, build them now:

- [ ] Accounting software (Wave is free; QuickBooks starts at $25/month)
- [ ] Business bank account (separate from personal)
- [ ] Business credit card (builds business credit; points are a bonus)
- [ ] Quarterly estimated tax calendar in your actual calendar app with reminders
- [ ] Payroll software if you have employees (Gusto is the best)
- [ ] Annual meeting with a CPA -- minimum. Tax strategy is worth the cost.

**The Most Common Business Finance Mistakes:**
1. Ignoring quarterly estimated taxes until April
2. Paying yourself too much too soon -- leave cash reserves
3. Not separating business and personal money
4. Not tracking which clients are actually profitable
5. Confusing revenue with profit -- you can be busy and broke

The business finance operating system sounds boring because it is. It's also the difference between a business that scales and one that runs its owner ragged while never building equity.`,
  keyTakeaways: [
    "Set aside 25-30% of net profit for taxes every month into a separate tax savings account -- quarterly taxes are not optional",
    "Monthly P&L review: revenue vs expenses vs last month. Are you trending toward profitability?",
    "Quarterly estimated taxes due in April, June, September, and January -- mark them in your calendar now",
    "Accounting software (Wave is free, QuickBooks is $25/month) makes tax time hours instead of weeks",
    "Annual CPA meeting is not overhead -- it's tax strategy that typically pays for itself many times over",
  ],
  actionItem:
    "This week: open a business savings account specifically for tax reserves. Transfer 25% of any business income received in the last 30 days into it right now. Set calendar reminders for the next four quarterly tax due dates. These two actions prevent the most painful business finance mistake.",
  proTip:
    "Your effective tax rate as a self-employed person is 15.3% for self-employment tax (SS + Medicare) plus your income tax rate. First-time business owners are shocked by this -- they expected to pay the same rate as employees but forgot their employer was covering half of payroll taxes before.",
};
