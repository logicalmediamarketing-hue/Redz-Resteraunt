"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIConcierge from "@/components/AIConcierge";

export default function Home() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], ["0%", "50%"]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Cinematic Parallax Hero */}
      <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Redz Restaurant Interior"
            fill
            priority
            className="object-cover opacity-60"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-accent/20 to-transparent z-10"></div>
        
        <motion.div 
          style={{ opacity: opacityText }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            animate={{ boxShadow: ["0 0 0px 0px rgba(158,0,0,0)", "0 0 20px 2px rgba(158,0,0,0.6)", "0 0 0px 0px rgba(158,0,0,0)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-sm font-medium tracking-widest uppercase text-red-50"
          >
            DoubleTree Suites, Mt Laurel NJ
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl">
            Inspired American Fare.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-light">
            An elevated dining experience combining authentic flavors, craft pairings, and modern luxury.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://redzrestaurant.com/reservations" target="_blank" rel="noopener noreferrer" className="bg-redz-accent text-redz-charcoal px-8 py-4 rounded font-bold hover:bg-white transition-colors text-lg">
              Reserve a Table
            </a>
            <Link href="/menus" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded font-bold hover:bg-white/10 transition-colors text-lg backdrop-blur-sm">
              Explore Menus
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Ultra Premium Bento Grid - Experience */}
      <section id="menus" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">The Redz Experience</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Discover our globally-inspired, locally-sourced creations crafted by world-class chefs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Large Main Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group"
          >
            <Image src="/images/original/bone-in-rib-eye.jpg" alt="Signature Dish" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-accent/40 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl font-serif text-redz-accent mb-2">Signature Fare</h3>
              <p className="text-gray-200 max-w-md">Indulge in our house-made Kobe beef meatballs, crispy tempura butternut squash, and bacon-wrapped jumbo shrimp.</p>
            </div>
          </motion.div>

          {/* Secondary Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden group bg-gradient-to-br from-redz-charcoal-light to-redz-accent/10 border border-redz-accent/20 p-8 flex flex-col justify-center shadow-[inset_0_0_20px_rgba(158,0,0,0.1)]"
          >
            <h3 className="text-2xl font-serif text-redz-accent mb-4">Breakfast & Dinner</h3>
            <p className="text-gray-400 mb-6">Join us for a casual morning start or an elegant evening out.</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Breakfast</span> <span>6:30 AM - 11:30 AM</span></li>
              <li className="flex justify-between pt-2"><span>Dinner</span> <span>4:00 PM - 10:00 PM</span></li>
            </ul>
          </motion.div>

          {/* Third Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden group"
          >
            <Image src="/images/original/happy-hour.jpg" alt="Craft Pairings" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-accent/40 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-serif text-redz-accent mb-2">Craft Pairings</h3>
              <p className="text-gray-200">Featuring local NJ favorites like Kane Brewing.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Banquets Callout */}
      <section id="banquets" className="py-24 bg-redz-charcoal-light border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Host Your Event</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            From intimate private dining to grand celebrations in the Falls Grand Ballroom, complete with elegant Koi ponds and waterfalls.
          </p>
          <Link href="/banquets" className="inline-block border border-redz-accent text-redz-accent px-10 py-4 rounded font-bold hover:bg-redz-accent hover:text-redz-charcoal transition-colors text-lg">
            Inquire About Banquets
          </Link>
        </div>
      </section>

      <Footer />
      <AIConcierge />
    </main>
  );
}
