export interface AddTaskModel {
    taskTypeId: string,
    title: string,
    emojiId: string,
    colorId: string,
    trackingType: string,
    unitId: string | null,
    targetValue: number
}