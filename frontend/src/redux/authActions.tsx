import { createAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';

export const login = createAction<{ email: string; password: string }>('auth/login');
export const loginSuccess = createAction<{username: string, token: string}>('auth/loginSuccess');
export const loginFailure = createAction<string>('auth/loginFailure');
export const logout = createAction('auth/logout');
export const getUserDetailsSuccess = createAction<{ username: string }>('auth/getUserDetailsSuccess');
const baseUrlApi = import.meta.env.VITE_API_BASE_URL;

export const clearError = createAction('auth/clearError');


// Async action to handle user login
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  try {
    const response = await fetch(`${baseUrlApi}/accounts/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(loginSuccess({username: data.username, token: data.token}));
    } else {
      let errorMessage = 'An error occurred while trying to log in. Please try again later.';

      if (response.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (response.status === 500) {
        errorMessage = 'There seems to be a problem with the server. Please try again later.';
      }

      dispatch(loginFailure(errorMessage));
    }
  } catch (error: any) {
    dispatch(loginFailure('A network error occurred. Please try again later.'));
  }
};


// Async action to handle fetching user details
export const getUserDetails = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const token = getState().auth.token; // Get the token from the state

  //Don't get details if not logged in
  if (!token) {
    return;
  }

  try {
    const response = await fetch(`${baseUrlApi}/accounts/user-details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Dispatch the getUserDetailsSuccess action upon successful fetching
      dispatch(getUserDetailsSuccess({ username: data.username }));
    } else {
      // Handle fetching failure, you can dispatch an error action if needed
      console.error('Fetching user details failed: ', response.statusText);
    }
  } catch (error) {
    console.error('Network error: ', error);
  }
};