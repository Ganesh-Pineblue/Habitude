# Services Architecture

This directory contains the service layer for the Habitude UI application, following company standards and patterns similar to the backend architecture.

## Architecture Overview

```
services/
├── api.ts              # API Gateway - Centralized HTTP client
├── userService.ts      # User-related API operations
├── LoginService.tsx    # Authentication operations
├── serviceRegistry.ts  # Service registry (singleton pattern)
├── index.ts           # Central exports
└── README.md          # This documentation
```

## API Gateway (`api.ts`)

The API Gateway provides a centralized way to make HTTP requests to the backend:

- **Base URL**: `http://localhost:8080/api/v1`
- **Timeout**: 10 seconds
- **Authentication**: Automatic token injection from localStorage
- **Error Handling**: Centralized error logging and handling

### Usage

```typescript
import { api } from './services';

// GET request
const response = await api.get<User>('/users/1');

// POST request
const response = await api.post<User>('/users', userData);

// PUT request
const response = await api.put<User>('/users', updatedUser);

// DELETE request
const response = await api.delete('/users/1');
```

## User Service (`userService.ts`)

Handles all user-related operations:

- **Registration**: Create new user accounts
- **Login**: Authenticate users (currently local)
- **User Management**: Get, update, list users

### Usage

```typescript
import { userService } from './services';

// Register a new user
const result = await userService.registerUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Get user by ID
const user = await userService.getUserById(1);

// Update user
const updatedUser = await userService.updateUser(userData);
```

## Login Service (`LoginService.tsx`)

Handles authentication operations:

- **Registration**: Uses userService for backend registration
- **Login**: Currently handled locally (as requested)
- **Validation**: Client-side validation for registration data

### Usage

```typescript
import { loginService } from './services';

// Register user (calls backend)
const result = await loginService.registerUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Login user (local)
const loginResult = await loginService.loginUser('john@example.com', 'password123');

// Validate registration data
const validation = loginService.validateRegistrationData(userData);
```

## Service Registry (`serviceRegistry.ts`)

Central registry for all services, following the singleton pattern:

### Usage

```typescript
import { serviceRegistry } from './services';

// Get a service
const userService = serviceRegistry.getService('userService');
const loginService = serviceRegistry.getService('loginService');

// Check if service exists
const hasService = serviceRegistry.hasService('userService');

// Get all registered services
const services = serviceRegistry.getRegisteredServices();
```

## Integration with LoginForm

The LoginForm component now uses the service layer for registration:

```typescript
import { loginService } from '../../services/LoginService';

const handleRegister = async (e: React.FormEvent) => {
  // Validate data
  const validation = loginService.validateRegistrationData(userData);
  
  if (!validation.isValid) {
    setError(validation.errors.join(', '));
    return;
  }

  // Register via backend
  const response = await loginService.registerUser(userData);
  
  if (response.success) {
    // Handle success
  } else {
    setError(response.message);
  }
};
```

## Backend Integration

The services connect to the backend `UsersController.createUser` endpoint:

- **Endpoint**: `POST /api/v1/users`
- **Request Body**: `{ email, password, name, authProvider }`
- **Response**: User object with ID and timestamps
- **Error Handling**: 409 for duplicate email, 500 for server errors

## Error Handling

All services include comprehensive error handling:

- **Network Errors**: Automatic logging and user-friendly messages
- **Validation Errors**: Client-side validation with clear error messages
- **Server Errors**: Proper HTTP status code handling
- **Timeout Errors**: 10-second timeout with fallback messages

## Future Enhancements

1. **Login API**: Implement backend login endpoint integration
2. **Token Management**: JWT token storage and refresh
3. **Social Login**: OAuth integration for Google, Facebook, etc.
4. **Password Reset**: Forgot password functionality
5. **User Profile**: Profile management and avatar upload

## Company Standards Compliance

- ✅ Singleton pattern for services
- ✅ Centralized API gateway
- ✅ Service registry pattern
- ✅ TypeScript interfaces for type safety
- ✅ Comprehensive error handling
- ✅ JSDoc documentation
- ✅ Consistent naming conventions
- ✅ Separation of concerns 