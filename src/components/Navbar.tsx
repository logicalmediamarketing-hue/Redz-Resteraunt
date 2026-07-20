"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-redz-charcoal/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="w-full bg-redz-accent/10 border-b border-redz-accent/20 backdrop-blur-sm text-white text-xs md:text-sm font-bold tracking-wider text-center py-2 hover:bg-redz-accent/20 transition-colors">
        <a href="https://www.hilton.com/en/hotels/phlfrdt-doubletree-suites-mt-laurel/" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          DoubleTree Suites by Hilton Mt Laurel
        </a>
      </div>
      <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
        <BrandLogo priority />
        
        <div className="hidden md:flex items-center gap-x-7 text-[15px] font-semibold tracking-wide text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65)]">
          <Link href="/menus" className="hover:text-redz-accent transition-colors">Menus</Link>
          <Link href="/private-dining" className="hover:text-redz-accent transition-colors">Private Dining</Link>
          <Link href="/banquets" className="hover:text-redz-accent transition-colors">Banquets</Link>
          <Link href="/news" className="hover:text-redz-accent transition-colors">News</Link>
          <Link href="/about" className="hover:text-redz-accent transition-colors">About</Link>
          <Link href="/contact" className="hover:text-redz-accent transition-colors">Contact</Link>
        </div>

        <div className="hidden md:block">
          <Link href="/private-dining" className="bg-gradient-to-b from-white to-slate-100 text-zinc-950 border border-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] hover:from-white hover:to-white hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_30px_rgba(0,0,0,0.28)] px-6 py-3 rounded-md font-bold transition-all duration-300">
            Book Now
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-redz-charcoal/95 backdrop-blur-lg flex flex-col p-6 space-y-4 md:hidden"
          >
            <Link href="/menus" className="text-white text-2xl font-semibold tracking-wide hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Menus</Link>
            <Link href="/private-dining" className="text-white text-2xl font-semibold tracking-wide hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Private Dining</Link>
            <Link href="/banquets" className="text-white text-2xl font-semibold tracking-wide hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Banquets</Link>
            <Link href="/news" className="text-white text-2xl font-semibold tracking-wide hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
            <Link href="/about" className="text-white text-2xl font-semibold tracking-wide hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="text-white text-2xl font-semibold tracking-wide hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link href="/private-dining" className="bg-gradient-to-b from-white to-slate-100 text-zinc-950 border border-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] hover:from-white hover:to-white hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_30px_rgba(0,0,0,0.28)] px-6 py-3 rounded-md font-bold text-center mt-4 transition-all duration-300">
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
