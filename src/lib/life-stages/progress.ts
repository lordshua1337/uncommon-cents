// Life Stage progress tracking -- localStorage-backed, immutable state
// Follows exact same pattern as src/lib/mastery.ts
// All operations return new state objects, never mutate

import type { StageProgress, LifeStageState } from "./types";
import { lifeStages } from "./stages";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uncommon-cents-life-stages";

const DEFAULT_STATE: LifeStageState = {
  activeStageId: null,
  stages: [],
  graduatedStages: [],
};

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

export function loadStageProgress(): LifeStageState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as LifeStageState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveStageProgress(state: LifeStageState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full -- fail silently, state is still valid in memory
  }
}

// ---------------------------------------------------------------------------
// State operations (immutable -- all return new state)
// ---------------------------------------------------------------------------

export function startStage(
  state: LifeStageState,
  stageId: string,
): LifeStageState {
  // Already started this stage? Just set it as active
  const existing = state.stages.find((s) => s.stageId === stageId);
  if (existing) {
    return { ...state, activeStageId: stageId };
  }

  const newProgress: StageProgress = {
    stageId,
    lessonsCompleted: [],
    startedAt: new Date().toISOString(),
    currentLessonIndex: 0,
  };

  return {
    ...state,
    activeStageId: stageId,
    stages: [...state.stages, newProgress],
  };
}

export function completeLesson(
  state: LifeStageState,
  stageId: string,
  lessonId: string,
): LifeStageState {
  const stageProgress = state.stages.find((s) => s.stageId === stageId);

  if (!stageProgress) {
    // Stage not started yet -- start it and mark lesson complete
    const started = startStage(state, stageId);
    return completeLesson(started, stageId, lessonId);
  }

  // Already completed this lesson? No-op
  if (stageProgress.lessonsCompleted.includes(lessonId)) {
    return state;
  }

  const stage = lifeStages.find((s) => s.id === stageId);
  const lessonIdx = stage
    ? stage.lessons.findIndex((l) => l.id === lessonId)
    : -1;
  const nextLessonIndex = Math.max(
    stageProgress.currentLessonIndex,
    lessonIdx + 1,
  );

  const updatedProgress: StageProgress = {
    ...stageProgress,
    lessonsCompleted: [...stageProgress.lessonsCompleted, lessonId],
    currentLessonIndex: nextLessonIndex,
  };

  const updatedStages = state.stages.map((s) =>
    s.stageId === stageId ? updatedProgress : s,
  );

  // Check if this completes the stage
  const totalLessons = stage?.lessons.length ?? 0;
  const completedCount = updatedProgress.lessonsCompleted.length;
  const isNowGraduated =
    totalLessons > 0 &&
    completedCount >= totalLessons &&
    !state.graduatedStages.includes(stageId);

  if (isNowGraduated) {
    const graduatedProgress: StageProgress = {
      ...updatedProgress,
      completedAt: new Date().toISOString(),
    };
    return {
      ...state,
      stages: state.stages.map((s) =>
        s.stageId === stageId ? graduatedProgress : s,
      ),
      graduatedStages: [...state.graduatedStages, stageId],
    };
  }

  return { ...state, stages: updatedStages };
}

export function setActiveStage(
  state: LifeStageState,
  stageId: string | null,
): LifeStageState {
  return { ...state, activeStageId: stageId };
}

// ---------------------------------------------------------------------------
// Queries (pure, no side effects)
// ---------------------------------------------------------------------------

export function isStageGraduated(
  state: LifeStageState,
  stageId: string,
): boolean {
  return state.graduatedStages.includes(stageId);
}

export function isStageStarted(
  state: LifeStageState,
  stageId: string,
): boolean {
  return state.stages.some((s) => s.stageId === stageId);
}

export function isLessonCompleted(
  state: LifeStageState,
  stageId: string,
  lessonId: string,
): boolean {
  const progress = state.stages.find((s) => s.stageId === stageId);
  if (!progress) return false;
  return progress.lessonsCompleted.includes(lessonId);
}

export function getActiveStage(state: LifeStageState): string | null {
  return state.activeStageId;
}

export function getGraduatedCount(state: LifeStageState): number {
  return state.graduatedStages.length;
}

export function getStageProgressById(
  state: LifeStageState,
  stageId: string,
): StageProgress | undefined {
  return state.stages.find((s) => s.stageId === stageId);
}

export function getStageLessonCompletionCount(
  state: LifeStageState,
  stageId: string,
): number {
  const progress = state.stages.find((s) => s.stageId === stageId);
  return progress?.lessonsCompleted.length ?? 0;
}

export function getStageCompletionPercent(
  state: LifeStageState,
  stageId: string,
): number {
  const stage = lifeStages.find((s) => s.id === stageId);
  if (!stage || stage.lessons.length === 0) return 0;

  const completed = getStageLessonCompletionCount(state, stageId);
  return Math.round((completed / stage.lessons.length) * 100);
}

export function getTotalLessonsCompleted(state: LifeStageState): number {
  return state.stages.reduce(
    (sum, sp) => sum + sp.lessonsCompleted.length,
    0,
  );
}

export function getQuickWinsCompleted(state: LifeStageState): number {
  let count = 0;
  for (const stage of lifeStages) {
    const quickWin = stage.lessons.find((l) => l.isQuickWin);
    if (quickWin && isLessonCompleted(state, stage.id, quickWin.id)) {
      count++;
    }
  }
  return count;
}

export function getBossLessonsCompleted(state: LifeStageState): number {
  let count = 0;
  for (const stage of lifeStages) {
    const bossLesson = stage.lessons.find((l) => l.isBossLesson);
    if (bossLesson && isLessonCompleted(state, stage.id, bossLesson.id)) {
      count++;
    }
  }
  return count;
}

export function getNextUncompletedLesson(
  state: LifeStageState,
  stageId: string,
): string | null {
  const stage = lifeStages.find((s) => s.id === stageId);
  if (!stage) return null;

  const progress = state.stages.find((s) => s.stageId === stageId);
  const completed = new Set(progress?.lessonsCompleted ?? []);

  for (const lesson of stage.lessons) {
    if (!completed.has(lesson.id)) return lesson.id;
  }

  return null; // All lessons complete
}
