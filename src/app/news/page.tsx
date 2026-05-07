"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NewsEventsPage() {
  const specials = [
    {
      title: "Thursday Night Special",
      time: "Every Thursday | 4:00pm - Close",
      desc: "Bartender's Choice: $15.00 bottle of wine! Discount available at bar only.",
      img: "/images/original/thursday_wine_special.jpg"
    },
    {
      title: "Fun After Four",
      time: "Monday - Thursday | 4:00pm - 6:00pm",
      desc: "Join us for our legendary happy hour with discounted drinks and appetizers at the bar.",
      img: "/images/original/craft-cocktails.jpg"
    },
    {
      title: "It's Back! The 28 oz. Bone-in-Rib Eye",
      time: "Available Daily",
      desc: "For the meat lovers out there, this will satisfy any appetite. Ask your server for details.",
      img: "/images/bone-in-rib-eye-hq.png"
    }
  ];

  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[450px] w-full mb-16 pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[75vh] z-0 pointer-events-none">
          <Image unoptimized src="/images/original/news_hero.jpg" alt="News and Events" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/60 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Happenings
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            News & Events
          </motion.h1>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-16 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 leading-relaxed"
        >
          In the Mt Laurel Area? Check out our current special offerings and what people are saying about Redz.
        </motion.p>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-24">

        <div className="grid md:grid-cols-3 gap-8">
          {specials.map((special, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-redz-charcoal-light border border-white/5 rounded-2xl overflow-hidden hover:border-redz-accent/50 transition-colors group flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={special.img} alt={special.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8 flex-1">
                <h3 className="text-2xl font-serif text-redz-accent mb-2">{special.title}</h3>
                <p className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-4">{special.time}</p>
                <p className="text-gray-400">{special.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-redz-charcoal-light border-y border-redz-accent/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-white mb-12">The Word is Out</h2>
          
          <div className="space-y-8">
            <blockquote className="border-l-4 border-redz-accent pl-6 text-left">
              <p className="text-xl text-gray-300 italic mb-4">"Excellent service! The food was exceptional. Overall great evening with friends!!"</p>
              <footer className="text-redz-accent font-bold uppercase tracking-wider text-sm">- Murrman, Philadelphia</footer>
            </blockquote>
            
            <blockquote className="border-l-4 border-redz-accent pl-6 text-left">
              <p className="text-xl text-gray-300 italic mb-4">"Great service and food as usual. Thanks for making my friend's birthday lunch really nice!"</p>
              <footer className="text-redz-accent font-bold uppercase tracking-wider text-sm">- OpenTable Diner, Philadelphia</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
