"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Wifi, XCircle, MapPin, Layers, ChevronDown } from "lucide-react";

const CATEGORIES = ["Todas", "Playa", "Montaña", "Selva", "Llanos"];
const STATES = [
  "Todos los Estados", "Miranda", "Mérida", "Falcón", "Anzoátegui", 
  "Nueva Esparta", "Aragua", "Los Roques", "Bolívar", "Zulia"
];

export default function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isStateOpen, setIsStateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentCategory = searchParams.get("categoria") || "Todas";
  const currentState = searchParams.get("estado") || "Todos los Estados";
  const currentAmenity = searchParams.get("amenity") || "";

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "Todas" || value === "Todos los Estados" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`/explorar?${params.toString()}`, { scroll: false });
    if (key === "estado") setIsStateOpen(false);
  };

  const clearFilters = () => {
    router.push("/explorar");
  };

  return (
    <div className="space-y-8 mb-16 animate-in fade-in slide-in-from-top duration-700">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between relative">
        
        {/* 1. Categorías (Ambiente) */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilters("categoria", cat)}
              className={`px-5 py-2 rounded-xl border font-bold text-sm transition-all duration-300 ${
                currentCategory === cat
                  ? "bg-primary text-white border-primary shadow-lg"
                  : "bg-white text-primary border-primary/10 hover:border-secondary hover:text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2. Custom Selector de Estados (Sin Azul) */}
        <div className="relative w-full lg:w-64" ref={dropdownRef}>
          <button
            onClick={() => setIsStateOpen(!isStateOpen)}
            className="w-full flex items-center justify-between pl-12 pr-4 py-3 bg-white border border-primary/10 rounded-2xl font-bold text-primary hover:border-secondary/30 transition-all text-left"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
              <MapPin size={18} />
            </div>
            <span className="truncate">{currentState}</span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${isStateOpen ? "rotate-180" : ""}`} />
          </button>

          {isStateOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
                {STATES.map((state) => (
                  <button
                    key={state}
                    onClick={() => updateFilters("estado", state)}
                    className={`w-full text-left px-12 py-3 text-sm font-bold transition-colors ${
                      currentState === state 
                        ? "bg-primary text-white" 
                        : "text-primary hover:bg-primary/5 hover:text-secondary"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Filtros de Servicios Críticos */}
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={() => updateFilters("amenity", currentAmenity === "planta" ? "" : "planta")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-bold text-sm transition-all ${
              currentAmenity === "planta"
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-white text-primary border-primary/10 hover:bg-primary/5 hover:border-primary/30"
            }`}
          >
            <Zap size={16} className={currentAmenity === "planta" ? "fill-white" : ""} />
            <span>Planta</span>
          </button>
          
          <button
            onClick={() => updateFilters("amenity", currentAmenity === "wifi" ? "" : "wifi")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-bold text-sm transition-all ${
              currentAmenity === "wifi"
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-white text-primary border-primary/10 hover:bg-primary/5 hover:border-primary/30"
            }`}
          >
            <Wifi size={16} />
            <span>WiFi Sat.</span>
          </button>
        </div>

        {/* Botón Limpiar */}
        {(currentCategory !== "Todas" || currentState !== "Todos los Estados" || currentAmenity) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-primary/40 hover:text-red-500 font-bold text-sm transition-colors px-2 py-1"
          >
            <XCircle size={16} />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
}
