"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIConcierge from "@/components/AIConcierge";

type Slot = {
  time: string;
  label: string;
  available: boolean;
  remaining: number;
};

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function maxDateISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    party_size: "2",
    special_requests: "",
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minDate = useMemo(() => todayISO(), []);
  const maxDate = useMemo(() => maxDateISO(), []);
  const partySize = parseInt(formData.party_size, 10) || 2;

  useEffect(() => {
    if (!formData.date) return;

    const controller = new AbortController();
    let cancelled = false;

    fetch(
      `/api/reservations/availability?date=${encodeURIComponent(formData.date)}&party_size=${partySize}`,
      { signal: controller.signal }
    )
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setSlots([]);
          setSlotsError(payload.error || "Unable to load available times.");
          setSlotsLoading(false);
          return;
        }
        const nextSlots: Slot[] = payload.slots || [];
        setSlots(nextSlots);
        setSlotsError(payload.warning || null);
        setSlotsLoading(false);
        setFormData((prev) => {
          if (!prev.time) return prev;
          const stillOk = nextSlots.some((s) => s.time === prev.time && s.available);
          return stillOk ? prev : { ...prev, time: "" };
        });
      })
      .catch((err) => {
        if (err.name === "AbortError" || cancelled) return;
        setSlots([]);
        setSlotsError("Unable to load available times.");
        setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [formData.date, partySize]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "date") {
      setSlotsLoading(!!value);
      setSlotsError(null);
      if (!value) setSlots([]);
      setFormData({ ...formData, date: value, time: "" });
      return;
    }
    if (name === "party_size" && formData.date) {
      setSlotsLoading(true);
      setFormData({ ...formData, party_size: value, time: "" });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.time) {
      setError("Please select an available time.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          party_size: partySize,
          source: "website",
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          payload.error ||
            "Unable to submit reservation. Please try again or call 856-380-6045."
        );
      } else {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          party_size: "2",
          special_requests: "",
        });
        setSlots([]);
      }
    } catch {
      setError("Unable to submit reservation. Please try again or call 856-380-6045.");
    }
    setIsSubmitting(false);
  };

  const availableSlots = formData.date ? slots.filter((s) => s.available) : [];

  return (
    <main className="min-h-screen bg-redz-charcoal text-white pb-24">
      <Navbar />

      <section className="relative h-[50vh] min-h-[450px] w-full mb-16 pt-[120px]">
        <div className="absolute top-0 inset-x-0 h-[75vh] z-0 pointer-events-none">
          <Image
            src="/images/reservations-hero.png"
            alt="Reserve Your Table"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-redz-charcoal via-redz-charcoal/60 to-transparent z-10" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-8 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-6 py-2 rounded-full border border-redz-accent/50 bg-redz-accent/20 backdrop-blur-md text-red-100 text-sm font-medium tracking-widest uppercase"
          >
            Premium Dining
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl"
          >
            Reserve Your Table
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl"
          >
            Book online in minutes — or ask Henry, our AI concierge, to reserve for you.
          </motion.p>
        </div>
      </section>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-redz-charcoal-light border border-redz-accent/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-redz-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif text-white mb-4">Request Received</h2>
                <p className="text-gray-400 mb-8">
                  Your reservation request is in our system. We&apos;ll confirm shortly — check your
                  email for details.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bg-white/5 border border-white/30 text-white backdrop-blur-sm px-8 py-3 rounded hover:bg-white/15 hover:border-white/60 transition-all duration-300"
                >
                  Book Another Table
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                      placeholder="(856) 555-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Party Size</label>
                    <select
                      name="party_size"
                      value={formData.party_size}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Person" : "People"}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Parties of 13–20 —{" "}
                      <Link href="/private-dining" className="text-gray-300 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white transition-colors">
                        inquire about private dining
                      </Link>
                      . Larger events —{" "}
                      <Link href="/banquets" className="text-gray-300 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white transition-colors">
                        banquets
                      </Link>{" "}
                      or call 856-380-6045.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                      required
                      type="date"
                      name="date"
                      min={minDate}
                      max={maxDate}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    {!formData.date ? (
                      <div className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-gray-500 text-sm">
                        Select a date to see open times
                      </div>
                    ) : slotsLoading ? (
                      <div className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-gray-400 text-sm">
                        Checking availability…
                      </div>
                    ) : (
                      <select
                        required
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors appearance-none"
                      >
                        <option value="">
                          {availableSlots.length
                            ? "Choose a time"
                            : "No open times — try another date"}
                        </option>
                        {availableSlots.map((slot) => (
                          <option key={slot.time} value={slot.time}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {slotsError && (
                      <p className="text-xs text-yellow-500/90 mt-2">{slotsError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors resize-none"
                    placeholder="Anniversary, dietary restrictions, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.time}
                  className="w-full bg-gradient-to-b from-white to-slate-100 text-zinc-950 border border-white font-bold py-4 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.22)] hover:from-white hover:to-white hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_30px_rgba(0,0,0,0.28)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? "Submitting…" : "Request Reservation"}
                </button>
                <p className="text-center text-xs text-gray-500">
                  Prefer chat? Open Henry (bottom right) — he books into the same CRM.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
      <AIConcierge />
    </main>
  );
}
