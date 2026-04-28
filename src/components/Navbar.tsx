"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-redz-charcoal/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/original/logo.png" alt="Redz Restaurant Logo" width={100} height={35} className="object-contain" />
        </Link>
        
        <div className="hidden md:flex space-x-8 text-white font-medium">
          <Link href="/menus" className="hover:text-redz-accent transition-colors">Menus</Link>
          <Link href="/private-dining" className="hover:text-redz-accent transition-colors">Private Dining</Link>
          <Link href="/banquets" className="hover:text-redz-accent transition-colors">Banquets</Link>
          <Link href="/news" className="hover:text-redz-accent transition-colors">News</Link>
          <Link href="/about" className="hover:text-redz-accent transition-colors">About</Link>
          <Link href="/contact" className="hover:text-redz-accent transition-colors">Contact</Link>
        </div>

        <div className="hidden md:block">
          <Link href="https://redzrestaurant.com/reservations" target="_blank" className="bg-redz-accent text-redz-charcoal px-6 py-3 rounded-md font-bold hover:bg-white transition-colors">
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
            <Link href="/menus" className="text-white text-xl hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Menus</Link>
            <Link href="/private-dining" className="text-white text-xl hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Private Dining</Link>
            <Link href="/banquets" className="text-white text-xl hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Banquets</Link>
            <Link href="/news" className="text-white text-xl hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
            <Link href="/about" className="text-white text-xl hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="text-white text-xl hover:text-redz-accent" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link href="https://redzrestaurant.com/reservations" target="_blank" className="bg-redz-accent text-redz-charcoal px-6 py-3 rounded-md font-bold text-center mt-4">
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
