// Life Stage Learning Paths -- type definitions
// All interfaces use readonly fields. All state is immutable.

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

export interface LifeStage {
  readonly id: string;               // "ls-1" through "ls-8"
  readonly slug: string;             // "move-out", "career-start", etc.
  readonly number: number;           // 1-8
  readonly title: string;            // "You Move Out"
  readonly tagline: string;          // Irreverent subtitle
  readonly description: string;      // 2-3 sentence overview
  readonly accentColor: string;      // Primary hex
  readonly accentColorLight: string; // Lighter tint for backgrounds
  readonly icon: string;             // Lucide icon name
  readonly estimatedMinutes: number; // Sum of lesson estimates
  readonly lessons: readonly StageLesson[];
}

export interface StageLesson {
  readonly id: string;               // "ls-1-01" format
  readonly type: "concept" | "stage-lesson";
  readonly conceptSlug?: string;     // Only when type="concept"
  readonly title: string;
  readonly summary: string;          // 1-2 sentences
  readonly isQuickWin: boolean;      // First lesson flag
  readonly isBossLesson: boolean;    // Last lesson flag
  readonly estimatedMinutes: number;
  readonly content?: StageLessonContent; // Only when type="stage-lesson"
}

export interface StageLessonContent {
  readonly body: string;                        // Main lesson text
  readonly keyTakeaways: readonly string[];     // 3-5 bullet points
  readonly actionItem: string;                  // One specific thing to do TODAY
  readonly proTip?: string;                     // Optional insider tip
}

// ---------------------------------------------------------------------------
// Progress types
// ---------------------------------------------------------------------------

export interface StageProgress {
  readonly stageId: string;
  readonly lessonsCompleted: readonly string[]; // lesson IDs
  readonly startedAt: string;                   // ISO date
  readonly completedAt?: string;                // ISO date -- null if in progress
  readonly currentLessonIndex: number;
}

export interface LifeStageState {
  readonly activeStageId: string | null;
  readonly stages: readonly StageProgress[];
  readonly graduatedStages: readonly string[];  // stage IDs
}
