"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { format } from "date-fns";

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
  const [error, setError] = useState<string | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    setError(null);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setError("Check your email for the confirmation link!");
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-redz-charcoal flex items-center justify-center px-4">
        <div className="bg-redz-charcoal-light p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-serif text-white mb-6 text-center">Redz CRM</h1>
          {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-redz-accent"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Password</label>
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-redz-accent"
              />
            </div>
            <button type="submit" className="w-full bg-redz-accent text-redz-charcoal font-bold py-2 rounded mt-4">
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-gray-400 text-sm hover:text-white transition-colors">
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-redz-charcoal text-white">
      {/* Admin Navbar */}
      <nav className="bg-black/50 border-b border-white/10 py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-serif text-redz-accent font-bold">Redz Admin CRM</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <button onClick={handleLogout} className="text-sm border border-white/20 px-3 py-1 rounded hover:bg-white/10 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Reservations</h1>
          <button onClick={fetchReservations} className="bg-redz-accent text-redz-charcoal px-4 py-2 rounded font-bold hover:bg-white transition-colors">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="bg-redz-charcoal-light border border-white/10 rounded-xl p-12 text-center text-gray-400">
            No reservations found.
          </div>
        ) : (
          <div className="bg-redz-charcoal-light border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-gray-400 text-sm">
                    <th className="px-6 py-4 font-medium">Guest</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Party Size</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map(res => (
                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{res.name}</div>
                        {res.special_requests && (
                          <div className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {res.special_requests}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {format(new Date(res.date), "MMM d, yyyy")} <br/>
                        <span className="text-gray-400 text-sm">{res.time}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{res.party_size}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {res.email}<br/>
                        {res.phone}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          res.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          res.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {res.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={res.status}
                          onChange={(e) => updateStatus(res.id, e.target.value)}
                          className="bg-black border border-white/10 rounded px-2 py-1 text-sm text-gray-300 focus:border-redz-accent outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
