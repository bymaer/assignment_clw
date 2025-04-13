import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    email: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [email, setEmail] = useState<string | null>(localStorage.getItem('userEmail'));

    const login = (token: string, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        setToken(token);
        setEmail(email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setToken(null);
        setEmail(null);
    };

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (Date.now() >= payload.exp * 1000) {
                    logout();
                }
            } catch (error) {
                logout();
            }
        }
    }, [token]); // Зависимость только от токена

    return (
        <AuthContext.Provider value={{ token, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}