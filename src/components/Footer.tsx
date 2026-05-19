import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-redz-charcoal text-white pt-0 pb-10 border-t border-redz-charcoal-light">
      
      {/* Hotel Booking CTA */}
      <div className="bg-redz-charcoal border-y border-redz-accent/20 py-24 px-6 relative overflow-hidden mb-16 mt-[-1px]">
        <div className="absolute inset-0 z-0">
          <Image src="/images/original/hotel_stay_cta.jpg" alt="DoubleTree Suites Hotel Room" fill className="object-cover opacity-40 mix-blend-luminosity" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/60 to-redz-charcoal/80 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-redz-charcoal/50 via-transparent to-redz-charcoal/50 z-0 pointer-events-none" />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-redz-accent/10 to-transparent pointer-events-none z-0" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-redz-accent/30 bg-redz-accent/10 text-red-200 text-xs font-semibold tracking-widest uppercase">
            Stay With Us
          </div>
          <h3 className="text-3xl md:text-5xl font-serif text-white mb-6">Extend Your Experience</h3>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            After a phenomenal meal at Redz, relax and unwind for the night. We are proudly located inside the beautiful DoubleTree Suites by Hilton Mt. Laurel.
          </p>
          <a 
            href="https://www.hilton.com/en/hotels/phlfrdt-doubletree-suites-mt-laurel/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-redz-accent text-white px-10 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-redz-charcoal transition-all duration-300 border border-transparent hover:border-white shadow-[0_0_20px_rgba(186,28,33,0.3)] hover:shadow-white/20"
          >
            Book Your Suite
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="mb-6">
            <Image src="/images/original/logo.png" alt="Redz Restaurant Logo" width={120} height={42} className="object-contain" />
          </div>
          <p className="text-gray-400 mb-6 mt-4">Inspired American Fare located in the DoubleTree Suites by Hilton in Mt Laurel, NJ.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-gray-400">
            <li><Link href="/menus" className="hover:text-redz-accent transition-colors">Menus</Link></li>
            <li><Link href="/private-dining" className="hover:text-redz-accent transition-colors">Private Dining</Link></li>
            <li><Link href="/banquets" className="hover:text-redz-accent transition-colors">Banquets</Link></li>
            <li><Link href="/news" className="hover:text-redz-accent transition-colors">News & Events</Link></li>
            <li><Link href="/about" className="hover:text-redz-accent transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-redz-accent transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="text-redz-accent mt-1 shrink-0" size={20} />
              <span>515 Fellowship Road<br/>Mt Laurel, NJ 08054</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-redz-accent shrink-0" size={20} />
              <a href="tel:18563806045" className="hover:text-white transition-colors">856.380.6045</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6">Hours</h4>
          <ul className="space-y-4 text-gray-400">
            <li><span className="text-white">Breakfast:</span><br/>Mon-Fri 6:30am - 10:30am<br/>Sat-Sun 7:00am - 11:30am</li>
            <li><span className="text-white">Dinner:</span><br/>Mon-Sat 4:00pm - 10:00pm<br/>Sun 5:00pm - 9:00pm</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-redz-charcoal-light text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Redz Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
}
