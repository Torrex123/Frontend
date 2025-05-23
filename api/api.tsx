import axios from 'axios';
import { LANGUAGES } from '@/app/components/LanguageSelector';

const pistonApi = axios.create({
    baseURL: 'https://emkc.org/api/v2/piston',
});

const authApi = axios.create({
    baseURL: 'http://crypto-playground.eastus.cloudapp.azure.com:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

authApi.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('user-storage');
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    const token = parsed?.state?.token;
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (err) {
                    console.warn('Error al extraer el token del local storage', err);
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const runCode = async (language: string, code: string) => {
    try {
        const response = await pistonApi.post('/execute', {
            "language": language,
            "version": LANGUAGES[language],
            "files": [
                {
                    "content": code
                }
            ],
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const registerUser = async (userData: { username: string, email: string, password: string }) => {
    try {
        const response = await authApi.post('/auth/register', userData);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al registrar el usuario',
        };
    }
};

export const loginUser = async (credentials: { email: string, password: string }) => {
    try {
        const response = await authApi.post('/auth/login', credentials);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Inicio de sesión fallido',
        };
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await authApi.get('/auth/me');
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener el perfil de usuario',
        };
    }
};

export const updateUserProfile = async (userData: { username: string, email: string, password: string }) => {
    try {
        const payload: Partial<typeof userData> = {};
        if (userData.username.trim()) payload.username = userData.username;
        if (userData.email.trim()) payload.email = userData.email;
        if (userData.password.trim()) payload.password = userData.password;
        console.log('Payload:', payload);
        const response = await authApi.put('/users/profile', payload);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al actualizar el perfil',
        };
    }
};

export const uploadProfileImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await authApi.post('/users/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al subir la imagen de perfil',
        };
    }
};

export const deteleUser = async () => {
    try {
        const response = await authApi.delete('/users');
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al eliminar el usuario',
        };
    }
}

export const loadUserHome = async () => {
    try {
        const response = await authApi.get('/users/modules');
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al cargar la página de inicio',
        };
    }
}

export const startModule = async (moduleId: string) => {
    try {
        const response = await authApi.post(`/modules/${moduleId}/start`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al iniciar el módulo',
        };
    }
};

export const completeModule = async (moduleId: string) => {
    try {
        const response = await authApi.post(`/modules/${moduleId}/complete`);
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al iniciar el módulo',
        };
    }
};

export const getSubModule = async (moduleId: string) => {
    try {
        const response = await authApi.get(`/submodules/${moduleId}`);
        return { success: true, data: response.data };
    }
    catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener los submódulos',
        };
    }
}

export const startSubModule = async (moduleId: string) => {
    try {
        const response = await authApi.post(`/submodules/${moduleId}/start`);
        return { success: true, data: response.data };
    }
    catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener los submódulos',
        };
    }
}


export const completeSubModule = async (moduleId: string) => {
    try {
        const response = await authApi.post(`/submodules/${moduleId}/complete`);
        return { success: true, data: response.data };
    }
    catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener los submódulos',
        };
    }
}

export const getChallenges = async () => {
    try {
        const response = await authApi.get(`/challenges`);
        return { success: true, data: response.data };
    }
    catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener los submódulos',
        };
    }
}