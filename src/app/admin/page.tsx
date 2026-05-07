"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { format, isToday, parseISO } from "date-fns";
import { Search, Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle, LogOut, RefreshCw, LayoutDashboard } from "lucide-react";
import Image from "next/image";

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  party_size: number;
  status: string;
  special_requests: string;
  created_at: string;
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (!error && data) {
      setReservations(data);
    }
    setLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess("Account created! You can now sign in.");
        setIsLogin(true);
      }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } else {
      alert("Error updating status: " + error.message);
    }
  };

  // Derived State & Filters
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchesSearch = 
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || res.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const todayGuests = reservations
      .filter(r => (r.status === 'confirmed' || r.status === 'pending') && isToday(parseISO(r.date)))
      .reduce((sum, r) => sum + r.party_size, 0);
    
    return { pending, confirmed, todayGuests, total: reservations.length };
  }, [reservations]);

  if (!user) {
    return (
      <div className="min-h-screen bg-redz-charcoal flex">
        {/* Left Side: Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image unoptimized src="/images/original/bar-and-lounge-01.jpg" alt="Redz Bar" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-redz-charcoal"></div>
        </div>
        
        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 relative z-10">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-4xl font-serif text-white mb-2">Redz Command Center</h1>
              <p className="text-gray-400">Secure access to the reservation management portal.</p>
            </div>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">{authError}</p>
              </div>
            )}

            {authSuccess && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">{authSuccess}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                  placeholder="admin@redz.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-redz-accent text-redz-charcoal font-bold py-3.5 rounded-lg mt-2 hover:bg-white transition-colors disabled:opacity-50"
              >
                {authLoading ? "Authenticating..." : (isLogin ? "Access Portal" : "Create Account")}
              </button>
            </form>
            
            <div className="mt-8 text-center lg:text-left">
              <button onClick={() => { setIsLogin(!isLogin); setAuthError(null); setAuthSuccess(null); }} className="text-gray-500 text-sm hover:text-white transition-colors">
                {isLogin ? "Need access? Create an account" : "Return to secure login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-redz-charcoal text-white flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-black/60 border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-redz-accent/20 p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-redz-accent" />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-wide">Redz CRM</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-400 hidden sm:inline-block">{user.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-redz-charcoal-light border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <Calendar className="w-5 h-5 text-redz-accent" />
              <h3 className="text-sm font-medium uppercase tracking-wider">Total</h3>
            </div>
            <p className="text-4xl font-serif text-white">{stats.total}</p>
          </div>
          
          <div className="bg-redz-charcoal-light border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-medium uppercase tracking-wider">Pending</h3>
            </div>
            <p className="text-4xl font-serif text-white">{stats.pending}</p>
          </div>

          <div className="bg-redz-charcoal-light border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-sm font-medium uppercase tracking-wider">Confirmed</h3>
            </div>
            <p className="text-4xl font-serif text-white">{stats.confirmed}</p>
          </div>

          <div className="bg-redz-charcoal-light border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium uppercase tracking-wider">Today's Guests</h3>
            </div>
            <p className="text-4xl font-serif text-white">{stats.todayGuests}</p>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-redz-accent transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-redz-accent appearance-none transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <button 
              onClick={fetchReservations} 
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-redz-charcoal-light border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto min-h-[400px]">
            {loading && reservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mb-4 text-redz-accent" />
                <p>Loading reservations database...</p>
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Calendar className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg">No reservations found.</p>
                {searchTerm || statusFilter !== 'all' ? (
                  <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="mt-4 text-redz-accent hover:underline text-sm">
                    Clear Filters
                  </button>
                ) : null}
              </div>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-black/40 text-gray-400 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Guest Details</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium text-center">Party</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReservations.map(res => {
                    const resDate = parseISO(res.date);
                    const today = isToday(resDate);

                    return (
                      <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white text-base">{res.name}</div>
                          <div className="text-sm text-gray-400 mt-1">{res.email}</div>
                          <div className="text-sm text-gray-400">{res.phone}</div>
                          {res.special_requests && (
                            <div className="text-xs text-yellow-500/90 mt-2 flex items-start gap-1.5 whitespace-normal max-w-xs bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span className="leading-snug">{res.special_requests}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className={`text-sm ${today ? 'text-redz-accent font-bold' : 'text-gray-300'}`}>
                              {today ? "Today" : format(resDate, "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-400">{res.time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-medium">
                            {res.party_size}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            res.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            res.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            res.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {res.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                            {res.status === 'pending' && <Clock className="w-3 h-3" />}
                            {res.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                            {res.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select 
                            value={res.status}
                            onChange={(e) => updateStatus(res.id, e.target.value)}
                            className="bg-black/50 border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:border-redz-accent focus:ring-1 focus:ring-redz-accent outline-none transition-all cursor-pointer"
                          >
                            <option value="pending">Mark Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="completed">Complete</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
