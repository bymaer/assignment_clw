import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
            className="bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-rose-100 via-violet-100 to-teal-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-900">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 rounded-xl bg-white/80 backdrop-blur-md dark:bg-gray-950/80 p-6 shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}