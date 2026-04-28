import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-redz-charcoal text-white pt-20 pb-10 border-t border-redz-charcoal-light">
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
