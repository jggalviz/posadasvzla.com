"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User, Menu, X, LayoutDashboard, PlusCircle, LogOut, ChevronDown, Building2, Home } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHomePage = pathname === "/";
  const useWhiteText = isHomePage && !isScrolled;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "owner") return "/owner/dashboard";
    return "/guest/profile";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isHomePage ? "glass py-3 shadow-sm border-b border-primary/5" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className={`text-2xl font-playfair font-bold tracking-tight transition-colors ${
          useWhiteText ? "text-white" : "text-primary"
        }`}>
          Posadas<span className="text-secondary">Vzla</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/explorar" className={`font-medium hover:text-secondary transition-colors ${useWhiteText ? "text-white" : "text-primary"}`}>
            Explorar
          </Link>

          {/* Show dashboard link based on role */}
          {role === "admin" && (
            <Link href="/admin/dashboard" className={`font-medium hover:text-secondary transition-colors flex items-center gap-1.5 ${useWhiteText ? "text-white" : "text-primary"}`}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
          {(role === "owner" || role === "admin") && (
            <Link href="/admin/publicar" className={`font-medium hover:text-secondary transition-colors flex items-center gap-1.5 ${useWhiteText ? "text-white" : "text-primary"}`}>
              <PlusCircle size={16} /> Publicar Posada
            </Link>
          )}

          {/* Auth Button */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-white border border-primary/10 px-4 py-2 rounded-xl font-bold text-primary hover:border-secondary/30 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                  {profile?.full_name?.[0] ?? "U"}
                </div>
                <span className="max-w-[100px] truncate text-sm">{profile?.full_name?.split(" ")[0]}</span>
                <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-primary/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-4 py-3 border-b border-primary/5">
                    <p className="font-bold text-primary text-sm truncate">{profile?.full_name}</p>
                    <p className="text-primary/40 text-xs truncate">{profile?.email}</p>
                    <span className="inline-block mt-1 bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {role === "admin" ? "Administrador" : role === "owner" ? "Dueño" : "Huésped"}
                    </span>
                  </div>
                  <Link href={getDashboardLink()} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                    <LayoutDashboard size={16} className="text-secondary" /> Mi Panel
                  </Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className={`font-medium hover:text-secondary transition-colors ${useWhiteText ? "text-white" : "text-primary"}`}>
                Entrar
              </Link>
              <Link href="/auth/signup" className="btn-terracotta flex items-center gap-2">
                <User size={18} />
                <span>Registrarse</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 focus:outline-none ${useWhiteText ? "text-white" : "text-primary"}`}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300 shadow-xl border-t border-primary/5">
          <Link href="/explorar" className="text-primary font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>Explorar</Link>
          {(role === "owner" || role === "admin") && (
            <Link href="/admin/publicar" className="text-primary font-medium text-lg py-2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <PlusCircle size={20} /> Publicar Posada
            </Link>
          )}
          {user ? (
            <>
              <Link href={getDashboardLink()} className="text-primary font-medium text-lg py-2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard size={20} /> Mi Panel
              </Link>
              <button onClick={handleSignOut} className="text-red-500 font-medium text-lg py-2 flex items-center gap-2">
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-primary font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
              <Link href="/auth/signup" className="btn-terracotta w-full text-center py-4" onClick={() => setIsMenuOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
