export interface PaginatedResponse<T> {
    items: T[];
    totalRegistros: number;
    page: number;
    limit: number;
}