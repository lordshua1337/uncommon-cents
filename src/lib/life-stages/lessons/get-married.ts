// Stage 3: You Get Married -- stage-specific lesson content

import type { StageLessonContent } from "../types";

// ls-3-01: Quick Win
export const moneyTalkQuestions: StageLessonContent = {
  body: `Money is the #1 cause of divorce. It's not how much you have. It's the misaligned expectations, undisclosed debts, and conflicting values that turn a shared life into a courtroom.

Before you merge finances, you need to have five conversations. Not arguments -- conversations. If these questions cause a fight, you've found the problem early. That's a gift.

**Question 1: What's your actual financial situation?**
Full disclosure: net worth, debts (student loans, credit cards, car loans), credit score, and any financial commitments you have to other people (family support, child support from a previous relationship, co-signed loans). No surprises after the ceremony.

**Question 2: What does money mean to you?**
For some people, money is security. For others, it's freedom or status. If one of you grew up in a household where money was scarce and savings were a survival tool, and the other grew up in a household where spending was love -- those are opposite money scripts. They will collide unless you name them.

**Question 3: Who manages the money?**
One person handles the bills? Split responsibility by category? Joint everything? Separate everything? No wrong answer, but you need an agreed-upon system, not a default that creates resentment.

**Question 4: What are your big financial goals and timelines?**
House in 5 years? Retire at 55? Start a business? Travel for a year? These goals require saving and sacrifice. If your goals aren't aligned, your financial decisions won't be either.

**Question 5: What happens when we disagree about money?**
Establish the rule upfront: any purchase over $X requires a conversation. What's X? Some couples say $100, some say $500. The number matters less than having one.

These five conversations take about two hours. They will save years of financial conflict.`,
  keyTakeaways: [
    "Full financial disclosure before merging: net worth, all debts, credit score, and external financial commitments",
    "Money means different things to different people -- understanding your partner's money script prevents future conflict",
    "Decide on a financial management structure upfront: joint, separate, or hybrid accounts",
    "Align on major financial goals and timelines before setting a budget together",
    "Establish a 'big purchase' rule: any spend over an agreed threshold requires discussion",
  ],
  actionItem:
    "Schedule a 'money date' this week. No phones, no multitasking. Share your full financial picture: net worth, debts, credit score. Ask your partner to do the same. This one conversation does more for your financial future than any investment choice.",
  proTip:
    "Bring your actual account statements and credit report to this conversation. Vague approximations lead to vague agreements. Specific numbers lead to specific plans.",
};

// ls-3-03: Joint vs Separate Accounts
export const jointVsSeparateAccounts: StageLessonContent = {
  body: `There is no universally correct way to handle married finances. There are trade-offs. Here are the three systems, with the honest pros and cons of each.

**Full Joint: Everything Together**
All income goes into shared accounts. All expenses come from shared accounts. Maximum transparency, minimum complexity. Works best when both partners have similar spending habits and trust is high. The downside: zero financial autonomy. Buying your partner a gift becomes awkward. Personal spending can feel monitored.

**Full Separate: Keep Everything Independent**
Each person has their own accounts. You split shared expenses by formula (50/50 or proportional to income). Maximum autonomy. The downside: complex, requires ongoing negotiation, and it's hard to build shared wealth when you're not pooling resources. Statistically, fully separate finances correlate with lower marital financial resilience.

**The Hybrid: Joint for Shared, Separate for Personal**
Three accounts: a joint account for bills, rent/mortgage, and shared savings. Each partner has a personal "fun money" account for discretionary spending, no questions asked. This is the most popular system among financial advisors for a reason -- it gives you shared goals and personal freedom simultaneously.

**The Tax Math**

Filing jointly almost always produces a lower tax bill. The marriage penalty (where filing jointly increases taxes) affects fewer than 1 in 4 married couples, typically those with similar incomes both over $100k. For most people, filing jointly saves $500 to $2,000/year.

Exception: if one spouse has significant medical expenses or other itemized deductions, running the math on "Married Filing Separately" may be worthwhile. Run both calculations or ask a CPA.

**The Credit Score Consideration**

Getting married does not merge your credit scores -- they remain individual forever. However, joint accounts, co-signed loans, and joint mortgages do affect both scores. If one partner has poor credit, it can affect your ability to qualify for joint credit at good rates. Fix the lower score before applying for a mortgage together.`,
  keyTakeaways: [
    "The Hybrid System (joint for bills + separate personal accounts) works for most couples: shared goals, personal freedom",
    "Filing taxes jointly typically saves $500-$2,000/year for most couples -- almost always the right call",
    "Marriage does not merge credit scores -- they stay separate forever, but joint accounts affect both",
    "If one partner has significantly worse credit, repair it before applying for a joint mortgage",
    "There's no wrong system, but you need an explicit system -- defaults create resentment",
  ],
  actionItem:
    "Decide on an account structure this month. If you choose the hybrid system, open a joint checking account together today. Decide how much each partner contributes monthly and set up automatic transfers.",
  proTip:
    "Set your joint account contributions proportional to income, not 50/50. If one partner earns $80k and the other earns $40k, equal contributions create unequal sacrifice. Proportional is fairer and causes fewer arguments.",
};

// ls-3-08: Prenups
export const prenupsSmartNotRomantic: StageLessonContent = {
  body: `A prenuptial agreement is not a prediction that your marriage will fail. It's a legal contract that defines how assets and debts are handled if the marriage ends -- whether by divorce or death. Every married couple has a prenup. Those who don't have one simply accepted the default contract written by their state legislature, which probably doesn't reflect what they actually want.

**Who needs a prenup:**
- Anyone with significant assets before marriage (inheritance, business equity, real estate, investment accounts over $50k)
- Anyone with significant debt before marriage (student loans over $75k, business debt)
- Anyone who owns part of a business or expects to inherit one
- Anyone entering a second marriage
- Anyone with children from a previous relationship

**Who probably doesn't need one:**
Both partners are starting from nothing, similar income, no existing assets, no children from prior relationships. In this case, your state's default laws are probably fine.

**What a prenup can do:**
- Define which assets remain separate property (yours vs shared)
- Specify how debts incurred before marriage are handled
- Establish property division rules if divorce occurs
- Protect a family business or inheritance from division
- Set terms for spousal support

**What a prenup cannot do:**
- Override child support obligations (courts determine child support based on current circumstances, not pre-agreed terms)
- Waive rights to marital assets acquired during the marriage that both parties agreed to share
- Include anything clearly illegal or unconscionable

**The process:**
Both partners need separate attorneys -- you cannot share one. Full financial disclosure is required or the agreement is voidable. It should be signed at least 30-60 days before the wedding, not the night before. Cost: typically $1,500 to $5,000 depending on complexity.

The conversation is uncomfortable. Have it anyway. A prenup negotiation reveals how you and your partner approach money, conflict, and fairness -- which is information you want before the wedding, not after.`,
  keyTakeaways: [
    "Every married couple has a prenup -- you either write your own or accept your state's default contract",
    "Prenups are most valuable when either partner has significant assets, debts, a business, or children from a prior relationship",
    "Both partners need separate attorneys -- one attorney cannot represent both parties",
    "Prenups cannot override child support -- courts set that based on circumstances at the time",
    "Sign 30-60 days before the wedding, not the week before -- last-minute prenups can be challenged",
  ],
  actionItem:
    "Look up your state's marital property laws (community property vs common law state). If you have assets over $50k, business interests, or significant debt, contact a family law attorney for a consultation. They'll tell you if a prenup is worth the cost in your situation.",
  proTip:
    "Framing matters: don't present a prenup as \"what happens if we divorce.\" Present it as \"I want us to be explicit about our financial expectations so there are no surprises if life takes an unexpected turn.\" That's the honest framing and it's less threatening.",
};

// ls-3-10: Boss Lesson
export const marriedMoneyOperatingSystem: StageLessonContent = {
  body: `You're not just managing your money anymore. You're managing a shared financial enterprise with a partner who has different instincts, history, and goals. The couples who get this right build wealth faster than two single people combined. The couples who get it wrong spend the next decade in slow-burning financial conflict.

Here's the operating system for married money.

**The Monthly Money Meeting (30 minutes, once a month)**
Put it on the calendar like an appointment. Review: Where did all the money go last month? Are savings targets on track? Any big expenses coming in the next 90 days? This is not a criticism session -- it's a systems check. Keep it brief. Make it normal.

**The Account Structure**
Recommended setup:
- Joint checking: all income deposited here
- Joint HYSA: emergency fund + shared saving goals
- His personal checking: personal fun money
- Her personal checking: personal fun money
- Joint brokerage or retirement contributions: shared investing

Each month: auto-transfer personal allowances to each personal account. No explanations needed, no questions asked.

**The Big Purchase Rule**
Agree on a threshold -- typically $300 to $500 -- above which either partner must mention the purchase before making it. Not ask permission (you're adults) -- mention it. This gives the other person a chance to say "hey we have that anniversary trip next month" before the money is spent.

**Insurance Review**
Update all beneficiaries on every account: 401(k), IRA, life insurance, bank accounts. This takes one hour and protects your spouse if something happens to you. People skip this and leave their spouse fighting with the estate for accounts that should transfer instantly.

**The Annual Big Picture**
Once a year, review: Are you on track for major goals (house down payment, retirement contributions, kids' college)? Does your will need updating? Have there been income changes that require W-4 adjustments?

The system isn't about perfection. It's about having enough structure that money doesn't create friction where there should be love.`,
  keyTakeaways: [
    "Monthly money meetings (30 minutes) normalize financial conversations and prevent small issues from becoming big fights",
    "Update all beneficiaries immediately after marriage -- this one-hour task prevents catastrophic estate complications",
    "Set a Big Purchase Rule threshold ($300-$500) so neither partner feels blindsided by expenses",
    "Personal allowances with no-questions-asked spending create autonomy within a shared financial structure",
    "The joint system works when both partners see it as 'our money' not 'my money + your money'",
  ],
  actionItem:
    "This week: update the beneficiary designations on your 401(k), IRA, life insurance policy, and bank accounts to reflect your spouse. Log into each account, find the beneficiary section, and update it. This takes about an hour and is one of the most important financial tasks you will ever do.",
  proTip:
    "Write a one-page \"financial snapshot\" document: account numbers, login locations, insurance policy numbers, financial advisor contacts, and where to find your will. Store it somewhere your spouse knows about. If something happens to you, this document is the first thing they'll need.",
};
