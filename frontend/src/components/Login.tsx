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
            error?: string;
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
        if (auth.token && auth.email) {
            navigate('/welcome', { replace: true });
        }
    }, [auth.token, auth.email, navigate]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string) => {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

        if (!hasMinLength) return 'Password must be at least 8 characters long';
        if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
        if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
        if (!hasNumbers) return 'Password must contain at least one number';
        if (!hasSpecialChar) return 'Password must contain at least one special character';
        return '';
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            const response = await login({ email, password });
            auth.login(response.token, email);
            navigate('/welcome');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            const errorCode = apiError.response?.data?.error;
            const errorMessage = apiError.response?.data?.message;

            switch (errorCode) {
                case 'INVALID_CREDENTIALS':
                    setError('Invalid email or password');
                    break;
                case 'ACCOUNT_LOCKED':
                    setError('Account is temporarily locked. Please try again later');
                    break;
                case 'MISSING_FIELDS':
                    setError('Please fill in all fields');
                    break;
                default:
                    setError(errorMessage || 'An error occurred during login');
            }
        }
    };

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
                                    onClick={() => setShowPassword(!showPassword)}
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