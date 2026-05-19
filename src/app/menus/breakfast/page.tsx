"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const menuData = [
  {
    category: "Eggs and Omelets",
    items: [
      { name: "Build your Breakfast", price: 11, desc: "Two Eggs any Style - Over Easy, Poached or Sunny Side Up. Add Bacon, Sausage, or Pork Roll $6 - Add Home Fries w/peppers and onions $5 - Substitute Egg Whites $2" },
      { name: "Omelet", price: 16, desc: "Two Egg omelet, choice of Bacon or Sausage, choice of American, Cheddar, Provolone, or Swiss Cheeses. Served with Home Fries and White or Wheat Toast" },
      { name: "Cheese Omelet", price: 12, desc: "Two Egg Omelet. Choice of American, Cheddar or Swiss Cheese" },
      { name: "Southwest Omelet", price: 18, desc: "Two Egg Omelet w/Bell Peppers, Pico de Gallo and Avocado. Served with Home Fries and White or Wheat Toast" },
      { name: "Healthy Start", price: 16, desc: "Egg white Omelet w/Spinach, Tomatoes and Mushrooms. Served with a Bowl of Fruit and Wheat Toast" },
      { name: "All American Breakfast", price: 20, desc: "Two Eggs any Style. Served with two slices of bacon, or sausage, toast, and home fries" },
      { name: "Big Breakfast Sampler", price: 22, desc: "Three Eggs any Style. Served with bacon and sausage, home fries, and a choice of toast, bagel, or English muffin" },
      { name: "Eggs Benedict", price: 21, desc: "Two Poached eggs. Pork roll or smoked salmon, home fries, hollandaise sauce" },
    ]
  },
  {
    category: "Griddle",
    items: [
      { name: "Buttermilk Pancakes", price: 12, desc: "Two pancakes served with butter and maple syrup. Add fresh fruit (strawberries, blueberries, or bananas) for $3" },
      { name: "Challah French Toast", price: 15, desc: "Two slices of Challah French Toast with a dusting of powdered sugar served with maple syrup. Add strawberries, blueberries, or bananas $3" },
      { name: "Belgian Waffle", price: 14, desc: "Belgian Style Waffle served with butter and maple syrup. Add strawberries, blueberries or bananas $3" },
    ]
  },
  {
    category: "Sides",
    items: [
      { name: "Oatmeal", price: 6, desc: "" },
      { name: "Breakfast Potatoes", price: 5, desc: "" },
      { name: "Bagel", price: 3.5, desc: "Add Cream Cheese $1" },
      { name: "Turkey Bacon", price: 6, desc: "" },
      { name: "Bacon or Sausage", price: 6, desc: "" },
      { name: "Chobani Yogurt", price: 3, desc: "Various Flavors" },
      { name: "Whole Fruit", price: 3, desc: "Apple, Banana, or Orange" },
      { name: "Bowl of Fruit", price: 7, desc: "Seasonal Berries, Grapes, Pineapple, Cantaloupe, Honey Dew" },
    ]
  },
  {
    category: "Refreshments",
    items: [
      { name: "Coffee", price: 4, desc: "Regular or Decaf" },
      { name: "Hot Tea", price: 3.5, desc: "" },
      { name: "Hot Cocoa", price: 4, desc: "" },
      { name: "Fresh Juice", price: 4.5, desc: "Apple, Cranberry, Orange or Tomato" },
    ]
  }
];

export default function BreakfastMenuPage() {
  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      <section className="relative h-[40vh] min-h-[350px] w-full pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[50vh] z-0 pointer-events-none">
          <Image src="/images/original/appetizer-spread-with-beer.jpg" alt="Breakfast Menu" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/80 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Morning Favorites
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Breakfast Menu
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
