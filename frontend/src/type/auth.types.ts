// src/types/auth.types.ts
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }

  export interface ChangePasswordCredentials {
    oldPassword: string;
    newPassword: string;
  }