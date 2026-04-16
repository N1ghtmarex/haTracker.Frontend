import type { Color } from "./color";
import type { Completion } from "./completion";
import type { Emoji } from "./emoji";

export interface TaskCompletion {
    id: string,
    title: string,
    emoji: Emoji,
    color: Color,
    targetValue: number,
    maxStreak: number,
    currentStreak: number,
    completions: Completion[]
}