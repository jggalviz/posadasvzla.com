"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2, Home, Building2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  full_name: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  role: z.enum(["guest", "owner"]),
});

type FormData = z.infer<typeof schema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "guest" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📬</span>
        </div>
        <h2 className="text-3xl font-playfair font-bold text-primary mb-4">¡Revisa tu correo!</h2>
        <p className="text-primary/70 text-lg max-w-sm mx-auto">
          Te enviamos un enlace de confirmación a tu email. Haz clic en él para activar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-playfair font-bold text-primary mb-2">Crear Cuenta</h1>
        <p className="text-primary/60">Únete a la comunidad PosadasVzla</p>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setValue("role", "guest")}
          className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
            selectedRole === "guest"
              ? "border-secondary bg-secondary/5 shadow-lg"
              : "border-primary/10 bg-white hover:border-secondary/30"
          }`}
        >
          <Home size={28} className={selectedRole === "guest" ? "text-secondary" : "text-primary/40"} />
          <div>
            <p className="font-bold text-primary text-sm">Soy Huésped</p>
            <p className="text-primary/40 text-xs">Busco posadas</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setValue("role", "owner")}
          className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
            selectedRole === "owner"
              ? "border-secondary bg-secondary/5 shadow-lg"
              : "border-primary/10 bg-white hover:border-secondary/30"
          }`}
        >
          <Building2 size={28} className={selectedRole === "owner" ? "text-secondary" : "text-primary/40"} />
          <div>
            <p className="font-bold text-primary text-sm">Soy Dueño</p>
            <p className="text-primary/40 text-xs">Tengo una posada</p>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-primary mb-2">Nombre Completo</label>
          <input
            {...register("full_name")}
            placeholder="José González"
            className="w-full px-5 py-3.5 bg-white border border-primary/10 rounded-xl text-primary focus:ring-2 focus:ring-secondary/20 outline-none"
          />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-primary mb-2">Correo Electrónico</label>
          <input
            {...register("email")}
            type="email"
            placeholder="tu@email.com"
            className="w-full px-5 py-3.5 bg-white border border-primary/10 rounded-xl text-primary focus:ring-2 focus:ring-secondary/20 outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-primary mb-2">Contraseña</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-5 py-3.5 bg-white border border-primary/10 rounded-xl text-primary focus:ring-2 focus:ring-secondary/20 outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
          Crear mi Cuenta
        </button>
      </form>

      <p className="text-center text-primary/50 mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-secondary font-bold hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
