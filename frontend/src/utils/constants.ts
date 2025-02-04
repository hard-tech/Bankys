// utils/constants.ts
export const constants = {
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    TIMEOUT: 5000,
    HEADERS: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },

  STORAGE_KEYS: {
    TOKEN: "auth_token",
    USER: "user_data",
    THEME: "app_theme",
    SAVED_EMAIL: "savedEmail",
    SAVED_PASSWORD: "savedPassword",
    SAVED_REMEMBER_ME: "savedRememberMe",
  },

  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    DASHBOARD: "/dashboard",
    TRANSACTIONS: "/transactions",
    ACCOUNTS: "/accounts",
    BENEFICIAIRES: "/beneficiaries",
  },

  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};