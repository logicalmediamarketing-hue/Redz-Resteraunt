"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin-emails";
import { User } from "@supabase/supabase-js";
import { 
  format, isToday, parseISO, isValid, 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  addMonths, subMonths, eachDayOfInterval, isSameMonth
} from "date-fns";
import { 
  Search, Calendar as CalendarIcon, Users, Clock, CheckCircle, XCircle, 
  AlertCircle, LogOut, RefreshCw, LayoutDashboard, Plus, Edit2, Trash2, X,
  ChevronLeft, ChevronRight, List, Mail, MessageSquare, Globe, Phone
} from "lucide-react";
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
  source?: string;
  deleted_at?: string | null;
  created_at: string;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  special_requests: string;
  status: string;
  created_at: string;
};

function sourceLabel(source?: string): string {
  switch (source) {
    case "henry":
      return "Henry";
    case "admin":
      return "Staff";
    case "phone":
      return "Phone";
    case "website":
      return "Website";
    default:
      return source || "Website";
  }
}

function SourceBadge({ source }: { source?: string }) {
  const label = sourceLabel(source);
  const icon =
    source === "henry" ? (
      <MessageSquare className="w-3 h-3" />
    ) : source === "phone" || source === "admin" ? (
      <Phone className="w-3 h-3" />
    ) : (
      <Globe className="w-3 h-3" />
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-gray-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded mt-1">
      {icon}
      {label}
    </span>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Staff invites (logged-in)
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [lastInviteCode, setLastInviteCode] = useState<string | null>(null);
  const [showInvitePanel, setShowInvitePanel] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(""); // "" means all dates

  // Calendar / CRM section State
  const [crmSection, setCrmSection] = useState<"reservations" | "leads">("reservations");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    party_size: "2",
    special_requests: "",
    status: "confirmed",
    source: "admin",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .is('deleted_at', null)
      .not('name', 'like', 'DELETED_%')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (!error && data) {
      setReservations(data);
    }
    setLoading(false);
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
  };

  useEffect(() => {
    if (user && isAdminEmail(user.email)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on auth change
      fetchReservations();
      fetchLeads();

      const channel = supabase
        .channel("crm-reservations")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "reservations" },
          () => {
            fetchReservations();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "leads" },
          () => {
            fetchLeads();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    if (authMode === "signup") {
      if (!isAdminEmail(email)) {
        setAuthError(
          "This email is not on the staff allowlist. Ask the owner to add it to NEXT_PUBLIC_ADMIN_EMAILS."
        );
        setAuthLoading(false);
        return;
      }

      if (!inviteCode.trim()) {
        setAuthError("Invite code is required. Ask a signed-in staff member to create one in the CRM.");
        setAuthLoading(false);
        return;
      }

      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          full_name: fullName.trim() || undefined,
          invite_code: inviteCode.trim(),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthError(payload.error || "Unable to create account.");
        setAuthLoading(false);
        return;
      }

      // Auto sign-in after successful create
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        setAuthSuccess("Account created. Please sign in.");
        setAuthMode("signin");
      } else if (data.user && !isAdminEmail(data.user.email)) {
        await supabase.auth.signOut();
        setAuthError("This account is not authorized for the CRM.");
      }
      setAuthLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    } else if (data.user && !isAdminEmail(data.user.email)) {
      await supabase.auth.signOut();
      setAuthError("This account is not authorized for the CRM. Contact the owner.");
    }

    setAuthLoading(false);
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    } else {
      alert("Error updating lead: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const createStaffInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteBusy(true);
    setInviteMessage(null);
    setLastInviteCode(null);

    const target = inviteEmail.trim().toLowerCase();
    if (!isAdminEmail(target)) {
      setInviteMessage("Add this email to NEXT_PUBLIC_ADMIN_EMAILS before inviting.");
      setInviteBusy(false);
      return;
    }

    const code = `REDZ-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const { error } = await supabase.from("staff_invites").insert([
      {
        email: target,
        code,
        full_name: inviteName.trim(),
        created_by: user?.id || null,
      },
    ]);

    if (error) {
      setInviteMessage(error.message);
    } else {
      setLastInviteCode(code);
      setInviteMessage(`Invite created for ${target}. Share the code securely.`);
      setInviteEmail("");
      setInviteName("");
    }
    setInviteBusy(false);
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

  const confirmDelete = (id: string) => {
    setReservationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!reservationToDelete) return;
    
    const { error } = await supabase
      .from('reservations')
      .update({
        status: 'cancelled',
        deleted_at: new Date().toISOString(),
        name: 'DELETED_' + reservationToDelete,
      })
      .eq('id', reservationToDelete);
    
    if (!error) {
      setReservations(reservations.filter(r => r.id !== reservationToDelete));
      setIsDeleteModalOpen(false);
      setReservationToDelete(null);
    } else {
      alert("Failed to delete: " + error.message);
    }
  };

  const handleSaveReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      party_size: parseInt(formData.party_size),
      special_requests: formData.special_requests,
      status: formData.status,
      source: formData.source || "admin",
    };

    if (isEditModalOpen && editingReservation) {
      // Update
      const { data, error } = await supabase
        .from('reservations')
        .update(payload)
        .eq('id', editingReservation.id)
        .select()
        .single();
      
      if (!error && data) {
        setReservations(reservations.map(r => r.id === editingReservation.id ? data : r));
        closeModals();
      } else {
        alert("Update failed: " + error?.message);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('reservations')
        .insert([payload])
        .select()
        .single();
      
      if (!error && data) {
        setReservations([...reservations, data].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)));
        closeModals();
      } else {
        alert("Creation failed: " + error?.message);
      }
    }
  };

  const openEditModal = (res: Reservation) => {
    setEditingReservation(res);
    setFormData({
      name: res.name,
      email: res.email || "",
      phone: res.phone || "",
      date: res.date,
      time: res.time,
      party_size: res.party_size.toString(),
      special_requests: res.special_requests || "",
      status: res.status,
      source: res.source || "admin",
    });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "18:00",
      party_size: "2",
      special_requests: "",
      status: "confirmed",
      source: "phone",
    });
    setIsAddModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingReservation(null);
  };

  // Calendar Helpers
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Derived State & Filters
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchesSearch = 
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (res.email && res.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (res.phone && res.phone.includes(searchTerm));
      const matchesStatus = statusFilter === "all" || res.status === statusFilter;
      const matchesSource = sourceFilter === "all" || (res.source || "website") === sourceFilter;
      const matchesDate = dateFilter === "" || res.date === dateFilter;
      
      return matchesSearch && matchesStatus && matchesSource && matchesDate;
    });
  }, [reservations, searchTerm, statusFilter, sourceFilter, dateFilter]);

  const stats = useMemo(() => {
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const todayGuests = reservations
      .filter(r => {
        if (r.status !== 'confirmed' && r.status !== 'pending') return false;
        try { return isToday(parseISO(r.date)); } catch { return false; }
      })
      .reduce((sum, r) => sum + r.party_size, 0);
    
    return { pending, confirmed, todayGuests, total: reservations.length };
  }, [reservations]);

  // Handle Auth Checking State (prevents login flicker)
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-redz-charcoal flex items-center justify-center">
        <RefreshCw className="w-10 h-10 text-redz-accent animate-spin" />
      </div>
    );
  }

  if (!user || !isAdminEmail(user.email)) {
    return (
      <div className="min-h-screen bg-redz-charcoal flex">
        {/* Left Side: Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image src="/images/original/bar-and-lounge-01.jpg" alt="Redz Bar" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-redz-charcoal"></div>
        </div>
        
        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 relative z-10">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-4xl font-serif text-white mb-2">Redz Command Center</h1>
              <p className="text-gray-400">
                Staff CRM for reservations and leads. Allowlisted emails can create an account here.
              </p>
            </div>

            <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode("signin"); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  authMode === "signin" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("signup"); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  authMode === "signup" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
                }`}
              >
                Create account
              </button>
            </div>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">{authError}</p>
              </div>
            )}
            {authSuccess && (
              <div className="bg-green-500/10 border border-green-500/40 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {authMode === "signup" && (
                <>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Full name</label>
                    <input 
                      type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                      placeholder="Jordan Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Invite code</label>
                    <input
                      type="text"
                      required
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors tracking-wider"
                      placeholder="REDZ-XXXX-XXXX"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                  placeholder="staff@laurellodging.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
                <input 
                  type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent transition-colors"
                  placeholder="••••••••"
                />
                {authMode === "signup" && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    At least 8 characters. Email must be allowlisted and match an unused invite.
                  </p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-redz-accent text-redz-charcoal font-bold py-3.5 rounded-lg mt-2 hover:bg-white transition-colors disabled:opacity-50"
              >
                {authLoading
                  ? authMode === "signup" ? "Creating account…" : "Authenticating…"
                  : authMode === "signup" ? "Create staff account" : "Access Portal"}
              </button>
            </form>
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
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setShowInvitePanel((v) => !v)}
            className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline"
          >
            Invite staff
          </button>
          <span className="text-sm text-gray-400 hidden sm:inline-block">{user.email}</span>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {showInvitePanel && (
        <div className="border-b border-white/10 bg-black/40 px-6 py-4">
          <form onSubmit={createStaffInvite} className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Staff email (must be allowlisted)</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-redz-accent"
                placeholder="newstaff@laurellodging.com"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Name (optional)</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-redz-accent"
                placeholder="Full name"
              />
            </div>
            <button
              type="submit"
              disabled={inviteBusy}
              className="bg-redz-accent text-redz-charcoal font-bold px-4 py-2 rounded-lg text-sm hover:bg-white transition-colors disabled:opacity-50"
            >
              {inviteBusy ? "Creating…" : "Generate invite"}
            </button>
          </form>
          {inviteMessage && (
            <p className="max-w-7xl mx-auto mt-3 text-sm text-gray-300">{inviteMessage}</p>
          )}
          {lastInviteCode && (
            <p className="max-w-7xl mx-auto mt-1 text-sm">
              Code:{" "}
              <code className="text-redz-accent font-mono tracking-wider">{lastInviteCode}</code>
              {" — "}share with them to use Create account on this page.
            </p>
          )}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        
        {/* CRM section + Header Action Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex bg-black/50 p-1 rounded-lg border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setCrmSection("reservations")}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${crmSection === "reservations" ? "bg-white/20 text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Reservations</span>
              </button>
              <button
                type="button"
                onClick={() => setCrmSection("leads")}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${crmSection === "leads" ? "bg-white/20 text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Leads / Contact</span>
                {leads.filter((l) => l.status === "new").length > 0 && (
                  <span className="ml-1 text-xs bg-redz-accent text-redz-charcoal px-1.5 py-0.5 rounded-full font-bold">
                    {leads.filter((l) => l.status === "new").length}
                  </span>
                )}
              </button>
            </div>

            {crmSection === "reservations" && (
              <div className="flex items-center gap-6">
                <h2 className="text-3xl font-serif">Reservation Management</h2>
                <div className="hidden sm:flex bg-black/50 p-1 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${viewMode === "list" ? "bg-white/20 text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium">List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${viewMode === "calendar" ? "bg-white/20 text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Calendar</span>
                  </button>
                </div>
              </div>
            )}
            {crmSection === "leads" && (
              <h2 className="text-3xl font-serif">Leads &amp; Contact</h2>
            )}
          </div>
          
          {crmSection === "reservations" && (
            <button 
              type="button"
              onClick={openAddModal}
              className="bg-redz-accent text-redz-charcoal px-5 py-2.5 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              New Booking
            </button>
          )}
        </div>

        {crmSection === "leads" && (
          <div className="bg-redz-charcoal-light border border-white/5 rounded-2xl overflow-hidden shadow-2xl mb-8">
            <div className="overflow-x-auto">
              {leads.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No leads or contact messages yet.</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-black/40 text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Contact</th>
                      <th className="px-6 py-4 font-medium">Type / Date</th>
                      <th className="px-6 py-4 font-medium">Details</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{lead.name}</div>
                          <div className="text-sm text-gray-400">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white capitalize">{lead.event_type}</div>
                          <div className="text-sm text-gray-400">{lead.event_date}</div>
                          {lead.event_type !== "contact" && (
                            <div className="text-xs text-gray-500">{lead.guest_count} guests</div>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-gray-300 whitespace-normal">{lead.special_requests || "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="bg-black/50 border border-white/10 hover:border-white/30 rounded px-2 py-1 text-xs text-gray-300 focus:border-redz-accent outline-none cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {crmSection === "reservations" && (
        <>
        {/* Mobile View Toggle */}
        <div className="flex sm:hidden bg-black/50 p-1 rounded-lg border border-white/10 mb-6">
          <button 
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex-1 py-2 rounded-md flex justify-center items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">List</span>
          </button>
          <button 
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`flex-1 py-2 rounded-md flex justify-center items-center gap-2 transition-colors ${viewMode === 'calendar' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Calendar</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-redz-charcoal-light border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <CalendarIcon className="w-5 h-5 text-redz-accent" />
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
              <h3 className="text-sm font-medium uppercase tracking-wider">Today&apos;s Guests</h3>
            </div>
            <p className="text-4xl font-serif text-white">{stats.todayGuests}</p>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="bg-redz-charcoal-light border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif text-white">{format(currentMonth, "MMMM yyyy")}</h3>
              <div className="flex gap-2">
                <button type="button" onClick={prevMonth} className="p-2 bg-black/40 hover:bg-black/80 rounded border border-white/10 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-300" />
                </button>
                <button type="button" onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 bg-black/40 hover:bg-black/80 rounded border border-white/10 text-sm text-gray-300 transition-colors">
                  Today
                </button>
                <button type="button" onClick={nextMonth} className="p-2 bg-black/40 hover:bg-black/80 rounded border border-white/10 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-black/60 p-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
              
              {eachDayOfInterval({ start: startOfWeek(startOfMonth(currentMonth)), end: endOfWeek(endOfMonth(currentMonth)) }).map(day => {
                const dayStr = format(day, "yyyy-MM-dd");
                const dayReservations = reservations.filter(r => r.date === dayStr);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isDayToday = isToday(day);

                return (
                  <div 
                    key={dayStr}
                    onClick={() => {
                      setDateFilter(dayStr);
                      setViewMode("list");
                    }}
                    className={`min-h-[120px] p-2 flex flex-col bg-redz-charcoal hover:bg-white/5 transition-colors cursor-pointer group ${!isCurrentMonth ? 'opacity-40' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${isDayToday ? 'bg-redz-accent text-redz-charcoal font-bold' : 'text-gray-300 group-hover:text-white'}`}>
                        {format(day, "d")}
                      </span>
                      {dayReservations.length > 0 && (
                        <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-medium shadow-sm border border-white/5">
                          {dayReservations.reduce((sum, r) => sum + r.party_size, 0)} guests
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                      {dayReservations.slice(0, 3).map(res => (
                        <div key={res.id} className={`text-xs px-2 py-1 rounded truncate border ${
                          res.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          res.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                          res.status === 'completed' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          <span className="font-semibold">{res.time}</span> {res.name.split(' ')[0]}
                        </div>
                      ))}
                      {dayReservations.length > 3 && (
                        <div className="text-xs text-gray-500 pl-1 font-medium italic mt-0.5">
                          +{dayReservations.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Filters Row */}
            <div className="bg-redz-charcoal-light border border-white/5 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search name, email, or phone..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-redz-accent transition-colors"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                {/* Date Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full sm:w-auto bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-gray-300 focus:outline-none focus:border-redz-accent [color-scheme:dark]"
                  />
                  {dateFilter && (
                    <button type="button" onClick={() => setDateFilter("")} className="text-gray-500 hover:text-white p-2" title="Clear Date Filter">
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-redz-accent appearance-none transition-colors cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full sm:w-auto bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-redz-accent appearance-none transition-colors cursor-pointer"
                >
                  <option value="all">All Sources</option>
                  <option value="website">Website</option>
                  <option value="henry">Henry</option>
                  <option value="phone">Phone</option>
                  <option value="admin">Staff</option>
                </select>
                
                <button 
                  type="button"
                  onClick={() => { fetchReservations(); fetchLeads(); }} 
                  disabled={loading}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
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
                    <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg">No reservations match your filters.</p>
                    {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || dateFilter) && (
                      <button type="button" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSourceFilter('all'); setDateFilter(''); }} className="mt-4 text-redz-accent hover:underline text-sm">
                        Clear All Filters
                      </button>
                    )}
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
                        let isResToday = false;
                        let displayDate = res.date;
                        try {
                          const resDate = parseISO(res.date);
                          isResToday = isValid(resDate) && isToday(resDate);
                          displayDate = isValid(resDate) ? format(resDate, "MMM d, yyyy") : res.date;
                        } catch {
                          // Fallback
                        }

                        return (
                          <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-medium text-white text-base">{res.name}</div>
                              <SourceBadge source={res.source} />
                              <div className="text-sm text-gray-400 mt-1">{res.email || "No email"}</div>
                              <div className="text-sm text-gray-400">{res.phone || "No phone"}</div>
                              {res.special_requests && (
                                <div className="text-xs text-yellow-500/90 mt-2 flex items-start gap-1.5 whitespace-normal max-w-xs bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <span className="leading-snug">{res.special_requests}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 mb-1">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span className={`text-sm ${isResToday ? 'text-redz-accent font-bold' : 'text-gray-300'}`}>
                                  {isResToday ? "Today" : displayDate}
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
                              <div className="flex flex-col items-start gap-2">
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
                                
                                <select 
                                  value={res.status}
                                  onChange={(e) => updateStatus(res.id, e.target.value)}
                                  className="bg-black/50 border border-white/10 hover:border-white/30 rounded px-2 py-1 text-xs text-gray-300 focus:border-redz-accent outline-none cursor-pointer"
                                >
                                  <option value="pending">Mark Pending</option>
                                  <option value="confirmed">Confirm</option>
                                  <option value="completed">Complete</option>
                                  <option value="cancelled">Cancel</option>
                                </select>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  type="button"
                                  onClick={() => openEditModal(res)}
                                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                  title="Edit Reservation"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => confirmDelete(res.id)}
                                  className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded transition-colors"
                                  title="Delete Reservation"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
        </>
        )}
      </main>

      {/* Delete Confirmation Modal Overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-redz-charcoal border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Delete Reservation?</h3>
            <p className="text-sm text-gray-400 mb-6">This action cannot be undone. It will be permanently removed from your dashboard.</p>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => { setIsDeleteModalOpen(false); setReservationToDelete(null); }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={executeDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal Overlay */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-redz-charcoal border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-redz-charcoal z-10">
              <h2 className="text-2xl font-serif text-white">
                {isEditModalOpen ? "Edit Reservation" : "New Reservation"}
              </h2>
              <button type="button" onClick={closeModals} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveReservation} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Guest Name *</label>
                  <input 
                    required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent appearance-none"
                  >
                    <option value="phone">Phone</option>
                    <option value="admin">Walk-in / Staff</option>
                    <option value="website">Website</option>
                    <option value="henry">Henry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input 
                    type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                  <input 
                    required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time *</label>
                  <input 
                    required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Party Size *</label>
                  <select 
                    value={formData.party_size} onChange={e => setFormData({...formData, party_size: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent appearance-none"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests / Notes</label>
                <textarea 
                  value={formData.special_requests} onChange={e => setFormData({...formData, special_requests: e.target.value})} rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-redz-accent resize-none"
                  placeholder="Anniversary, window seat preferred, dietary restrictions..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button 
                  type="button" onClick={closeModals}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-lg transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-redz-accent text-redz-charcoal font-bold py-3 rounded-lg hover:bg-white transition-colors"
                >
                  {isEditModalOpen ? "Save Changes" : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
