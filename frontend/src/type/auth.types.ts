// src/types/auth.types.ts
export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
    username: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }