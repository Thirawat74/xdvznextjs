"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    role: number;
    profile?: string | null;
    time: string;
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    balance?: number;
}

interface AuthContextType {
    isAuth: boolean;
    user: User | null;
    login: (token: string, user: User) => Promise<void>;
    logout: () => void;
    loading: boolean;
    validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('auth_token');
        if (token) {
            validateToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    // Periodic token validation every 5 minutes when user is authenticated
    useEffect(() => {
        if (!isAuth) return;

        const interval = setInterval(async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const response = await fetch('/api/v1/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    if (!data.success) {
                        // Token expired or invalid, logout user
                        localStorage.removeItem('auth_token');
                        setUser(null);
                        setIsAuth(false);
                    }
                } catch (error) {
                    console.error('Periodic token validation error:', error);
                    // Don't logout on network errors, just log
                }
            }
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [isAuth]);

    const validateToken = async (token?: string): Promise<boolean> => {
        const authToken = token || localStorage.getItem('auth_token');
        if (!authToken) {
            setUser(null);
            setIsAuth(false);
            setLoading(false);
            return false;
        }

        try {
            const response = await fetch('/api/v1/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.data.user);
                setIsAuth(true);
                return true;
            } else {
                // Token invalid, remove it
                localStorage.removeItem('auth_token');
                setUser(null);
                setIsAuth(false);
                return false;
            }
        } catch (error) {
            console.error('Token validation error:', error);
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAuth(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (token: string, userData: User): Promise<void> => {
        localStorage.setItem('auth_token', token);
        setUser(userData);
        setIsAuth(true);

        // Validate token immediately after login to ensure it's still valid
        const isValid = await validateToken(token);
        if (!isValid) {
            // Token invalid immediately after login, logout
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAuth(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuth(false);
    };

    const value: AuthContextType = {
        isAuth,
        user,
        login,
        logout,
        loading,
        validateToken: () => validateToken(),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
