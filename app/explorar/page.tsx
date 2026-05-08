import React from "react";
import PosadaCard from "@/components/PosadaCard";
import ExploreFilters from "@/components/ExploreFilters";
import { supabase } from "@/lib/supabase";
import { SearchX } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: { 
    categoria?: string; 
    estado?: string; 
    zona?: string; 
    amenity?: string;
  };
}) {
  const { categoria, estado, zona, amenity } = searchParams;
  
  // Construcción dinámica de la Query de Supabase
  let query = supabase
    .from("posadas")
    .select("*")
    .order("created_at", { ascending: false });

  // Filtro por Categoría (Ambiente)
  if (categoria && categoria !== "Todas") {
    query = query.eq("category", categoria);
  }

  // Filtro por Estado
  if (estado) {
    query = query.ilike("location", `%${estado}%`);
  }

  // Filtro por Zona (Playa, Montaña, Selva)
  if (zona) {
    query = query.eq("category", zona); // Mapeamos zona a categoría por ahora
  }

  // Filtro por Amenidades Críticas
  if (amenity === "planta") {
    query = query.eq("has_power_plant", true);
  } else if (amenity === "wifi") {
    query = query.eq("has_wifi", true);
  }

  const { data: posadas, error } = await query;

  if (error) {
    console.error("Error fetching posadas:", error);
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background text-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            {estado ? `Posadas en ${estado}` : "Explora Posadas Exclusivas"}
          </h1>
          <p className="text-primary/70 text-lg max-w-2xl">
            {amenity === "planta" 
              ? "Selección de posadas con garantía eléctrica 24/7." 
              : amenity === "wifi" 
              ? "Destinos con conectividad Starlink y alta velocidad."
              : "Seleccionamos las mejores estancias rústicas de lujo en toda Venezuela."}
          </p>
        </div>

        {/* Client Component for Filters */}
        <ExploreFilters />

        {/* Grid / Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {posadas && posadas.length > 0 ? (
            posadas.map((posada) => (
              <PosadaCard key={posada.id} posada={posada} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
              <div className="bg-accent/20 p-6 rounded-full mb-6">
                <SearchX size={48} className="text-secondary" />
              </div>
              <h2 className="text-3xl font-playfair font-bold mb-3">
                No encontramos lo que buscas
              </h2>
              <p className="text-primary/60 text-lg max-w-md mx-auto">
                No hay resultados para estos filtros en este momento. Intenta explorar todos los destinos.
              </p>
              <a href="/explorar" className="mt-8 btn-terracotta inline-block">
                Ver toda la colección
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
