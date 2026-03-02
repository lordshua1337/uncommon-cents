export interface Domain {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  conceptCount: number;
  color: string;
}

export const domains: Domain[] = [
  {
    id: "d1",
    slug: "tax-advantaged-accounts",
    name: "Tax-Advantaged Accounts",
    shortName: "Tax Accounts",
    description:
      "401k, Roth, HSA, 529, Solo 401k, SEP-IRA. The accounts designed to give you legal tax breaks -- if you know how to use them.",
    icon: "PiggyBank",
    conceptCount: 10,
    color: "#16A34A",
  },
  {
    id: "d2",
    slug: "tax-optimization",
    name: "Tax Optimization Strategies",
    shortName: "Tax Strategy",
    description:
      "Bracket management, Roth conversions, tax-loss harvesting, 0% capital gains. The moves that separate the tax-literate from everyone else.",
    icon: "Calculator",
    conceptCount: 10,
    color: "#2563EB",
  },
  {
    id: "d3",
    slug: "equity-compensation",
    name: "Equity Compensation",
    shortName: "Equity Comp",
    description:
      "ISOs, NSOs, RSUs, 83(b) elections, ESPP. What your stock options actually mean and the tax landmines hidden in each.",
    icon: "TrendingUp",
    conceptCount: 10,
    color: "#7C3AED",
  },
  {
    id: "d4",
    slug: "real-estate",
    name: "Real Estate Finance",
    shortName: "Real Estate",
    description:
      "Buy vs rent math, rental property analysis, 1031 exchanges, house hacking. Real numbers, not real estate guru fantasies.",
    icon: "Home",
    conceptCount: 9,
    color: "#B45309",
  },
  {
    id: "d5",
    slug: "business-finance",
    name: "Business, Self-Employment, and Entity Structures",
    shortName: "Business",
    description:
      "S-Corp optimization, entity selection, self-employment tax, business exit strategies. The tax advantages of being your own boss.",
    icon: "Briefcase",
    conceptCount: 10,
    color: "#0891B2",
  },
  {
    id: "d6",
    slug: "retirement-income",
    name: "Retirement Income Planning",
    shortName: "Retirement",
    description:
      "Safe withdrawal rates, sequence risk, Social Security optimization, RMDs, bucket strategies. Making your money last longer than you do.",
    icon: "Sunset",
    conceptCount: 10,
    color: "#DC2626",
  },
  {
    id: "d7",
    slug: "investing",
    name: "Investing Concepts and Portfolio Construction",
    shortName: "Investing",
    description:
      "Asset allocation, factor investing, direct indexing, bond strategies. Evidence-based investing without the Wall Street noise.",
    icon: "BarChart3",
    conceptCount: 10,
    color: "#059669",
  },
  {
    id: "d8",
    slug: "estate-planning",
    name: "Estate Planning and Wealth Transfer",
    shortName: "Estate Planning",
    description:
      "Gift tax, step-up basis, trusts, buy-borrow-die. How wealth actually transfers between generations.",
    icon: "Shield",
    conceptCount: 10,
    color: "#4F46E5",
  },
  {
    id: "d9",
    slug: "insurance",
    name: "Insurance as a Financial Instrument",
    shortName: "Insurance",
    description:
      "Term vs permanent, IUL (honest analysis), disability, long-term care. What actually protects you vs what enriches the agent.",
    icon: "Umbrella",
    conceptCount: 10,
    color: "#BE185D",
  },
  {
    id: "d10",
    slug: "debt-strategy",
    name: "Debt Strategy and Credit",
    shortName: "Debt",
    description:
      "Avalanche vs snowball, mortgage vs invest, student loan strategies, credit optimization. Using debt as a tool, not a trap.",
    icon: "CreditCard",
    conceptCount: 10,
    color: "#92400E",
  },
  {
    id: "d11",
    slug: "behavioral-finance",
    name: "Behavioral Finance",
    shortName: "Behavior",
    description:
      "Loss aversion, recency bias, mental accounting, overconfidence, anchoring. The psychology that costs you more than bad investments.",
    icon: "Brain",
    conceptCount: 10,
    color: "#9333EA",
  },
  {
    id: "d12",
    slug: "career-finance",
    name: "Income and Career Finance",
    shortName: "Career",
    description:
      "Total comp analysis, negotiation, freelance rate setting, career ROI. Earning more is the most powerful financial tool.",
    icon: "GraduationCap",
    conceptCount: 10,
    color: "#0D9488",
  },
  {
    id: "d13",
    slug: "international",
    name: "International and Expat Finance",
    shortName: "International",
    description:
      "FEIE, foreign tax credit, FBAR/FATCA. The extra rules for Americans living, working, or investing abroad.",
    icon: "Globe",
    conceptCount: 3,
    color: "#1D4ED8",
  },
  {
    id: "d14",
    slug: "foundations",
    name: "Foundations for Financial Freedom",
    shortName: "Foundations",
    description:
      "The 10 most important financial truths distilled from IRS data, SEC research, and academic evidence. The bedrock principles that everything else builds on.",
    icon: "Compass",
    conceptCount: 10,
    color: "#D97706",
  },
];

export function getDomainBySlug(slug: string): Domain | undefined {
  return domains.find((d) => d.slug === slug);
}

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}
