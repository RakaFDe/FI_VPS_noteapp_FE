export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  notes: {
    list: "/api/notes",
    create: "/api/notes",
    update: (id: number) => `/api/notes/${id}`,
    delete: (id: number) => `/api/notes/${id}`,
  },
} as const;
