"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { deletePosada } from "@/lib/actions";
import { Trash2, Pencil, Loader2, Building2, MapPin, Star, DollarSign, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Posada {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  created_at: string;
}

export default function AdminDashboardClient({ posadas }: { posadas: Posada[] }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <PosadasManagementTable posadas={posadas} />
    </ProtectedRoute>
  );
}

function PosadasManagementTable({ posadas }: { posadas: Posada[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [localPosadas, setLocalPosadas] = useState(posadas);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deletePosada(id);
    if (result.success) {
      setLocalPosadas((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
    } else {
      alert("Error al eliminar: " + result.error);
    }
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-primary/5 p-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-playfair font-bold text-primary flex items-center gap-2">
          <Building2 size={22} className="text-secondary" />
          Gestión Global de Posadas
          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full ml-2">
            {localPosadas.length} total
          </span>
        </h3>
        <Link
          href="/admin/publicar"
          className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
        >
          + Nueva Posada
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-primary/50 text-xs uppercase tracking-wider border-b border-primary/10">
              <th className="pb-4 font-bold">Posada</th>
              <th className="pb-4 font-bold">Ubicación</th>
              <th className="pb-4 font-bold">Categoría</th>
              <th className="pb-4 font-bold">Precio</th>
              <th className="pb-4 font-bold">Rating</th>
              <th className="pb-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {localPosadas.map((posada) => (
              <tr key={posada.id} className="border-b border-primary/5 last:border-0 hover:bg-background/50 transition-colors group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-accent/20 flex-shrink-0">
                      {posada.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={posada.image} alt={posada.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 size={20} className="text-primary/30 m-auto mt-3" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{posada.name}</p>
                      <p className="text-primary/40 text-xs">
                        {new Date(posada.created_at).toLocaleDateString("es-VE")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1 text-primary/70">
                    <MapPin size={14} className="text-secondary" />
                    {posada.location}
                  </div>
                </td>
                <td className="py-4">
                  <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full">
                    {posada.category}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1 font-bold text-primary">
                    <DollarSign size={14} />{posada.price}
                    <span className="text-primary/40 font-normal text-xs">/noche</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={14} className="fill-yellow-400" />{posada.rating}
                  </div>
                </td>
                <td className="py-4 text-right">
                  {confirmId === posada.id ? (
                    <div className="flex items-center justify-end gap-2 animate-in fade-in duration-200">
                      <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> ¿Confirmar?
                      </span>
                      <button
                        onClick={() => handleDelete(posada.id)}
                        disabled={deletingId === posada.id}
                        className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all flex items-center gap-1"
                      >
                        {deletingId === posada.id ? <Loader2 size={12} className="animate-spin" /> : null}
                        Eliminar
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="bg-white border border-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/explorar/${posada.id}`}
                        className="p-2 rounded-lg text-primary/40 hover:text-secondary hover:bg-secondary/5 transition-all"
                        title="Ver posada"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => setConfirmId(posada.id)}
                        className="p-2 rounded-lg text-primary/40 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Eliminar posada"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {localPosadas.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-primary/40">
                  No hay posadas registradas en la plataforma.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
