// API Gateway
export { api } from './api';
export type { ApiResponse, ApiError } from './api';

// User Service
export { 
  userService, 
  UserService
} from './userService';
export type {
  User,
  UserRegistrationRequest,
  UserRegistrationResponse,
  UserLoginRequest,
  UserLoginResponse
} from './userService';

// Login Service
export { 
  loginService, 
  LoginService 
} from './LoginService';

// Service Registry
export { 
  serviceRegistry, 
  ServiceRegistry 
} from './serviceRegistry'; 