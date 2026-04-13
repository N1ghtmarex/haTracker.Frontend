import axios from "axios";
import { buildQueryString } from "./httpHelper.service";
import type { AddTaskModel } from "../types/addTaskModel";

export async function getTaskList(searchQuery: string | null = null, limit: number | null = null,
    offset: number | null = null) : Promise<any> {
        const queryParams = {
        SearchQuery: searchQuery,
        Limit: limit,
        Offset: offset
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/task${buildQueryString(queryParams)}`);
    

    return response.data;
}

export async function addTask(request: AddTaskModel) {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/task`, {
            body: request
        }
    );

    return response.data;
}