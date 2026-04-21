import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { encryptAuthData, decryptAuthData, type CreatorDetails, type Token } from '@/lib/helper';

interface AuthState {
  isAuthenticated: boolean;
  creator: CreatorDetails | null;
  token: Token | null;
}

const getInitialState = (): AuthState => {
  try {
    const stored = localStorage.getItem('creator');
    if (!stored) return { creator: null, token: null, isAuthenticated: false };
    const initialUser = decryptAuthData(stored);
    return {
      creator: initialUser?.creator || null,
      token: initialUser?.token || null,
      isAuthenticated: !!initialUser?.token?.access,
    };
  } catch {
    localStorage.removeItem('creator');
    return { creator: null, token: null, isAuthenticated: false };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ creator: CreatorDetails; token: Token }>) => {
      if (action.payload.creator.role_id !== 4) {
        state.creator = null;
        state.token = null;
        state.isAuthenticated = false;
        return;
      }

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