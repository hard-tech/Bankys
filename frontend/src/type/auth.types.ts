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
    first_name: string;
    last_name: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }

  export interface AccountUser {
    id: number;
    sold: number;
    iban: string;
    name: string;
}
export interface AccountFormValues {
  name: string;
  type: "Compte courant" | "Épargne" | "";
}