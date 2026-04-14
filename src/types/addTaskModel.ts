export interface AddTaskModel {
    taskTypeId: string,
    title: string,
    emojiId: string | null,
    colorId: string,
    trackingType: string,
    unitId: string | null,
    targetValue: number
}