'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi, logout as logoutApi } from '@/services/auth/auth.service';
import { usePathname, useRouter } from 'next/navigation';
import { IUser } from '@/types/user';

type AuthContextType = {
    user: IUser | null;
    loading: boolean;
    login: (login: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<IUser>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        getMe()
        .then(setUser)
        .catch(() => {
            setUser(null);

            if (pathname === '/register') return;
            
            const link = pathname === '/login' || pathname === '/'
                ? '/login' 
                : `/login?next=${encodeURIComponent(pathname)}`
            router.push(link);
        })
        .finally(() => setLoading(false));
    }, []);

    async function login(loginStr: string, password: string) {
        await loginApi(loginStr, password);
        const me = await getMe();
        setUser(me);
    };

    async function logout() {
        await logoutApi();
        setUser(null);
    };

    function updateUser(data: Partial<IUser>) {
        setUser((prev) => (prev ? { ...prev, ...data } : prev));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};