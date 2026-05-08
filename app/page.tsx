import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, MapPin, Zap, Wifi, Palmtree, Mountain, 
  Trees, ChevronRight, Star, ArrowRight, ShieldCheck 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import PosadaCard from "@/components/PosadaCard";

// Forzar renderizado dinámico - nunca cachear en Vercel CDN
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATES = [
  "Miranda", "Mérida", "Falcón", "Anzoátegui", "Nueva Esparta", "Aragua", "Los Roques"
];

const ZONES = [
  { name: "Playa", icon: <Palmtree size={24} />, color: "bg-secondary/10 text-secondary" },
  { name: "Montaña", icon: <Mountain size={24} />, color: "bg-primary/10 text-primary" },
  { name: "Selva", icon: <Trees size={24} />, color: "bg-accent/30 text-primary" }
];

export default async function Home() {
  // Obtener las últimas 4 posadas - sin caché
  const { data: latestPosadas } = await supabase
    .from("posadas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)
    .throwOnError();

  return (
    <main className="min-h-screen bg-background">
      {/* 1. Hero Section - Impacto Visual y Experiencia */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Luxury Rustic Posada"
            fill
            className="object-cover brightness-[0.65] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <span className="inline-block bg-secondary/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom duration-700">
            Experiencias Únicas en Venezuela
          </span>
          <h1 className="text-5xl md:text-8xl font-playfair font-bold text-white mb-8 drop-shadow-2xl leading-tight">
            Redescubre el <br /> <span className="text-secondary italic">Lujo Rústico</span>
          </h1>
          
          {/* Quick Search por Estados */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {STATES.map((state) => (
              <Link 
                key={state}
                href={`/explorar?estado=${state}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
              >
                {state}
              </Link>
            ))}
          </div>

          {/* Buscador Principal */}
          <div className="glass p-2 rounded-3xl md:rounded-full shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 group focus-within:ring-4 ring-secondary/20 transition-all">
            <div className="flex-1 flex items-center gap-3 px-8 py-4 w-full">
              <MapPin className="text-secondary" size={24} />
              <input 
                type="text" 
                placeholder="¿Qué destino buscas hoy?" 
                className="bg-transparent border-none focus:ring-0 p-0 text-primary placeholder:text-primary/40 font-medium text-lg w-full"
              />
            </div>
            <Link 
              href="/explorar"
              className="bg-primary hover:bg-primary/90 text-background p-4 rounded-2xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto md:px-10 group"
            >
              <Search size={22} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold">Buscar Posada</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Explore por Ambiente (Zonas) */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ZONES.map((zone) => (
            <Link 
              key={zone.name}
              href={`/explorar?zona=${zone.name}`}
              className="bg-white p-8 rounded-[2rem] shadow-xl border border-primary/5 flex items-center justify-between group hover:border-secondary/30 transition-all hover:-translate-y-2"
            >
              <div className="flex items-center gap-6">
                <div className={`${zone.color} p-5 rounded-2xl transition-transform group-hover:rotate-12`}>
                  {zone.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-primary">{zone.name}</h3>
                  <p className="text-primary/40 text-sm">Explorar destinos</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center text-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Imprescindibles en Venezuela */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row gap-8">
          <Link 
            href="/explorar?amenity=planta" 
            className="flex-1 relative h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" 
              alt="Garantía Eléctrica" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="bg-secondary text-white w-fit px-4 py-1 rounded-lg text-xs font-bold mb-4 flex items-center gap-2">
                <Zap size={14} className="fill-white" /> SERVICIO CRÍTICO
              </div>
              <h3 className="text-4xl font-playfair font-bold text-white mb-4">Garantía Eléctrica</h3>
              <p className="text-white/80 mb-6 text-lg">Posadas con planta eléctrica 24/7 para que nada interrumpa tu descanso.</p>
              <div className="flex items-center gap-2 text-secondary font-bold group-hover:translate-x-2 transition-transform">
                Ver posadas seguras <ArrowRight size={20} />
              </div>
            </div>
          </Link>

          <Link 
            href="/explorar?amenity=wifi" 
            className="flex-1 relative h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800" 
              alt="Conectividad Total" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="bg-secondary text-white w-fit px-4 py-1 rounded-lg text-xs font-bold mb-4 flex items-center gap-2">
                <Wifi size={14} /> ALTA VELOCIDAD
              </div>
              <h3 className="text-4xl font-playfair font-bold text-white mb-4">Conectividad Total</h3>
              <p className="text-white/80 mb-6 text-lg">Selección exclusiva de posadas con Starlink y WiFi satelital de alta velocidad.</p>
              <div className="flex items-center gap-2 text-secondary font-bold group-hover:translate-x-2 transition-transform">
                Ver posadas conectadas <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Últimos Hallazgos (Dinámico de Supabase) */}
      <section className="bg-white py-32 border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-secondary font-bold text-sm tracking-[0.3em] uppercase mb-4 block">Novedades</span>
              <h2 className="text-5xl font-playfair font-bold text-primary mb-6">Últimos Hallazgos</h2>
              <p className="text-primary/60 max-w-xl text-lg">Descubre las posadas más recientes que se han unido a nuestra colección exclusiva.</p>
            </div>
            <Link 
              href="/explorar" 
              className="group flex items-center gap-3 bg-accent/5 px-8 py-4 rounded-2xl font-bold text-primary hover:bg-primary hover:text-white transition-all duration-500"
            >
              Ver toda la colección <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosadas?.map((posada) => (
              <PosadaCard key={posada.id} posada={posada} />
            ))}
            
            {(!latestPosadas || latestPosadas.length === 0) && (
              <div className="col-span-full py-20 text-center bg-background rounded-[2rem] border-2 border-dashed border-primary/10">
                <p className="text-primary/40 font-medium italic">Pronto verás aquí nuestras nuevas adquisiciones...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Banner de Confianza */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="bg-primary rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <div className="relative z-10 flex-1">
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-8 leading-tight">
              ¿Eres dueño de una posada <span className="text-secondary italic">excepcional</span>?
            </h2>
            <p className="text-white/70 text-xl mb-12 max-w-xl">
              Únete a la red más exclusiva de turismo en Venezuela. Te ayudamos a conectar con viajeros que valoran la autenticidad y el lujo rústico.
            </p>
            <Link 
              href="/admin/publicar" 
              className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-secondary/90 hover:scale-105 transition-all shadow-xl shadow-secondary/20"
            >
              Publicar mi Posada <ShieldCheck size={24} />
            </Link>
          </div>
          <div className="relative z-10 flex-1 w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/10">
             <Image 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" 
                alt="Owner Excellence" 
                fill 
                className="object-cover"
             />
          </div>
        </div>
      </section>
    </main>
  );
}
