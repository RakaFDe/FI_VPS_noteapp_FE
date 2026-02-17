import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

/* ===============================
 * TYPES
 * =============================== */
type LoginPayload = {
  username: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  password: string;
};

/* ===============================
 * PROD AUTH
 * =============================== */
export function useAuthProd() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /* ===============================
   * CURRENT USER
   * =============================== */
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await apiFetch<User>(API_ENDPOINTS.auth.me);
      } catch (err: any) {
        if (err.message.includes("401")) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  /* ===============================
   * LOGIN
   * =============================== */
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiFetch<User>(API_ENDPOINTS.auth.login, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);
      toast({
        title: "Welcome back",
        description: `Logged in as ${data.username}`,
      });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    },
  });

  /* ===============================
   * REGISTER
   * =============================== */
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiFetch(API_ENDPOINTS.auth.register, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    onSuccess: () => {
      toast({
        title: "Account created",
        description: "Please login with your new account",
      });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Register failed",
        description: error.message,
      });
    },
  });

  /* ===============================
   * LOGOUT
   * =============================== */
  const logoutMutation = useMutation({
    mutationFn: () =>
      apiFetch(API_ENDPOINTS.auth.logout, { method: "POST" }),

    onSuccess: () => {
      queryClient.clear();
      toast({ title: "Logged out" });
    },
  });

  return {
    user,
    isLoading,
    error,

    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
