import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Layout } from './ui/layout';

export function Welcome() {
    const { email, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!email) return null;

    return (
        <Layout>
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                Hello, {email}
            </h1>
            <Button
                onClick={handleLogout}
                variant="destructive"
                size="lg"
                className="mt-8"
            >
                Logout
            </Button>
        </Layout>
    );
}