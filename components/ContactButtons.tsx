"use client";

import React from "react";
import { MessageCircle, Instagram, Globe } from "lucide-react";
import { logContactEvent } from "@/lib/actions";

interface ContactButtonsProps {
  posadaId: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
}

const ContactButtons = ({ posadaId, whatsapp, instagram, website }: ContactButtonsProps) => {
  const handleContact = async (type: string, url: string) => {
    // Fire and forget logging
    logContactEvent(posadaId, type);
    
    // Open link immediately
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-lg font-playfair font-bold text-primary mb-2">Contactar con la posada</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {whatsapp && (
          <button
            onClick={() => handleContact("whatsapp", `https://wa.me/${whatsapp}`)}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <MessageCircle size={20} />
            <span>WhatsApp</span>
          </button>
        )}

        {instagram && (
          <button
            onClick={() => handleContact("instagram", `https://instagram.com/${instagram}`)}
            className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Instagram size={20} />
            <span>Instagram</span>
          </button>
        )}

        {website && (
          <button
            onClick={() => handleContact("website", website)}
            className="flex items-center justify-center gap-2 bg-primary text-background py-4 px-6 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 sm:col-span-2"
          >
            <Globe size={20} />
            <span>Visitar Sitio Web</span>
          </button>
        )}
      </div>
      
      <p className="text-[10px] text-primary/40 text-center mt-2 italic">
        Al contactar, confirmas que has leído nuestros términos de servicio.
      </p>
    </div>
  );
};

export default ContactButtons;
