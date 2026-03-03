// Money Script Assessment Quiz Engine
// 16 questions (4 per script), Likert scale scoring, dominant script detection
// Based on Klontz Money Script Inventory research

export type ScriptId = "avoidance" | "worship" | "status" | "vigilance";

export interface QuizQuestion {
  readonly id: string;
  readonly text: string;
  readonly scriptId: ScriptId;
}

export interface QuizAnswer {
  readonly questionId: string;
  readonly value: number; // 1-5 (strongly disagree to strongly agree)
}

export interface ScriptScore {
  readonly scriptId: ScriptId;
  readonly raw: number; // sum of answers (4-20)
  readonly normalized: number; // 0-100
  readonly label: string;
}

export interface QuizResult {
  readonly scores: readonly ScriptScore[];
  readonly dominant: ScriptId;
  readonly secondary: ScriptId | null;
  readonly completedAt: string;
}

// ---------------------------------------------------------------------------
// Questions (4 per script = 16 total, presented in mixed order)
// ---------------------------------------------------------------------------

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  // Avoidance
  {
    id: "a1",
    text: "I feel uncomfortable when people talk about how much money they make.",
    scriptId: "avoidance",
  },
  {
    id: "a2",
    text: "Rich people got their wealth by taking advantage of others.",
    scriptId: "avoidance",
  },
  {
    id: "a3",
    text: "I avoid looking at my bank balance or financial statements.",
    scriptId: "avoidance",
  },
  {
    id: "a4",
    text: "I feel guilty when I spend money on myself, even for things I need.",
    scriptId: "avoidance",
  },

  // Worship
  {
    id: "w1",
    text: "If I just had more money, most of my problems would go away.",
    scriptId: "worship",
  },
  {
    id: "w2",
    text: "I would be happier if I could afford to buy more things.",
    scriptId: "worship",
  },
  {
    id: "w3",
    text: "Money is what gives life meaning and purpose.",
    scriptId: "worship",
  },
  {
    id: "w4",
    text: "I often feel like I never have enough money, no matter how much I earn.",
    scriptId: "worship",
  },

  // Status
  {
    id: "s1",
    text: "I judge people's success by the car they drive or clothes they wear.",
    scriptId: "status",
  },
  {
    id: "s2",
    text: "It's important to me that others know I can afford nice things.",
    scriptId: "status",
  },
  {
    id: "s3",
    text: "I sometimes spend more than I should to keep up with my peers.",
    scriptId: "status",
  },
  {
    id: "s4",
    text: "I feel embarrassed when I can't afford what my friends are buying.",
    scriptId: "status",
  },

  // Vigilance
  {
    id: "v1",
    text: "I believe it's important to save money for a rainy day, even if it means sacrificing now.",
    scriptId: "vigilance",
  },
  {
    id: "v2",
    text: "I feel anxious if I don't have a financial cushion at all times.",
    scriptId: "vigilance",
  },
  {
    id: "v3",
    text: "I prefer not to tell others how much money I have or make.",
    scriptId: "vigilance",
  },
  {
    id: "v4",
    text: "I check my accounts or financial apps more than once a day.",
    scriptId: "vigilance",
  },
];

// Shuffled presentation order (consistent across sessions)
export const QUESTION_ORDER: readonly number[] = [
  0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15,
];

export function getOrderedQuestions(): readonly QuizQuestion[] {
  return QUESTION_ORDER.map((i) => QUIZ_QUESTIONS[i]);
}

// ---------------------------------------------------------------------------
// Likert scale labels
// ---------------------------------------------------------------------------

export const LIKERT_LABELS: readonly string[] = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

const SCRIPT_NAMES: Record<ScriptId, string> = {
  avoidance: "Money Avoidance",
  worship: "Money Worship",
  status: "Money Status",
  vigilance: "Money Vigilance",
};

function getScoreLabel(normalized: number): string {
  if (normalized >= 75) return "Very High";
  if (normalized >= 55) return "High";
  if (normalized >= 35) return "Moderate";
  if (normalized >= 15) return "Low";
  return "Very Low";
}

export function scoreQuiz(answers: readonly QuizAnswer[]): QuizResult {
  // Group answers by script
  const sums: Record<ScriptId, number> = {
    avoidance: 0,
    worship: 0,
    status: 0,
    vigilance: 0,
  };

  for (const answer of answers) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    if (question) {
      sums[question.scriptId] += answer.value;
    }
  }

  // Normalize: raw range is 4-20, map to 0-100
  const scores: ScriptScore[] = (
    Object.keys(sums) as ScriptId[]
  ).map((scriptId) => {
    const raw = sums[scriptId];
    const normalized = Math.round(((raw - 4) / 16) * 100);
    return {
      scriptId,
      raw,
      normalized,
      label: getScoreLabel(normalized),
    };
  });

  // Sort by normalized score descending
  const sorted = [...scores].sort((a, b) => b.normalized - a.normalized);
  const dominant = sorted[0].scriptId;
  const secondary =
    sorted[1].normalized >= 35 ? sorted[1].scriptId : null;

  return {
    scores: sorted,
    dominant,
    secondary,
    completedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Result interpretation
// ---------------------------------------------------------------------------

export interface ScriptInterpretation {
  readonly headline: string;
  readonly description: string;
  readonly watchFor: string;
  readonly strength: string;
}

export const SCRIPT_INTERPRETATIONS: Record<ScriptId, ScriptInterpretation> = {
  avoidance: {
    headline: "You tend to avoid engaging with money",
    description:
      "Your dominant script is rooted in beliefs that money is bad, corrupting, or that you don't deserve it. This often forms in childhoods where money was a source of conflict or where wealth was associated with moral failure.",
    watchFor:
      "Ignoring bills, not checking balances, guilt after spending, giving away money you need, sabotaging earning potential.",
    strength:
      "You're unlikely to become obsessed with accumulation. Your values extend beyond material wealth, which is genuinely healthy -- the goal is awareness, not elimination.",
  },
  worship: {
    headline: "You believe more money is the answer",
    description:
      "Your dominant script ties happiness, security, and self-worth to having more money. The goalpost always moves -- no amount ever feels like enough. This often forms when money solved visible problems in childhood.",
    watchFor:
      "Working excessive hours, neglecting relationships for earning, feeling empty after hitting financial milestones, always wanting the next raise.",
    strength:
      "You're motivated and driven. Your ambition can be channeled productively once you define what 'enough' actually looks like in concrete numbers.",
  },
  status: {
    headline: "You connect your identity to visible wealth",
    description:
      "Your dominant script ties self-worth to what others can see you own. Spending becomes performance -- a way to signal success. This often forms in environments where status was visibly rewarded or where you felt 'less than' peers.",
    watchFor:
      "Buying things to impress others, carrying high credit card balances, feeling anxious about being 'found out,' upgrading things that work fine.",
    strength:
      "You understand that presentation matters. Once you separate identity from possessions, your social awareness becomes an asset in networking and career advancement.",
  },
  vigilance: {
    headline: "You prioritize saving and financial caution",
    description:
      "Your dominant script values preparation, discretion, and saving. This is generally the healthiest script -- but it has a shadow side when taken to extremes, turning caution into anxiety and deprivation.",
    watchFor:
      "Chronic anxiety about money even when stable, guilt about any spending, inability to enjoy vacations or gifts, checking accounts obsessively.",
    strength:
      "You have natural financial discipline. You're unlikely to fall into debt traps or make impulsive purchases. Your foundation is solid -- the work is learning to enjoy it.",
  },
};

// ---------------------------------------------------------------------------
// LocalStorage persistence
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uc_quiz_result";

export function saveQuizResult(result: QuizResult): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadQuizResult(): QuizResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizResult;
  } catch {
    return null;
  }
}

export function clearQuizResult(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
