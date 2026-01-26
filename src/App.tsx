import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
console.log("MODE:", import.meta.env.MODE);
console.log("API:", import.meta.env.VITE_API_URL);
console.log("AUTH MODE:", import.meta.env.VITE_AUTH_MODE);
