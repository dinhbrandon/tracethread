import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  loggedIn: boolean;
  email: string | null;
  error: string | null;
  username: string | null;
  token: string | null;
}

const initialState: AuthState = {
  loggedIn: false,
  email: null,
  error: null,
  username: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.loggedIn = true;
    },
    loginSuccess: (state, action: PayloadAction<{ username: string, token: string }>) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: () => {
      // Resetting state upon logout
      return initialState;
    },
    getUserDetailsSuccess: (state, action: PayloadAction<{ username: string }>) => {
      state.username = action.payload.username;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, loginSuccess, loginFailure, getUserDetailsSuccess, clearError } = authSlice.actions;
export default authSlice.reducer;
