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
    // Assuming renamed implementation: frame_000.jpg
    // We have 191 frames (0 to 190, or 001 to 191? Let's assume 0-indexed or check script)
    // The script regex was /frame_(\d{3})/, preserving the number. Original were 000 to 191.
    // So we can just use the index formatted to 3 digits.
    const paddedIndex = String(index).padStart(3, "0");
    return `/sequence/frame_${paddedIndex}.jpg`;
  }, []);

  return (
    <main className="min-h-screen bg-cream selection:bg-brick selection:text-cream">
      <JsonLd />
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-timber">
          <div className="font-serif text-2xl font-bold tracking-tight">
            COLMAR<span className="text-brick">.</span>
          </div>

          <nav className="flex items-center gap-8">
            <a href="#" className="hidden md:block text-sm font-medium uppercase tracking-widest hover:text-brick transition-colors">Collections</a>
            <a href="#" className="hidden md:block text-sm font-medium uppercase tracking-widest hover:text-brick transition-colors">Notre Histoire</a>
            <button className="relative p-2 hover:text-brick transition-colors">
              <ShoppingBag size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-brick rounded-full"></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Scrollytelling */}
      {/* Frame count is 93 based on new assets */}
      <div className="relative">
        <ScrollSequence frameCount={93} getFramePath={getFramePath} />

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-cream drop-shadow-lg mb-6 tracking-tight opacity-90">
              Colmar. <br />
              <span className="text-4xl md:text-6xl lg:text-7xl italic font-light">L'âme de l'Alsace.</span>
            </h1>
            <p className="text-cream/90 text-lg md:text-xl font-light tracking-wide max-w-lg mx-auto drop-shadow-md">
              Plus qu'une affiche, un fragment d'histoire à chérir chez soi.
            </p>
          </div>
        </div>
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
