"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, CheckCircle2 } from "lucide-react";

export default function PrivateDiningPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here we would normally send to an API
  };

  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <Image src="/images/original/bar-and-lounge-01.jpg" alt="Private Dining Room" fill className="object-cover opacity-60" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/50 to-transparent z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Intimate Gatherings
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Private Dining
          </motion.h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 mb-10 leading-relaxed"
        >
          We offer private dining for parties up to 20 with state-of-the-art audio/visual connectivity. Redz Restaurant is the perfect backdrop to your gathering, rehearsal dinner, birthday celebration, or corporate occasion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a href="#inquire" className="bg-redz-accent text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-redz-charcoal transition-colors">
            Inquire Now
          </a>
          <a href="tel:18563806050" className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded hover:bg-white/5 transition-colors">
            <Phone size={20} className="text-redz-accent" />
            856.380.6050
          </a>
        </motion.div>
      </section>

      <section id="inquire" className="py-24 bg-redz-charcoal-light border-y border-redz-accent/10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-center mb-4">Reserve Your Special Event</h2>
          <p className="text-gray-400 text-center mb-12">Give us details about your private dining event using the form below, and our team will contact you shortly.</p>
          
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-redz-charcoal border border-redz-accent/30 rounded-2xl p-12 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-redz-accent mx-auto mb-6" />
              <h3 className="text-3xl font-serif text-white mb-4">Inquiry Received</h3>
              <p className="text-gray-400">Thank you for considering Redz. Our private dining coordinator will contact you shortly to discuss your event details.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input required type="text" placeholder="First Name" className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
                <input required type="text" placeholder="Last Name" className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input required type="email" placeholder="Email Address" className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
                <input required type="tel" placeholder="Phone Number" className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input required type="date" className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-gray-400" />
                <input required type="number" placeholder="Guest Count (up to 20)" max="20" className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
              </div>
              <textarea placeholder="Event Details & Special Requests" rows={5} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white resize-none"></textarea>
              <button type="submit" className="w-full bg-redz-accent text-white py-4 rounded font-bold hover:bg-white hover:text-redz-charcoal transition-colors">
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
