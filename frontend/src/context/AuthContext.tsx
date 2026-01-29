import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    _id: string;
    email: string;
    name: string;
    isProfileComplete: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            } else {
                setUser(null);
                localStorage.removeItem('token');
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData: any) => {
        if (userData.token) localStorage.setItem('token', userData.token);
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
