"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/contexts/AuthContext";
import { Loader2, ShieldX } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      // Strict block: non-admins cannot access /admin/* routes
      if (isAdminRoute && role !== "admin") {
        if (role === "owner") router.push("/owner/dashboard");
        else router.push("/");
        return;
      }
      // Block by allowedRoles
      if (allowedRoles && role && !allowedRoles.includes(role)) {
        if (role === "admin") router.push("/admin/dashboard");
        else if (role === "owner") router.push("/owner/dashboard");
        else router.push("/");
      }
    }
  }, [user, role, loading, allowedRoles, router, isAdminRoute, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-secondary" size={40} />
          <p className="text-primary/60 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) return null;

  // Admin route guard — show a nice "Access Denied" if role mismatch to avoid flash
  if (isAdminRoute && role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShieldX size={56} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Acceso Denegado</h2>
          <p className="text-primary/50">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  // Role-based block
  if (allowedRoles && role && !allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
