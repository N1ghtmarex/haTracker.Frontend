import axios from "axios";
import { buildQueryString } from "./httpHelper.service";

export async function getColorList(searchQuery: string | null = null, limit: number | null = null,
    offset: number | null = null) : Promise<any> {
        const queryParams = {
        SearchQuery: searchQuery,
        Limit: limit,
        Offset: offset
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/color${buildQueryString(queryParams)}`);
    

    return response.data;
}