import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Breakfast Menu",
  description: "Start your morning at Redz Restaurant in Mt Laurel, NJ — a full breakfast menu served daily from 6:30am weekdays and 7am weekends.",
};

export default function BreakfastMenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
