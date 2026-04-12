import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // bisa ubah 5–10 detik

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-6 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h1 className="text-4xl font-bold font-display tracking-tight">
          404 Page Not Found
        </h1>

        <p className="text-lg text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

        <p className="text-sm text-muted-foreground">
          Redirecting to home in <b>{countdown}</b> seconds...
        </p>

        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => navigate("/", { replace: true })}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}