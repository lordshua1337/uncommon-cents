export interface MoneyScript {
  id: string;
  name: string;
  triggerPhrase: string;
  association: "destructive" | "protective";
  description: string;
  riskPattern: string;
}

export interface ScriptCounterMove {
  scriptId: string;
  intervention: string;
  mechanism: string;
}

export interface TrackingChallenge {
  instruction: string;
  purpose: string;
  duration: number;
}

export interface MoneyScriptAssessment {
  id: string;
  title: string;
  subtitle: string;
  researchContext: {
    keyFinding: string;
    earlyFormation: string;
    source: string;
  };
  scripts: MoneyScript[];
  counterMoves: ScriptCounterMove[];
  trackingChallenge: TrackingChallenge;
}

export const moneyScripts: MoneyScript[] = [
  {
    id: "avoidance",
    name: "Money Avoidance",
    triggerPhrase:
      '"Rich people are greedy" / "Money corrupts" / "I don\'t deserve it"',
    association: "destructive",
    description:
      "A belief that money is bad, that rich people are morally suspect, or that you personally don't deserve wealth. Often rooted in childhood messages about greed, guilt, or scarcity.",
    riskPattern:
      "Avoidance leads to binge spending followed by shame followed by denial -- a repeating cycle. Can coexist with worship/status beliefs creating whiplash patterns.",
  },
  {
    id: "worship",
    name: "Money Worship",
    triggerPhrase: '"More money will finally make me feel safe/happy"',
    association: "destructive",
    description:
      "A belief that more money will solve everything -- that happiness, security, and self-worth are just one raise or windfall away. The goalpost always moves.",
    riskPattern:
      "Endless accumulation without satisfaction. Lower net worth paradox -- the pursuit undermines the goal through overwork, relationship neglect, and chronic dissatisfaction.",
  },
  {
    id: "status",
    name: "Money Status",
    triggerPhrase: '"I need the newest/best to feel legit"',
    association: "destructive",
    description:
      "A belief that self-worth is tied to visible markers of wealth. Spending becomes a performance to signal success to others.",
    riskPattern:
      "Higher revolving credit balances. External validation drives spending beyond means. Often masked as 'investing in yourself' when it's actually lifestyle inflation.",
  },
  {
    id: "vigilance",
    name: "Money Vigilance",
    triggerPhrase: '"Save, stay discreet, prepare"',
    association: "protective",
    description:
      "A belief in saving, discretion about finances, and constant preparation. Generally the healthiest script -- but has a dark side when taken to extremes.",
    riskPattern:
      "Generally protective UNLESS it becomes chronic anxiety. Then it flips to deprivation backlash -- refusing to enjoy money, guilt about spending, and paradoxically undermining long-term financial wellbeing.",
  },
];

export const counterMoves: ScriptCounterMove[] = [
  {
    scriptId: "avoidance",
    intervention: "Automation + forced visibility",
    mechanism:
      "Alerts, calendar money dates. Remove the option to not-look. Avoidance thrives in darkness -- automated visibility breaks the cycle.",
  },
  {
    scriptId: "worship",
    intervention: '"Enough number" + debt kill rules',
    mechanism:
      'Define a concrete target. "More" is infinite -- cap it. Write down what "enough" looks like in specific numbers. When you hit it, the rules change.',
  },
  {
    scriptId: "status",
    intervention: "Pre-commitment budgets + friction",
    mechanism:
      "Wishlist delay rules. 72-hour purchase delays on non-essentials. Remove saved payment methods from shopping sites. Make impulse spending structurally harder.",
  },
  {
    scriptId: "vigilance",
    intervention: "Permission to enjoy within guardrails",
    mechanism:
      'Structured "fun money" allocation so vigilance doesn\'t become deprivation backlash. Set a specific amount that is guilt-free by design.',
  },
];

export const trackingChallenge: TrackingChallenge = {
  instruction:
    "Every time you spend, avoid, or panic-check accounts, write the 5-word thought that preceded it.",
  purpose:
    "That's your money script showing itself. Making these beliefs conscious is the entry point to challenging and changing them.",
  duration: 30,
};

export const moneyScriptAssessment: MoneyScriptAssessment = {
  id: "money-scripts",
  title: "The Money Operating System You Inherited",
  subtitle:
    "Your financial behavior is shaped by scripts formed in childhood that operate largely outside awareness.",
  researchContext: {
    keyFinding:
      "Financial socialization during childhood lays a foundation associated with later financial behavior and well-being.",
    earlyFormation:
      "Children's money habits may form as early as age 7. Children as young as 5 show distinct tightwad vs spendthrift tendencies that predict real spending behavior.",
    source: "Klontz et al., Financial Planning Association; OECD; Michigan Ross",
  },
  scripts: moneyScripts,
  counterMoves,
  trackingChallenge,
};

export function getScriptById(id: string): MoneyScript | undefined {
  return moneyScripts.find((s) => s.id === id);
}

export function getCounterMoveByScriptId(
  scriptId: string
): ScriptCounterMove | undefined {
  return counterMoves.find((c) => c.scriptId === scriptId);
}
