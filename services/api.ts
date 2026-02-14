// API Service for JHL Backend Integration

const API_BASE_URL = 'http://localhost:3001/api';

// Store token in memory and localStorage
let authToken: string | null = null;

const getToken = (): string | null => {
    if (authToken) return authToken;
    if (typeof window !== 'undefined') {
        authToken = localStorage.getItem('jhl_token');
    }
    return authToken;
};

const setToken = (token: string | null) => {
    authToken = token;
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem('jhl_token', token);
        } else {
            localStorage.removeItem('jhl_token');
        }
    }
};

// Base fetch wrapper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
};

// ========== AUTH API ==========
export const authApi = {
    login: async (email: string, password: string) => {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    register: async (name: string, email: string, password: string) => {
        const data = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    demoLogin: async (role: string) => {
        const data = await apiFetch('/auth/demo-login', {
            method: 'POST',
            body: JSON.stringify({ role }),
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    getMe: async () => {
        return apiFetch('/auth/me');
    },

    logout: () => {
        setToken(null);
    },

    isLoggedIn: () => {
        return !!getToken();
    },
};

// ========== USERS API ==========
export const usersApi = {
    getAll: async () => apiFetch('/users'),
    getById: async (id: string) => apiFetch(`/users/${id}`),
    update: async (id: string, data: any) => apiFetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: async (id: string) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};

// ========== APPLICATIONS API ==========
export const applicationsApi = {
    getAll: async () => apiFetch('/applications'),
    getById: async (id: string) => apiFetch(`/applications/${id}`),
    create: async (data: any) => apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    approve: async (id: string, invoiceAmount: number) => apiFetch(`/applications/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ invoiceAmount }),
    }),
    reject: async (id: string) => apiFetch(`/applications/${id}/reject`, { method: 'POST' }),
    pay: async (id: string) => apiFetch(`/applications/${id}/pay`, { method: 'POST' }),
};

// ========== EVENTS API ==========
export const eventsApi = {
    getAll: async () => apiFetch('/events'),
    getById: async (id: string) => apiFetch(`/events/${id}`),
    create: async (data: any) => apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateStatus: async (id: string, status: string) => apiFetch(`/events/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    }),
    update: async (id: string, data: any) => apiFetch(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
};

// ========== MEALS API ==========
export const mealsApi = {
    getAll: async (filters?: { date?: string; type?: string; active?: boolean }) => {
        const params = new URLSearchParams();
        if (filters?.date) params.append('date', filters.date);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.active !== undefined) params.append('active', String(filters.active));
        const query = params.toString();
        return apiFetch(`/meals${query ? `?${query}` : ''}`);
    },
    getById: async (id: string) => apiFetch(`/meals/${id}`),
    create: async (data: any) => apiFetch('/meals', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => apiFetch(`/meals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: async (id: string) => apiFetch(`/meals/${id}`, { method: 'DELETE' }),
    rate: async (id: string, rating: number, feedback?: string) => apiFetch(`/meals/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating, feedback }),
    }),
    getHistory: async () => apiFetch('/meals/history/me'),
};

// ========== SUBSCRIPTIONS API ==========
export const subscriptionsApi = {
    getAll: async () => apiFetch('/subscriptions'),
    getById: async (id: string) => apiFetch(`/subscriptions/${id}`),
    create: async (data: any) => apiFetch('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => apiFetch(`/subscriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    cancel: async (id: string) => apiFetch(`/subscriptions/${id}/cancel`, { method: 'POST' }),
    // Admin methods
    adminGetAll: async () => apiFetch('/subscriptions/admin/all'),
    adminAssign: async (data: any) => apiFetch('/subscriptions/admin/assign', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    adminUpdate: async (id: string, data: any) => apiFetch(`/subscriptions/admin/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    adminDelete: async (id: string) => apiFetch(`/subscriptions/admin/${id}`, {
        method: 'DELETE',
    }),
};

// ========== MEAL ASSIGNMENTS API ==========
export const mealAssignmentsApi = {
    // User methods
    getMy: async () => apiFetch('/meal-assignments/my'),
    getUpcoming: async () => apiFetch('/meal-assignments/upcoming'),
    // Admin methods
    adminGetAll: async () => apiFetch('/meal-assignments/admin/all'),
    adminGetByUser: async (userId: string) => apiFetch(`/meal-assignments/admin/user/${userId}`),
    adminAssign: async (data: any) => apiFetch('/meal-assignments/admin/assign', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    adminAssignBulk: async (userId: string, assignments: any[]) => apiFetch('/meal-assignments/admin/assign-bulk', {
        method: 'POST',
        body: JSON.stringify({ userId, assignments }),
    }),
    adminUpdate: async (id: string, data: any) => apiFetch(`/meal-assignments/admin/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    adminDelete: async (id: string) => apiFetch(`/meal-assignments/admin/${id}`, {
        method: 'DELETE',
    }),
};
// ========== EMPLOYEES API ==========
export const employeesApi = {
    getAll: async () => apiFetch('/employees'),
    getById: async (id: string) => apiFetch(`/employees/${id}`),
    create: async (data: any) => apiFetch('/employees', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => apiFetch(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: async (id: string) => apiFetch(`/employees/${id}`, { method: 'DELETE' }),
};

// ========== INVOICES API ==========
export const invoicesApi = {
    getAll: async () => apiFetch('/invoices'),
    getById: async (id: string) => apiFetch(`/invoices/${id}`),
    create: async (data: any) => apiFetch('/invoices', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateStatus: async (id: string, status: string) => apiFetch(`/invoices/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    }),
};

// ========== SUPPORT API ==========
export const supportApi = {
    getAll: async () => apiFetch('/support'),
    getById: async (id: string) => apiFetch(`/support/${id}`),
    create: async (subject: string, message: string) => apiFetch('/support', {
        method: 'POST',
        body: JSON.stringify({ subject, message }),
    }),
    update: async (id: string, message: string) => apiFetch(`/support/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ message }),
    }),
    resolve: async (id: string) => apiFetch(`/support/${id}/resolve`, { method: 'POST' }),
};

// Export all APIs
export default {
    auth: authApi,
    users: usersApi,
    applications: applicationsApi,
    events: eventsApi,
    meals: mealsApi,
    subscriptions: subscriptionsApi,
    employees: employeesApi,
    invoices: invoicesApi,
    support: supportApi,
};
