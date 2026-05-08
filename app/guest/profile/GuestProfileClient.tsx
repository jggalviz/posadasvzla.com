"use client";

import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Heart, MapPin, LogOut } from "lucide-react";

export default function GuestProfileClient() {
  const { profile, signOut } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["guest"]}>
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <span className="text-secondary font-bold text-sm tracking-[0.2em] uppercase mb-2 block">Mi Perfil</span>
              <h1 className="text-4xl font-playfair font-bold text-primary">
                {profile?.full_name} 🌴
              </h1>
              <p className="text-primary/60 mt-2">{profile?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 bg-white border border-primary/10 text-primary px-6 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: CalendarDays, label: "Mis Reservas", desc: "Próximamente", color: "text-secondary" },
              { icon: Heart, label: "Favoritos", desc: "Guardados", color: "text-red-400" },
              { icon: MapPin, label: "Destinos Visitados", desc: "Tu historial", color: "text-emerald-500" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-8 border border-primary/5 shadow-sm hover:shadow-md transition-all">
                <item.icon size={32} className={item.color} />
                <h3 className="text-xl font-playfair font-bold text-primary mt-4 mb-1">{item.label}</h3>
                <p className="text-primary/40 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bookings Placeholder */}
          <div className="bg-white rounded-[2rem] border border-primary/5 p-12 text-center shadow-sm">
            <CalendarDays size={48} className="text-primary/20 mx-auto mb-4" />
            <h2 className="text-2xl font-playfair font-bold text-primary mb-3">Aún no tienes reservas</h2>
            <p className="text-primary/50 mb-6">Explora nuestras posadas y vive una experiencia inolvidable.</p>
            <a href="/explorar" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
              <MapPin size={18} /> Explorar Posadas
            </a>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
