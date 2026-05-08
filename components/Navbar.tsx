"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, X, LayoutDashboard, PlusCircle } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determinar si debemos usar texto blanco (solo en la Home y cuando no hay scroll)
  const isHomePage = pathname === "/";
  const useWhiteText = isHomePage && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? "glass py-3 shadow-sm border-b border-primary/5" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className={`text-2xl font-playfair font-bold tracking-tight transition-colors ${
          useWhiteText ? "text-white" : "text-primary"
        }`}>
          Posadas<span className="text-secondary">Vzla</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/explorar" 
            className={`font-medium hover:text-secondary transition-colors ${
              useWhiteText ? "text-white" : "text-primary"
            }`}
          >
            Explorar
          </Link>
          <Link 
            href="/admin/dashboard" 
            className={`font-medium hover:text-secondary transition-colors flex items-center gap-1.5 ${
              useWhiteText ? "text-white" : "text-primary"
            }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link 
            href="/admin/publicar" 
            className={`font-medium hover:text-secondary transition-colors flex items-center gap-1.5 ${
              useWhiteText ? "text-white" : "text-primary"
            }`}
          >
            <PlusCircle size={16} />
            Publicar Posada
          </Link>
          <button className="btn-terracotta flex items-center gap-2">
            <User size={18} />
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 focus:outline-none transition-colors ${
              useWhiteText ? "text-white" : "text-primary"
            }`}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300 shadow-xl border-t border-primary/5">
          <Link 
            href="/explorar" 
            className="text-primary font-medium text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Explorar
          </Link>
          <Link 
            href="/admin/dashboard" 
            className="text-primary font-medium text-lg py-2 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link 
            href="/admin/publicar" 
            className="text-primary font-medium text-lg py-2 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <PlusCircle size={20} />
            Publicar Posada
          </Link>
          <button className="btn-terracotta w-full flex justify-center items-center gap-2 py-4">
            <User size={18} />
            <span>Iniciar Sesión</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
