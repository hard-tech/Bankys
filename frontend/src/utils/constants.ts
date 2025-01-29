// utils/constants.ts
export const constants = {
  API: {
    BASE_URL: import.meta.env.VITE_API_URL,
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
  },

  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    DASHBOARD: "/dashboard",
    TRANSACTIONS: "/transactions",
    ACCOUNTS: "/accounts",
  },

  MENU_ITEMS: [
    { title: "Home", path: "/", needAuth: false },
    { title: "Login", path: "/login", needAuth: false },
    { title: "Register", path: "/register", needAuth: false },
    { title: "Profile", path: "/profile", needAuth: true },
  ],

  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};