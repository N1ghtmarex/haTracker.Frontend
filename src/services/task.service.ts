import axios from "axios";
import { buildQueryString } from "./httpHelper.service";
import type { AddTaskModel } from "../types/addTaskModel";

export interface TaskListParams {
    searchQuery?: string;
    limit?: number;
    offset?: number;
    date?: string;
    taskTypeId?: string
}

export async function getTaskList(params: TaskListParams = {}): Promise<any> {
    const queryParams = {
        SearchQuery: params.searchQuery ?? null,
        Limit: params.limit ?? null,
        Offset: params.offset ?? null,
        Date: params.date ?? null,
        TaskTypeId: params.taskTypeId ?? null
    };

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task${buildQueryString(queryParams)}`
    );
    return response.data;
}

export async function addTask(request: AddTaskModel) {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/task`, {
            body: request
        }
    );

    return response.data;
}