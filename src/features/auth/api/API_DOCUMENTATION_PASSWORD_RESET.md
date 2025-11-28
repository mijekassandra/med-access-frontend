# Password Reset API Documentation

This document provides comprehensive API documentation for the password reset functionality, including request/response formats, error handling, and RTK Query integration examples.

---

## Table of Contents
- [Forgot Password](#forgot-password)
- [Reset Password](#reset-password)
- [RTK Query Integration Examples](#rtk-query-integration-examples)
- [Error Handling](#error-handling)
- [Security Notes](#security-notes)

---

## Forgot Password

### Endpoint
```
POST /api/users/forgot-password
```

### Access
**Public** - No authentication required

### Description
Initiates a password reset process by sending a reset token to the user's email address. For security reasons, the API always returns a success message regardless of whether the email exists in the system.

### Request

#### Headers
```json
{
  "Content-Type": "application/json"
}
```

#### Body Schema
```typescript
{
  email: string;  // Required, must be a valid email format
}
```

#### Example Request
```json
{
  "email": "user@example.com"
}
```

### Response

#### Success Response (200 OK)

**Production Mode:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Development Mode:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent.",
  "resetToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

> **Note:** In development mode, the `resetToken` is included in the response for testing purposes. This field is **NOT** included in production for security reasons.

#### Error Responses

**400 Bad Request - Missing Email**
```json
{
  "success": false,
  "message": "Email is required"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Server error processing password reset request"
}
```

### Important Notes
- The reset token expires after **10 minutes**
- The API always returns a success message (200) even if the email doesn't exist (security best practice)
- In production, the reset token should be sent via email (currently not implemented)
- In development, the token is returned in the response for testing

---

## Reset Password

### Endpoint
```
POST /api/users/reset-password
```

### Access
**Public** - No authentication required

### Description
Resets the user's password using a valid reset token. The token must be obtained from the forgot password endpoint and must not be expired.

### Request

#### Headers
```json
{
  "Content-Type": "application/json"
}
```

#### Body Schema
```typescript
{
  token: string;    // Required, reset token from forgot password endpoint
  password: string; // Required, minimum 6 characters
}
```

#### Example Request
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "password": "newSecurePassword123"
}
```

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

#### Error Responses

**400 Bad Request - Missing Token**
```json
{
  "success": false,
  "message": "Reset token is required"
}
```

**400 Bad Request - Missing Password**
```json
{
  "success": false,
  "message": "Password is required"
}
```

**400 Bad Request - Password Too Short**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters"
}
```

**400 Bad Request - Invalid or Expired Token**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Password must be at least 6 characters",
    "Please enter a valid email"
  ]
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Server error resetting password"
}
```

### Important Notes
- Reset tokens expire after **10 minutes** from generation
- Password must be at least **6 characters** long
- After successful reset, the token is invalidated and cannot be reused
- The token is case-sensitive and must match exactly

---

## RTK Query Integration Examples

### Setup

First, create your API slice or add these endpoints to your existing user API slice:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define request/response types
interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string; // Only in development
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

// Create API slice
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/users',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // ... other endpoints
    
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
```

### Usage in React Components

#### Forgot Password Component

```typescript
import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../store/api/userApi';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await forgotPassword({ email }).unwrap();
      
      // In development, you might want to log the token
      if (process.env.NODE_ENV === 'development' && result.resetToken) {
        console.log('Reset Token (Dev only):', result.resetToken);
      }
      
      // Show success message to user
      alert(result.message);
    } catch (err: any) {
      // Handle error
      const errorMessage = err?.data?.message || 'An error occurred';
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </button>
      
      {isSuccess && (
        <p style={{ color: 'green' }}>
          If an account with that email exists, a password reset link has been sent.
        </p>
      )}
      
      {isError && (
        <p style={{ color: 'red' }}>
          {error && 'data' in error 
            ? (error.data as any)?.message 
            : 'An error occurred'}
        </p>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
```

#### Reset Password Component

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../store/api/userApi';

const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();

  // Get token from URL query parameter
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setValidationError('Reset token is missing');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Client-side validation
    if (!token) {
      setValidationError('Reset token is missing');
      return;
    }

    if (!password) {
      setValidationError('Password is required');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      const result = await resetPassword({ token, password }).unwrap();
      
      // Show success message and redirect
      alert(result.message);
      navigate('/login');
    } catch (err: any) {
      // Handle error
      const errorMessage = err?.data?.message || 'An error occurred';
      const errors = err?.data?.errors || [];
      
      if (errors.length > 0) {
        setValidationError(errors.join(', '));
      } else {
        setValidationError(errorMessage);
      }
    }
  };

  if (!token) {
    return (
      <div>
        <p style={{ color: 'red' }}>Invalid reset link. Please request a new password reset.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">New Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>
      
      {validationError && (
        <p style={{ color: 'red' }}>{validationError}</p>
      )}
      
      {isError && !validationError && (
        <p style={{ color: 'red' }}>
          {error && 'data' in error 
            ? (error.data as any)?.message 
            : 'An error occurred'}
        </p>
      )}
      
      <button type="submit" disabled={isLoading || !token}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
      
      {isSuccess && (
        <p style={{ color: 'green' }}>
          Password has been reset successfully. Redirecting to login...
        </p>
      )}
    </form>
  );
};

export default ResetPasswordForm;
```

### Advanced Usage with Error Handling

```typescript
import { useForgotPasswordMutation, useResetPasswordMutation } from '../store/api/userApi';

// Custom hook for forgot password with better error handling
export const useForgotPassword = () => {
  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  const handleForgotPassword = async (email: string) => {
    try {
      const result = await forgotPassword({ email }).unwrap();
      return {
        success: true,
        message: result.message,
        resetToken: result.resetToken, // Only in dev
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.data?.message || 'Failed to send reset email',
        error: err,
      };
    }
  };

  return {
    forgotPassword: handleForgotPassword,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

// Custom hook for reset password with better error handling
export const useResetPassword = () => {
  const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();

  const handleResetPassword = async (token: string, password: string) => {
    try {
      const result = await resetPassword({ token, password }).unwrap();
      return {
        success: true,
        message: result.message,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.data?.message || 'Failed to reset password',
        errors: err?.data?.errors || [],
        error: err,
      };
    }
  };

  return {
    resetPassword: handleResetPassword,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};
```

---

## Error Handling

### Common Error Scenarios

1. **Network Errors**
   - Handle network failures gracefully
   - Show user-friendly error messages
   - Implement retry logic if appropriate

2. **Validation Errors**
   - Client-side validation should match server-side rules
   - Display validation errors clearly to users
   - Highlight specific fields with errors

3. **Token Expiration**
   - Tokens expire after 10 minutes
   - Guide users to request a new reset link if token expires
   - Provide clear error messages

4. **Invalid Token**
   - Tokens can only be used once
   - If token is invalid, user must request a new one
   - Provide link to forgot password page

### Error Response Structure

All error responses follow this structure:
```typescript
{
  success: false,
  message: string,        // Main error message
  errors?: string[]       // Optional array of validation errors
}
```

---

## Security Notes

### Best Practices

1. **Never expose reset tokens in production**
   - The `resetToken` field is only included in development mode
   - In production, tokens should be sent via email only

2. **Token expiration**
   - Reset tokens expire after 10 minutes
   - Implement proper error handling for expired tokens

3. **One-time use tokens**
   - Tokens are invalidated after successful password reset
   - Users must request a new token if they need to reset again

4. **Email validation**
   - Always validate email format on the frontend
   - Server-side validation is also performed

5. **Password requirements**
   - Minimum 6 characters (enforced on both client and server)
   - Consider adding additional password strength requirements

6. **Rate limiting** (Recommended)
   - Consider implementing rate limiting to prevent abuse
   - Limit the number of password reset requests per email/IP

### Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| Reset token in response | ✅ Included | ❌ Not included |
| Token logging | ✅ Console log | ❌ No logging |
| Email sending | ❌ Not implemented | ⚠️ Should be implemented |

---

## Testing Examples

### cURL Examples

#### Forgot Password
```bash
curl -X POST http://localhost:3000/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

#### Reset Password
```bash
curl -X POST http://localhost:3000/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-reset-token-here",
    "password": "newPassword123"
  }'
```

### Postman Collection

You can import these endpoints into Postman:

1. **Forgot Password**
   - Method: POST
   - URL: `{{baseUrl}}/api/users/forgot-password`
   - Body (raw JSON):
     ```json
     {
       "email": "user@example.com"
     }
     ```

2. **Reset Password**
   - Method: POST
   - URL: `{{baseUrl}}/api/users/reset-password`
   - Body (raw JSON):
     ```json
     {
       "token": "{{resetToken}}",
       "password": "newPassword123"
     }
     ```

---

## Flow Diagram

```
User Flow:
1. User clicks "Forgot Password"
2. User enters email → POST /api/users/forgot-password
3. Server generates token (expires in 10 min)
4. In production: Email sent with reset link
5. In development: Token returned in response
6. User clicks reset link (with token in URL)
7. User enters new password → POST /api/users/reset-password
8. Server validates token and updates password
9. Token invalidated
10. User redirected to login
```

---

## Additional Resources

- Base API URL: `/api/users`
- Token Expiration: 10 minutes
- Password Minimum Length: 6 characters
- Related Endpoints:
  - `POST /api/users/login` - Login after password reset
  - `POST /api/users/register` - Register new account

---

## Support

For issues or questions regarding the password reset API:
1. Check error messages in the response
2. Verify token hasn't expired (10-minute window)
3. Ensure password meets minimum requirements
4. Check network connectivity and API endpoint availability

