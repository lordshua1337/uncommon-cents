export interface LoopStep {
  order: number;
  action: string;
  linkedModules: string[];
  description: string;
}

export interface OperatingLoop {
  steps: LoopStep[];
  principle: string;
}

export const operatingLoop: OperatingLoop = {
  principle:
    "The trap isn't that people don't know. It's that people don't have a system that survives stress, temptation, and life randomness.",
  steps: [
    {
      order: 1,
      action:
        "Identify your money script (avoidance, worship, status, vigilance). Design around your predictable weaknesses.",
      linkedModules: ["money-scripts"],
      description:
        "Before any strategy works, you need to understand the behavioral operating system running underneath. Your money script predicts where you'll self-sabotage.",
    },
    {
      order: 2,
      action:
        "Eliminate mandatory-payment fragility first. Debt-service-ratio thinking.",
      linkedModules: ["debt-service-ratio-attack"],
      description:
        "Required payments are the measure of financial fragility. Reduce the ratio of mandatory payments to income before optimizing anything else.",
    },
    {
      order: 3,
      action:
        "Max out legal tax shelters that match your life stage.",
      linkedModules: [
        "mega-backdoor-roth",
        "plan-turbo-stack",
        "529-estate-freeze",
      ],
      description:
        "Tax-advantaged accounts are the highest-certainty wealth accelerators available. Which ones matter depends on your age, income, and employment situation.",
    },
    {
      order: 4,
      action:
        "Run a tax-aware investing system (fees down, losses harvested, wash-sale discipline).",
      linkedModules: ["tax-alpha-engine", "basis-reset-year"],
      description:
        "After-tax returns are what pay for your life. Fees and taxes are the two largest controllable leaks in any portfolio.",
    },
    {
      order: 5,
      action:
        "Buy insurance where downside is life-altering (liability, disability).",
      linkedModules: ["liability-income-barbell"],
      description:
        "Insure catastrophic risks that can permanently derail wealth creation. Self-insure small risks. Stop buying insurance as an investment.",
    },
    {
      order: 6,
      action:
        "Install fraud armor -- the internet is not polite society.",
      linkedModules: [
        "credit-freeze",
        "phishing-resistant-mfa",
        "phone-lockdown",
        "sacrificial-card",
        "push-alerts",
        "family-safe-phrase",
        "encrypted-app-red-flag",
        "no-go-payments",
        "recovery-rails",
        "data-minimization",
      ],
      description:
        "FTC reported consumer fraud losses over $12.5B in 2024. AI tools have accelerated impersonation. Layered defenses are not optional.",
    },
  ],
};
