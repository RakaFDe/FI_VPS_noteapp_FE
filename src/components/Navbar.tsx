import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Search } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (isLoading) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-background gap-6">
      {/* LEFT */}
      <Link to="/" className="font-bold text-xl shrink-0">
        Finote
      </Link>

      {/* SEARCH */}
      {user && onSearchChange && (
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="pl-9"
          />
        </div>
      )}

      {/* RIGHT */}
      <div className="flex items-center gap-4 shrink-0">
        {/* THEME */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* AUTH */}
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, <strong>{user.username}</strong>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
