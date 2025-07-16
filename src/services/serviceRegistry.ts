import { userService } from './userService';
import { loginService } from './LoginService';
import { onboardingService } from './OnboardingService';

/**
 * ServiceRegistry - Central registry for all application services
 * Follows the same pattern as the backend ServiceRegistry
 */
export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerServices();
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Register all services
   */
  private registerServices(): void {
    this.services.set('userService', userService);
    this.services.set('loginService', loginService);
    this.services.set('onboardingService', onboardingService);
  }

  /**
   * Get a service by name
   * @param serviceName - Name of the service to retrieve
   * @returns The service instance
   */
  getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found in registry`);
    }
    return service as T;
  }

  /**
   * Register a new service
   * @param serviceName - Name of the service
   * @param service - Service instance
   */
  registerService(serviceName: string, service: any): void {
    this.services.set(serviceName, service);
  }

  /**
   * Get all registered service names
   * @returns Array of service names
   */
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Check if a service is registered
   * @param serviceName - Name of the service to check
   * @returns boolean
   */
  hasService(serviceName: string): boolean {
    return this.services.has(serviceName);
  }
}

// Export singleton instance
export const serviceRegistry = ServiceRegistry.getInstance(); 