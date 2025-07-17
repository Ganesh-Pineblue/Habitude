# Services Architecture

This directory contains the service layer for the Habitude UI application, following company standards and patterns similar to the backend architecture.

## Architecture Overview

```
services/
├── api.ts              # API Gateway - Centralized HTTP client with JWT management
├── authService.ts      # Comprehensive authentication service
├── userService.ts      # User-related API operations
├── LoginService.tsx    # Legacy authentication operations
├── serviceRegistry.ts  # Service registry (singleton pattern)
├── index.ts           # Central exports
└── README.md          # This documentation
```

## Enhanced JWT Authentication System

### Overview

The authentication system now includes:

- **JWT Token Management**: Automatic token storage, refresh, and expiration handling
- **Refresh Token Support**: Seamless token refresh without user interruption
- **Enhanced Error Handling**: Comprehensive error handling for network, auth, and server errors
- **State Management**: Centralized authentication state management
- **Security Features**: Token expiration checks, automatic logout on auth failures

### Key Features

#### 1. **Automatic Token Management**
```typescript
import { authService } from './services';

// Login - automatically stores tokens
const authState = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Tokens are automatically managed:
// - Access token stored in localStorage
// - Refresh token stored securely
// - Token expiration tracked
// - Automatic refresh on 401 responses
```

#### 2. **Automatic API Authentication**
```typescript
import { api } from './services';

// All API calls automatically include auth headers
const userProfile = await api.get('/users/profile');
const updateUser = await api.put('/users/profile', userData);

// No need to manually add Authorization headers
// Tokens are automatically included and refreshed
```

#### 3. **Refresh Token Handling**
```typescript
// Automatic refresh when token expires
// No user intervention required
const response = await api.get('/protected-endpoint');
// If token expired, it's automatically refreshed and request retried
```

#### 4. **Comprehensive Error Handling**
```typescript
try {
  const result = await api.post('/some-endpoint', data);
} catch (error) {
  // Handles various error types:
  // - 401: Automatic token refresh or logout
  // - Network errors: User-friendly messages
  // - Server errors: Proper error messages
  // - Timeout errors: Retry suggestions
}
```

## API Gateway (`api.ts`)

The enhanced API Gateway provides centralized HTTP requests with automatic JWT management:

- **Base URL**: `http://localhost:8080/api/v1`
- **Timeout**: 10 seconds
- **Authentication**: Automatic token injection and refresh
- **Error Handling**: Centralized error logging and handling
- **Token Management**: Automatic token storage, refresh, and expiration

### Token Management Features

```typescript
// Automatic token storage on login
const response = await authApi.login(credentials);
// Token automatically stored in localStorage
// Refresh token stored if provided
// Expiration time tracked

// Automatic token refresh
// When API call returns 401, token is automatically refreshed
// Original request is retried with new token

// Automatic logout on auth failure
// If refresh fails, user is automatically logged out
// Redirected to login page
```

### Usage Examples

```typescript
import { api, authApi } from './services';

// GET request with automatic auth
const response = await api.get<User>('/users/1');

// POST request with automatic auth
const response = await api.post<User>('/users', userData);

// PUT request with automatic auth
const response = await api.put<User>('/users', updatedUser);

// DELETE request with automatic auth
const response = await api.delete('/users/1');

// File upload with automatic auth
const formData = new FormData();
formData.append('file', file);
const response = await api.post('/upload', formData);
```

## Authentication Service (`authService.ts`)

Comprehensive authentication service with state management:

### Features

- **Login/Logout**: Complete authentication flow
- **Token Management**: Automatic token storage and refresh
- **State Management**: Centralized auth state
- **Validation**: Client-side credential validation
- **Profile Management**: User profile operations

### Usage

```typescript
import { authService } from './services';

// Login
const authState = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

if (authState.isAuthenticated) {
  console.log('Login successful:', authState.user);
} else {
  console.log('Login failed:', authState.error);
}

// Check authentication status
const isAuthenticated = authService.isAuthenticated();
const currentUser = authService.getCurrentUser();

// Logout
await authService.logout();

// Change password
const success = await authService.changePassword({
  currentPassword: 'oldpassword',
  newPassword: 'newpassword'
});

// Register new user
const result = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Update user profile
const updatedUser = await authService.updateUserProfile({
  firstName: 'John',
  lastName: 'Doe'
});
```

## User Service (`userService.ts`)

Enhanced user service with authentication integration:

### Usage

```typescript
import { userService } from './services';

// Register a new user
const result = await userService.registerUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Login user (uses enhanced authApi)
const loginResult = await userService.loginUser({
  email: 'john@example.com',
  password: 'password123'
});

// Get user by ID
const user = await userService.getUserById(1);

// Update user
const updatedUser = await userService.updateUser(userData);

// Get all users (admin function)
const users = await userService.getAllUsers();

// Change password
const success = await userService.changePassword('oldpass', 'newpass');

// Refresh token
const newToken = await userService.refreshToken();
```

## Service Registry (`serviceRegistry.ts`)

Central registry for all services:

### Usage

```typescript
import { serviceRegistry } from './services';

// Get a service
const userService = serviceRegistry.getService('userService');
const authService = serviceRegistry.getService('authService');

// Check if service exists
const hasService = serviceRegistry.hasService('userService');

// Get all registered services
const services = serviceRegistry.getRegisteredServices();
```

## Integration with Components

### Login Component Example

```typescript
import React, { useState } from 'react';
import { authService } from '../services';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate credentials
    const validation = authService.validateCredentials({ email, password });
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const authState = await authService.login({ email, password });
      
      if (authState.isAuthenticated) {
        // Redirect to dashboard or home
        window.location.href = '/dashboard';
      } else {
        setError(authState.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Protected Route Example

```typescript
import React from 'react';
import { authService } from '../services';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};
```

## Backend Integration

The services connect to backend endpoints:

### Authentication Endpoints

- **Login**: `POST /api/v1/auth/login`
- **Logout**: `POST /api/v1/auth/logout`
- **Refresh**: `POST /api/v1/auth/refresh`
- **Change Password**: `POST /api/v1/auth/change-password`

### User Endpoints

- **Register**: `POST /api/v1/users`
- **Get Profile**: `GET /api/v1/users/profile`
- **Update Profile**: `PUT /api/v1/users/profile`
- **Get User**: `GET /api/v1/users/:id`

### Expected Response Format

```typescript
// Login Response
{
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // ... other user fields
}

// Error Response
{
  message: string;
  error?: string;
  status?: number;
}
```

## Security Best Practices

### 1. **Token Storage**
- Access tokens stored in localStorage (for development)
- Consider httpOnly cookies for production
- Refresh tokens stored securely

### 2. **Token Expiration**
- Automatic expiration tracking
- Proactive token refresh
- Graceful logout on expiration

### 3. **Error Handling**
- Comprehensive error categorization
- User-friendly error messages
- Automatic retry for transient errors

### 4. **Network Security**
- HTTPS enforcement in production
- Request timeout handling
- Network connectivity checks

## Error Handling

All services include comprehensive error handling:

- **Network Errors**: Automatic logging and user-friendly messages
- **Authentication Errors**: Automatic token refresh or logout
- **Validation Errors**: Client-side validation with clear error messages
- **Server Errors**: Proper HTTP status code handling
- **Timeout Errors**: 10-second timeout with fallback messages

## Future Enhancements

1. **OAuth Integration**: Google, Facebook, GitHub login
2. **Two-Factor Authentication**: TOTP support
3. **Session Management**: Multiple device handling
4. **Password Reset**: Forgot password functionality
5. **Account Lockout**: Brute force protection
6. **Audit Logging**: Authentication event tracking

## Company Standards Compliance

- ✅ Singleton pattern for services
- ✅ Centralized API gateway
- ✅ Service registry pattern
- ✅ TypeScript interfaces for type safety
- ✅ Comprehensive error handling
- ✅ JSDoc documentation
- ✅ Consistent naming conventions
- ✅ Separation of concerns
- ✅ JWT token management
- ✅ Refresh token support
- ✅ Automatic token refresh
- ✅ Secure token storage 