import React from "react";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = {
  title: "Crear Cuenta | PosadasVzla",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-32">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-primary/5">
        <SignUpForm />
      </div>
    </main>
  );
}
