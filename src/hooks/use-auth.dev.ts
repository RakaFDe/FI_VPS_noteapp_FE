import type { User } from "@/types/user";

export function useAuthDev() {
  if (import.meta.env.VITE_AUTH_MODE !== "dev") {
    throw new Error("useAuthDev should only be used when VITE_AUTH_MODE=dev");
  }

  const mockUser: User = {
    id: 1,
    username: "dev-user",
  };

  return {
    user: mockUser,
    isLoading: false,
    error: null,

    login: () => console.info("[AUTH] Dev login"),
    isLoggingIn: false,

    register: () => console.info("[AUTH] Dev register"),
    isRegistering: false,

    logout: () => console.info("[AUTH] Dev logout"),
    isLoggingOut: false,
  };
}
