"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MenusPage() {
  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <Image src="/images/original/bone-in-rib-eye.jpg" alt="Our Menus" fill className="object-cover opacity-60" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/50 to-transparent z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Culinary Excellence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Our Menus
          </motion.h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 leading-relaxed"
        >
          Whether you're enjoying a relaxed lunch, a memorable dinner, or a casual bite in the bar, you'll appreciate our chef's passionate attention to detail.
        </motion.p>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dinner */}
          <motion.a
            href="#"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative h-[400px] rounded-2xl overflow-hidden group block"
          >
            <Image src="/images/original/prime-rib.jpg" alt="Dinner" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-accent/40 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-4xl font-serif text-redz-accent mb-2">Dinner</h2>
              <p className="text-gray-200 mb-4">Authentic specialties from all over the country. Mon-Sat 4:00pm - 10:00pm.</p>
              <span className="inline-block text-sm uppercase tracking-wider border border-white/30 px-4 py-2 rounded backdrop-blur-sm group-hover:bg-redz-accent group-hover:border-redz-accent transition-colors w-fit">
                View Dinner Menu
              </span>
            </div>
          </motion.a>

          {/* Happy Hour */}
          <motion.a
            href="#"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative h-[400px] rounded-2xl overflow-hidden group block"
          >
            <Image src="/images/original/happy-hour.jpg" alt="Happy Hour" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-accent/40 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-4xl font-serif text-redz-accent mb-2">Happy Hour</h2>
              <p className="text-gray-200 mb-4">Join us at the bar Monday-Friday from 4:00pm to 6:00pm.</p>
              <span className="inline-block text-sm uppercase tracking-wider border border-white/30 px-4 py-2 rounded backdrop-blur-sm group-hover:bg-redz-accent group-hover:border-redz-accent transition-colors w-fit">
                View Happy Hour Menu
              </span>
            </div>
          </motion.a>

          {/* Breakfast */}
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 relative rounded-2xl overflow-hidden group bg-gradient-to-br from-redz-charcoal-light to-redz-accent/10 border border-redz-accent/20 p-12 flex flex-col md:flex-row justify-between items-center shadow-[inset_0_0_20px_rgba(158,0,0,0.1)]"
          >
            <div className="absolute inset-0 z-0">
              <Image src="/images/original/appetizer-spread-with-beer.jpg" alt="Breakfast Background" fill className="object-cover opacity-20 transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="relative z-10 max-w-xl text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-4xl font-serif text-redz-accent mb-4">Breakfast</h2>
              <p className="text-gray-300">Start your morning right. Mon-Fri 6:30am - 10:30am. Sat-Sun 7:00am - 11:30am.</p>
            </div>
            <span className="inline-block text-sm uppercase tracking-wider border border-redz-accent text-redz-accent px-6 py-3 rounded hover:bg-redz-accent hover:text-white transition-colors">
              View Breakfast Menu
            </span>
          </motion.a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
