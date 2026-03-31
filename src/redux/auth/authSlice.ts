import { decryptAuthData, encryptAuthData } from '@/lib/helper';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CreatorDetails {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone_no?: string;
  status?: boolean;
  token: string;
  position: string;
  address: string
  type?: string
  role?: string
}

export interface LoginData {
    creator: CreatorDetails,
    token: string
}

interface AuthState {
  isAuthenticated: boolean;
  creator: CreatorDetails | null;
  token: string
}

const initialUserStr = decryptAuthData(localStorage.getItem('creator')!);
const initialUser: AuthState | null = initialUserStr ? initialUserStr : null;

const initialState: AuthState = {
  creator: initialUser?.creator || null,
  token: initialUser?.token || '',
  isAuthenticated: !!initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      state.creator = action.payload?.creator;
      state.token = action.payload?.token
      state.isAuthenticated = action?.payload?.token ? true : false;
      localStorage.setItem('creator', encryptAuthData(action.payload));
    },
    logoutAction: (state) => {
      state.creator = null;
      state.isAuthenticated = false;
      localStorage.removeItem('creator');
    },
  },
});

export const { loginSuccess, logoutAction } = authSlice.actions;
export default authSlice.reducer;
