const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';

class ApiClient {
    private token: string | null = null;

    constructor() {
        // Load token from localStorage
        this.token = localStorage.getItem('auth_token');
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_URL}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    getToken(): string | null {
        return this.token;
    }

    // Auth endpoints
    async signUp(email: string, password: string) {
        const data = await this.request<{ user: any; token: string }>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data;
    }

    async signIn(email: string, password: string) {
        const data = await this.request<{ user: any; token: string }>('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data;
    }

    async signOut() {
        await this.request('/auth/signout', { method: 'POST' });
        this.setToken(null);
    }

    async getCurrentUser() {
        return this.request<{ user: any; preferences: any; progress: any }>('/auth/me');
    }

    async updateProfile(username?: string, profileImage?: string) {
        return this.request<{ user: any }>('/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify({ username, profileImage }),
        });
    }

    // Preferences endpoints
    async getPreferences() {
        return this.request<any>('/preferences');
    }

    async updatePreferences(preferences: {
        language?: string;
        theme?: string;
        notifications?: boolean;
    }) {
        return this.request<any>('/preferences', {
            method: 'PATCH',
            body: JSON.stringify(preferences),
        });
    }

    // Progress endpoints
    async getProgress() {
        return this.request<any>('/progress');
    }

    async updateProgress(progress: {
        level?: number;
        xp?: number;
        streak?: number;
        lessonsCompleted?: number;
    }) {
        return this.request<any>('/progress', {
            method: 'PATCH',
            body: JSON.stringify(progress),
        });
    }

    async getLeaderboard() {
        return this.request<any[]>('/progress/leaderboard');
    }

    // Activities endpoints
    async getActivities(limit = 50, skip = 0) {
        return this.request<{ activities: any[]; total: number; hasMore: boolean }>(
            `/activities?limit=${limit}&skip=${skip}`
        );
    }

    async createActivity(type: string, description: string, metadata?: any) {
        return this.request<any>('/activities', {
            method: 'POST',
            body: JSON.stringify({ type, description, metadata }),
        });
    }

    async getAllActivities(limit = 100, skip = 0) {
        return this.request<{ activities: any[]; total: number; hasMore: boolean }>(
            `/activities/all?limit=${limit}&skip=${skip}`
        );
    }
}

export const apiClient = new ApiClient();
