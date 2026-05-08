"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const { error, data: authData } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError("Credenciales incorrectas. Verifica tu email y contraseña.");
      return;
    }

    // Fetch profile to get role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    const role = profile?.role;
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "owner") router.push("/owner/dashboard");
    else router.push("/");
    
    router.refresh();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-playfair font-bold text-primary mb-2">Bienvenido</h1>
        <p className="text-primary/60">Inicia sesión en tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-primary">Contraseña</label>
            <Link href="/auth/reset-password" className="text-xs text-secondary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña"
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
          Iniciar Sesión
        </button>
      </form>

      <p className="text-center text-primary/50 mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/signup" className="text-secondary font-bold hover:underline">
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
