import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Zap, Star } from "lucide-react";
import { Posada } from "@/types/posada";

const PosadaCard = ({ posada }: { posada: Posada }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-primary/5">
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={posada.image || "/placeholder.png"}
          alt={posada.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {posada.has_power_plant && (
            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5 text-primary text-xs font-bold animate-in fade-in slide-in-from-left duration-500">
              <Zap size={14} className="fill-secondary text-secondary" />
              <span>Planta Eléctrica</span>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 text-primary font-bold text-sm shadow-sm">
          <Star size={14} className="fill-secondary text-secondary border-none" />
          {posada.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-playfair font-bold text-primary group-hover:text-secondary transition-colors duration-300">
            {posada.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-1.5 text-primary/80 font-medium text-sm mb-4">
          <MapPin size={16} className="text-secondary" />
          <span>{posada.location}</span>
        </div>

        <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary">${posada.price}</span>
            <span className="text-primary/70 text-sm ml-1">/ noche</span>
          </div>
          <Link 
            href={`/explorar/${posada.id}`}
            className="text-secondary font-bold text-sm hover:underline underline-offset-4 transition-all"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PosadaCard;
