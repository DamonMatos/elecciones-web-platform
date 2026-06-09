export function normalizeQueryParams<T extends Record<string, any>>(params: T): Record<string, string> {
    const result: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
        // Solo agregamos valores que no sean null ni undefined
        if (value !== null && value !== undefined) {
            result[key] = String(value); // Convertimos todo a string
        }
    });

    return result;
}