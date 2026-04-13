import type { Author } from './author'
import type { TaskType } from './taskType'
import type { Emoji } from './emoji'
import type { Color } from './color'
import type { Unit } from './unit'

export interface Task {
    id: string,
    author: Author,
    taskType: TaskType,
    title: string,
    emoji: Emoji,
    color: Color,
    trackingType: string,
    unit: Unit,
    targetValue: number,
    currentValue: number,
    isCompleted: boolean,
    createdAt: Date,
    updatedAt: Date
}