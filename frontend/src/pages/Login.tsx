import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/auth';
import { Layout } from './ui/layout';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };


    const getPasswordError = (password: string) => {
        if (password.length < 8) return 'Password must be at least 8 characters long';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
        return '';
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (!validateEmail(email)) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }

            const passwordError = getPasswordError(password);
            if (passwordError) {
                setError(passwordError);
                setIsLoading(false);
                return;
            }

            const response = await login({ email, password });
            auth.login(response.token, email);
            navigate('/welcome');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred during login';
            const errorCode = err.response?.data?.error;

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
                    setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Sign in
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full"
                            disabled={isLoading}
                            icon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-500 hover:text-gray-700"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            }
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </Layout>
    );
}