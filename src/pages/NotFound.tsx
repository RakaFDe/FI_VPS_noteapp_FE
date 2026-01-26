import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-6 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
          404 Page Not Found
        </h1>
        
        <p className="text-lg text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
