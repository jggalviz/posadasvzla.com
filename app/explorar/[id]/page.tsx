import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ContactButtons from "@/components/ContactButtons";
import DeletePosadaButton from "@/components/admin/DeletePosadaButton";
import { MapPin, Zap, Star, ShieldCheck, Coffee, Wifi } from "lucide-react";

// Forzar renderizado dinámico para manejar searchParams y datos de Supabase en tiempo real
export const dynamic = 'force-dynamic';

export default async function PosadaDetail({ params }: { params: { id: string } }) {
  const { data: posada, error } = await supabase
    .from("posadas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !posada) {
    notFound();
  }

  return (
    <main className="pt-24 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Gallery Container */}
          <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src={posada.image || "/hero-bg.png"}
              alt={posada.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            {posada.has_power_plant && (
              <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full flex items-center gap-2 text-primary font-bold shadow-lg animate-in slide-in-from-left duration-700">
                <Zap size={20} className="fill-secondary text-secondary" />
                <span>Energía 24/7 Garantizada</span>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  {posada.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary leading-tight">
                  {posada.name}
                </h1>
              </div>
              <div className="flex items-center gap-1 bg-white p-3 rounded-2xl shadow-md border border-primary/5">
                <Star size={20} className="fill-secondary text-secondary" />
                <span className="font-bold text-xl">{posada.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-primary/60 mb-10">
              <MapPin size={20} className="text-secondary" />
              <span className="text-lg font-medium">{posada.location}</span>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-primary/5 mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-primary/40 text-[10px] uppercase font-bold tracking-widest mb-1">Inversión por noche</p>
                  <p className="text-5xl font-bold text-primary">${posada.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-secondary font-bold text-sm bg-secondary/5 px-3 py-1 rounded-full">Reserva Segura</p>
                </div>
              </div>

              {/* Lead Tracking Buttons */}
              <ContactButtons 
                posadaId={posada.id}
                whatsapp="584120000000"
                instagram="posada_ejemplo"
                website="https://posadavenezuela.com"
              />
            </div>

            {/* Premium Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, text: "Seguridad Privada" },
                { icon: Coffee, text: "Desayuno Gourmet" },
                { icon: Wifi, text: "Starlink WiFi" },
                { icon: Zap, text: "Planta Eléctrica" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white/50 border border-primary/5 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300">
                  <feature.icon className="text-secondary" size={20} />
                  <span className="text-sm font-semibold text-primary/80">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="max-w-4xl mb-20">
          <h2 className="text-4xl font-playfair font-bold text-primary mb-8 relative inline-block">
            Sobre esta experiencia
            <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/20 -mb-2" />
          </h2>
          <p className="text-primary/70 text-xl leading-relaxed mb-8 font-inter">
            {posada.description || `Ubicada en los paisajes más privilegiados de ${posada.location}, esta estancia redefine el concepto de "lujo rústico". 
            Diseñada para aquellos que buscan desconectarse del mundo sin renunciar a las comodidades más exigentes.`}
          </p>
          
          <div className="p-6 bg-accent/5 border-l-4 border-secondary rounded-r-2xl">
            <p className="text-primary/80 italic text-lg">
              "Una joya escondida. La atención al detalle y la calidez del personal hicieron de nuestra estancia algo inolvidable."
              <span className="block mt-2 font-bold not-italic text-sm text-secondary">— Huésped Satisfecho</span>
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-red-100 pt-12 mt-12">
          <h3 className="text-red-900 font-bold mb-4 flex items-center gap-2">
            Zona Administrativa
          </h3>
          <DeletePosadaButton id={posada.id} posadaName={posada.name} />
        </div>
      </div>
    </main>
  );
}
