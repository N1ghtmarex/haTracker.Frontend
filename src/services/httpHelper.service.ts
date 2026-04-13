export function buildQueryString(params: Record<string, any>): string {
    const parts = Object.keys(params)
        .filter(key => params[key] != null && params[key] !== '') // фильтрация null, undefined и пустых строк
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

    return parts.length > 0 ? `?${parts.join('&')}` : '';
}