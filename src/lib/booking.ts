import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendNotifications } from "@/lib/notify";

export const RESTAURANT_PHONE = "856-380-6045";
export const MAX_PARTY_ONLINE = 12;
export const MAX_PARTY_HARD = 20;
export const DEFAULT_MAX_COVERS_PER_SLOT = 40;

export type BookingSource = "website" | "henry" | "admin" | "phone" | "other";

export const reservationInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(1).max(40),
  party_size: z.coerce.number().int().min(1).max(MAX_PARTY_HARD),
  special_requests: z.string().trim().max(1000).optional(),
  source: z.enum(["website", "henry", "admin", "phone", "other"]).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

type MealPeriod = { label: string; start: string; end: string };

/** Dinner is the primary reservation window; breakfast is also bookable. */
function mealPeriodsForDate(dateStr: string): MealPeriod[] {
  const day = new Date(`${dateStr}T12:00:00`).getDay(); // 0 = Sun
  const isWeekend = day === 0 || day === 6;

  const breakfast: MealPeriod = isWeekend
    ? { label: "Breakfast", start: "07:00", end: "11:00" }
    : { label: "Breakfast", start: "06:30", end: "10:00" };

  const dinner: MealPeriod =
    day === 0
      ? { label: "Dinner", start: "17:00", end: "20:30" }
      : { label: "Dinner", start: "16:00", end: "21:30" };

  return [breakfast, dinner];
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Normalize "6:00 PM", "18:00:00", "18:00" → "HH:mm". */
export function normalizeTime(raw: string): string | null {
  const trimmed = raw.trim();
  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = parseInt(ampm[2], 10);
    const mer = ampm[3].toUpperCase();
    if (mer === "PM" && h < 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    if (h > 23 || m > 59) return null;
    return fromMinutes(h * 60 + m);
  }

  const twentyFour = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFour) {
    const h = parseInt(twentyFour[1], 10);
    const m = parseInt(twentyFour[2], 10);
    if (h > 23 || m > 59) return null;
    return fromMinutes(h * 60 + m);
  }

  return null;
}

export function maxCoversPerSlot(): number {
  const n = parseInt(process.env.MAX_COVERS_PER_SLOT || "", 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_COVERS_PER_SLOT;
}

export function generateSlotsForDate(dateStr: string): string[] {
  const slots: string[] = [];
  for (const period of mealPeriodsForDate(dateStr)) {
    let t = toMinutes(period.start);
    const end = toMinutes(period.end);
    while (t <= end) {
      slots.push(fromMinutes(t));
      t += 30;
    }
  }
  return slots;
}

export function isWithinServiceHours(dateStr: string, timeHHMM: string): boolean {
  const mins = toMinutes(timeHHMM);
  return mealPeriodsForDate(dateStr).some((p) => {
    const start = toMinutes(p.start);
    const end = toMinutes(p.end);
    return mins >= start && mins <= end;
  });
}

export function isDateBookable(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(target.getTime())) return false;
  // Allow same-day and up to 90 days ahead
  const max = new Date(today);
  max.setDate(max.getDate() + 90);
  return target >= today && target <= max;
}

type CoverRow = { slot_time: string; covers: number };

async function fetchDayCovers(dateStr: string): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  const { data, error } = await supabase.rpc("day_reservation_covers", {
    p_date: dateStr,
  });

  if (error) {
    console.error("day_reservation_covers RPC error:", error);
    return map;
  }

  const rows = (Array.isArray(data) ? data : []) as CoverRow[];
  for (const row of rows) {
    const t = normalizeTime(String(row.slot_time)) || String(row.slot_time);
    map.set(t, Number(row.covers) || 0);
  }
  return map;
}

export type AvailabilitySlot = {
  time: string;
  label: string;
  available: boolean;
  remaining: number;
};

function formatSlotLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const mer = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${mer}`;
}

export async function getAvailability(
  dateStr: string,
  partySize: number
): Promise<{ slots: AvailabilitySlot[]; maxCovers: number; error?: string }> {
  if (!isDateBookable(dateStr)) {
    return { slots: [], maxCovers: maxCoversPerSlot(), error: "Please choose a date within the next 90 days." };
  }
  if (partySize < 1 || partySize > MAX_PARTY_HARD) {
    return { slots: [], maxCovers: maxCoversPerSlot(), error: "Invalid party size." };
  }
  if (partySize > MAX_PARTY_ONLINE) {
    return {
      slots: [],
      maxCovers: maxCoversPerSlot(),
      error: `Parties larger than ${MAX_PARTY_ONLINE} should call ${RESTAURANT_PHONE}, inquire via Private Dining, or Banquets for larger events.`,
    };
  }

  const maxCovers = maxCoversPerSlot();
  const covers = await fetchDayCovers(dateStr);
  const slots = generateSlotsForDate(dateStr).map((time) => {
    const used = covers.get(time) || 0;
    const remaining = Math.max(0, maxCovers - used);
    return {
      time,
      label: formatSlotLabel(time),
      available: remaining >= partySize,
      remaining,
    };
  });

  return { slots, maxCovers };
}

export type CreateReservationResult =
  | {
      success: true;
      reservation: {
        name: string;
        email: string;
        phone: string;
        date: string;
        time: string;
        party_size: number;
        special_requests?: string;
        status: string;
        source: BookingSource;
      };
    }
  | { success: false; error: string };

export async function createReservation(
  raw: ReservationInput,
  options?: { notify?: boolean; skipCapacity?: boolean }
): Promise<CreateReservationResult> {
  const notify = options?.notify !== false;
  const skipCapacity = options?.skipCapacity === true;

  const time = normalizeTime(raw.time);
  if (!time) {
    return { success: false, error: "Invalid time format. Please use a valid reservation time." };
  }

  if (!isDateBookable(raw.date)) {
    return { success: false, error: "Please choose a date within the next 90 days." };
  }

  if (!isWithinServiceHours(raw.date, time)) {
    return {
      success: false,
      error: `That time is outside our reservation hours. Breakfast and dinner seatings only — or call ${RESTAURANT_PHONE}.`,
    };
  }

  if (raw.party_size > MAX_PARTY_ONLINE && !skipCapacity) {
    return {
      success: false,
      error: `For parties larger than ${MAX_PARTY_ONLINE}, please call ${RESTAURANT_PHONE}, use Private Dining, or Banquets for larger events.`,
    };
  }

  if (!skipCapacity) {
    const { slots, error } = await getAvailability(raw.date, raw.party_size);
    if (error) return { success: false, error };
    const slot = slots.find((s) => s.time === time);
    if (!slot?.available) {
      const alternatives = slots
        .filter((s) => s.available)
        .slice(0, 5)
        .map((s) => s.label);
      const alt =
        alternatives.length > 0
          ? ` Available nearby: ${alternatives.join(", ")}.`
          : ` Please try another date or call ${RESTAURANT_PHONE}.`;
      return { success: false, error: `That time is fully booked.${alt}` };
    }
  }

  const source: BookingSource = raw.source || "website";
  const status = raw.status || "pending";

  const { error } = await supabase.from("reservations").insert([
    {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      date: raw.date,
      time,
      party_size: raw.party_size,
      special_requests: raw.special_requests || "",
      status,
      source,
    },
  ]);

  if (error) {
    console.error("Reservation insert error:", error);
    return {
      success: false,
      error: `Unable to save the reservation. Please try again or call ${RESTAURANT_PHONE}.`,
    };
  }

  if (notify) {
    try {
      await sendNotifications("reservation", {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        date: raw.date,
        time,
        party_size: raw.party_size,
        special_requests: raw.special_requests,
      });
    } catch (notifyErr) {
      console.error("Failed to send reservation notifications:", notifyErr);
    }
  }

  return {
    success: true,
    reservation: {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      date: raw.date,
      time,
      party_size: raw.party_size,
      special_requests: raw.special_requests,
      status,
      source,
    },
  };
}
