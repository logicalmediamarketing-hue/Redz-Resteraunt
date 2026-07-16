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
      <section className="relative h-[50vh] min-h-[450px] w-full mb-16 pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[75vh] z-0 pointer-events-none">
          <Image src="/images/original/about_hero.jpg" alt="Our Story" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/60 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8 md:pt-12">
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

      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 space-y-6 leading-relaxed"
        >
          <p>Located at the DoubleTree Suites by Hilton Hotel Mt Laurel, Redz Restaurant & Bar serves authentic specialties from all over the country.</p>
          <p>We are known for our carefully chosen and locally sourced in-season ingredients, with an imaginative approach to many of the foods you know and love—as well as many others you&apos;ll be delighted to discover.</p>
          <p>Bringing over three decades of global experience to Redz&apos;s kitchen, our chefs invite you to join us for lunch, dinner, and casual fare throughout the day and evening.</p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif text-white mb-6"
          >
            Meet Our Team
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-24 h-1 bg-redz-accent mx-auto origin-center"
          />
        </div>

        <div className="flex justify-center max-w-md mx-auto">
          {/* Head Chef */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-gray-800 shadow-2xl w-full"
          >
            <div className="relative h-[400px] w-full overflow-hidden">
              <Image 
                src="/images/staff/head_chef.png" 
                alt="Executive Chef Kevin" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
            </div>
            <div className="relative p-8 -mt-12 text-center bg-[#1A1A1A] z-10 mx-4 rounded-xl border border-gray-800 shadow-xl">
              <h3 className="text-2xl font-serif text-white mb-1">Kevin</h3>
              <p className="text-redz-accent uppercase tracking-widest text-xs font-semibold mb-4">Executive Chef</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                With over two decades of culinary mastery across Europe and the Americas, Chef Kevin brings an unparalleled dedication to authentic flavors and locally sourced, seasonal ingredients.
              </p>
            </div>
          </motion.div>
        </div>
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
