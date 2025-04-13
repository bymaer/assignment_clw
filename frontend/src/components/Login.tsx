import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Layout } from './ui/layout';
import { Eye, EyeOff } from 'lucide-react';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        // If user is already logged in, redirect to welcome page
        if (auth.token && auth.email) {
            navigate('/welcome', { replace: true });
        }
    }, [auth.token, auth.email, navigate]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await login({ email, password });
            auth.login(response.token, email);
            navigate('/welcome');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || 'An error occurred during login');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Don't render the login form if user is already authenticated
    if (auth.token && auth.email) {
        return null;
    }

    return (
        <Layout>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Login to your account
                </h2>
                <p className="text-sm text-gray-400 pt-2">test@example.com / Test@12345</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            icon={
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="bg-background text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    {showPassword ?
                                        <EyeOff className="h-4 w-4" /> :
                                        <Eye className="h-4 w-4" />
                                    }
                                </button>
                            }
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                    Sign in
                </Button>
            </form>
        </Layout>
    );
}