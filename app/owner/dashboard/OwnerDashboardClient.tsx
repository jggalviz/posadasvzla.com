"use client";

import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, PlusCircle, Star, TrendingUp, LogOut } from "lucide-react";
import Link from "next/link";

export default function OwnerDashboardClient() {
  const { profile, signOut } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <span className="text-secondary font-bold text-sm tracking-[0.2em] uppercase mb-2 block">Panel del Dueño</span>
              <h1 className="text-4xl font-playfair font-bold text-primary">
                Hola, {profile?.full_name?.split(" ")[0]} 👋
              </h1>
              <p className="text-primary/60 mt-2">Gestiona tus posadas y revisa el rendimiento.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/publicar"
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                <PlusCircle size={18} />
                Nueva Posada
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2 bg-white border border-primary/10 text-primary px-6 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <LogOut size={18} />
                Salir
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Building2, label: "Mis Posadas", value: "—", color: "text-secondary" },
              { icon: Star, label: "Rating Promedio", value: "—", color: "text-yellow-500" },
              { icon: TrendingUp, label: "Contactos Este Mes", value: "—", color: "text-emerald-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-8 border border-primary/5 shadow-sm">
                <stat.icon size={28} className={stat.color} />
                <p className="text-4xl font-bold text-primary mt-4 mb-1">{stat.value}</p>
                <p className="text-primary/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mis Posadas Placeholder */}
          <div className="bg-white rounded-[2rem] border border-primary/5 p-12 text-center shadow-sm">
            <Building2 size={48} className="text-primary/20 mx-auto mb-4" />
            <h2 className="text-2xl font-playfair font-bold text-primary mb-3">Aún no tienes posadas publicadas</h2>
            <p className="text-primary/50 mb-6">Publica tu primera posada y empieza a recibir huéspedes.</p>
            <Link href="/admin/publicar" className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-all">
              <PlusCircle size={18} /> Publicar mi Posada
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
