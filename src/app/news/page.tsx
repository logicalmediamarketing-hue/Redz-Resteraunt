"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NewsEventsPage() {
  const specials = [
    {
      title: "Thursday Night Special",
      time: "Every Thursday | 4:00pm - Close",
      desc: "Bartender's Choice: $15.00 bottle of wine! Discount available at bar only.",
      img: "/images/original/thursday_wine_special.jpg",
      imageAlt: "Wine bottles featured for the Thursday Night Special",
    },
    {
      title: "Happy Hour",
      time: "Monday–Friday | 4:00 PM–6:00 PM",
      desc: "Join us for Happy Hour with discounted drinks and appetizers at the bar.",
      img: "/images/original/craft-cocktails.jpg",
      imageAlt: "Handcrafted cocktail served at the Redz bar",
      href: "/menus/happy-hour",
      cta: "View Happy Hour Menu",
    },
  ];

  return (
    <main className="min-h-screen bg-redz-charcoal text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[450px] w-full mb-16 pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[75vh] z-0 pointer-events-none">
          <Image src="/images/original/news_hero.jpg" alt="News and Events" fill className="object-cover opacity-60" priority />
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

        <div className="grid md:grid-cols-2 gap-8">
          {specials.map((special, i) => (
            <motion.div
              key={special.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-redz-charcoal-light border border-white/5 rounded-2xl overflow-hidden hover:border-redz-accent/50 transition-colors group flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={special.img} alt={special.imageAlt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8 flex flex-1 flex-col">
                <h3 className="text-2xl font-serif text-redz-accent mb-2">{special.title}</h3>
                <p className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-4">{special.time}</p>
                <p className="text-gray-400">{special.desc}</p>
                {special.href && special.cta ? (
                  <Link
                    href={special.href}
                    className="mt-6 inline-flex items-center justify-center rounded bg-gradient-to-b from-white to-slate-100 px-6 py-3 font-bold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-white hover:to-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {special.cta}
                  </Link>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1 }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/5 bg-redz-charcoal-light lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <div className="relative min-h-72 lg:min-h-full">
            <Image
              src="/images/original/bar-and-lounge-01.jpg"
              alt="The warm bar and lounge at Redz Restaurant"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal-light/70 to-transparent lg:bg-gradient-to-r" />
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-300">
              Happy Hour &amp; Private Dining
            </p>
            <h2 className="mb-6 text-3xl font-serif text-redz-accent sm:text-4xl">
              Gather at Redz for Happy Hour
            </h2>
            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p>
                Looking for the perfect setting for a small gathering, team outing, birthday toast, or casual celebration? Redz Restaurant &amp; Bar offers a warm, inviting atmosphere, great food, handcrafted cocktails, and a private dining room that is ideal for bringing people together.
              </p>
              <p>
                Join us for Happy Hour Monday through Friday from 4 PM to 6 PM and enjoy a relaxed setting with shareable bites, cold drinks, and the kind of hospitality that makes every gathering feel easy.
              </p>
              <p>
                Our private dining room is available for small groups looking for a more comfortable and personal space to connect, celebrate, or unwind.
              </p>
              <p>
                Book your private dining room today and make your next gathering a Redz gathering.
              </p>
            </div>
            <Link
              href="/private-dining"
              className="mt-8 inline-flex items-center justify-center rounded bg-gradient-to-b from-white to-slate-100 px-7 py-4 font-bold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-white hover:to-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Book Your Private Dining Room
            </Link>
          </div>
        </motion.article>
      </section>

      <section className="py-24 bg-redz-charcoal-light border-y border-redz-accent/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-white mb-12">The Word is Out</h2>
          
          <div className="space-y-8">
            <blockquote className="border-l-4 border-redz-accent pl-6 text-left">
              <p className="text-xl text-gray-300 italic mb-4">&quot;Excellent service! The food was exceptional. Overall great evening with friends!!&quot;</p>
              <footer className="text-redz-accent font-bold uppercase tracking-wider text-sm">- Murrman, Philadelphia</footer>
            </blockquote>
            
            <blockquote className="border-l-4 border-redz-accent pl-6 text-left">
              <p className="text-xl text-gray-300 italic mb-4">&quot;Great service and food as usual. Thanks for making my friend&apos;s birthday lunch really nice!&quot;</p>
              <footer className="text-redz-accent font-bold uppercase tracking-wider text-sm">- OpenTable Diner, Philadelphia</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
