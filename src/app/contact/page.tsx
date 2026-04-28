"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <Image src="/images/original/cypress-room-round-tables.jpg" alt="Contact Us" fill className="object-cover opacity-60" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/50 to-transparent z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Get In Touch
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Contact Redz
          </motion.h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-24">

        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-redz-charcoal-light border border-white/5 rounded-2xl p-10 shadow-2xl"
          >
            <h2 className="text-3xl font-serif text-redz-accent mb-8">Send Us A Message</h2>
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="w-16 h-16 text-redz-accent mx-auto mb-6" />
                <h3 className="text-2xl font-serif text-white mb-4">Message Sent</h3>
                <p className="text-gray-400">Thank you for reaching out to Redz. We will get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">First Name</label>
                    <input required type="text" className="w-full bg-redz-charcoal border border-gray-800 rounded p-3 focus:outline-none focus:border-redz-accent text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                    <input required type="text" className="w-full bg-redz-charcoal border border-gray-800 rounded p-3 focus:outline-none focus:border-redz-accent text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input required type="email" className="w-full bg-redz-charcoal border border-gray-800 rounded p-3 focus:outline-none focus:border-redz-accent text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea required rows={5} className="w-full bg-redz-charcoal border border-gray-800 rounded p-3 focus:outline-none focus:border-redz-accent text-white resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-redz-accent text-white py-4 rounded font-bold hover:bg-white hover:text-redz-charcoal transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-12"
          >
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-serif text-white mb-6">
                <MapPin className="text-redz-accent" /> Location
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Located in the DoubleTree Suites by Hilton<br />
                515 Fellowship Road<br />
                Mt Laurel, NJ 08054
              </p>
              <a href="https://g.page/redzrestaurant?share" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-redz-accent hover:text-white transition-colors uppercase tracking-wider text-sm font-bold border-b border-redz-accent pb-1">
                Get Directions
              </a>
            </div>

            <div>
              <h3 className="flex items-center gap-3 text-2xl font-serif text-white mb-6">
                <Phone className="text-redz-accent" /> Contact Details
              </h3>
              <p className="text-gray-400 text-lg">
                Restaurant: <a href="tel:18563806045" className="hover:text-white transition-colors">856.380.6045</a><br />
                Banquets/Private Dining: <a href="tel:18567788999" className="hover:text-white transition-colors">856.778.8999</a>
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-3 text-2xl font-serif text-white mb-6">
                <Clock className="text-redz-accent" /> Hours
              </h3>
              <div className="text-gray-400 text-lg grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-white block mb-2">Breakfast</strong>
                  Mon-Fri: 6:30am - 10:30am<br />
                  Sat-Sun: 7:00am - 11:30am
                </div>
                <div>
                  <strong className="text-white block mb-2">Dinner</strong>
                  Mon-Sat: 4:00pm - 10:00pm<br />
                  Sun: 5:00pm - 9:00pm
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
