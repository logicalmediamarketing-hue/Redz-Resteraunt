"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, ExternalLink, X, ChevronRight, ChevronLeft, CheckCircle2, Calendar, Users, Info, FileText } from "lucide-react";

export default function BanquetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: "Wedding",
    date: "",
    guestCount: "100",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventTypes = ["Wedding", "Banquet/Special Event", "Corporate Outing", "Other"];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          event_type: formData.eventType,
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
      console.error("Banquet submit error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      eventType: "Wedding",
      date: "",
      guestCount: "100",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: ""
    });
    setIsSubmitted(false);
    setError(null);
    setIsModalOpen(false);
  };

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
          <p>For a complete overview of our venues, event packages, and to request a formal proposal, please visit our dedicated DoubleTree Events website or inquire directly below.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center justify-center gap-2 bg-redz-accent text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-redz-charcoal transition-colors cursor-pointer shadow-[0_4px_20px_rgba(158,0,0,0.4)]"
          >
            Inquire About Banquets
            <ChevronRight size={20} />
          </button>
          <a href="https://doubletree-weddings.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded hover:bg-white/5 transition-colors">
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-redz-accent text-redz-accent px-10 py-4 rounded font-bold hover:bg-redz-accent hover:text-white transition-all duration-300 cursor-pointer"
          >
            Inquire Now
          </button>
        </div>
      </section>

      <Footer />

      {/* Multi-Step Banquet Inquiry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-redz-charcoal border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">Banquet Inquiry</h3>
                  <p className="text-xs text-gray-400 mt-1">Host your special event at Redz</p>
                </div>
                <button 
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Progress Indicator */}
              {!isSubmitted && (
                <div className="h-1 bg-white/5 w-full">
                  <motion.div 
                    className="h-full bg-redz-accent"
                    initial={{ width: "25%" }}
                    animate={{ width: `${(step / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Form Content */}
              <div className="p-6 min-h-[350px] flex flex-col justify-between">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 flex-1 flex flex-col justify-center items-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-redz-accent mb-6" />
                    <h4 className="text-2xl font-serif text-white mb-3">Proposal Request Received</h4>
                    <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
                      Thank you for your interest. Our banquet sales manager will review details for your <strong>{formData.eventType}</strong> on <strong>{formData.date}</strong> and reach out shortly.
                    </p>
                    <button 
                      onClick={resetForm}
                      className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-3 rounded font-bold transition-colors"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between gap-8">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded">
                        {error}
                      </div>
                    )}

                    {/* Step 1: Event Type */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                          <Info size={18} className="text-redz-accent" /> What type of event are you planning?
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {eventTypes.map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleInputChange("eventType", type)}
                              className={`p-4 rounded-xl border text-left font-medium transition-all ${
                                formData.eventType === type
                                  ? "bg-redz-accent/10 border-redz-accent text-white"
                                  : "bg-black/30 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Date & Guest Count */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                          <Calendar size={18} className="text-redz-accent" /> Select date and guest size
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Target Event Date</label>
                            <div className="relative">
                              <input 
                                required 
                                type="date" 
                                value={formData.date} 
                                onChange={e => handleInputChange("date", e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-redz-accent [color-scheme:dark]" 
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Estimated Guest Count: <span className="text-white font-bold">{formData.guestCount}</span></label>
                            <input 
                              type="range" 
                              min="20" 
                              max="300" 
                              step="5"
                              value={formData.guestCount} 
                              onChange={e => handleInputChange("guestCount", e.target.value)} 
                              className="w-full accent-redz-accent bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>20 Guests</span>
                              <span>150 Guests</span>
                              <span>300 Guests</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Contact Info */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                          <Users size={18} className="text-redz-accent" /> Who should we contact?
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <input 
                              required 
                              type="text" 
                              placeholder="First Name" 
                              value={formData.firstName} 
                              onChange={e => handleInputChange("firstName", e.target.value)} 
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-redz-accent" 
                            />
                            <input 
                              required 
                              type="text" 
                              placeholder="Last Name" 
                              value={formData.lastName} 
                              onChange={e => handleInputChange("lastName", e.target.value)} 
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-redz-accent" 
                            />
                          </div>
                          
                          <input 
                            required 
                            type="email" 
                            placeholder="Email Address" 
                            value={formData.email} 
                            onChange={e => handleInputChange("email", e.target.value)} 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-redz-accent" 
                          />
                          
                          <input 
                            required 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={formData.phone} 
                            onChange={e => handleInputChange("phone", e.target.value)} 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-redz-accent" 
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Special Requests */}
                    {step === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                          <FileText size={18} className="text-redz-accent" /> Special requests or details
                        </h4>
                        
                        <textarea 
                          placeholder="Tell us about your event theme, dietary requirements, timing constraints, etc..." 
                          value={formData.specialRequests} 
                          onChange={e => handleInputChange("specialRequests", e.target.value)} 
                          rows={6}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-redz-accent resize-none"
                        />
                      </motion.div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex gap-4 border-t border-white/5 pt-6 mt-4">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex items-center justify-center gap-2 border border-white/10 text-white px-5 py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors"
                        >
                          <ChevronLeft size={16} /> Back
                        </button>
                      )}
                      
                      {step < 4 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={
                            (step === 2 && !formData.date) ||
                            (step === 3 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
                          }
                          className="flex-1 flex items-center justify-center gap-2 bg-redz-accent text-white px-5 py-3 rounded-lg font-bold hover:bg-white hover:text-redz-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-redz-accent text-white px-5 py-3 rounded-lg font-bold hover:bg-white hover:text-redz-charcoal transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
