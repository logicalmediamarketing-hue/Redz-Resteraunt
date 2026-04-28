"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <Image src="/images/original/chicken-asparagas-tomato.jpg" alt="Our Story" fill className="object-cover opacity-60" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/50 to-transparent z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Our Story
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Authentic American Cuisine
          </motion.h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 space-y-6 leading-relaxed"
        >
          <p>Located at the DoubleTree Suites by Hilton Hotel Mt Laurel, Redz Restaurant & Bar serves authentic specialties from all over the country.</p>
          <p>We are known for our carefully chosen and locally sourced in-season ingredients, with an imaginative approach to many of the foods you know and love—as well as many others you'll be delighted to discover.</p>
          <p>Bringing over three decades of global experience to Redz's kitchen, our chefs invite you to join us for lunch, dinner, and casual fare throughout the day and evening.</p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-24">

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative h-[300px] rounded-2xl overflow-hidden mt-12"
            >
              <Image src="/images/original/chicken-asparagas-tomato.jpg" alt="Steak Dish" fill className="object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative h-[300px] rounded-2xl overflow-hidden"
            >
              <Image src="/images/original/bar-and-lounge-01.jpg" alt="Wine Pouring" fill className="object-cover" />
            </motion.div>
          </div>
      </section>

      <Footer />
    </main>
  );
}
