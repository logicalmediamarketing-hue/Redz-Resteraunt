"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, CheckCircle2 } from "lucide-react";

export default function PrivateDiningPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    guestCount: "",
    specialRequests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          event_type: "Private Dining",
          event_date: formData.date,
          guest_count: parseInt(formData.guestCount),
          special_requests: formData.specialRequests
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit inquiry");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Private dining submit error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[450px] w-full mb-16 pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[75vh] z-0 pointer-events-none">
          <Image src="/images/original/bar-and-lounge-01.jpg" alt="Private Dining Room" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/60 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8 md:pt-12">
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

      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-24 text-center">
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
          <a href="tel:18567788999" className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded hover:bg-white/5 transition-colors">
            <Phone size={20} className="text-redz-accent" />
            856.778.8999
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
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <input required type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
                <input required type="text" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
                <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-gray-400 [color-scheme:dark]" />
                <input required type="number" placeholder="Guest Count (up to 20)" max="20" value={formData.guestCount} onChange={e => setFormData({...formData, guestCount: e.target.value})} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white" />
              </div>
              <textarea placeholder="Event Details & Special Requests" value={formData.specialRequests} onChange={e => setFormData({...formData, specialRequests: e.target.value})} rows={5} className="bg-redz-charcoal border border-gray-800 rounded p-4 focus:outline-none focus:border-redz-accent w-full text-white resize-none"></textarea>
              <button type="submit" disabled={isSubmitting} className="w-full bg-redz-accent text-white py-4 rounded font-bold hover:bg-white hover:text-redz-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
