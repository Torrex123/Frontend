// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '../store/UserStore';

export const useAuth = (redirectIfAuthenticated = false) => {
    const router = useRouter();
    const { isAuthenticated, user, token, hasHydrated } = useUserStore();

    useEffect(() => {
        if (!hasHydrated) return; 

        if (!isAuthenticated && !redirectIfAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, redirectIfAuthenticated, router, hasHydrated]);

    return { isAuthenticated, user, token };
};

export default useAuth;