// authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { encryptAuthData, decryptAuthData, type CreatorDetails, type Token, type AuthData } from '@/lib/helper';

interface AuthState {
  isAuthenticated: boolean;
  creator: CreatorDetails | null;
  token: Token | null;
}

// Load initial state from localStorage
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