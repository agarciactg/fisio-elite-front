import type { UserRole } from "../services/api";

export function getToken(): string | null {
    return localStorage.getItem('fisio_token') ?? sessionStorage.getItem('fisio_token');
}

export function clearToken() {
    localStorage.removeItem('fisio_token');
    sessionStorage.removeItem('fisio_token');
    localStorage.removeItem('fisio_role');
    sessionStorage.removeItem('fisio_role');
}

function decodeJwtPayload(token: string): Record<string, any> | null {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

export function getRole(): UserRole | null {
    const token = getToken();
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    return (payload?.role as UserRole) ?? null;
}


export function getTokenInfo(): { role: UserRole, name: string, email: string } | null {
    const token = getToken();
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    return {
        role: payload?.role as UserRole,
        name: payload?.name as string,
        email: payload?.email as string
    };
}
