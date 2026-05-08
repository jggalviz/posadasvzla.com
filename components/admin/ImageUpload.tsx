"use client";

import React, { useState } from "react";
import { Upload, X, CheckCircle2, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  defaultValue?: string;
}

const ImageUpload = ({ onUploadSuccess, defaultValue }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setProgress(0);

      // Preview local instantáneo
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "posadas_preset");

      const xhr = new XMLHttpRequest();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "deiy4t3y1";
      
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          
          // Aplicar optimización automática f_auto, q_auto en la URL
          // Transformamos: .../upload/v123/... -> .../upload/f_auto,q_auto/v123/...
          const optimizedUrl = response.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
          
          onUploadSuccess(optimizedUrl);
          setUploading(false);
        } else {
          console.error("Error en carga:", xhr.responseText);
          alert("Error al subir a Cloudinary. Revisa tu preset y cloud name.");
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        alert("Error de conexión con Cloudinary.");
        setUploading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative group border-2 border-dashed border-primary/20 rounded-3xl p-4 transition-all hover:border-secondary/40 bg-white/50">
        {preview ? (
          <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-inner bg-accent/5">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            
            {uploading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-300">
                <Loader2 className="animate-spin mb-4 text-secondary" size={40} />
                <p className="font-bold mb-2 text-lg">Optimizando imagen...</p>
                <div className="w-full max-w-xs bg-white/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-secondary h-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs mt-2 text-white/70">{progress}% completado</p>
              </div>
            )}

            {!uploading && progress === 100 && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 p-4 rounded-full shadow-2xl animate-in zoom-in duration-500">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
              </div>
            )}

            {!uploading && (
              <button
                onClick={() => { setPreview(null); setProgress(0); }}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg active:scale-90"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
            <div className="p-6 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
              <Upload size={32} className="text-secondary" />
            </div>
            <p className="text-primary font-bold text-lg">Sube la foto principal</p>
            <p className="text-primary/40 text-sm">Cloudinary optimizará el peso automáticamente</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
