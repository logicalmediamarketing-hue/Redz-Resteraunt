import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations",
  description: "Reserve your table at Redz Restaurant in Mt Laurel, NJ. Book online in seconds for breakfast, dinner, or happy hour.",
};

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
