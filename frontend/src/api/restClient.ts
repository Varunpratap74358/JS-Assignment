const API_URL = import.meta.env.VITE_API_BASE_URL;

export const restRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
    }
    return result; // Return full object { success, data, pagination, etc. }
};

// General
export const getProfileRest = () => restRequest('/profile');

// Search & Projects
export const searchProfilesRest = (query: string, page = 1, limit = 6) =>
    restRequest(`/search?q=${query}&page=${page}&limit=${limit}`);

export const getProjectsRest = (skill: string, page = 1, limit = 6) =>
    restRequest(`/projects?skill=${skill}&page=${page}&limit=${limit}`);

// Profile update (POST /api/profile)
export const updateProfileRest = (data: any) =>
    restRequest('/profile', { method: 'POST', body: JSON.stringify(data) });

// Projects CRUD
export const addProjectRest = (data: any) =>
    restRequest('/projects', { method: 'POST', body: JSON.stringify(data) });

export const updateProjectRest = (id: string, data: any) =>
    restRequest(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteProjectRest = (id: string) =>
    restRequest(`/projects/${id}`, { method: 'DELETE' });

// Work Experience CRUD
export const addWorkRest = (data: any) =>
    restRequest('/work', { method: 'POST', body: JSON.stringify(data) });

export const updateWorkRest = (id: string, data: any) =>
    restRequest(`/work/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteWorkRest = (id: string) =>
    restRequest(`/work/${id}`, { method: 'DELETE' });
