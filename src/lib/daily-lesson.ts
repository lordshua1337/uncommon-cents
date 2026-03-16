// Daily lesson rotation for Uncommon Cents
// Cycles through all 132 concepts deterministically
// Generates a quiz question from each concept's data

import { concepts, type FinancialConcept } from "./concepts";
import { domains } from "./domains";

export interface QuizOption {
  readonly text: string;
  readonly isCorrect: boolean;
}

export interface DailyLesson {
  readonly concept: FinancialConcept;
  readonly domainName: string;
  readonly domainColor: string;
  readonly question: string;
  readonly options: readonly QuizOption[];
  readonly explanation: string;
  readonly dayIndex: number;
  readonly totalConcepts: number;
}

function getDaysSinceEpoch(): number {
  const epoch = new Date(2026, 0, 1).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - epoch) / 86400000);
}

// Deterministic pseudo-random from day index (for shuffling options)
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function shuffleWithSeed<T>(arr: readonly T[], seed: number): T[] {
  const result = [...arr];
  const rng = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateQuestion(
  concept: FinancialConcept,
  dayIndex: number,
): { question: string; options: QuizOption[]; explanation: string } {
  // Get 3 wrong answers from other concepts in different domains
  const otherConcepts = concepts.filter((c) => c.id !== concept.id);
  const rng = seededRandom(dayIndex * 31337);

  // Shuffle others deterministically
  const shuffled = shuffleWithSeed(otherConcepts, dayIndex);

  // Extract the core insight from the summary (first sentence or phrase)
  const correctAnswer = concept.summary.split(".")[0].trim();

  // Pick 3 distractors from different concepts' summaries
  const distractors = shuffled
    .slice(0, 3)
    .map((c) => c.summary.split(".")[0].trim());

  const allOptions: QuizOption[] = [
    { text: correctAnswer, isCorrect: true },
    ...distractors.map((text) => ({ text, isCorrect: false })),
  ];

  // Shuffle options deterministically so correct answer isn't always first
  const shuffledOptions = shuffleWithSeed(allOptions, dayIndex + 7919);

  // Question based on concept name
  const question = `What is the key insight behind "${concept.name}"?`;

  // Explanation from the accessible layer (first 2 sentences)
  const sentences = concept.layers.accessible.match(/[^.!?]+[.!?]+/g) || [
    concept.layers.accessible,
  ];
  const explanation = sentences.slice(0, 2).join(" ").trim();

  return { question, options: shuffledOptions, explanation };
}

export function getDailyLesson(): DailyLesson {
  const totalConcepts = concepts.length;
  const dayIndex = getDaysSinceEpoch() % totalConcepts;
  const concept = concepts[dayIndex];
  const domain = domains.find((d) => d.id === concept.domainId);

  const { question, options, explanation } = generateQuestion(
    concept,
    dayIndex,
  );

  return {
    concept,
    domainName: domain?.shortName ?? "Finance",
    domainColor: domain?.color ?? "#2C5F7C",
    question,
    options,
    explanation,
    dayIndex,
    totalConcepts,
  };
}

export function getConceptProgress(): number {
  // Returns percentage of total concepts covered so far
  const daysSinceEpoch = getDaysSinceEpoch();
  const covered = Math.min(daysSinceEpoch, concepts.length);
  return Math.round((covered / concepts.length) * 100);
}
