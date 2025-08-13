export interface BaseLocalAuthService<T> {
  validateEntity(email: string, password: string): Promise<T | null>;
}
