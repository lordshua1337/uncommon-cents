// SM-2 Spaced Repetition Engine
// Adapted from SuperMemo SM-2 algorithm for financial concept review

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewCard {
  readonly conceptId: string;
  readonly easeFactor: number; // starts at 2.5, min 1.3
  readonly interval: number; // days until next review
  readonly repetitions: number; // consecutive correct reviews
  readonly nextReviewDate: string; // ISO date
  readonly lastReviewDate: string | null;
  readonly totalReviews: number;
}

export interface ReviewState {
  readonly cards: readonly ReviewCard[];
  readonly createdAt: string;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uncommon_cents_spaced_rep";

export function loadReviewState(): ReviewState {
  if (typeof window === "undefined") {
    return { cards: [], createdAt: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cards: [], createdAt: new Date().toISOString() };
    return JSON.parse(raw) as ReviewState;
  } catch {
    return { cards: [], createdAt: new Date().toISOString() };
  }
}

function saveReviewState(state: ReviewState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full
  }
}

// ---------------------------------------------------------------------------
// SM-2 Algorithm
// ---------------------------------------------------------------------------

export function addCard(
  state: ReviewState,
  conceptId: string
): ReviewState {
  // Don't add duplicates
  if (state.cards.some((c) => c.conceptId === conceptId)) return state;

  const card: ReviewCard = {
    conceptId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().slice(0, 10),
    lastReviewDate: null,
    totalReviews: 0,
  };

  const updated: ReviewState = {
    ...state,
    cards: [...state.cards, card],
  };
  saveReviewState(updated);
  return updated;
}

export function removeCard(
  state: ReviewState,
  conceptId: string
): ReviewState {
  const updated: ReviewState = {
    ...state,
    cards: state.cards.filter((c) => c.conceptId !== conceptId),
  };
  saveReviewState(updated);
  return updated;
}

/**
 * Process a review rating (0-5 scale from SM-2)
 * 0 = total blackout
 * 1 = incorrect, remembered on seeing answer
 * 2 = incorrect, answer seemed easy once seen
 * 3 = correct, but significant difficulty
 * 4 = correct, some hesitation
 * 5 = perfect, instant recall
 */
export function processReview(
  state: ReviewState,
  conceptId: string,
  rating: number
): ReviewState {
  const clampedRating = Math.max(0, Math.min(5, Math.round(rating)));

  const updated: ReviewState = {
    ...state,
    cards: state.cards.map((card) => {
      if (card.conceptId !== conceptId) return card;

      let newEF = card.easeFactor + (0.1 - (5 - clampedRating) * (0.08 + (5 - clampedRating) * 0.02));
      newEF = Math.max(1.3, newEF);

      let newInterval: number;
      let newReps: number;

      if (clampedRating < 3) {
        // Failed -- reset
        newReps = 0;
        newInterval = 1;
      } else {
        // Passed
        newReps = card.repetitions + 1;
        if (newReps === 1) {
          newInterval = 1;
        } else if (newReps === 2) {
          newInterval = 6;
        } else {
          newInterval = Math.round(card.interval * newEF);
        }
      }

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + newInterval);

      return {
        ...card,
        easeFactor: newEF,
        interval: newInterval,
        repetitions: newReps,
        nextReviewDate: nextDate.toISOString().slice(0, 10),
        lastReviewDate: new Date().toISOString().slice(0, 10),
        totalReviews: card.totalReviews + 1,
      };
    }),
  };

  saveReviewState(updated);
  return updated;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function getDueCards(state: ReviewState): readonly ReviewCard[] {
  const today = new Date().toISOString().slice(0, 10);
  return state.cards.filter((c) => c.nextReviewDate <= today);
}

export function getDueCount(state: ReviewState): number {
  return getDueCards(state).length;
}

export function getReviewStats(state: ReviewState): {
  total: number;
  due: number;
  mastered: number;
  learning: number;
} {
  const due = getDueCards(state).length;
  const mastered = state.cards.filter((c) => c.interval >= 21).length;
  const learning = state.cards.length - mastered;

  return {
    total: state.cards.length,
    due,
    mastered,
    learning,
  };
}
