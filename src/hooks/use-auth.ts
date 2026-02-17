import { useAuthDev } from "./use-auth.dev";
import { useAuthProd } from "./use-auth.prod";

const AUTH_MODE = import.meta.env.VITE_AUTH_MODE as "dev" | "prod";

/**
 * Export hook berdasarkan env
 * TIDAK ADA conditional hook call
 */
export const useAuth =
  AUTH_MODE === "dev"
    ? useAuthDev
    : useAuthProd;
