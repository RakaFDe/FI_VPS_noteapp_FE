import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const AUTH_MODE = import.meta.env.VITE_AUTH_MODE;

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // DEV MODE → langsung lolos
  if (AUTH_MODE === "dev") {
    return <>{children}</>;
  }

  const { user, isLoading } = useAuth();

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
