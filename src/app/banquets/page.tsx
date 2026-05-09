"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, ExternalLink } from "lucide-react";

export default function BanquetsPage() {
  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[450px] w-full mb-16 pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[75vh] z-0 pointer-events-none">
          <Image unoptimized src="/images/download-1-hq.png" alt="Falls Grand Ballroom" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/60 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Up to 300 Guests
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Weddings & Special Events
          </motion.h1>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 space-y-6 mb-10 leading-relaxed"
        >
          <p>We host large celebrations including weddings, corporate outings, and all other special events. Enjoy the same attention to detail and fare offered in Redz Restaurant right here in our Mt Laurel, NJ ballrooms.</p>
          <p>For a complete overview of our venues, event packages, and to request a formal proposal, please visit our dedicated DoubleTree Events website.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a href="https://doubletree-weddings.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-redz-accent text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-redz-charcoal transition-colors">
            Explore The Venue Site
            <ExternalLink size={20} />
          </a>
          <a href="tel:18567788999" className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded hover:bg-white/5 transition-colors">
            <Phone size={20} className="text-redz-accent" />
            856.778.8999
          </a>
        </motion.div>
      </section>

      <section className="py-24 bg-redz-charcoal-light border-y border-redz-accent/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-white mb-6">The Falls Grand Ballroom</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">Discover an uncompromising commitment to exceptional service, elegant spaces, and your perfect event. View our capacities, cinematic venue tours, and submit your Request for Proposal instantly.</p>
          <a href="https://doubletree-weddings.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-redz-accent text-redz-accent px-10 py-4 rounded font-bold hover:bg-redz-accent hover:text-white transition-all duration-300">
            Visit DoubleTree Events <ExternalLink size={20} />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
