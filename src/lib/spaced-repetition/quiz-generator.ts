// Quiz Generator -- creates multiple-choice review questions from concept data

import { concepts, type FinancialConcept } from "@/lib/concepts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewQuestion {
  readonly conceptId: string;
  readonly conceptName: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly explanation: string;
}

// ---------------------------------------------------------------------------
// Question templates
// ---------------------------------------------------------------------------

type QuestionBuilder = (concept: FinancialConcept, allConcepts: readonly FinancialConcept[]) => ReviewQuestion | null;

const builders: readonly QuestionBuilder[] = [
  // "What is..." definition question
  (concept, allConcepts) => {
    const domainPeers = allConcepts.filter(
      (c) => c.domainId === concept.domainId && c.id !== concept.id
    );
    if (domainPeers.length < 2) return null;

    const shuffled = [...domainPeers].sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3).map((c) => c.summary.split(".")[0] + ".");
    const correct = concept.summary.split(".")[0] + ".";

    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

    return {
      conceptId: concept.id,
      conceptName: concept.name,
      question: `Which best describes "${concept.name}"?`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: concept.summary,
    };
  },

  // "Which domain..." classification question
  (concept, allConcepts) => {
    const domains = [...new Set(allConcepts.map((c) => c.domainId))];
    if (domains.length < 4) return null;

    const correctDomain = concept.domainId;
    const otherDomains = domains
      .filter((d) => d !== correctDomain)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const domainLabels: Record<string, string> = {
      d1: "Tax-Advantaged Accounts",
      d2: "Equity Compensation",
      d3: "Real Estate",
      d4: "Business & Self-Employment",
      d5: "Retirement Planning",
      d6: "Investing",
      d7: "Estate Planning",
      d8: "Insurance",
      d9: "Debt Management",
      d10: "Behavioral Finance",
      d11: "Career & Income",
      d12: "Fraud & Protection",
    };

    const options = [correctDomain, ...otherDomains]
      .map((d) => domainLabels[d] ?? d)
      .sort(() => Math.random() - 0.5);

    const correctLabel = domainLabels[correctDomain] ?? correctDomain;

    return {
      conceptId: concept.id,
      conceptName: concept.name,
      question: `"${concept.name}" belongs to which domain?`,
      options,
      correctIndex: options.indexOf(correctLabel),
      explanation: `This concept is part of the ${correctLabel} domain.`,
    };
  },

  // "True or false" style (presented as 2-option)
  (concept) => {
    const firstSentence = concept.layers.accessible.split(".")[0] + ".";
    if (firstSentence.length < 20) return null;

    // Create a false version by negating or changing key words
    const falsified = firstSentence
      .replace(/tax-free/i, "fully taxable")
      .replace(/deductible/i, "non-deductible")
      .replace(/advantage/i, "disadvantage")
      .replace(/reduces/i, "increases")
      .replace(/lower/i, "higher");

    // If we couldn't meaningfully change it, skip
    if (falsified === firstSentence) return null;

    const isTrue = Math.random() > 0.5;
    const statement = isTrue ? firstSentence : falsified;

    const options = ["True", "False"];
    const correctIndex = isTrue ? 0 : 1;

    return {
      conceptId: concept.id,
      conceptName: concept.name,
      question: `True or False: ${statement}`,
      options,
      correctIndex,
      explanation: firstSentence,
    };
  },
];

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export function generateQuestion(conceptId: string): ReviewQuestion | null {
  const concept = concepts.find((c) => c.id === conceptId);
  if (!concept) return null;

  // Try each builder in random order
  const shuffledBuilders = [...builders].sort(() => Math.random() - 0.5);

  for (const builder of shuffledBuilders) {
    const question = builder(concept, concepts);
    if (question) return question;
  }

  // Fallback: simple recall
  return {
    conceptId: concept.id,
    conceptName: concept.name,
    question: `Can you recall the key idea behind "${concept.name}"?`,
    options: ["I remember it clearly", "I remember some of it", "I don't remember", "I've never seen this"],
    correctIndex: 0,
    explanation: concept.summary,
  };
}

export function generateBatchQuestions(
  conceptIds: readonly string[],
  maxQuestions: number = 10
): readonly ReviewQuestion[] {
  const questions: ReviewQuestion[] = [];

  for (const id of conceptIds) {
    if (questions.length >= maxQuestions) break;
    const q = generateQuestion(id);
    if (q) questions.push(q);
  }

  return questions;
}
