"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, ExternalLink, ChevronRight } from "lucide-react";

const DOUBLETREE_EVENTS_URL = "https://doubletree-weddings.vercel.app/";

export default function BanquetsPage() {
  return (
    <main className="min-h-screen bg-redz-charcoal text-white relative">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[450px] w-full mb-16 pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[75vh] z-0 pointer-events-none">
          <Image src="/images/download-1-hq.png" alt="Falls Grand Ballroom" fill className="object-cover opacity-60" priority />
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
          <p>For venue details, event packages, and to request a formal proposal, continue on our dedicated DoubleTree Events site.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href={DOUBLETREE_EVENTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-b from-white to-slate-100 text-zinc-950 border border-white px-8 py-4 rounded font-bold shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] hover:from-white hover:to-white hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_30px_rgba(0,0,0,0.28)] transition-all duration-300"
          >
            Explore DoubleTree Events
            <ExternalLink size={20} />
          </a>
          <a href="tel:18567788999" className="flex items-center justify-center gap-2 bg-white/5 border border-white/30 text-white backdrop-blur-sm px-8 py-4 rounded hover:bg-white/15 hover:border-white/60 transition-all duration-300">
            <Phone size={20} className="text-redz-accent" />
            856.778.8999
          </a>
        </motion.div>
      </section>

      <section className="py-24 bg-redz-charcoal-light border-y border-redz-accent/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-white mb-6">The Falls Grand Ballroom</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">Discover elegant spaces, capacities, cinematic venue tours, and submit your Request for Proposal on the DoubleTree Events site.</p>
          <a
            href={DOUBLETREE_EVENTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/30 text-white backdrop-blur-sm px-10 py-4 rounded font-bold hover:bg-white/15 hover:border-white/60 transition-all duration-300"
          >
            Request a Proposal
            <ExternalLink size={18} />
          </a>
          <p className="text-gray-500 text-sm mt-10">
            Planning something more intimate?{" "}
            <Link href="/private-dining" className="text-gray-300 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white transition-colors inline-flex items-center gap-1">
              Inquire about private dining at Redz
              <ChevronRight size={14} />
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
