"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePosada } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function DeletePosadaButton({ id, posadaName }: { id: string, posadaName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePosada(id);
    
    if (result.success) {
      router.push("/explorar");
      router.refresh();
    } else {
      alert("Error al eliminar: " + result.error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-3xl animate-in fade-in zoom-in duration-300">
        <p className="text-red-900 font-bold mb-4">¿Estás seguro de eliminar "{posadaName}"?</p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            Sí, eliminar
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold border border-primary/10 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 text-red-500 font-bold hover:text-red-700 transition-colors p-2"
    >
      <Trash2 size={20} />
      <span>Eliminar Posada</span>
    </button>
  );
}
