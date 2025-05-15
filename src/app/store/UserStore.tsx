// src/store/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { registerUser, loginUser, fetchUserProfile } from '../../../api/api';

interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: any;
}

interface LoginCredentials {
    email: string;
    password: string;
    name?: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    [key: string]: any;
}

interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    hasHydrated: boolean;

    setHasHydrated: (state: boolean) => void;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean, error?: string }>;
    logout: () => void;
    register: (userData: RegisterData) => Promise<{ success: boolean, error?: string }>;
    updateUser: (userData: Partial<User>) => void;
    setToken: (token: string) => void;
    clearError: () => void;
}

const UseUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            hasHydrated: false,
            setHasHydrated: (state) => set({ hasHydrated: state }),


            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await loginUser({
                        email: credentials.email,
                        password: credentials.password
                    });

                    if (result.success && result.data) {
                        const { user, token } = result.data.data;;

                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false
                        });

                        return { success: true };
                    } else {
                        throw new Error(result.error || 'Inicio de sesión fallido');
                    }
                } catch (error: any) {
                    set({
                        error: error.message || 'Error al iniciar sesión',
                        isLoading: false
                    });
                    return { success: false, error: error.message };
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                });
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await registerUser({
                        username: userData.name,
                        email: userData.email,
                        password: userData.password
                    });

                    if (result.success && result.data) {
                        const { user, token } = result.data.data;
                        console.log('User data:', result);
                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false
                        });

                        return { success: true };
                    } else {
                        throw new Error(result.error || 'Registro fallido');
                    }
                } catch (error: any) {
                    set({
                        error: error.message || 'Error al registrar',
                        isLoading: false
                    });
                    return { success: false, error: error.message };
                }
            },

            // Add a method to fetch user profile
            fetchProfile: async () => {
                if (!get().token) return { success: false, error: 'No autenticado' };

                set({ isLoading: true });
                try {
                    const result = await fetchUserProfile();

                    if (result.success && result.data) {
                        set({
                            user: result.data.user,
                            isLoading: false
                        });
                        return { success: true };
                    } else {
                        throw new Error(result.error || 'Error al obtener el perfil');
                    }
                } catch (error: any) {
                    set({
                        error: error.message,
                        isLoading: false
                    });
                    return { success: false, error: error.message };
                }
            },

            // Existing methods remain the same
            updateUser: (userData) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...userData }
                    });
                }
            },

            setToken: (token) => {
                set({ token });
            },

            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export default UseUserStore;