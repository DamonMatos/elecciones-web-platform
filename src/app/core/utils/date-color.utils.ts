/** Convierte cualquier fecha a formato YYYY-MM-DD para input[type="date"] */
// export function toInputDate(value: string | null | undefined): string {
//     if (!value) return '';

//     const date = new Date(value);
//     if (isNaN(date.getTime())) return '';

//     // Evita desfase de zona horaria
//     const yyyy = date.getUTCFullYear();
//     const mm   = String(date.getUTCMonth() + 1).padStart(2, '0');
//     const dd   = String(date.getUTCDate()).padStart(2, '0');

//     return `${yyyy}-${mm}-${dd}`;
// }

    export function toInputDate(value: string | null | undefined): string {
        if (!value) return '';

        // Caso 1: formato ISO "2026-04-02T00:00:00" o "2026-04-02"
        if (value.includes('T') || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return value.split('T')[0];
        }

        // Caso 2: formato "D/MM/YYYY HH:mm:ss" o "D/MM/YYYY" (día primero)
        if (value.includes('/')) {
            const soloFecha = value.split(' ')[0]; // quita " 00:00:00"
            const partes = soloFecha.split('/');   // ["2", "04", "2026"]

            if (partes.length !== 3) return '';

            const [dia, mes, anio] = partes; // ✅ día primero

            const dd = dia.padStart(2, '0');
            const mm = mes.padStart(2, '0');

            return `${anio}-${mm}-${dd}`; // "2026-04-02"
        }

        return '';
    }

    /** Asegura que el color tenga formato #RRGGBB para input[type="color"] */
    export function toInputColor(value: string | null | undefined): string {
        if (!value) return '#000000';

        // Ya tiene formato correcto
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value;

        // Sin # → agregar
        if (/^[0-9A-Fa-f]{6}$/.test(value)) return `#${value}`;

        return '#000000'; // fallback
    }