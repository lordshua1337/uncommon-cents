// All 8 LifeStage definitions with full lesson arrays
// Lessons mix existing concept slugs (type: "concept") with new stage-specific content (type: "stage-lesson")
// Quick Win is always the first lesson; Boss Lesson is always the last lesson
// estimatedMinutes is the sum of all lesson estimates for the stage

import type { LifeStage } from "./types";
import {
  budgetRuleWrong,
  firstEmergencyFund,
  subscriptionsLifestyleCreep,
  monthOneAutopilot,
} from "./lessons/move-out";
import {
  readYourPaystub,
  benefitsEnrollment,
  firstYearChecklist,
} from "./lessons/career-start";
import {
  moneyTalkQuestions,
  jointVsSeparateAccounts,
  prenupsSmartNotRomantic,
  marriedMoneyOperatingSystem,
} from "./lessons/get-married";
import {
  whatYouCanAfford,
  closingCostsHiddenExpenses,
  homeownerFirstYearPlaybook,
} from "./lessons/buy-house";
import {
  trueCostOfKid,
  childcareTaxCredits,
  teachingKidsMoney,
  newParentFinancialShield,
} from "./lessons/have-kid";
import {
  separateYourMoney,
  businessInsuranceNeeds,
  businessFinanceOperatingSystem,
} from "./lessons/start-business";
import {
  fourPercentRuleBroken,
  retirementCountdown,
} from "./lessons/plan-retirement";
import {
  stepUpBasisLoophole,
  familyGovernanceEntitledKids,
  legacyBlueprint,
} from "./lessons/build-legacy";

// ---------------------------------------------------------------------------
// Stage 1: You Move Out
// ---------------------------------------------------------------------------

export const stageYouMoveOut: LifeStage = {
  id: "ls-1",
  slug: "move-out",
  number: 1,
  title: "You Move Out",
  tagline: "Adulting starts with a budget, not a prayer",
  description:
    "The moment you sign a lease, money stops being abstract. This path covers the financial fundamentals every first-time apartment dweller needs: building a budget that actually works, creating a real emergency fund, and setting up the automated systems that will run your money without requiring constant willpower.",
  accentColor: "#F59E0B",
  accentColorLight: "#FEF3C7",
  icon: "KeyRound",
  estimatedMinutes: 52,
  lessons: [
    {
      id: "ls-1-01",
      type: "stage-lesson",
      title: "The 50/30/20 Rule Is Wrong (Here's What Actually Works)",
      summary:
        "The most famous budgeting rule was invented for a different economy. Here's the Reverse Budget -- a system that works regardless of your income or city.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: budgetRuleWrong,
    },
    {
      id: "ls-1-02",
      type: "concept",
      conceptSlug: "compound-interest",
      title: "Compound Interest: The Only Math That Actually Matters",
      summary:
        "The reason starting early beats earning more. Understand this and you'll never procrastinate on saving again.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 8,
    },
    {
      id: "ls-1-03",
      type: "concept",
      conceptSlug: "inflation-purchasing-power",
      title: "Inflation: Why Saving in a Mattress Makes You Poorer",
      summary:
        "Every dollar you don't invest loses value over time. Here's how inflation works and why it changes where you keep your money.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-1-04",
      type: "concept",
      conceptSlug: "credit-score-anatomy",
      title: "Credit Score Anatomy: What Actually Moves the Number",
      summary:
        "Your credit score affects your apartment, your car loan, and eventually your mortgage. Build it now, before you need it.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-1-05",
      type: "concept",
      conceptSlug: "debt-avalanche-vs-snowball",
      title: "Avalanche vs Snowball: Paying Off Debt the Smart Way",
      summary:
        "Two methods for getting out of debt. One saves more money. One works better psychologically. Know which you are.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-1-06",
      type: "stage-lesson",
      title: "Your First Emergency Fund: How Much and Where",
      summary:
        "The 3-6 month rule sounds great on paper. Here's what it actually looks like when you're 23 and starting from zero -- and the specific account type that earns real interest.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
      content: firstEmergencyFund,
    },
    {
      id: "ls-1-07",
      type: "stage-lesson",
      title: "Subscriptions, Lifestyle Creep, and the Latte Lie",
      summary:
        "The latte debate misses the real enemy: the slow creep of lifestyle upgrades that consumes every raise before you notice.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
      content: subscriptionsLifestyleCreep,
    },
    {
      id: "ls-1-08",
      type: "concept",
      conceptSlug: "the-spreadsheet-lie",
      title: "The Spreadsheet Lie: Why Tracking Every Dollar Doesn't Work",
      summary:
        "Detailed budgeting apps and spreadsheets sound rigorous. For most people, they create guilt without results.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-1-09",
      type: "concept",
      conceptSlug: "loss-aversion",
      title: "Loss Aversion: Why You Make Irrational Money Decisions",
      summary:
        "Your brain is wired to fear losses twice as much as it values equivalent gains. Knowing this changes how you make financial decisions.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-1-10",
      type: "stage-lesson",
      title: "Month One Autopilot: The System That Runs Your Money Without You",
      summary:
        "Build this system once and your finances run themselves. No willpower required -- just automation, separate accounts, and one 15-minute monthly review.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 7,
      content: monthOneAutopilot,
    },
  ],
};

// ---------------------------------------------------------------------------
// Stage 2: You Start Your Career
// ---------------------------------------------------------------------------

export const stageCareerStart: LifeStage = {
  id: "ls-2",
  slug: "career-start",
  number: 2,
  title: "You Start Your Career",
  tagline: "Your first paycheck is the most dangerous one",
  description:
    "The decisions you make in your first year of real income compound for decades. This path covers everything you need to do in year one: understanding your pay stub, capturing the employer match, choosing the right benefits, and establishing the automated systems that will fund your retirement whether you think about it or not.",
  accentColor: "#3B82F6",
  accentColorLight: "#DBEAFE",
  icon: "Briefcase",
  estimatedMinutes: 54,
  lessons: [
    {
      id: "ls-2-01",
      type: "stage-lesson",
      title: "Read Your Paystub Like a CFO",
      summary:
        "Your gross salary and your take-home pay are very different numbers. Here's every line item translated -- and what to do about each one.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: readYourPaystub,
    },
    {
      id: "ls-2-02",
      type: "concept",
      conceptSlug: "roth-vs-traditional",
      title: "Roth vs Traditional: The Tax Timing Decision",
      summary:
        "Pay taxes now or later? The answer changes based on your income, career trajectory, and retirement plans -- and most advice gets it wrong.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 8,
    },
    {
      id: "ls-2-03",
      type: "concept",
      conceptSlug: "hsa-triple-tax",
      title: "HSA: The Triple Tax Advantage Most People Ignore",
      summary:
        "The most tax-advantaged account in the entire tax code. Deductible going in, tax-free growth, tax-free withdrawals. Nothing else gets all three.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-2-04",
      type: "concept",
      conceptSlug: "total-comp-analysis",
      title: "Total Comp Analysis: Your Salary Is the Least Important Number",
      summary:
        "The benefits, equity, and perks in your offer letter are worth real money. Learn to evaluate them before accepting.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-2-05",
      type: "concept",
      conceptSlug: "salary-negotiation",
      title: "Salary Negotiation: The Conversation Nobody Teaches You",
      summary:
        "Every year you don't negotiate costs you tens of thousands in compounding income. The tactics are learnable and uncomfortable -- learn them now.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-2-06",
      type: "concept",
      conceptSlug: "tax-bracket-management",
      title: "Tax Bracket Management: The Government's Price List",
      summary:
        "Tax brackets are not what most people think. Understanding marginal rates changes how you approach raises, bonuses, and deductions.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-2-07",
      type: "concept",
      conceptSlug: "tax-drag",
      title: "Tax Drag: The Silent Performance Killer",
      summary:
        "The difference between investing in taxable vs tax-advantaged accounts isn't just fees -- it's the annual drag of taxes on gains that compounds against you.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-2-08",
      type: "stage-lesson",
      title: "Benefits Enrollment: The 30-Minute Window That Costs You Thousands",
      summary:
        "Open enrollment happens once a year and most people click through it in 5 minutes. Here's how to make a decision worth thousands of dollars instead.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
      content: benefitsEnrollment,
    },
    {
      id: "ls-2-09",
      type: "concept",
      conceptSlug: "career-roi",
      title: "Career ROI: Your Biggest Wealth-Building Asset Is Your Salary",
      summary:
        "Investing $500/month matters. Earning $30,000 more per year matters more. The highest-return investment you can make is often in your career itself.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-2-10",
      type: "stage-lesson",
      title: "Your First-Year Financial Checklist",
      summary:
        "A month-by-month playbook for year one: the 401(k) enrollment, emergency fund, insurance review, and tax filing that set the trajectory for the next 40 years.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 7,
      content: firstYearChecklist,
    },
  ],
};

// ---------------------------------------------------------------------------
// Stage 3: You Get Married
// ---------------------------------------------------------------------------

export const stageGetMarried: LifeStage = {
  id: "ls-3",
  slug: "get-married",
  number: 3,
  title: "You Get Married",
  tagline: "Love is beautiful. Splitting finances is war.",
  description:
    "Marriage is the most significant financial merger of your life. This path covers the conversations to have before you combine finances, the account structures that actually work, the legal protections you need, and how to build a shared financial system that survives disagreement -- because it will.",
  accentColor: "#EC4899",
  accentColorLight: "#FCE7F3",
  icon: "Heart",
  estimatedMinutes: 57,
  lessons: [
    {
      id: "ls-3-01",
      type: "stage-lesson",
      title: "The Money Talk: 5 Questions Before You Merge Finances",
      summary:
        "Money is the #1 cause of divorce. These five conversations take two hours and save years of conflict. Have them before the wedding.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: moneyTalkQuestions,
    },
    {
      id: "ls-3-02",
      type: "concept",
      conceptSlug: "filing-status",
      title: "Filing Status: How Marriage Changes Your Taxes",
      summary:
        "Married Filing Jointly vs Separately -- the math is not what you'd expect, and the filing status you choose affects your total tax bill significantly.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-3-03",
      type: "stage-lesson",
      title: "Joint vs Separate: Accounts, Taxes, and the Real Math",
      summary:
        "Full joint, full separate, or hybrid? Here are the three systems for married money, with honest pros and cons of each.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
      content: jointVsSeparateAccounts,
    },
    {
      id: "ls-3-04",
      type: "concept",
      conceptSlug: "term-vs-permanent-insurance",
      title: "Life Insurance: Term vs Permanent",
      summary:
        "Now that someone depends on your income, life insurance is no longer optional. Here's what to buy and what to ignore.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-3-05",
      type: "concept",
      conceptSlug: "disability-insurance",
      title: "Disability Insurance: The Coverage Nobody Talks About",
      summary:
        "You're far more likely to become disabled than to die during your working years. If your household depends on your income, disability insurance is more important than life insurance.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-3-06",
      type: "concept",
      conceptSlug: "basic-estate-plan",
      title: "Basic Estate Plan: The Documents Every Adult Needs",
      summary:
        "A will, power of attorney, and healthcare directive are not just for the elderly. Marriage is the trigger to get these done.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-3-07",
      type: "concept",
      conceptSlug: "beneficiary-designations",
      title: "Beneficiary Designations: The Update That Overrides Your Will",
      summary:
        "Beneficiary designations on 401(k)s, IRAs, and life insurance override whatever your will says. Marriage makes this update urgent.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-3-08",
      type: "stage-lesson",
      title: "Prenups: Not Romantic, Extremely Smart",
      summary:
        "Every couple has a prenup. Those who don't have one just accepted their state legislature's default contract -- which probably doesn't reflect what they actually want.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
      content: prenupsSmartNotRomantic,
    },
    {
      id: "ls-3-09",
      type: "concept",
      conceptSlug: "mental-accounting",
      title: "Mental Accounting: Why Two Rational People Fight About Money",
      summary:
        "Mental accounting creates invisible buckets in your mind that make objectively equivalent dollars feel different. It explains most couples' money arguments.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-3-10",
      type: "stage-lesson",
      title: "The Married Money Operating System",
      summary:
        "Monthly money meetings, account structures, the big purchase rule, and the annual financial review -- the complete system for running finances as a team.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 7,
      content: marriedMoneyOperatingSystem,
    },
  ],
};

// ---------------------------------------------------------------------------
// Stage 4: You Buy a House
// ---------------------------------------------------------------------------

export const stageBuyHouse: LifeStage = {
  id: "ls-4",
  slug: "buy-house",
  number: 4,
  title: "You Buy a House",
  tagline: "The biggest purchase you'll ever make with money you don't have",
  description:
    "A house is not primarily an investment -- it's a financial decision that affects your cash flow, taxes, and flexibility for decades. This path covers what you can actually afford (not what the bank says), the mechanics of mortgages, the hidden costs nobody warns you about, and what to do in year one to protect the investment.",
  accentColor: "#10B981",
  accentColorLight: "#D1FAE5",
  icon: "House",
  estimatedMinutes: 59,
  lessons: [
    {
      id: "ls-4-01",
      type: "stage-lesson",
      title: "What 'You Can Afford' Actually Means (Not What the Bank Says)",
      summary:
        "The bank's pre-approval is a maximum, not a recommendation. Here's how to calculate what you can actually afford without becoming house-poor.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: whatYouCanAfford,
    },
    {
      id: "ls-4-02",
      type: "concept",
      conceptSlug: "buy-vs-rent-math",
      title: "Buy vs Rent: The Math Nobody Does",
      summary:
        "Buying is not always better than renting. The math depends on your timeline, local prices, and opportunity cost of the down payment. Run it honestly.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 8,
    },
    {
      id: "ls-4-03",
      type: "concept",
      conceptSlug: "mortgage-mechanics",
      title: "Mortgage Mechanics: How 30 Years of Debt Actually Works",
      summary:
        "An amortizing mortgage is structured so you pay mostly interest in the early years. Understanding this changes when and whether to make extra payments.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-4-04",
      type: "concept",
      conceptSlug: "down-payment-strategy",
      title: "Down Payment Strategy: 3%, 10%, or 20%?",
      summary:
        "The 20% down payment rule is a myth for most buyers. Here's the real math on how much to put down and when PMI is actually fine.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-4-05",
      type: "concept",
      conceptSlug: "mortgage-optimization",
      title: "Mortgage Optimization: Rate Shopping, Points, and Refinancing",
      summary:
        "A 0.5% lower interest rate on a $400,000 mortgage saves $60,000 over 30 years. Shopping your mortgage is the highest-leverage hour you'll spend on this purchase.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-4-06",
      type: "concept",
      conceptSlug: "homeowners-insurance",
      title: "Homeowner's Insurance: What It Covers and What It Doesn't",
      summary:
        "Standard homeowner's insurance has gaps that cost owners thousands. Know what's excluded before you need to file a claim.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-4-07",
      type: "concept",
      conceptSlug: "property-tax",
      title: "Property Taxes: The Variable Bill That Never Goes Away",
      summary:
        "Property taxes are reassessed, appealed, and exempted in ways most homeowners never discover. Know your options.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-4-08",
      type: "stage-lesson",
      title: "Closing Costs, Inspections, and the Hidden $20K",
      summary:
        "Closing costs run 2-5% of the loan amount. Moving, repairs, and furnishings add another $10,000-$20,000. Here's the complete cost breakdown before you sign.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
      content: closingCostsHiddenExpenses,
    },
    {
      id: "ls-4-09",
      type: "concept",
      conceptSlug: "property-tax-deduction",
      title: "Property Tax Deduction: When Itemizing Actually Makes Sense",
      summary:
        "The mortgage interest and property tax deductions only help if your itemized deductions exceed the standard deduction. Most first-time buyers are surprised to find they still take the standard deduction.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-4-10",
      type: "stage-lesson",
      title: "The Homeowner's First-Year Financial Playbook",
      summary:
        "Month one through twelve: change the locks, file for homestead exemption, open a maintenance fund, and build the systems that protect your investment for decades.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 7,
      content: homeownerFirstYearPlaybook,
    },
  ],
};

// ---------------------------------------------------------------------------
// Stage 5: You Have a Kid
// ---------------------------------------------------------------------------

export const stageHaveKid: LifeStage = {
  id: "ls-5",
  slug: "have-kid",
  number: 5,
  title: "You Have a Kid",
  tagline: "Congratulations. Your expenses just got an 18-year subscription.",
  description:
    "A child changes every financial equation: insurance, estate planning, childcare costs, tax credits, college savings, and your own retirement timeline. This path covers the financial shield every new parent needs to build, and the decisions that determine whether your kid grows up financially literate or entitled.",
  accentColor: "#8B5CF6",
  accentColorLight: "#EDE9FE",
  icon: "Star",
  estimatedMinutes: 53,
  lessons: [
    {
      id: "ls-5-01",
      type: "stage-lesson",
      title: "The True Cost of a Kid: $310K... Unless You're Smart",
      summary:
        "The USDA figure is real. But it's an average, not a sentence. Here's where the money actually goes and where you can cut it without cutting what matters.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: trueCostOfKid,
    },
    {
      id: "ls-5-02",
      type: "concept",
      conceptSlug: "529-plans",
      title: "529 Plans: Tax-Free College Savings",
      summary:
        "529s grow tax-free and withdrawals for education are tax-free. Recent law changes make them even more flexible. Start one while your child is young.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-5-03",
      type: "concept",
      conceptSlug: "term-vs-permanent-insurance",
      title: "Life Insurance Revisited: Now It's Not Optional",
      summary:
        "You have a dependent. The calculus changes completely. How much term insurance do you actually need and how do you buy it without getting sold to?",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-5-04",
      type: "concept",
      conceptSlug: "basic-estate-plan",
      title: "Wills and Guardianship: Who Raises Your Child If You Can't",
      summary:
        "Without a will naming a guardian, a court decides who raises your child. This is not hypothetical. It happens. It's a $300 problem to solve.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-5-05",
      type: "stage-lesson",
      title: "Childcare Tax Credits and Dependent Care FSA",
      summary:
        "Most working parents use one childcare tax benefit. Almost nobody uses all three optimally. Here's how to stack the DCFSA, Child and Dependent Care Credit, and Child Tax Credit.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
      content: childcareTaxCredits,
    },
    {
      id: "ls-5-06",
      type: "concept",
      conceptSlug: "emergency-fund-scaling",
      title: "Emergency Fund Scaling: How Much Changes When You Have Kids",
      summary:
        "Your emergency fund calculation needs to account for childcare, pediatric costs, and the risk of losing one income. The number goes up.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 5,
    },
    {
      id: "ls-5-07",
      type: "stage-lesson",
      title: "Teaching Kids About Money: Ages 5 to 18",
      summary:
        "Financial literacy isn't taught in schools. Your kids will learn it from you or from credit card companies. Here's an age-by-age framework that actually works.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
      content: teachingKidsMoney,
    },
    {
      id: "ls-5-08",
      type: "concept",
      conceptSlug: "single-income-transition",
      title: "Single-Income Transition: When One Partner Steps Back",
      summary:
        "Going from dual to single income is one of the most significant financial transitions a family makes. Here's how to stress-test and plan for it.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-5-09",
      type: "stage-lesson",
      title: "The New Parent Financial Shield",
      summary:
        "Life insurance, disability, a will with guardians named, updated beneficiaries, and a recalculated emergency fund -- the five protections to build before your child's six-month birthday.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 7,
      content: newParentFinancialShield,
    },
  ],
};

// ---------------------------------------------------------------------------
// Stage 6: You Start a Business
// ---------------------------------------------------------------------------

export const stageStartBusiness: LifeStage = {
  id: "ls-6",
  slug: "start-business",
  number: 6,
  title: "You Start a Business",
  tagline: "The IRS treats business owners differently. Use it.",
  description:
    "Self-employment creates tax obligations and tax advantages most employees never encounter. This path covers entity selection, separating your money, the deductions most new business owners miss, how to pay yourself correctly, and the financial operating system that keeps a business from eating its owner alive.",
  accentColor: "#F97316",
  accentColorLight: "#FFEDD5",
  icon: "Zap",
  estimatedMinutes: 61,
  lessons: [
    {
      id: "ls-6-01",
      type: "stage-lesson",
      title: "The First Thing You Do: Separate Your Money",
      summary:
        "Before a logo, before a website, before anything else: open a business bank account. Commingling personal and business funds destroys your LLC's legal protection and makes taxes a nightmare.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: separateYourMoney,
    },
    {
      id: "ls-6-02",
      type: "concept",
      conceptSlug: "entity-selection",
      title: "Entity Selection: LLC vs S-Corp vs Sole Prop",
      summary:
        "The entity you choose affects your taxes, liability protection, and administrative burden for the life of the business. Choose deliberately.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 8,
    },
    {
      id: "ls-6-03",
      type: "concept",
      conceptSlug: "s-corp-optimization",
      title: "S-Corp Optimization: The Salary + Distribution Split",
      summary:
        "The S-Corp election saves self-employed people $3,000-$20,000 per year in self-employment tax when done correctly. The IRS cares about your 'reasonable salary.'",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-6-04",
      type: "concept",
      conceptSlug: "self-employment-tax",
      title: "Self-Employment Tax: The Bill That Shocks First-Time Business Owners",
      summary:
        "As an employee, your employer pays half of Social Security and Medicare. As a business owner, you pay all of it. Here's how to plan for it.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-6-05",
      type: "concept",
      conceptSlug: "sep-ira-solo-401k",
      title: "SEP-IRA and Solo 401(k): Retire Tax-Free as a Business Owner",
      summary:
        "Business owners have access to retirement accounts that let them contribute far more than employees -- up to $69,000/year. Here's which one to use.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-6-06",
      type: "concept",
      conceptSlug: "business-deductions",
      title: "Business Deductions: What's Actually Deductible",
      summary:
        "Home office, vehicle, travel, health insurance -- business owners can deduct expenses employees cannot. Know what's legitimate and what triggers an audit.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-6-07",
      type: "concept",
      conceptSlug: "quarterly-estimated-taxes",
      title: "Quarterly Estimated Taxes: Pay Now or Pay Penalties",
      summary:
        "The IRS expects quarterly payments from the self-employed. Missing them costs you penalty interest. Here's the calculation and the calendar.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-6-08",
      type: "stage-lesson",
      title: "Business Insurance: What You Actually Need",
      summary:
        "Most new business owners either skip insurance entirely or over-insure because a broker scared them. Here's the actual map of what you need and when.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
      content: businessInsuranceNeeds,
    },
    {
      id: "ls-6-09",
      type: "concept",
      conceptSlug: "business-exit-strategy",
      title: "Business Exit Strategy: Building to Sell",
      summary:
        "The most valuable businesses are ones you could sell. Even if you never will. Building with exit optionality in mind creates a more valuable and less owner-dependent business.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-6-10",
      type: "stage-lesson",
      title: "Your Business Finance Operating System",
      summary:
        "Weekly cash checks, monthly P&L review, quarterly estimated tax payments, annual CPA meeting -- the infrastructure that separates businesses that scale from owners who just have an expensive job.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 7,
      content: businessFinanceOperatingSystem,
    },
  ],
};

// ---------------------------------------------------------------------------
// Stage 7: You Plan Retirement
// ---------------------------------------------------------------------------

export const stagePlanRetirement: LifeStage = {
  id: "ls-7",
  slug: "plan-retirement",
  number: 7,
  title: "You Plan Retirement",
  tagline: "Freedom isn't free. It's exactly $X at Y% withdrawal.",
  description:
    "Retirement planning is not just saving money -- it's converting a lump sum into reliable lifetime income. This path covers the withdrawal rate reality, sequence-of-returns risk, Social Security optimization, Roth conversion strategy, and the decade-by-decade countdown to your last day of work.",
  accentColor: "#06B6D4",
  accentColorLight: "#CFFAFE",
  icon: "Compass",
  estimatedMinutes: 62,
  lessons: [
    {
      id: "ls-7-01",
      type: "stage-lesson",
      title: "The 4% Rule Is Broken. Here's the Real Number.",
      summary:
        "The famous rule was built for 30-year retirements. If you're retiring at 55 or 60, you need a different withdrawal rate -- and the Social Security offset changes everything.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: fourPercentRuleBroken,
    },
    {
      id: "ls-7-02",
      type: "concept",
      conceptSlug: "safe-withdrawal-rate",
      title: "Safe Withdrawal Rate: How Long Will Your Money Last",
      summary:
        "The Trinity Study, historical success rates, and how portfolio composition affects how long your money survives in retirement.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 8,
    },
    {
      id: "ls-7-03",
      type: "concept",
      conceptSlug: "sequence-of-returns-risk",
      title: "Sequence of Returns Risk: The Biggest Threat You've Never Heard Of",
      summary:
        "A market crash in year one of retirement is catastrophically different from a crash in year fifteen. This asymmetry reshapes how you should structure retirement income.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-7-04",
      type: "concept",
      conceptSlug: "social-security-optimization",
      title: "Social Security Optimization: When to Claim",
      summary:
        "Claiming at 62 vs 70 is a 76% monthly benefit difference. For most people with average health, the break-even math strongly favors waiting.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-7-05",
      type: "concept",
      conceptSlug: "roth-conversion-ladder",
      title: "Roth Conversion Ladder: Converting Tax Liability into Tax-Free Income",
      summary:
        "The gap years between retirement and Required Minimum Distributions are the optimal window for Roth conversions. Fill the lower brackets before RMDs force higher ones.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-7-06",
      type: "concept",
      conceptSlug: "rmd-strategy",
      title: "RMD Strategy: Managing Required Minimum Distributions",
      summary:
        "Required Minimum Distributions from Traditional accounts start at 73 and can push you into higher tax brackets and trigger Medicare surcharges. Plan ahead.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-7-07",
      type: "concept",
      conceptSlug: "bucket-strategy",
      title: "Bucket Strategy: Organizing Retirement Income",
      summary:
        "The bucket strategy divides retirement assets into short, medium, and long-term buckets -- each with different risk levels and purposes. It solves the sequence-of-returns problem behaviorally.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-7-08",
      type: "concept",
      conceptSlug: "long-term-care-insurance",
      title: "Long-Term Care Insurance: The Expense That Wrecks Retirement Plans",
      summary:
        "The average nursing home costs $100,000+/year. Long-term care insurance is either your hedge against this risk or the most expensive premium you pay for nothing.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-7-09",
      type: "concept",
      conceptSlug: "medicare-navigation",
      title: "Medicare Navigation: Parts A, B, C, D, and the Medigap Maze",
      summary:
        "Medicare has four parts, a dozen supplement plans, and enrollment windows that create permanent penalties if missed. Understand it before you need it.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-7-10",
      type: "stage-lesson",
      title: "The Retirement Countdown: 10 Years, 5 Years, 1 Year Out",
      summary:
        "The decade before retirement is the most important financial period of your life. Here's what to do at each milestone to arrive at retirement day with a working system, not a plan.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 8,
      content: retirementCountdown,
    },
  ],
};

// ---------------------------------------------------------------------------
// Stage 8: You Build Legacy
// ---------------------------------------------------------------------------

export const stageBuildLegacy: LifeStage = {
  id: "ls-8",
  slug: "build-legacy",
  number: 8,
  title: "You Build Legacy",
  tagline: "The money moves that outlive you",
  description:
    "Legacy is not just what you leave -- it's what you build in the people who receive it. This path covers the tax strategies that preserve generational wealth, the legal structures that protect it, and the family governance that prevents third-generation wealth destruction. The goal: your family's financial intelligence compounds alongside the capital.",
  accentColor: "#CA8A04",
  accentColorLight: "#FEF9C3",
  icon: "Crown",
  estimatedMinutes: 58,
  lessons: [
    {
      id: "ls-8-01",
      type: "stage-lesson",
      title: "The Step-Up Basis Loophole: Why the Rich Don't Sell",
      summary:
        "The most powerful legal tax loophole in plain sight: die holding appreciated assets and your heirs owe zero capital gains tax. Here's the math and the strategy.",
      isQuickWin: true,
      isBossLesson: false,
      estimatedMinutes: 3,
      content: stepUpBasisLoophole,
    },
    {
      id: "ls-8-02",
      type: "concept",
      conceptSlug: "gift-tax-strategy",
      title: "Gift Tax Strategy: Moving Wealth Without the IRS",
      summary:
        "$18,000 per recipient per year, completely tax-free. Used consistently over decades, this is one of the most effective wealth transfer tools available.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-8-03",
      type: "concept",
      conceptSlug: "step-up-basis",
      title: "Step-Up in Basis: The Full Mechanics",
      summary:
        "The complete picture of how step-up in basis works, which assets qualify, which don't, and how to structure your portfolio around it over a lifetime.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-8-04",
      type: "concept",
      conceptSlug: "irrevocable-trusts",
      title: "Irrevocable Trusts: Removing Assets from Your Taxable Estate",
      summary:
        "Once assets go into an irrevocable trust, they leave your estate for tax purposes. The trade-off: you lose control. Here's when that trade-off is worth it.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-8-05",
      type: "concept",
      conceptSlug: "buy-borrow-die",
      title: "Buy-Borrow-Die: The Billionaire Tax Strategy",
      summary:
        "Buy appreciating assets. Borrow against them tax-free. Die holding them with a stepped-up basis for heirs. Legal, effective, and increasingly accessible to non-billionaires.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 7,
    },
    {
      id: "ls-8-06",
      type: "concept",
      conceptSlug: "charitable-giving-strategy",
      title: "Charitable Giving Strategy: Doing Good While Paying Less Tax",
      summary:
        "Donor-advised funds, qualified charitable distributions, and charitable remainder trusts let you give more while paying less tax than writing a check.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-8-07",
      type: "concept",
      conceptSlug: "generation-skipping-trust",
      title: "Generation-Skipping Trust: Giving to Grandchildren Tax-Efficiently",
      summary:
        "Transferring wealth directly to grandchildren bypasses one entire generation of estate taxes. The GST exemption in 2024 matches the estate tax exemption.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-8-08",
      type: "stage-lesson",
      title: "Family Governance: How to Not Raise Entitled Kids",
      summary:
        "Research shows unprepared heirs do worse with sudden wealth. The families that preserve wealth across generations have explicit structures, conversations, and expectations -- not just money.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
      content: familyGovernanceEntitledKids,
    },
    {
      id: "ls-8-09",
      type: "concept",
      conceptSlug: "generational-wealth-math",
      title: "Generational Wealth Math: What a Century of Compounding Looks Like",
      summary:
        "The mathematics of wealth passed across 3-4 generations with different scenarios: spent down, preserved, and grown. The numbers are staggering in both directions.",
      isQuickWin: false,
      isBossLesson: false,
      estimatedMinutes: 6,
    },
    {
      id: "ls-8-10",
      type: "stage-lesson",
      title: "The Legacy Blueprint: Your 3-Generation Plan",
      summary:
        "The complete framework for generational wealth: protect your estate now, prepare the next generation, and plant for the generation after that. This is the capstone.",
      isQuickWin: false,
      isBossLesson: true,
      estimatedMinutes: 8,
      content: legacyBlueprint,
    },
  ],
};

// ---------------------------------------------------------------------------
// All stages in order
// ---------------------------------------------------------------------------

export const lifeStages: readonly LifeStage[] = [
  stageYouMoveOut,
  stageCareerStart,
  stageGetMarried,
  stageBuyHouse,
  stageHaveKid,
  stageStartBusiness,
  stagePlanRetirement,
  stageBuildLegacy,
] as const;

// ---------------------------------------------------------------------------
// Helper functions (pure, no side effects)
// ---------------------------------------------------------------------------

export function getStageBySlug(slug: string): LifeStage | undefined {
  return lifeStages.find((s) => s.slug === slug);
}

export function getStageById(id: string): LifeStage | undefined {
  return lifeStages.find((s) => s.id === id);
}

export function getLessonById(
  stage: LifeStage,
  lessonId: string,
): import("./types").StageLesson | undefined {
  return stage.lessons.find((l) => l.id === lessonId);
}

export function getLessonIndex(stage: LifeStage, lessonId: string): number {
  return stage.lessons.findIndex((l) => l.id === lessonId);
}

export function getNextLesson(
  stage: LifeStage,
  currentLessonId: string,
): import("./types").StageLesson | undefined {
  const idx = getLessonIndex(stage, currentLessonId);
  if (idx === -1 || idx >= stage.lessons.length - 1) return undefined;
  return stage.lessons[idx + 1];
}

export function getPrevLesson(
  stage: LifeStage,
  currentLessonId: string,
): import("./types").StageLesson | undefined {
  const idx = getLessonIndex(stage, currentLessonId);
  if (idx <= 0) return undefined;
  return stage.lessons[idx - 1];
}
