import axios from "axios";
import { buildQueryString } from "./httpHelper.service";
import type { AddTaskModel } from "../types/addTaskModel";

export interface TaskListParams {
    searchQuery?: string;
    limit?: number;
    offset?: number;
    date?: string;
    taskTypeId?: string
};

export interface RequestParams {
    searchQuery?: string;
    limit?: number;
    offset?: number;
};

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

export async function completeTask(id: string, currentValue: number, date: string) {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/task/completion`, {
            body: {
                taskId: id,
                currentValue: currentValue,
                date: date
            }
        }
    );

    return response.data;
}

export async function getTypesList(request: RequestParams | null = null) {
    const queryParams = {
        SearchQuery: request?.searchQuery ?? null,
        Limit: request?.limit ?? null,
        Offset: request?.offset ?? null
    };

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/type${buildQueryString(queryParams)}`
    );

    return response.data;
}