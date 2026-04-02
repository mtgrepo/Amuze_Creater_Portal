import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { encryptAuthData, decryptAuthData, type CreatorDetails, type Token, type AuthData } from '@/lib/helper';
import { toast } from 'sonner';

interface AuthState {
  isAuthenticated: boolean;
  creator: CreatorDetails | null;
  token: Token | null;
}

const stored = localStorage.getItem('creator');
const initialUser: AuthData | null = stored ? decryptAuthData(stored) : null;

const initialState: AuthState = {
  creator: initialUser?.creator || null,
  token: initialUser?.token || null,
  isAuthenticated: !!initialUser?.token?.access,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ creator: CreatorDetails; token: Token }>) => {
      // 1. Check if the role_id is exactly 4
      if (action.payload.creator.role_id !== 4) {
        toast.error("Unauthorized: Access restricted to specific roles.");
        
        // Ensure state remains empty/unauthenticated
        state.creator = null;
        state.token = null;
        state.isAuthenticated = false;
        return; 
      }

      // 2. Proceed with login if role_id is 4
      state.creator = action.payload.creator;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token?.access;
      
      localStorage.setItem('creator', encryptAuthData({
        creator: action.payload.creator,
        token: action.payload.token,
        isAuthenticated: true,
      }));
    },
    logoutAction: (state) => {
      state.creator = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('creator');
    },
  },
});

export const { loginSuccess, logoutAction } = authSlice.actions;
export default authSlice.reducer;