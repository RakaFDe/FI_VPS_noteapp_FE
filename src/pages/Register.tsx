import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";


export default function Register() {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

  register(
    { username, password },
    {
      onSuccess: () => {
        toast({
          title: "Success 🎉",
          description: "Account created. Please login.",
        });

        navigate("/login");
      },

      onError: (err: any) => {
        const message = err?.response?.data?.message || err?.message;

        const errorMap: Record<string, string> = {
          username_already_exists: "Username already registered.",
          username_and_password_required: "Username and password are required.",
        };

        toast({
          title: "Registration Failed",
          description: errorMap[message] || "Something went wrong.",
          variant: "destructive",
        });

        setPassword("");
      },
    }
  );
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Register</CardTitle>
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

            <Button className="w-full" type="submit" disabled={isRegistering || !username || !password}>
              {isRegistering && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Account
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
