"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const menuData = [
  {
    category: "Happy Hour Specials",
    items: [
      { name: "“Redz” Wings", price: 8, desc: "Choice of Hot, Hot & Honey, Honey BBQ or Garlic Parmesan" },
      { name: "Fish Tacos", price: 8, desc: "Fried Alaskan Cod, Jicama Lime Slaw, Pico de Gallo & Cilantro Ranch Dressing" },
      { name: "Bavarian Pretzel", price: 8, desc: "Served w/ Cheese Sauce" },
      { name: "Tuna Tartar", price: 8, desc: "Wakame, Carrots, Avocado, Sesame Oil, Toasted Sesame Seeds" },
      { name: "Cheese Burger Sliders", price: 8, desc: "Angus Beef, Cooper Sharp Cheese on Hawaiian Brioche Buns" },
      { name: "Bruschetta", price: 6, desc: "Roma Tomato, Garlic, Onion, Basil, Olive Oil, Balsamic Glaze on French Ciabatta Baguette Crostini" },
    ]
  },
  {
    category: "Boardwalk Crispy Fries",
    items: [
      { name: "Plain Fries", price: 6, desc: "" },
      { name: "Garlic Parmesan Fries", price: 8, desc: "" },
      { name: "Truffle Fries", price: 10, desc: "" },
    ]
  },
  {
    category: "Flatbreads",
    items: [
      { name: "Margherita", price: 6, desc: "" },
      { name: "Pepperoni", price: 8, desc: "" },
    ]
  }
];

export default function HappyHourMenuPage() {
  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      <section className="relative h-[40vh] min-h-[350px] w-full pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[50vh] z-0 pointer-events-none">
          <Image unoptimized src="/images/original/craft-cocktails.jpg" alt="Happy Hour Menu" fill className="object-cover opacity-40 object-[50%_80%]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/80 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Lounge & Bar
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Happy Hour Menu
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link href="/menus" className="text-gray-300 hover:text-redz-accent transition-colors underline underline-offset-4">
              &larr; Back to all menus
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-24 mt-8">
        <div className="space-y-16">
          {menuData.map((section, idx) => (
            <motion.div 
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2 className="text-3xl font-serif text-redz-accent mb-8 border-b border-white/10 pb-4">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {section.items.map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-xl font-medium text-white group-hover:text-redz-accent transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex-1 border-b border-dotted border-white/20 mx-4 relative top-[-4px]"></div>
                      <span className="text-lg text-redz-accent">${item.price}</span>
                    </div>
                    {item.desc && (
                      <p className="text-gray-400 text-sm leading-relaxed pr-8">
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
