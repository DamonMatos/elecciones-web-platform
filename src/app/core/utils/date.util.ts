export class DateUtil {
    /**
     * Convierte una fecha (Date o string) al formato ISO yyyy-MM-dd
     */
    static toIsoDate(date: string | Date | null | undefined): string | null {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0];
    }

    /**
     * Convierte una fecha ISO en formato legible local (para mostrar en inputs o vistas)
     */
    static toLocalDate(isoDate: string | null | undefined): string | null {
        if (!isoDate) return null;
        const d = new Date(isoDate);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleDateString('es-PE');
    }

    static parseFromDdMmYyyy(value: string): Date {
        if (!value) throw new Error('La fecha no puede ser nula o vacía.');

        const parts = value.split('/');
        if (parts.length !== 3) {
            throw new Error(`Formato de fecha inválido: ${value}. Se esperaba "dd/MM/yyyy".`);
        }

        const [dayStr, monthStr, yearStr] = parts;
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);

        // Validaciones básicas
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            throw new Error(`La fecha contiene valores no numéricos: ${value}`);
        }
        if (month < 1 || month > 12) {
            throw new Error(`Mes inválido: ${month} en ${value}`);
        }
        if (day < 1 || day > 31) {
            throw new Error(`Día inválido: ${day} en ${value}`);
        }

        const date = new Date(year, month - 1, day);

        // Validar coherencia (ej. 31/02/2025)
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
            throw new Error(`Fecha inválida o inexistente: ${value}`);
        }

        return date;
    }

    /**
     * Convierte un objeto Date al formato "yyyy-MM-dd" (aceptado por la mayoría de backends).
     * @param date Objeto Date.
     * @returns String en formato "yyyy-MM-dd".
     */
    static toBackendFormat(date: Date): string {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error('El valor proporcionado no es una fecha válida.');
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    static obtenerFechaHoyIso(): string {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }
}