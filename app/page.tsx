"use client";

import ScrollSequence from "@/components/hero/ScrollSequence";
import AboutSection from "@/components/home/AboutSection";
import ProductGrid from "@/components/home/ProductGrid";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import JsonLd from "@/components/seo/JsonLd";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hero section is 500vh, animation ends when we scroll 400vh (container - sticky view)
      // We want transparency to last until we pass the hero section
      const threshold = window.innerHeight * 4;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getFramePath = useCallback((index: number) => {
    return `/frames/frame_${index.toString().padStart(3, "0")}.jpg`;
  }, []);

  return (
    <main className="min-h-screen bg-timber text-timber w-full">
      <JsonLd />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-cream/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6 text-cream"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight">Colmar.</span>
          </div>

          <nav className="flex items-center gap-8">
            <a href="#" className="hidden md:block text-sm font-medium uppercase tracking-widest hover:text-brick transition-colors">Boutique</a>
            <a href="#" className="hidden md:block text-sm font-medium uppercase tracking-widest hover:text-brick transition-colors">À propos</a>
            <button className="relative p-2 hover:text-brick transition-colors">
              <ShoppingBag size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-brick rounded-full"></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Scrollytelling */}
      {/* Frame count is 76 based on new assets */}
      <div className="relative">
        <ScrollSequence frameCount={76} getFramePath={getFramePath} />
      </div>

      {/* Content Sections */}
      <div className="relative z-10 bg-cream">
        <AboutSection />
        <ProductGrid />
      </div>

      {/* Footer */}
      <footer className="bg-timber text-cream py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-serif text-2xl mb-4">COLMAR.</h4>
            <p className="text-white/60 text-sm max-w-xs mx-auto md:mx-0">
              L'esprit de Colmar, capturé pour votre intérieur. Imaginé ici, imprimé en France.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-medium uppercase tracking-widest text-xs text-white/40 mb-2">Nos Collections</h5>
            <a href="#" className="hover:text-brick transition-colors">Toutes les affiches</a>
            <a href="#" className="hover:text-brick transition-colors">Lieux de Mémoire</a>
            <a href="#" className="hover:text-brick transition-colors">Éditions Limitées</a>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-medium uppercase tracking-widest text-xs text-white/40 mb-2">Social</h5>
            <a href="#" className="hover:text-brick transition-colors">Instagram</a>
            <a href="#" className="hover:text-brick transition-colors">Pinterest</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          &copy; 2026 Colmar Posters. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
