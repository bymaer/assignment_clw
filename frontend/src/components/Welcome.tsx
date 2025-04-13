import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Layout } from './ui/layout';

export function Welcome() {
    const { email, token, logout } = useAuth();
    const navigate = useNavigate();
    const [sessionTime, setSessionTime] = useState<number | null>(null);

    useEffect(() => {
        if (!email || !token) {
            navigate('/login');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiration = payload.exp * 1000;

            const checkExpiration = () => {
                const remaining = Math.max(0, Math.floor((expiration - Date.now()) / 1000));
                if (remaining <= 0) {
                    logout();
                    navigate('/login');
                    return;
                }
                setSessionTime(remaining);
            };

            const interval = setInterval(checkExpiration, 1000);
            checkExpiration(); // Initial check

            return () => clearInterval(interval);
        } catch (error) {
            console.error('Error parsing token:', error);
            logout();
            navigate('/login');
        }
    }, [email, token, logout, navigate]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!email || !token) return null;

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                    Hello,
                </h1>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                    {email}
                </div>



                {sessionTime !== null && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Session expires in: {formatTime(sessionTime)}
                    </div>
                )}

                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    size="lg"
                    className="w-full"
                >
                    Logout
                </Button>
            </div>
        </Layout>
    );
}