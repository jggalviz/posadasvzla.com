"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createPosada } from "@/lib/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Info, 
  Zap, 
  Waves, 
  Wifi, 
  Car, 
  Dog,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  PartyPopper
} from "lucide-react";

const posadaSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres"),
  description: z.string().min(20, "Describe mejor tu posada (min 20 caracteres)"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Precio inválido"),
  location: z.string().min(5, "Ubicación requerida"),
  category: z.string().min(1, "Selecciona una categoría"),
  image: z.string().url("Sube una foto principal"),
  amenities: z.array(z.string()).default([]),
});

type PosadaFormValues = z.infer<typeof posadaSchema>;

export default function PublicarPosada() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<PosadaFormValues>({
    resolver: zodResolver(posadaSchema),
    defaultValues: {
      amenities: [],
      category: "Playa",
      image: "",
    },
  });

  const onSubmit = async (data: PosadaFormValues) => {
    console.log("Formulario válido, enviando datos:", data);
    setIsSubmitting(true);
    try {
      const result = await createPosada(data);
      if (result.success) {
        setIsSuccess(true);
        form.reset();
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 3000);
      } else {
        alert("Error al publicar: " + result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error fatal en onSubmit:", err);
      setIsSubmitting(false);
    }
  };

  // Debug de errores de validación
  const onInvalid = (errors: any) => {
    console.log("Errores de validación detectados:", errors);
  };

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["name", "location", "price", "category"];
    } else if (step === 2) {
      fieldsToValidate = ["description"];
    }

    const isStepValid = await form.trigger(fieldsToValidate as any);
    
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  if (isSuccess) {
    return (
      <div className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center px-6">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl text-center max-w-lg w-full animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <PartyPopper size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">¡Posada Publicada!</h1>
          <p className="text-primary/60 text-lg mb-8">
            Tu propiedad ya está registrada y lista para recibir clientes. Estamos redirigiéndote al panel de administración...
          </p>
          <div className="w-full bg-accent/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-[progress_3s_linear]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/10 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                step >= num ? "bg-secondary text-white shadow-lg" : "bg-white text-primary/30 border border-primary/10"
              }`}
            >
              {step > num ? <CheckCircle size={20} /> : num}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-primary/5 p-8 md:p-12">
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-top">
                <p className="text-red-600 text-sm font-bold flex items-center gap-2">
                  <Info size={16} /> Hay errores en el formulario. Por favor, revisa todos los pasos.
                </p>
              </div>
            )}
            {/* Paso 1: Información Básica */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Información Básica</h2>
                <p className="text-primary/80 mb-8">Cuéntanos sobre tu propiedad.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Nombre de la Posada</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
                      <input 
                        {...form.register("name")}
                        className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none"
                        placeholder="Ej: Posada Los Roques Luxury"
                      />
                    </div>
                    {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Ubicación</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
                      <input 
                        {...form.register("location")}
                        className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none"
                        placeholder="Ej: Gran Roque, Dependencias Federales"
                      />
                    </div>
                    {form.formState.errors.location && <p className="text-red-500 text-xs mt-1">{form.formState.errors.location.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-primary mb-2">Precio / Noche ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
                        <input 
                          {...form.register("price")}
                          className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none"
                          placeholder="150"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary mb-2">Categoría</label>
                      <select 
                        {...form.register("category")}
                        className="w-full px-4 py-4 bg-accent/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none appearance-none"
                      >
                        <option value="Playa">Playa</option>
                        <option value="Montaña">Montaña</option>
                        <option value="Selva">Selva</option>
                        <option value="Llanos">Llanos</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-12">
                  <button 
                    type="button" 
                    onClick={handleNextStep}
                    className="flex items-center gap-2 bg-primary text-white py-4 px-8 rounded-2xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Detalles y Servicios */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Detalles y Servicios</h2>
                <p className="text-primary/80 mb-8">¿Qué hace especial a tu posada?</p>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Descripción</label>
                    <textarea 
                      {...form.register("description")}
                      className="w-full p-4 bg-accent/5 border border-primary/10 rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none h-40 resize-none"
                      placeholder="Describe la experiencia, las habitaciones y el entorno..."
                    />
                    {form.formState.errors.description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-4">Servicios Incluidos</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AmenityCheckbox icon={<Zap size={18}/>} label="Planta Eléctrica" value="planta" form={form} />
                      <AmenityCheckbox icon={<Waves size={18}/>} label="Tanque de Agua" value="tanque" form={form} />
                      <AmenityCheckbox icon={<Wifi size={18}/>} label="WiFi Satelital" value="wifi" form={form} />
                      <AmenityCheckbox icon={<Car size={18}/>} label="Estacionamiento 4x4" value="estacionamiento" form={form} />
                      <AmenityCheckbox icon={<Dog size={18}/>} label="Pet Friendly" value="pet" form={form} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-12">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex items-center gap-2 text-primary/60 font-bold"
                  >
                    <ChevronLeft size={20} /> Atrás
                  </button>
                  <button 
                    type="button" 
                    onClick={handleNextStep}
                    className="flex items-center gap-2 bg-primary text-white py-4 px-8 rounded-2xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Fotos y Confirmación */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Fotos de la Posada</h2>
                <p className="text-primary/80 mb-8">La primera impresión es la más importante.</p>

                <ImageUpload 
                  onUploadSuccess={(url) => form.setValue("image", url, { shouldValidate: true })} 
                  defaultValue={form.watch("image")}
                />
                {form.formState.errors.image && <p className="text-red-500 text-xs mt-4 text-center">{form.formState.errors.image.message}</p>}

                <div className="mt-12 p-6 bg-accent/5 rounded-2xl border border-primary/5">
                  <div className="flex items-start gap-3">
                    <Info className="text-secondary shrink-0" size={20} />
                    <p className="text-xs text-primary/80">
                      Al publicar, aceptas que la información proporcionada es verídica. Tu posada será revisada por nuestro equipo antes de aparecer en los resultados destacados.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-12">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex items-center gap-2 text-primary/60 font-bold"
                  >
                    <ChevronLeft size={20} /> Atrás
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 bg-secondary text-white py-4 px-12 rounded-2xl font-bold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-secondary/20 disabled:opacity-50 min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> Publicando...
                      </>
                    ) : (
                      "Publicar Ahora"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function AmenityCheckbox({ icon, label, value, form }: { icon: React.ReactNode, label: string, value: string, form: any }) {
  const selected = form.watch("amenities").includes(value);
  
  const toggle = () => {
    const current = form.getValues("amenities");
    if (selected) {
      form.setValue("amenities", current.filter((v: string) => v !== value));
    } else {
      form.setValue("amenities", [...current, value]);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
        selected 
          ? "bg-secondary/10 border-secondary text-primary" 
          : "bg-white border-primary/10 text-primary/40 hover:border-primary/20"
      }`}
    >
      <div className={`${selected ? "text-secondary" : "text-primary/20"}`}>
        {icon}
      </div>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
