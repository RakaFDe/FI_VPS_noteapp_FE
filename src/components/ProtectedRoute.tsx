import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const AUTH_MODE = import.meta.env.VITE_AUTH_MODE;

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔹 Hook selalu dipanggil
  const { user, isLoading } = useAuth();

  // DEV MODE → bypass auth
  if (AUTH_MODE === "dev") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
