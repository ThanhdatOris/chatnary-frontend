// Authentication service - Token management and auth API calls
// Best Practice: Access Token in memory, Refresh Token in localStorage (fallback until backend supports HttpOnly cookies)

const TOKEN_KEY = 'chatnary_refresh_token';
const USER_KEY = 'chatnary_user';

// ==================== TYPES ====================

export interface User {
    id: string;
    email: string;
    username?: string;
    name?: string;
    role: 'ADMIN' | 'USER';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// ==================== IN-MEMORY TOKEN STORAGE ====================

// Access token stored in memory only (more secure against XSS)
let inMemoryAccessToken: string | null = null;

export function getAccessToken(): string | null {
    return inMemoryAccessToken;
}

export function setAccessToken(token: string | null): void {
    inMemoryAccessToken = token;
}

// ==================== REFRESH TOKEN STORAGE ====================
// Using localStorage as fallback (ideally should be HttpOnly cookie from backend)

export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setRefreshToken(token: string | null): void {
    if (typeof window === 'undefined') return;
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

// ==================== USER STORAGE ====================

export function getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function setStoredUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
}

// ==================== TOKEN UTILITIES ====================

export function setTokens(tokens: AuthTokens): void {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
}

export function clearTokens(): void {
    setAccessToken(null);
    setRefreshToken(null);
    setStoredUser(null);
}

export function isAuthenticated(): boolean {
    // Check if we have a refresh token (access token might be expired/cleared on refresh)
    return !!getRefreshToken();
}

// Decode JWT payload without verification (client-side only)
function decodeJwtPayload(token: string): any | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.exp) return true;

    // Add 30 second buffer before actual expiry
    const expiryTime = payload.exp * 1000;
    const bufferTime = 30 * 1000;
    return Date.now() >= expiryTime - bufferTime;
}

export function getTokenExpiryTime(token: string): number | null {
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.exp) return null;
    return payload.exp * 1000;
}

// ==================== AUTH API CALLS ====================

// Remove trailing slash from base URL to prevent double slashes
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

interface BackendResponse<T> {
    statusCode: number;
    success: boolean;
    data?: T;
    message?: string | { message: string; error: string; statusCode: number };
}

// Helper to extract error message from response
function getErrorMessage(message: string | { message: string } | undefined, fallback: string): string {
    if (!message) return fallback;
    if (typeof message === 'string') return message;
    if (typeof message === 'object' && 'message' in message) return message.message;
    return fallback;
}

export async function login(credentials: LoginRequest): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const result: BackendResponse<LoginResponse> = await response.json();

        if (!result.success || !result.data) {
            return { success: false, error: getErrorMessage(result.message, 'Login failed') };
        }

        // Store tokens
        setTokens({
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
        });
        setStoredUser(result.data.user);

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
}

export async function register(credentials: RegisterRequest): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const result: BackendResponse<{ message: string }> = await response.json();

        if (!result.success) {
            return { success: false, error: getErrorMessage(result.message, 'Registration failed') };
        }

        return { success: true, message: result.data?.message };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
}

export async function refreshAccessToken(): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        return { success: false, error: 'No refresh token available' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });

        const result: BackendResponse<AuthTokens> = await response.json();

        if (!result.success || !result.data) {
            // Refresh failed - clear all tokens and redirect to login
            clearTokens();
            return { success: false, error: getErrorMessage(result.message, 'Token refresh failed') };
        }

        // Update tokens
        setTokens(result.data);

        return { success: true, accessToken: result.data.accessToken };
    } catch (error) {
        clearTokens();
        return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
}

export async function logout(): Promise<{ success: boolean }> {
    const accessToken = getAccessToken();

    try {
        if (accessToken) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        }
    } catch {
        // Ignore logout API errors
    } finally {
        clearTokens();
    }

    return { success: true };
}

// ==================== SILENT REFRESH ====================

let refreshPromise: Promise<{ success: boolean; accessToken?: string; error?: string }> | null = null;
let refreshInterval: NodeJS.Timeout | null = null;

// Ensure only one refresh request at a time
export async function silentRefresh(): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = refreshAccessToken();
    const result = await refreshPromise;
    refreshPromise = null;

    return result;
}

// Get valid access token (refresh if expired)
export async function getValidAccessToken(): Promise<string | null> {
    const accessToken = getAccessToken();

    // If no access token or expired, try to refresh
    if (!accessToken || isTokenExpired(accessToken)) {
        const result = await silentRefresh();
        if (result.success && result.accessToken) {
            return result.accessToken;
        }
        return null;
    }

    return accessToken;
}

// Start automatic token refresh interval
export function startSilentRefresh(): void {
    if (refreshInterval) return;

    // Check and refresh every 5 minutes
    refreshInterval = setInterval(async () => {
        const accessToken = getAccessToken();
        if (accessToken && isTokenExpired(accessToken)) {
            await silentRefresh();
        }
    }, 5 * 60 * 1000);
}

export function stopSilentRefresh(): void {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}
