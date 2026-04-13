import axios from "axios";
import { buildQueryString } from "./httpHelper.service";

export async function getEmojiList(searchQuery: string | null = null, limit: number | null = null,
    offset: number | null = null) : Promise<any> {
        const queryParams = {
        SearchQuery: searchQuery,
        Limit: limit,
        Offset: offset
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/emoji${buildQueryString(queryParams)}`);
    

    return response.data;
}