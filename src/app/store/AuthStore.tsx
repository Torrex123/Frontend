import { IoIosLogIn } from 'react-icons/io';
import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { sign } from 'crypto';

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLogginIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try{
            const response = await axiosInstance.get('/auth/check-auth');

            set({user: response.data.user});
        } catch (error) {
            set({user: null});
        } finally {
            set({isCheckingAuth: false});
        }
    }
  
}));