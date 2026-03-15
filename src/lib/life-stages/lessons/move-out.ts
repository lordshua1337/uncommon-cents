// Stage 1: You Move Out -- stage-specific lesson content
// These are the NEW lessons that don't map to existing concepts.
// Tone: irreverent, direct, opinionated, real numbers. No "it depends."

import type { StageLessonContent } from "../types";

// ls-1-01: Quick Win
export const budgetRuleWrong: StageLessonContent = {
  body: `The 50/30/20 rule says: 50% needs, 30% wants, 20% savings. It's a lie wrapped in math. In most American cities, 50% on "needs" will cover your rent and nothing else. In San Francisco or New York, housing alone takes 60-70% of a median paycheck. The 50/30/20 rule was invented for a 1990s economy with $400 apartments. You don't live there.

Here's what actually works: **the Reverse Budget**.

Step 1: Calculate your real after-tax take-home. Not gross salary -- the number that hits your bank account every two weeks.

Step 2: Immediately move a fixed amount to savings the moment you're paid. Not "whatever's left." A fixed number. Even $50/month if that's all you can swing. The savings comes FIRST, before you see it.

Step 3: Pay your fixed expenses (rent, utilities, phone, subscriptions) with automatic payments tied to a separate account.

Step 4: What's left is your spending money. You can blow it guilt-free because the important stuff already happened automatically.

The Reverse Budget has three advantages over 50/30/20: it works regardless of your income level, it doesn't require tracking every coffee, and it's automatic -- which means you'll actually do it.

One more thing: the "needs vs wants" distinction is a trap. Is Netflix a need? Probably not. Is going to therapy a want? Kind of yes. Stop morally categorizing every purchase and start building systems that make the math work regardless of your choices.

The goal isn't a perfect budget. It's a budget you'll actually follow six months from now.`,
  keyTakeaways: [
    "The 50/30/20 rule assumes housing costs from a different era -- it doesn't work in most major cities",
    "The Reverse Budget: save and pay fixed expenses first, spend the rest without guilt",
    "Automation beats willpower every time -- set up auto-transfers on payday",
    "Stop categorizing purchases as 'good' or 'bad' and focus on systems that run without discipline",
  ],
  actionItem:
    "Calculate your real monthly take-home (after taxes, not your salary). Pick a savings amount -- even $50 -- and set up an auto-transfer to happen the same day your paycheck lands. Do this today, before you forget.",
  proTip:
    "Open a second checking account at a different bank for your 'spending money.' The friction of transferring money to pay for something unplanned will stop most impulse purchases better than any budgeting app.",
};

// ls-1-02: Emergency Fund
export const firstEmergencyFund: StageLessonContent = {
  body: `Everyone says "3-6 months of expenses." Nobody tells you what that actually looks like when you're 23 and broke.

Here's the real math. Add up: rent + utilities + groceries + minimum debt payments + phone. That's your bare-bones monthly burn rate. Not your full lifestyle -- what you need to survive and not default on anything. For most first-time apartment dwellers, this number is $1,500 to $2,500/month.

Three months of that? $4,500 to $7,500. That's your target emergency fund.

But here's what nobody says: **any emergency fund beats no emergency fund**. The difference between $0 and $500 in savings is enormous. The difference between $500 and $5,000 is just degree. Start with $500.

Where does it live? A high-yield savings account (HYSA). In 2024-2025, these pay 4-5% APY -- which is 50-100x what your normal bank pays. Marcus by Goldman, Ally, SoFi, and Wealthfront all have competitive options. Takes 10 minutes to open. You're leaving free money on the table if your emergency fund is earning 0.01% at Chase.

**What counts as an emergency:**
- Actual emergencies: job loss, medical bills, car breakdown, emergency travel
- Not emergencies: concerts you forgot were coming up, that TV that went on sale, anything you saw on Instagram

The rule is simple: if you didn't know about this expense three months ago, it's an emergency. If you did, it's just bad planning.

One common mistake: people use the emergency fund for non-emergencies, feel guilty, and then stop saving because they "can't do it." The emergency fund will get used. That's the point. The goal is to refill it, not to never touch it.`,
  keyTakeaways: [
    "Calculate your bare-bones monthly burn: rent + utilities + groceries + minimum debt payments + phone",
    "Target: 3 months of bare-bones expenses -- but $500 is an infinitely better start than $0",
    "Keep it in a high-yield savings account (HYSA) earning 4-5% APY, not in your regular bank account",
    "Using the emergency fund for actual emergencies is correct -- that's what it's for. Refill it after.",
    "Subscriptions and bad planning are not emergencies. Job loss, medical bills, and car breakdowns are.",
  ],
  actionItem:
    "Open a high-yield savings account at Ally, Marcus, or SoFi today (takes 10 minutes, no minimum balance). Transfer your first $50. Set up a recurring transfer of whatever you can afford monthly. You now have an emergency fund.",
  proTip:
    "Name the account 'DO NOT TOUCH' or 'Emergency Only' in your banking app. Stupid but effective -- seeing the label every time you log in is a real deterrent to impulse raids.",
};

// ls-1-03: Subscriptions and Lifestyle Creep
export const subscriptionsLifestyleCreep: StageLessonContent = {
  body: `The average American pays for 4.2 subscriptions they have forgotten about. That's about $50-80/month in charges for services they haven't used since 2022. Netflix, Hulu, Apple TV+, Peacock, Paramount+, Disney+ -- pick one. You're not watching all of them.

But subscriptions aren't the real problem. **Lifestyle creep is.**

Lifestyle creep is what happens when your income goes up and your spending magically rises to match it. You get a $5,000 raise and somehow have $5,000 less in savings a year later. You upgrade from Spotify free to premium, then add YouTube Premium, then buy a nicer gym membership, then start ordering DoorDash twice a week because you can "afford it now."

Each individual upgrade is reasonable. The aggregate will eat your raise alive.

The math nobody does: a $50/month lifestyle upgrade costs $600/year and, invested instead, becomes $7,800 after 10 years at 7% return. Every small upgrade you make is a decision about your future self's freedom.

**The audit:**
Pull up your last three bank statements. Find every recurring charge. Build a list. For each one, ask: did I use this in the last 30 days? If no, cancel it right now -- not "I'll cancel it next week" but while you have the list in front of you. Take 15 minutes. This is the fastest money most people ever find.

**Preventing future creep:**
When you get a raise, immediately raise your auto-savings transfer by 50% of the raise amount. Not all of it -- you're allowed to enjoy the money -- but half. The other half you can spend guilt-free. This is how you build wealth without feeling deprived.

The latte argument (you've heard it): cutting out a $5 daily coffee doesn't make you rich. Missing the point: the habit of examining whether small purchases are worth it does.`,
  keyTakeaways: [
    "Do a 15-minute subscription audit right now -- find recurring charges you forgot about and cancel unused ones",
    "Lifestyle creep is the real enemy: income rises, spending matches it, nothing accumulates",
    "When you get a raise, automatically direct 50% of the increase into savings before you spend it",
    "A $50/month 'small' upgrade costs $7,800 in future value over 10 years at 7% return",
    "The goal isn't zero fun -- it's intentional spending where you know what you're paying for and why",
  ],
  actionItem:
    "Pull up your last bank statement. Highlight every recurring charge. Cancel any subscription you haven't actively used in 30 days. Set a 15-minute timer. You will find at least $20/month -- probably more.",
  proTip:
    "Use a dedicated credit card for all subscriptions. This creates a single place to audit every recurring charge instead of hunting across multiple bank accounts and statements.",
};

// ls-1-10: Boss Lesson
export const monthOneAutopilot: StageLessonContent = {
  body: `Willpower is not a financial strategy. The people who successfully manage money don't spend more time thinking about money -- they spend less, because their system does the thinking for them.

Here's the complete Month One Autopilot setup. Every dollar gets a job before you see it.

**Step 1: The Pay-Yourself-First Transfer**
Set up an automatic transfer from checking to HYSA the same day your paycheck arrives. Amount: whatever you can realistically afford without going negative. Even $100/month is $1,200/year. This happens before you spend a single dollar on anything discretionary.

**Step 2: The Bill Account**
Open a second checking account (free at most banks). Calculate your fixed monthly expenses: rent, utilities, internet, phone, insurance, minimum debt payments. Move that exact amount here every month on payday. All bills autopay from this account. You never need to think about whether you can pay rent -- the money is already there.

**Step 3: The Spending Account**
What's left in your main account is your spending money for the month. You can do anything you want with it, guilt-free. When it's gone, it's gone. No tracking required.

**Step 4: The One-Time Setup**
- Turn on autopay for every bill to avoid late fees
- Set up your 401(k) contribution if your employer offers one (even 1% to start -- just start)
- Enable bank account alerts for any transaction over $50

**Step 5: The 30-Day Review**
Once a month, spend 15 minutes reviewing: Did you overdraft anywhere? Is your savings target realistic? Any subscriptions to cut? Adjust and move on.

This system takes 2-3 hours to build once. After that, it runs your money while you live your life. The goal is to make the right choices automatic and the wrong choices inconvenient.

You're not trying to be perfect with money. You're building a machine that makes perfection unnecessary.`,
  keyTakeaways: [
    "Build a system, not willpower: automate savings, bill payments, and investments so decisions are made once",
    "The three-account setup: one for pay-yourself-first savings, one for bills, one for guilt-free spending",
    "Autopay everything -- late fees and missed payments are purely a tax on disorganization",
    "Start your 401(k) contribution even at 1% -- the habit matters more than the amount right now",
    "15 minutes once a month to review and adjust is all the active management this system needs",
  ],
  actionItem:
    "This weekend: open a HYSA, open a second checking account for bills, set up one automatic savings transfer, and turn on autopay for your rent and any recurring bills. This is the financial foundation you'll run on for the next decade.",
  proTip:
    "Treat your savings transfer like a bill you pay yourself. If you miss it one month, catch up the next. Consistency over years beats perfection over weeks.",
};
