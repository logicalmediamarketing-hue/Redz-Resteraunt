"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIConcierge from "@/components/AIConcierge";
import GoogleReviews from "@/components/GoogleReviews";

export default function Home() {
  const { scrollY } = useScroll();
  
  // Cinematic Text Fade & Drop
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);
  const yText = useTransform(scrollY, [0, 400], ["0px", "150px"]);
  const scaleText = useTransform(scrollY, [0, 400], [1, 0.9]);

  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Cinematic Parallax Hero */}
      <section className="relative h-[100svh] w-full flex items-center justify-center bg-redz-charcoal pt-[120px]">
        <div className="absolute top-0 left-0 w-full h-[140svh] z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/original/hero-bg-v2-poster.jpg"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-bg-v2.mp4" type="video/mp4" />
          </video>
          {/* Gradient to smoothly blend the extended video into the background color */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-redz-charcoal z-10"></div>
          <div className="absolute inset-0 bg-redz-charcoal/20 z-10"></div>
        </div>
        
        <motion.div 
          style={{ opacity: opacityText, y: yText, scale: scaleText }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl">
            Inspired American Fare.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-light">
            An elevated dining experience combining authentic flavors, craft pairings, and modern luxury.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/reservations" className="bg-gradient-to-b from-white to-slate-100 text-zinc-950 border border-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] hover:from-white hover:to-white hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_30px_rgba(0,0,0,0.28)] transition-all duration-300 px-8 py-4 rounded font-bold text-lg">
              Reserve a Table
            </Link>
            <Link href="/menus" className="bg-white/5 border border-white/30 text-white backdrop-blur-sm hover:bg-white/15 hover:border-white/60 transition-all duration-300 px-8 py-4 rounded font-bold text-lg">
              Explore Menus
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Ultra Premium Bento Grid - Experience */}
      <section id="menus" className="py-32 px-6 max-w-7xl mx-auto relative z-10 pt-48">
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
            <Image src="/images/signature-burger.jpg" alt="Signature Dish" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/40 to-transparent flex flex-col justify-end p-8">
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
            className="relative rounded-2xl overflow-hidden group bg-gradient-to-br from-redz-charcoal-light to-black/40 border border-white/10 p-8 flex flex-col justify-center"
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
            <Image 
              src="/images/original/craft-cocktails.jpg" 
              alt="Craft Pairings" 
              fill 
              quality={100}
              className="object-cover object-[50%_80%] transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/40 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-serif text-redz-accent mb-2">Craft Pairings</h3>
              <p className="text-gray-200">Featuring local NJ favorites like Kane Brewing.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Banquets Callout */}
      <section id="banquets" className="relative py-32 border-y border-white/5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/images/ballroom-bqt1-optimized.jpg" alt="Falls Grand Ballroom" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-redz-charcoal/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/40 to-redz-charcoal"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Host Your Event</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            From intimate private dining to grand celebrations in the Falls Grand Ballroom, complete with elegant Koi ponds and waterfalls.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/private-dining" className="inline-flex items-center gap-2 bg-gradient-to-b from-white to-slate-100 text-zinc-950 border border-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] hover:from-white hover:to-white hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_30px_rgba(0,0,0,0.28)] transition-all duration-300 px-10 py-4 rounded font-bold text-lg">
              Private Dining at Redz
            </Link>
            <a href="https://doubletree-weddings.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/5 border border-white/30 text-white backdrop-blur-sm hover:bg-white/15 hover:border-white/60 transition-all duration-300 px-10 py-4 rounded font-bold text-lg">
              Explore DoubleTree Events
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <AIConcierge />
    </main>
  );
}
