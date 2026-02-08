export const localStorageService = {
    getItem(key: string): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
    },

    setItem(key: string, value: string): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
    },

    removeItem(key: string): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    },

    getAccessToken(): string | null {
        return this.getItem("accessToken");
    },

    getRefreshToken(): string | null {
        return this.getItem("refreshToken");
    },

    getUser<T = unknown>(): T | null {
        const raw = this.getItem("user");
        if (!raw) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    },

    setUser(user: unknown): void {
        this.setItem("user", JSON.stringify(user));
    },

    clearAuth(): void {
        this.removeItem("accessToken");
        this.removeItem("refreshToken");
        this.removeItem("user");
    },
};