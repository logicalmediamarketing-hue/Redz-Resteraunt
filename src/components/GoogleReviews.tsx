"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    date: "2 weeks ago",
    text: "A hidden gem in Mt Laurel! The Kobe beef meatballs and French onion soup were fantastic. The atmosphere is vibrant yet intimate. We'll definitely be coming back.",
    rating: 5,
  },
  {
    id: 2,
    name: "John D.",
    date: "1 month ago",
    text: "Great atmosphere, excellent food. Wayne the bartender makes an amazing spicy margarita and Old Ghost Old Fashioned. The service here is truly top-notch.",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael T.",
    date: "3 months ago",
    text: "Phenomenal service and food. The ribeye was cooked to absolute perfection, and the ambiance was perfect for our anniversary dinner. Highly recommend!",
    rating: 5,
  },
];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export default function GoogleReviews() {
  return (
    <section className="py-24 px-6 bg-redz-charcoal relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <GoogleIcon />
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" className="text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-bold text-lg">4.6</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white">What Our Guests Say</h2>
          </div>
          <a 
            href="https://www.google.com/maps/search/Redz+Restaurant+Mt+Laurel+NJ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block border border-redz-accent text-redz-accent px-8 py-3 rounded font-bold hover:bg-redz-accent hover:text-redz-charcoal transition-colors text-sm tracking-wider uppercase"
          >
            Read More on Google
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-redz-accent to-red-900 flex items-center justify-center text-white font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{review.name}</h4>
                    <span className="text-gray-400 text-sm">{review.date}</span>
                  </div>
                </div>
                <GoogleIcon />
              </div>
              
              <div className="flex text-yellow-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" className="text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-300 leading-relaxed flex-grow">
                &quot;{review.text}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
