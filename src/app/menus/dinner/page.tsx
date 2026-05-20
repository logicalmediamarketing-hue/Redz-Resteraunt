"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const menuData = [
  {
    category: "Appetizers",
    items: [
      { name: "Margarita Flatbread", price: 12, desc: "Fresh Mozzarella, Marinara Sauce and Basil" },
      { name: "Redz Wings", price: 15, desc: "Sauces-Mild, Hot, Hot and Honey, Honey Barbeque" },
      { name: "Pepperoni Flatbread", price: 13, desc: "Fresh Mozzarella, Marinara, Pepperoni" },
      { name: "Roasted Garlic Hummus", price: 13, desc: "Feta, Kalamata Olives, Roasted Red Peppers, Cucumber, Pita" },
      { name: "Prosciutto Flatbread", price: 14, desc: "Ricotta Cheese Spread, Prosciutto, Arugula, Balsamic Glaze" },
      { name: "Bavarian Pretzel", price: 11, desc: "Cheddar Cheese Sauce" },
    ]
  },
  {
    category: "Handhelds",
    items: [
      { name: "Classic Burger", price: 15, desc: "Lettuce, Tomato and American Cheese Served With Boardwalk Fries" },
      { name: "Grilled Chicken Avocado BLT", price: 15, desc: "Applewood Smoked Bacon, Lettuce, Tomato, Avocado with Lemon Aioli Served with Boardwalk Fries" },
      { name: "Exit 4 Burger", price: 24, desc: "Lettuce, Tomato, Onion, Pork Roll, Egg, Cooper Sharp Cheese, Served with Boardwalk Fries" },
      { name: "Philly Cheesesteak", price: 16, desc: "Shaved Ribeye with Cooper Sharp Cheese Served with Boardwalk Fries" },
      { name: "Redz Burger", price: 18, desc: "8oz Burger topped with Onion Rings, Barbecue Sauce, and Smoked Cheddar Served with Boardwalk Fries" },
    ]
  },
  {
    category: "Salads",
    items: [
      { name: "Garden Salad", price: 10, desc: "Arcadian Harvest Blend, Tomatoes, Cucumbers, Red Onions, Balsamic Vinaigrette" },
      { name: "Caeser Salad", price: 12, desc: "Romaine, Caeser Dressing, Garlic Parmesan Croutons, Asiago Crisp" },
      { name: "Apple Walnut", price: 16, desc: "Arcadian Harvest Blend, Apple Slices, Candied Walnut, Dried Cranberries, Bleu Cheese Crumbles, Maple Cinnamon Dressing" },
      { name: "Heirloom Tomato", price: 16, desc: "Heirloom Tomato, Burrata, Basil Oil, Balsamic Glaze" },
    ]
  },
  {
    category: "Entrées",
    items: [
      { name: "Chicken Parmigiana", price: 24, desc: "Served with Linguini" },
      { name: "Tuscan Pasta with Chicken", price: 26, desc: "House Made Tuscan Sauce, Linguini Pasta, Herb Sous Vide Chicken Served over Linguini" },
      { name: "Seared Atlantic Salmon", price: 30, desc: "Seared skin on Salmon, Roasted Asparagus, Heirloom Carrots" },
      { name: "Grilled Pork Chop", price: 29, desc: "Frenched 14oz Pork Chop, Mashed Potato, Sautéed Spinach, Apple Cinnamon Chutney" },
      { name: "Steak and Frites", price: 40, desc: "Sliced 12oz New York Strip, Boardwalk Fries, Cowboy Butter Sauce" },
      { name: "Rack of Ribs", price: 32, desc: "Rack of Ribs, Slow Roasted in an Apple Barbeque Sauce served with Boardwalk Fries" },
    ]
  }
];

export default function DinnerMenuPage() {
  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      <section className="relative h-[40vh] min-h-[350px] w-full pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[50vh] z-0 pointer-events-none">
          <Image src="/images/original/premium_dinner_hero.jpg" alt="Dinner Menu" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/80 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Restaurant & Bar
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Dinner Menu
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
