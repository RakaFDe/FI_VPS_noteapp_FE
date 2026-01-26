import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    login(
      { username, password },
      {
        onSuccess: () => {
          navigate("/", { replace: true });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button className="w-full" type="submit" disabled={isLoggingIn}>
              {isLoggingIn && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
