import React from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Iniciar Sesión | PosadasVzla",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-32">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-primary/5">
        <LoginForm />
      </div>
    </main>
  );
}
