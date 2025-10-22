import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } from '../api/authApi';
import { setCredentials, logout, setError, clearError } from '../slice/authSlice';
import type { RootState, AppDispatch } from '../../../store';
import type { LoginRequest } from '../../../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  
  // Only fetch current user if we have a token but no user data
  const shouldFetchUser = auth.token && !auth.user;
  const { data: currentUserData, error: currentUserError, isLoading: isCurrentUserLoading } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
  });

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(clearError());
      const result = await loginMutation(credentials).unwrap();
      
      if (result.success) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token
        }));
        return result.data;
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || "Login failed. Please try again.";
      dispatch(setError(errorMsg));
      throw new Error(errorMsg);
    }
  };

  const logoutUser = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      // Even if logout API fails, clear local state
      console.error('Logout API failed:', err);
    } finally {
      dispatch(logout());
    }
  };

  // Handle current user data restoration
  React.useEffect(() => {
    if (currentUserData?.success && currentUserData.data && auth.token) {
      // Restore user data from API
      dispatch(setCredentials({
        user: currentUserData.data,
        token: auth.token
      }));
    } else if (currentUserError && auth.token) {
      // Token is invalid, clear auth state
      console.log('Token validation failed, clearing auth state');
      dispatch(logout());
    }
  }, [currentUserData, currentUserError, auth.token, dispatch]);

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || isLoginLoading || isLogoutLoading || isCurrentUserLoading,
    error: auth.error,
    
    // Actions
    login,
    logout: logoutUser,
    clearError: () => dispatch(clearError()),
  };
};
